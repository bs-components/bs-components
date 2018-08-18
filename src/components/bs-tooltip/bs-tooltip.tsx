import { Component, Prop, Element, Method, State } from '@stencil/core';

import Popper from 'popper.js';

import _size from 'lodash/size';
import _get from 'lodash/get';
import _split from 'lodash/split';
import _toLower from 'lodash/toLower';
import _has from 'lodash/has'
import _toInteger from 'lodash/toInteger'
import _isNaN from 'lodash/isNaN'
import _toString from 'lodash/toString'
import _isNumber from 'lodash/isNumber'
import _includes from 'lodash/includes'
import _intersection from 'lodash/intersection'

import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import closest from '../../utilities/closest';
import hasClass from '../../utilities/has-class';
import removeClass from '../../utilities/remove-class';
import addClass from '../../utilities/add-class';
import customEvent from '../../utilities/custom-event';
import getConfigBoolean from '../../utilities/get-config-boolean';
import parseJson from '../../utilities/parse-json';
import getUniqueId from '../../utilities/get-unique-id';

@Component({
  tag: 'bs-tooltip',
  shadow: false
})
export class BsTooltip {
  @Element() tooltipEl: HTMLElement;

  @Prop() noEnableOnLoad: boolean = false;

  @Prop() showEventName: string = 'show.bs.tooltip';
  @Prop() shownEventName: string = 'shown.bs.tooltip';
  @Prop() hideEventName: string = 'hide.bs.tooltip';
  @Prop() hiddenEventName: string = 'hidden.bs.tooltip';
  @Prop() insertedEventName: string = 'inserted.bs.tooltip';

  @State() config: any;
  @State() isEnabled: boolean;
  @State() activeTrigger: any;
  @State() tooltipId: string;
  @State() tip: HTMLElement;
  @State() popperHandle: any;
  @State() hoverState: string;
  @State() timeout: any;
  @State() disposeTimeout: any;

  // TODO: a stencil watch on a prop to update the title on change would be nice. . .

  componentDidLoad() {
    const currentTabIndex = this.tooltipEl.getAttribute('tabindex');
    if (_size(currentTabIndex) === 0) {
       // without tabindex set the bs-tooltip can not receive focus
      this.tooltipEl.setAttribute('tabindex', '0');
    }
    if (!this.noEnableOnLoad && !this.isEnabled) {
      this.enableTooltip();
    }
  }

  componentDidUnload() {
    this.disableTooltip();
  }

  enableTooltip(overrideConfig:any = {}) {
    this.isEnabled = true;
    this.activeTrigger = {};
    this.hoverState = '';
    this.tooltipId = getUniqueId('tooltip');
    this.tooltipEl.dataset.bsId = this.tooltipId;
    this.tip = null;
    this.getConfig(overrideConfig);
    this.setListeners();
  }

  makeTip() {
    const container = this.config.container === false ? document.body : document.querySelector(this.config.container);
    const tip = document.createElement("div");
    addClass(tip, 'tooltip');
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('id', this.tooltipId);
    this.tooltipEl.setAttribute('aria-describedby', this.tooltipId);
    tip.innerHTML = '<div class="arrow"></div>' + '<div class="tooltip-inner"></div>';
    if (!this.tooltipEl.ownerDocument.documentElement.contains(tip)) {
      customEvent(this.tooltipEl, this.insertedEventName);
      container.appendChild(tip);
    }
    return tip;
  }

  getTipElement() {
    clearTimeout(this.disposeTimeout);
    this.tip = this.tip || this.makeTip();
    return this.tip;
  };

  disableTooltip() {
    this.isEnabled = false;
    clearTimeout(this.timeout);
    this.tooltipEl.removeEventListener('click', this.handleClickTrigger);
    this.tooltipEl.removeEventListener('mouseenter', this.handleMouseEnter);
    this.tooltipEl.removeEventListener('mouseleave', this.handleMouseLeave);
    this.tooltipEl.removeEventListener('focusin', this.handleFocusIn);
    this.tooltipEl.removeEventListener('focusout', this.handleFocusOut);
    const closestModal = closest(this.tooltipEl, '.modal');
    if (closestModal) {
      const modalHideEventName = closestModal.hideEventName;
      if (modalHideEventName) {
        closestModal.removeEventListener(closestModal.hideEventName, this.handleModalHide);
      }
    }
    this.activeTrigger = {};
    this.hoverState = '';
    clearTimeout(this.disposeTimeout);
    this.removeTooltipFromDom();
  }

