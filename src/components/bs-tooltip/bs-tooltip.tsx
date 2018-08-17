import { Component, Prop, Element, Method, State } from '@stencil/core';

import Popper from 'popper.js';

import _size from 'lodash/size';
import _get from 'lodash/get';
import split from 'lodash/split';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _has from 'lodash/has'
import _toInteger from 'lodash/toInteger'
import _isNaN from 'lodash/isNaN'
import _toString from 'lodash/toString'
import _isNumber from 'lodash/isNumber'
import _includes from 'lodash/includes'
// import _some from 'lodash/some'

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

  @Prop() enableOnLoad: boolean = false;

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

  componentDidLoad() {
    const currentTabIndex = this.tooltipEl.getAttribute('tabindex');
    if (_size(currentTabIndex) === 0) {
       // without tabindex set the bs-tooltip can not receive focus
      this.tooltipEl.setAttribute('tabindex', '0');
    }
    if (this.enableOnLoad && !this.isEnabled) {
      this.enabledTooltip();
    }
  }

  componentDidUnload() {
    this.tooltipEl.removeEventListener('click', this.handleClickTrigger);
  }

  enabledTooltip() {
    this.isEnabled = true;
    this.activeTrigger = {};
    this.tip = null;
    this.getConfig();
    this.setListeners();
  }

  getTipElement() {
    this.tip = this.tip || this.tooltipEl.querySelector('.tooltip');
    return this.tip;
  };

  handleClickTrigger = (event) => {
    this.toggle(event);
  }

  toggle(event: any) {
    console.log('toggle event: ', event);
    if (!this.isEnabled) {
      return;
    }

    if (event) {
      this.tooltipId = getUniqueId('tooltip');
      this.tooltipEl.dataset.bsId = this.tooltipId;


      // this.tooltipEl.setAttribute('data-bs-id', this.dropdownId);


      // var dataKey = this.constructor.DATA_KEY;
      // var context = $$$1(event.currentTarget).data(dataKey);

      // if (!context) {
      //   context = new this.constructor(event.currentTarget, this._getDelegateConfig());
      //   $$$1(event.currentTarget).data(dataKey, context);
      // }


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

      // if ($$$1(this.getTipElement()).hasClass(ClassName.SHOW)) {
      //   this._leave(null, this);

      //   return;
      // }

      // this._enter(null, this);
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
    console.log('enter event: ', event);
    // var dataKey = this.constructor.DATA_KEY;
    // context = context || $$$1(event.currentTarget).data(dataKey);

    // if (!context) {
    //   context = new this.constructor(event.currentTarget, this._getDelegateConfig());
    //   $$$1(event.currentTarget).data(dataKey, context);
    // }

    // TODO: for focus trigger
    // if (event) {
    //   context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
    // }

    // TODO: for hover trigger
    // if ($$$1(context.getTipElement()).hasClass(ClassName.SHOW) || context._hoverState === HoverState.SHOW) {
    //   context._hoverState = HoverState.SHOW;
    //   return;
    // }

    // clearTimeout(context._timeout);
    // context._hoverState = HoverState.SHOW;

    if (!this.config.delay || !this.config.delay.show) {
      this.show();
      return;
    }

    // context._timeout = setTimeout(function () {
    //   if (context._hoverState === HoverState.SHOW) {
    //     context.show();
    //   }
    // }, context.config.delay.show);



  }

  leave() {
    console.log('leave'); // TODO:
    // var dataKey = this.constructor.DATA_KEY;
    // context = context || $$$1(event.currentTarget).data(dataKey);

    // if (!context) {
    //   context = new this.constructor(event.currentTarget, this._getDelegateConfig());
    //   $$$1(event.currentTarget).data(dataKey, context);
    // }

    // if (event) {
    //   context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
    // }

    if (this.isWithActiveTrigger()) {
      return;
    }

    // clearTimeout(context._timeout);
    // context._hoverState = HoverState.OUT;

    if (!this.config.delay || !this.config.delay.hide) {
      this.hide();
      return;
    }

    // context._timeout = setTimeout(function () {
    //   if (context._hoverState === HoverState.OUT) {
    //     context.hide();
    //   }
    // }, context.config.delay.hide);




  }

  show() {
    // TODO:
    console.log('show');



    if (this.tooltipEl.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }

    // var showEvent = $$$1.Event(this.constructor.Event.SHOW);

    if (_size(this.config.title) > 0 && this.isEnabled) {

      const showEvent = customEvent(this.tooltipEl, this.showEventName);
      if (showEvent.defaultPrevented) {
        return;
      }

      // $$$1(this.element).trigger(showEvent);
      // var isInTheDom = $$$1.contains(this.element.ownerDocument.documentElement, this.element);

      // if (showEvent.isDefaultPrevented() || !isInTheDom) {
      //   return;
      // }

      const tip = this.getTipElement();
      const tipId = this.tooltipId;
      // var tipId = Util.getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);
      this.tooltipEl.setAttribute('aria-describedby', tipId);
      this.setContent();

      // if (this.config.animation) {
      //   $$$1(tip).addClass(ClassName.FADE);
      // }

      const placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.tooltipEl) : this.config.placement;

      // var attachment = this._getAttachment(placement);
      const attachment = this.getAttachment(placement);

      this.addAttachmentClass(attachment);
      // var container = this.config.container === false ? document.body : $$$1(document).find(this.config.container);
      // $$$1(tip).data(this.constructor.DATA_KEY, this);

      // if (!$$$1.contains(this.element.ownerDocument.documentElement, this.tip)) {
      //   $$$1(tip).appendTo(container);
      // }

      // $$$1(this.element).trigger(this.constructor.Event.INSERTED);
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

      addClass(tip, 'show');

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      // TODO:
      // if ('ontouchstart' in document.documentElement) {
      //   $$$1(document.body).children().on('mouseover', null, $$$1.noop);
      // }

      if (hasClass(tip, 'fade')) {
        const transitionDuration = getTransitionDurationFromElement(this.tip);
        setTimeout(this.showComplete, transitionDuration);
      } else {
        this.showComplete();
      }
    }
  }

  showComplete() {
    if (this.config.animation) {
      this.fixTransition();
    }

    // var prevHoverState = _this._hoverState;
    // _this._hoverState = null;

    customEvent(this.tooltipEl, this.shownEventName);
    // $$$1(_this.element).trigger(_this.constructor.Event.SHOWN);

    // if (prevHoverState === HoverState.OUT) {
    //   _this._leave(null, _this);
    // }
  }

  hide(callback : any = () => {}) {
    console.log('hide');


    const tip = this.getTipElement();
    // var hideEvent = $$$1.Event(this.constructor.Event.HIDE);



    const hideEvent = customEvent(this.tooltipEl, this.hideEventName);
    if (hideEvent.defaultPrevented) {
      return;
    }

    removeClass(tip, 'show');

    // $$$1(tip).removeClass(ClassName.SHOW); // If this is a touch-enabled device we remove the extra
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


    // if (hasClass(tip, 'fade')) {

    // } else {
    //   this.showComplete();
    // }

    // if ($$$1(this.tip).hasClass(ClassName.FADE)) {
    //   var transitionDuration = Util.getTransitionDurationFromElement(tip);
    //   $$$1(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
    // } else {
    //   complete();
    // }

    // this._hoverState = '';

  }

  hideComplete(callback : any = () => {}) {
    // if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
    //   tip.parentNode.removeChild(tip);
    // }

    this.cleanTipClass();

    this.tooltipEl.removeAttribute('aria-describedby');

    // $$$1(_this2.element).trigger(_this2.constructor.Event.HIDDEN);
    customEvent(this.tooltipEl, this.hiddenEventName);

    if (this.popperHandle !== null) {
      this.popperHandle.destroy();
    }

    if (callback) {
      callback();
    }
  };



  fixTransition() {
    var tip = this.getTipElement();
    var initConfigAnimation = this.config.animation;

    if (tip.getAttribute('x-placement') !== null) {
      return;
    }
    removeClass(tip, 'fade');
    // $$$1(tip).removeClass(ClassName.FADE);
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
    // var $tip = $$$1(this.getTipElement());
    var CLASS_PREFIX = 'bs-tooltip';
    var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');

    // console.log('BSCLS_PREFIX_REGEX: ', BSCLS_PREFIX_REGEX);

    var tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX).map(x => x.trim());

    console.log('tabClass: ', tabClass);

    if (tabClass !== null && tabClass.length) {
      removeClass(tip, tabClass);
      // $tip.removeClass(tabClass.join(''));
    }
  };


  addAttachmentClass(attachment) {
    const CLASS_PREFIX = 'bs-tooltip';
    addClass(this.getTipElement(), CLASS_PREFIX + "-" + attachment);
    // $$$1(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
  };

  getAttachment(placement) {
    const AttachmentMap = {
      AUTO: 'auto',
      TOP: 'top',
      RIGHT: 'right',
      BOTTOM: 'bottom',
      LEFT: 'left'
    };
    return AttachmentMap[_toUpper(placement)];
  };

  setContent() {
    var tip = this.getTipElement();
    this.setElementContent(this.tooltipEl.querySelector('.tooltip-inner'), this.getTitle());
    removeClass(tip, 'fade');
    removeClass(tip, 'show');
    // $$$1(tip).removeClass(ClassName.FADE + " " + ClassName.SHOW);
  };


  setElementContent(el, content) {
    // var html = this.config.html;
    if (this.config.html) {
      el.innerHTML = content;
      // if (!$$$1(content).parent().is($element)) {
      //   $element.empty().append(content);
      // }
    } else {
      el.textContent = content;
      // $element.text($$$1(content).text());
    }

    // if (typeof content === 'object' && (content.nodeType || content.jquery)) {
    //   // Content is a DOM node or a jQuery

    // } else {
    //   $element[html ? 'html' : 'text'](content);
    // }
  };

  getTitle() {
    let title = this.tooltipEl.dataset.originalTitle;
    if (!title) {
      title = typeof this.config.title === 'function' ? this.config.title.call(this.tooltipEl) : this.config.title;
    }
    return title;
  };



  setListeners() {
    const triggers = split(_toLower(this.config.trigger), ' ');
    console.log('this.config: ', this.config);
    console.log('triggers: ', triggers);
    if (_includes(triggers, 'manual')) {
      // no events to bind because of manual trigger
      return;
    }
    if (_includes(triggers, 'click')) {
      this.tooltipEl.removeEventListener('click', this.handleClickTrigger);
      this.tooltipEl.addEventListener('click', this.handleClickTrigger);
      // console.log('bind trigger: click');
    }
    if (_includes(triggers, 'hover')) {
      console.log('bind trigger: hover');
    }
    if (_includes(triggers, 'focus')) {
      console.log('bind trigger: focus');
    }
  }


  getConfig(overrideConfig:any = {}) {
    const defaultConfig = {
      animation: true,
      // template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      selector: false,
      placement: 'top',
      offset: 0,
      container: false,
      fallbackPlacement: 'flip',
      boundary: 'scrollParent'
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
    // show
    // hide
    // toggle
    // enable
    // disable
    // toggleEnabled
    // update
    console.log('tooltipOptions: ', tooltipOptions);
  }

  getTooltip(tooltipHtml: any) {
    console.log('tooltipHtml: ', tooltipHtml.toString());
    return tooltipHtml; // <p>test</p>;
  }

  render() {
    // https://developers.google.com/web/fundamentals/web-components/shadowdom#slots
    return [
      <slot />,
      <slot name="tooltip-template">
        <div class="tooltip" role="tooltip">
          <div class="arrow"></div>
          <div class="tooltip-inner"></div>
        </div>
      </slot>,
    ]
  }
}