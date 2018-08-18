import { Component, Prop, Element, Method, State } from '@stencil/core';

import Popper from 'popper.js';

import _size from 'lodash/size';
import _get from 'lodash/get';
import _split from 'lodash/split';
import _toLower from 'lodash/toLower';
// import _toUpper from 'lodash/toUpper';
import _has from 'lodash/has'
import _toInteger from 'lodash/toInteger'
import _isNaN from 'lodash/isNaN'
import _toString from 'lodash/toString'
import _isNumber from 'lodash/isNumber'
import _includes from 'lodash/includes'
import _intersection from 'lodash/intersection'
// import _some from 'lodash/some'
// import _findIndex from 'lodash/findIndex';

import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
// import closest from '../../utilities/closest';
// import elementMatches from '../../utilities/element-matches';
import hasClass from '../../utilities/has-class';
// import addClass from '../../utilities/add-class';
// import removeClass from '../../utilities/remove-class';
// import toggleClass from '../../utilities/toggle-class';
import customEvent from '../../utilities/custom-event';
import getConfigBoolean from '../../utilities/get-config-boolean';
// import reflow from '../../utilities/reflow';
import parseJson from '../../utilities/parse-json';
import getUniqueId from '../../utilities/get-unique-id';
import removeClass from '../../utilities/remove-class';
import addClass from '../../utilities/add-class';

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
  // @State() tipTemplate: HTMLElement;
  @State() tip: HTMLElement;
  @State() popperHandle: any;
  @State() hoverState: string;
  @State() timeout: any;


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
    // console.log('this.tooltipEl.children: ', this.tooltipEl.children);

    // const userSelectedTemplate = this.getTemplateSelector();
    // if (_size(userSelectedTemplate) > 0) {
    //   this.tip = document.querySelector(userSelectedTemplate);
    // }


    // const tipArr = this.getBsTooltipTemplates();

    // // console.log('tipArr: ', tipArr);
    // // console.log('tipArr.length: ', tipArr.length);
    // // let templateWrapper;
    // if (tipArr.length === 1) {
    //   this.tipTemplate = tipArr[0];
    // } else if (tipArr.length === 0) {
    //   // insert default template and set this.tip to it

    //   const bsTooltipTemplate = document.createElement("bs-tooltip-template");
    //   // addClass(this.tip, 'tooltip');
    //   // this.tip.setAttribute('role', 'tooltip');
    //   bsTooltipTemplate.innerHTML = '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>';
    //   this.tooltipEl.appendChild(bsTooltipTemplate);
    //   const newTipArr = this.getBsTooltipTemplates();
    //   this.tipTemplate = newTipArr[0];
    // } else {
    //   throw new Error('You may only have one bs-tooltip-template');
    // }
    // // console.log('templateWrapper: ', templateWrapper);
    // this.tip = this.tipTemplate.querySelector('.tooltip');
    // console.log('this.tip: ', this.tip);

    // const bsTooltipNamedTemplates = Array.prototype.slice.call(this.tooltipEl.querySelectorAll('[name="tooltip-template"]'));
    // console.log('bsTooltipNamedTemplates: ', bsTooltipNamedTemplates);
    // if (bsTooltipNamedTemplates.length !== 1) {
    //   throw new Error('Unable to locate tooltip-template for tooltip');
    // }
    // if (bsTooltipNamedTemplates[0].children.length !== 1) {
    //   throw new Error('there must be a single html element within the tooltip-template');
    // }
    // this.tip = bsTooltipNamedTemplates[0].children[0];


    // console.log('bsTooltipTemplateEl: ', bsTooltipTemplateEl);
    // this.tipTemplate.style.display = 'none';

    this.getConfig(overrideConfig);
    this.setListeners();
  }

  getTemplateSelector() {
    if (_has(this.tooltipEl.dataset, 'templateSelector')) {
      return this.tooltipEl.dataset.templateSelector;
    }
    return '';
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
    this.tip = this.tip || this.makeTip();
    return this.tip;
  };



  // getBsTooltipTemplates() {
  //   const tooltipChildren = Array.prototype.slice.call(this.tooltipEl.children);
  //   const tipArr = [];
  //   for (let j = 0, len = tooltipChildren.length; j < len; j++) {
  //     if (_toLower(tooltipChildren[j].tagName) === 'bs-tooltip-template') {
  //       tipArr.push(tooltipChildren[j]);
  //     }
  //   }
  //   return tipArr;
  // }


  disableTooltip() {
    this.isEnabled = false;
    clearTimeout(this.timeout);
    this.tooltipEl.removeEventListener('click', this.handleClickTrigger);
    this.tooltipEl.removeEventListener('mouseenter', this.handleMouseEnter);
    this.tooltipEl.removeEventListener('mouseleave', this.handleMouseLeave);
    // this.tip.removeEventListener('mouseenter', this.handleMouseLeave);
    this.tooltipEl.removeEventListener('focusin', this.handleFocusIn);
    this.tooltipEl.removeEventListener('focusout', this.handleFocusOut);
    this.activeTrigger = {};
    this.hoverState = '';
    // this.tipTemplate.style.display = 'none';
  }

  // getTipElement() {
  //   this.tip = this.tip || this.tooltipEl.querySelector('.tooltip');
  //   return this.tip;
  // };

  toggle(event: any) {
    // console.log('toggle event: ', event);
    if (!this.isEnabled) {
      return;
    }
    if (event) {
      this.activeTrigger.click = !this.activeTrigger.click;
      // const hasAnActiveTrigger = _some(this.activeTrigger);
      // context._activeTrigger.click = !context._activeTrigger.click;
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
    // console.log('enter event: ', event);
    // var dataKey = this.constructor.DATA_KEY;
    // context = context || $$$1(event.currentTarget).data(dataKey);

    // if (!context) {
    //   context = new this.constructor(event.currentTarget, this._getDelegateConfig());
    //   $$$1(event.currentTarget).data(dataKey, context);
    // }

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
    // console.log('show');

    if (this.tooltipEl.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }

    if (_size(this.config.title) > 0 && this.isEnabled) {
      const showEvent = customEvent(this.tooltipEl, this.showEventName);
      const isInTheDom = this.tooltipEl.ownerDocument.documentElement.contains(this.tooltipEl);
      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      // const tipId = this.tooltipId;
      // this.tip.setAttribute('id', tipId);
      // this.tooltipEl.setAttribute('aria-describedby', tipId);
      const tip = this.getTipElement();
      this.setContent();


      if (this.config.animation) {
        addClass(tip, 'fade');
      }

      const placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.tooltipEl) : this.config.placement;

      const attachment = this.getAttachment(placement);

      this.addAttachmentClass(attachment);
      // var container = this.config.container === false ? document.body : $$$1(document).find(this.config.container);
      // $$$1(tip).data(this.constructor.DATA_KEY, this);

      // if (!$$$1.contains(this.element.ownerDocument.documentElement, this.tip)) {
      //   $$$1(tip).appendTo(container);
      // }


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
            element: '.arrow', //Selector.ARROW
          },
          preventOverflow: {
            boundariesElement: this.config.boundary
          }
        },
        onCreate: this.handlePopperOnCreate,
        onUpdate: this.handlePopperOnUpdate,
      });

      // this.tipTemplate.style.display = 'block';
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
    // console.log('hide');
    const tip = this.getTipElement();
    const hideEvent = customEvent(this.tooltipEl, this.hideEventName);
    if (hideEvent.defaultPrevented) {
      return;
    }

    removeClass(tip, 'show');
    // this.tipTemplate.style.display = 'none';

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
    const tip = this.getTipElement();
    // if (this.hoverState !== 'show' && tip.parentNode) {
    //   tip.parentNode.removeChild(tip);
    // }

    if (this.hoverState !== 'show' && tip.parentNode) {
      tip.parentNode.removeChild(tip);
      this.tip = null;
    } else {
      this.cleanTipClass();
    }

    this.tooltipEl.removeAttribute('aria-describedby');
    customEvent(this.tooltipEl, this.hiddenEventName);
    if (this.popperHandle !== null) {
      this.popperHandle.destroy();
    }
    callback();
  };

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
    // const tip = this.getTipElement();
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

  setListeners() {
    const triggers = _split(_toLower(this.config.trigger), ' ');
    // console.log('this.config: ', this.config);
    // console.log('triggers: ', triggers);
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

    this.config = config;
  };


  @Method()
  tooltip(tooltipOptions:any = {}) {
    if (!this.isEnabled) {
      this.enableTooltip();
    }

    // show
    // hide
    // toggle
    // enable
    // disable
    // toggleEnabled
    // update
    console.log('tooltipOptions: ', tooltipOptions);
  }

  render() {
    return ( <slot /> );
  }

  // render() {
  //   // // https://developers.google.com/web/fundamentals/web-components/shadowdom#slots
  //   // return [
  //   //   <slot />,
  //   //     <div class="tooltip" role="tooltip">
  //   //       <div class="arrow"></div>
  //   //       <div class="tooltip-inner"></div>
  //   //     </div>
  //   // ]
  // }
}