  toggle(event: any = null) {
    if (!this.isEnabled) {
      return;
    }
    if (event) {
      this.activeTrigger.click = !this.activeTrigger.click;
      if (this.isWithActiveTrigger()) {
        this.enter();
      } else {
        this.leave();
      }
    } else {
      if (hasClass(this.getTipElement(), 'show')) {
        this.leave();
      } else {
        this.enter();
      }
    }
  }

  isWithActiveTrigger() {
    for (const trigger in this.activeTrigger) {
      if (this.activeTrigger[trigger]) {
        return true;
      }
    }
    return false;
  };

  enter(event: any = null) {
    if (event) {
      const eventType = event.type === 'focusin' ? 'focus' : 'hover';
      this.activeTrigger[eventType] = true;
    }

    if (hasClass(this.getTipElement(), 'show') || this.hoverState === 'show') {
      this.hoverState = 'show';
      return;
    }

    clearTimeout(this.timeout);

    this.hoverState = 'show';

    if (!this.config.delay || !this.config.delay.show) {
      this.show();
      return;
    }

    this.timeout = setTimeout(() => {
      if (this.hoverState === 'show') {
        this.show();
      }
    }, this.config.delay.show);
  }

  leave(event: any = null) {
    // console.log('leave');
    if (event) {
      const eventType = event.type === 'focusout' ? 'focus' : 'hover';
      this.activeTrigger[eventType] = false;
    }

    if (this.isWithActiveTrigger()) {
      return;
    }

    clearTimeout(this.timeout);
    this.hoverState = 'out';

    if (!this.config.delay || !this.config.delay.hide) {
      this.hide();
      return;
    }

    this.timeout = setTimeout(() => {
      if (this.hoverState === 'out') {
        this.hide();
      }
    }, this.config.delay.hide);
  }

