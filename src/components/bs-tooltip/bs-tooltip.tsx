import { Component, Prop, Element, Method, State } from '@stencil/core';

import _size from 'lodash/size';
import _get from 'lodash/get';
import split from 'lodash/split';
import toLower from 'lodash/toLower';
import _has from 'lodash/has'
import _toInteger from 'lodash/toInteger'
import _isNaN from 'lodash/isNaN'
import _toString from 'lodash/toString'
import _isNumber from 'lodash/isNumber'
import _includes from 'lodash/includes'
import _some from 'lodash/some'

// import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
// import closest from '../../utilities/closest';
// import elementMatches from '../../utilities/element-matches';
// import hasClass from '../../utilities/has-class';
// import addClass from '../../utilities/add-class';
// import removeClass from '../../utilities/remove-class';
// import toggleClass from '../../utilities/toggle-class';
// import customEvent from '../../utilities/custom-event';
import getConfigBoolean from '../../utilities/get-config-boolean';
// import reflow from '../../utilities/reflow';
import parseJson from '../../utilities/parse-json';
import getUniqueId from '../../utilities/get-unique-id';

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
      const hasAnActiveTrigger = _some(this.activeTrigger);
      // context._activeTrigger.click = !context._activeTrigger.click;
      if (hasAnActiveTrigger) {
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

  enter(event: any = null) {
    console.log('enter');
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
  }

  show() {
    // TODO:




  }

  setListeners() {
    const triggers = split(toLower(this.config.trigger), ' ');
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