  show() {
    if (this.tooltipEl.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }

    if (_size(this.config.title) > 0 && this.isEnabled) {
      const showEvent = customEvent(this.tooltipEl, this.showEventName);
      const isInTheDom = this.tooltipEl.ownerDocument.documentElement.contains(this.tooltipEl);
      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      const tip = this.getTipElement();
      this.setContent();

      if (this.config.animation) {
        addClass(tip, 'fade');
      }

      const placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.tooltipEl) : this.config.placement;

      const attachment = this.getAttachment(placement);

      this.addAttachmentClass(attachment);

      this.popperHandle = new Popper(this.tooltipEl, tip, {
        placement: attachment,
        modifiers: {
          offset: {
            offset: this.config.offset
          },
          flip: {
            behavior: this.config.fallbackPlacement
          },
          arrow: {
            element: '.arrow',
          },
          preventOverflow: {
            boundariesElement: this.config.boundary
          }
        },
        onCreate: this.handlePopperOnCreate,
        onUpdate: this.handlePopperOnUpdate,
      });

      addClass(tip, 'show');

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      // if ('ontouchstart' in document.documentElement) {
      //   $$$1(document.body).children().on('mouseover', null, $$$1.noop);
      // }

      if (hasClass(tip, 'fade')) {
        const transitionDuration = getTransitionDurationFromElement(tip);
        setTimeout(() => {
          this.showComplete();
        }, transitionDuration);
      } else {
        this.showComplete();
      }
    }
  }

  showComplete() {
    if (this.config.animation) {
      this.fixTransition();
    }
    const prevHoverState = this.hoverState;
    this.hoverState = null;
    customEvent(this.tooltipEl, this.shownEventName);
    if (prevHoverState === 'out') {
      this.leave();
    }
  }

  hide(callback : any = () => {}) {
    const tip = this.getTipElement();
    const hideEvent = customEvent(this.tooltipEl, this.hideEventName);
    if (hideEvent.defaultPrevented) {
      return;
    }

    removeClass(tip, 'show');

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    // if ('ontouchstart' in document.documentElement) {
    //   $$$1(document.body).children().off('mouseover', null, $$$1.noop);
    // }

    this.activeTrigger.click = false;
    this.activeTrigger.focus = false;
    this.activeTrigger.hover = false;

    if (hasClass(tip, 'fade')) {
      const transitionDuration = getTransitionDurationFromElement(tip);
      setTimeout(() => {
        this.hideComplete(callback);
      }, transitionDuration);
    } else {
      this.hideComplete();
    }
    this.hoverState = '';
  }

  hideComplete(callback : any = () => {}) {
    this.cleanTipClass();

    this.tooltipEl.removeAttribute('aria-describedby');
    customEvent(this.tooltipEl, this.hiddenEventName);
    if (this.popperHandle !== null) {
      this.popperHandle.destroy();
    }

    this.disposeTimeout = setTimeout(() => {
      this.removeTooltipFromDom();
    }, this.config.disposeTimeToWait);

    callback();
  };

  removeTooltipFromDom() {
    if (this.tip && this.hoverState !== 'show' && this.tip.parentNode) {
      this.tip.parentNode.removeChild(this.tip);
      this.tip = null;
    }
  }

  fixTransition() {
    const tip = this.getTipElement();
    const initConfigAnimation = this.config.animation;
    if (tip.getAttribute('x-placement') !== null) {
      return;
    }
    removeClass(tip, 'fade');
    this.config.animation = false;
    this.hide();
    this.show();
    this.config.animation = initConfigAnimation;
  }

  handlePopperOnCreate = (data) => {
    if (data.originalPlacement !== data.placement) {
      this.handlePopperPlacementChange(data);
    }
  }

  handlePopperOnUpdate = (data) => {
    this.handlePopperPlacementChange(data);
  }

  handlePopperPlacementChange(popperData) {
    const popperInstance = popperData.instance;
    this.tip = popperInstance.popper;
    this.cleanTipClass();
    this.addAttachmentClass(this.getAttachment(popperData.placement));
  };

  cleanTipClass() {
    const tip = this.getTipElement();
    const bsTooltipPositionClasses = [
      'bs-tooltip-auto',
      'bs-tooltip-top',
      'bs-tooltip-right',
      'bs-tooltip-bottom',
      'bs-tooltip-left'
    ];
    const classesToRemove = _intersection(bsTooltipPositionClasses, tip.classList);
    for (let j = 0, len = classesToRemove.length; j < len; j++) {
      removeClass(tip, classesToRemove[j]);
    }
  };

  addAttachmentClass(attachment) {
    const CLASS_PREFIX = 'bs-tooltip';
    addClass(this.getTipElement(), CLASS_PREFIX + "-" + attachment);
  };

  getAttachment(placement) {
    const AttachmentMap = {
      auto: 'auto',
      top: 'top',
      right: 'right',
      bottom: 'bottom',
      left: 'left'
    };
    return AttachmentMap[_toLower(placement)];
  };

  setContent() {
    const tip = this.getTipElement();
    this.setElementContent(tip.querySelector('.tooltip-inner'), this.getTitle());
    removeClass(tip, 'fade');
    removeClass(tip, 'show');
  };

  setElementContent(el, content) {
    if (this.config.html) {
      el.innerHTML = content;
    } else {
      el.textContent = content;
    }
  };

  getTitle() {
    let title = this.tooltipEl.dataset.originalTitle;
    if (!title) {
      title = typeof this.config.title === 'function' ? this.config.title.call(this.tooltipEl) : this.config.title;
    }
    return title;
  };

  handleClickTrigger = (event) => {
    this.toggle(event);
  }

  handleMouseEnter = (event) => {
    this.enter(event);
  }

  handleFocusIn = (event) => {
    this.enter(event);
  }

  handleMouseLeave = (event) => {
    this.leave(event);
  }

  handleFocusOut = (event) => {
    this.leave(event);
  }

  handleModalHide = (event) => {
    this.activeTrigger.click = false;
    this.leave(event);
  }

  setListeners() {
    const triggers = _split(_toLower(this.config.trigger), ' ');
    if (_includes(triggers, 'click')) {
      this.tooltipEl.removeEventListener('click', this.handleClickTrigger);
      this.tooltipEl.addEventListener('click', this.handleClickTrigger);
    }
    if (_includes(triggers, 'manual')) {
      // hover and focus events are ignored if manual is included.
      return;
    }
    if (_includes(triggers, 'hover')) {
      this.tooltipEl.removeEventListener('mouseenter', this.handleMouseEnter);
      this.tooltipEl.addEventListener('mouseenter', this.handleMouseEnter);
      this.tooltipEl.removeEventListener('mouseleave', this.handleMouseLeave);
      this.tooltipEl.addEventListener('mouseleave', this.handleMouseLeave);
    }
    if (_includes(triggers, 'focus')) {
      this.tooltipEl.removeEventListener('focusin', this.handleFocusIn);
      this.tooltipEl.addEventListener('focusin', this.handleFocusIn);
      this.tooltipEl.removeEventListener('focusout', this.handleFocusOut);
      this.tooltipEl.addEventListener('focusout', this.handleFocusOut);
    }

    const closestModal = closest(this.tooltipEl, '.modal');
    if (closestModal) {
      const modalHideEventName = closestModal.hideEventName;
      // console.log('closestModal: ', closestModal);
      // console.log('closestModal.hideEventName: ', closestModal.hideEventName);
      if (modalHideEventName) {
        closestModal.removeEventListener(closestModal.hideEventName, this.handleModalHide);
        closestModal.addEventListener(closestModal.hideEventName, this.handleModalHide);
      }
    }

    // TODO: what if the selector is set
    // https://github.com/twbs/bootstrap/issues/4215
    // well if it's a dynamic html element. . .
    // we can just add and remove bs-tooltip tags as needed. . .

    this.fixTitle();
  }

  fixTitle() {
    const titleType = typeof this.tooltipEl.dataset.originalTitle;
    if (this.tooltipEl.title || titleType !== 'string') {
      this.tooltipEl.dataset.originalTitle = this.tooltipEl.title || '';
      this.tooltipEl.title = '';
    }
  }

  getConfig(overrideConfig:any = {}) {
    const defaultConfig = {
      animation: true,
      template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      selector: false,
      placement: 'top',
      offset: 0,
      container: false,
      fallbackPlacement: 'flip',
      boundary: 'scrollParent',
      disposeTimeToWait: 5000,
    };

    this.config = {};
    const config: any = {};

    if (_has(overrideConfig, 'animation')) {
      config.animation = getConfigBoolean(overrideConfig.animation);
    } else if (_has(this.tooltipEl.dataset, 'animation')) {
      config.animation = getConfigBoolean(this.tooltipEl.dataset.animation);
    } else {
      config.animation = defaultConfig.animation;
    }

    if (_has(overrideConfig, 'trigger')) {
      config.trigger = overrideConfig.trigger;
    } else if (_has(this.tooltipEl.dataset, 'trigger')) {
      config.trigger = this.tooltipEl.dataset.trigger;
    } else {
      config.trigger = defaultConfig.trigger;
    }

    const titleAttribute = this.tooltipEl.getAttribute('title');
    if (_has(overrideConfig, 'title')) {
      config.title = overrideConfig.title;
    } else if (_has(this.tooltipEl.dataset, 'title')) {
      config.title = this.tooltipEl.dataset.title;
    } else if (titleAttribute) {
      config.title = titleAttribute;
    } else {
      config.title = defaultConfig.title;
    }
    if (_isNumber(config.title)) {
      config.title = _toString(config.title);
    }

    let newConfigDelay;
    if (_has(overrideConfig, 'delay')) {
      newConfigDelay = overrideConfig.delay;
    } else if (_has(this.tooltipEl.dataset, 'delay')) {
      newConfigDelay = this.tooltipEl.dataset.delay;
    }
    if (_size(newConfigDelay) > 0) {
      const configDelayInteger = _toInteger(newConfigDelay);
      const configDelayObj = parseJson(newConfigDelay);
      if (!_isNaN(configDelayInteger)) {
        config.delay = {
          show: configDelayInteger,
          hide: configDelayInteger
        };
      } else if (configDelayObj !== false) {
        config.delay = {
          show: _get(configDelayObj, 'show', defaultConfig.delay),
          hide: _get(configDelayObj, 'hide', defaultConfig.delay),
        };
      }
    } else {
      config.delay = {
        show: defaultConfig.delay,
        hide: defaultConfig.delay
      };
    }

    if (_has(overrideConfig, 'html')) {
      config.html = getConfigBoolean(overrideConfig.html);
    } else if (_has(this.tooltipEl.dataset, 'html')) {
      config.html = getConfigBoolean(this.tooltipEl.dataset.html);
    } else {
      config.html = defaultConfig.html;
    }

    if (_has(overrideConfig, 'selector')) {
      config.selector = overrideConfig.selector;
    } else if (_has(this.tooltipEl.dataset, 'selector')) {
      config.selector = this.tooltipEl.dataset.selector;
    } else {
      config.selector = defaultConfig.selector;
    }

    if (_has(overrideConfig, 'placement')) {
      config.placement = overrideConfig.placement;
    } else if (_has(this.tooltipEl.dataset, 'placement')) {
      config.placement = this.tooltipEl.dataset.placement;
    } else {
      config.placement = defaultConfig.placement;
    }

    if (_has(overrideConfig, 'offset')) {
      config.offset = _toInteger(overrideConfig.offset);
    } else if (_has(this.tooltipEl.dataset, 'offset')) {
      config.offset = _toInteger(this.tooltipEl.dataset.offset);
    } else {
      config.offset = defaultConfig.offset;
    }
    if (_isNaN(config.offset)) {
      config.offset = defaultConfig.offset;
    }

    if (_has(overrideConfig, 'container')) {
      config.container = getConfigBoolean(overrideConfig.container);
    } else if (_has(this.tooltipEl.dataset, 'container')) {
      config.container = getConfigBoolean(this.tooltipEl.dataset.container);
    } else {
      config.container = defaultConfig.container;
    }

    if (_has(overrideConfig, 'fallbackPlacement')) {
      config.fallbackPlacement = overrideConfig.fallbackPlacement;
    } else if (_has(this.tooltipEl.dataset, 'fallbackPlacement')) {
      config.fallbackPlacement = this.tooltipEl.dataset.fallbackPlacement;
    } else {
      config.fallbackPlacement = defaultConfig.fallbackPlacement;
    }

    if (_has(overrideConfig, 'boundary')) {
      config.boundary = overrideConfig.boundary;
    } else if (_has(this.tooltipEl.dataset, 'boundary')) {
      config.boundary = this.tooltipEl.dataset.boundary;
    } else {
      config.boundary = defaultConfig.boundary;
    }

    if (_has(overrideConfig, 'disposeTimeToWait')) {
      config.disposeTimeToWait = _toInteger(overrideConfig.disposeTimeToWait);
    } else if (_has(this.tooltipEl.dataset, 'disposeTimeToWait')) {
      config.disposeTimeToWait = _toInteger(this.tooltipEl.dataset.disposeTimeToWait);
    } else {
      config.disposeTimeToWait = defaultConfig.disposeTimeToWait;
    }
    if (_isNaN(config.disposeTimeToWait)) {
      config.disposeTimeToWait = defaultConfig.disposeTimeToWait;
    }

    this.config = config;
  };


  @Method()
  tooltip(tooltipOptions:any = {}) {
    if (_size(tooltipOptions) === 0) {
      if (!this.isEnabled) {
        this.enableTooltip();
      }
    } else if (tooltipOptions === 'enable') {
      this.enableTooltip();
    } else if (tooltipOptions === 'disable') {
      this.disableTooltip();
    } else if (tooltipOptions === 'toggleEnabled') {
      if (this.isEnabled) {
        this.disableTooltip();
      } else {
        this.enableTooltip();
      }
    } else if (tooltipOptions === 'show') {
      if (!this.isEnabled) {
        this.enableTooltip();
      }
      this.enter();
    } else if (tooltipOptions === 'hide') {
      if (!this.isEnabled) {
        this.enableTooltip();
      }
      this.leave();
    } else if (tooltipOptions === 'toggle') {
      if (!this.isEnabled) {
        this.enableTooltip();
      }
      this.toggle();
    } else if (tooltipOptions === 'update') {
      if (this.popperHandle !== null) {
        this.popperHandle.scheduleUpdate();
      }
    } else {
      this.enableTooltip(tooltipOptions);
    }
  }

  render() {
    return ( <slot /> );
  }
}