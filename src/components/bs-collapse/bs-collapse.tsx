import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  Element,
  State,
  Method, // eslint-disable-line no-unused-vars
  Watch, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import _get from 'lodash/get';
import _has from 'lodash/has';
import _size from 'lodash/size';
import _upperFirst from 'lodash/upperFirst';
import _isElement from 'lodash/isElement';

import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import customEvent from '../../utilities/custom-event';
import reflow from '../../utilities/reflow';
import elementMatches from '../../utilities/element-matches';
import getTargetSelector from '../../utilities/get-target-selector';

@Component({ tag: 'bs-collapse', styleUrl: 'bs-collapse.css', shadow: false })
export class BsCollapse { // eslint-disable-line import/prefer-default-export
  @Element() collapseEl: HTMLElement;

  @Prop() showEventName: string = 'show.bs.collapse';
  @Prop() shownEventName: string = 'shown.bs.collapse';
  @Prop() hideEventName: string = 'hide.bs.collapse';
  @Prop() hiddenEventName: string = 'hidden.bs.collapse';

  @Prop({ mutable: true }) ignoreAccordion: boolean = false;
  @Prop({ mutable: true }) ignoreDataToggles: boolean = false;
  @Prop({ mutable: true }) showCollapse: boolean = false;

  @State() relatedTarget: Element;

  componentWillLoad() {
    const collapseIsOpen = this.thisCollapseIsShown();
    if (collapseIsOpen === false && this.showCollapse === true) {
      addClass(this.collapseEl, 'show');
      removeClass(this.collapseEl, 'collapsing');
      addClass(this.collapseEl, 'collapse');
      const dimension = BsCollapse.getDimension(this.collapseEl);
      this.collapseEl.style[dimension] = '';
      const config = this.getConfig({ toggle: 'show' });
      let accordionParentEl;
      if (_isElement(config.parent)) {
        accordionParentEl = config.parent;
      } else {
        accordionParentEl = document.querySelector(config.parent);
        if (!accordionParentEl) {
          console.warn(`unable to find accordion parent by selector: "${config.parent}"`);
        }
      }
      if (accordionParentEl) {
        const childCollapseArr = Array.prototype.slice.call(accordionParentEl.querySelectorAll('.collapse'));
        for (let j = 0, len = childCollapseArr.length; j < len; j += 1) {
          if (hasClass(childCollapseArr[j], 'show')) {
            const isAMemberOfThisAccordion = elementMatches(accordionParentEl, childCollapseArr[j].dataset.parent);
            if (isAMemberOfThisAccordion && !childCollapseArr[j].isEqualNode(this.collapseEl)) {
              config.collapseElPlannedToBeClosed.push(childCollapseArr[j]);
            }
          }
        }
      }
      if (config.ignoreAccordion !== true) {
        for (let j = 0, len = config.collapseElPlannedToBeClosed.length; j < len; j += 1) {
          removeClass(config.collapseElPlannedToBeClosed[j], 'show');
          removeClass(config.collapseElPlannedToBeClosed[j], 'collapsing');
          addClass(config.collapseElPlannedToBeClosed[j], 'collapse');
          const childDimension = BsCollapse.getDimension(config.collapseElPlannedToBeClosed[j]);
          this.collapseEl.style[childDimension] = '';
        }
      }
      if (config.ignoreDataToggles !== true) {
        BsCollapse.handleToggleDataToggles(config);
      }
    }
  }

  componentDidUnload() {
    this.relatedTarget = null;
  }

  getConfig(overrideConfig:any = {}, relatedTarget:any = null) {
    const config: any = {};
    config.relatedTarget = relatedTarget;
    if (overrideConfig.toggle === true) {
      config.toggle = 'toggle';
    } else if (overrideConfig.toggle === false) {
      // keep the toggle state as is
      if (this.thisCollapseIsShown() === true) {
        config.toggle = 'show';
      } else {
        config.toggle = 'hide';
      }
    } else {
      config.toggle = _get(overrideConfig, 'toggle', 'toggle');
    }

    if (_has(overrideConfig, 'ignoreAccordion')) {
      config.ignoreAccordion = overrideConfig.ignoreAccordion;
    } else {
      config.ignoreAccordion = this.ignoreAccordion;
    }
    if (_has(overrideConfig, 'ignoreDataToggles')) {
      config.ignoreDataToggles = overrideConfig.ignoreDataToggles;
    } else {
      config.ignoreDataToggles = this.ignoreDataToggles;
    }

    config.collapseElPlannedToBeOpened = [];
    config.collapseElPlannedToBeClosed = [];
    if (_has(overrideConfig, 'target')) {
      config.targetSelector = overrideConfig.target;
    } else if (relatedTarget && _has(relatedTarget.dataset, 'target')) {
      config.targetSelector = relatedTarget.dataset.target;
    }
    if (_has(overrideConfig, 'parent') && _isElement(overrideConfig.parent)) {
      config.parent = overrideConfig.parent;
    } else if (_has(overrideConfig, 'parent') && typeof overrideConfig.parent === 'string' && _size(overrideConfig.parent) > 1) {
      config.parent = overrideConfig.parent;
    } else if (_has(this.collapseEl.dataset, 'parent')) {
      config.parent = this.collapseEl.dataset.parent;
    }
    return config;
  }

  closeOtherOpenAccordions(config) {
    for (let j = 0, len = config.collapseElPlannedToBeClosed.length; j < len; j += 1) {
      if (config.collapseElPlannedToBeClosed[j].collapse && !this.collapseEl.isEqualNode(config.collapseElPlannedToBeClosed[j])) {
        config.collapseElPlannedToBeClosed[j].collapse({ toggle: 'hide', ignoreAccordion: true, ignoreDataToggles: true });
      } else {
        console.error('Unable to toggle collapse for all targets due to unavailable bs-collapse method "collapse');
      }
    }
  }


  static handleToggleDataToggles(config) {
    // handle all of the toggler [data-toggle="collapse"] dom state (mark them expanded or not)
    const allCollapsesOnPage = Array.prototype.slice.call(document.querySelectorAll('[data-toggle="collapse"]'));
    for (let j = 0, len = allCollapsesOnPage.length; j < len; j += 1) {
      const targetSelector = getTargetSelector(allCollapsesOnPage[j]);
      let thisCollapseWasOpened = false;
      if (_size(targetSelector) > 0) {
      // see if we need to open this collapse
        for (let x = 0, innerLen = config.collapseElPlannedToBeOpened.length; x < innerLen; x += 1) {
          const shouldOpen = elementMatches(config.collapseElPlannedToBeOpened[x], targetSelector);
          if (shouldOpen === true && thisCollapseWasOpened === false) {
            removeClass(allCollapsesOnPage[j], 'collapsed');
            allCollapsesOnPage[j].setAttribute('aria-expanded', 'true');
            thisCollapseWasOpened = true;
          }
        }
        // see if we need to close this collapse
        if (thisCollapseWasOpened === false) {
          for (let x = 0, innerLen = config.collapseElPlannedToBeClosed.length; x < innerLen; x += 1) {
            const shouldClose = elementMatches(config.collapseElPlannedToBeClosed[x], targetSelector);
            if (shouldClose === true) {
              const preExistingOpenTargets = document.querySelectorAll(`${targetSelector}.show`);
              if (_size(preExistingOpenTargets) === 0) {
                addClass(allCollapsesOnPage[j], 'collapsed');
                allCollapsesOnPage[j].setAttribute('aria-expanded', 'false');
              }
            }
          }
        }
      }
    }
  }

  thisCollapseIsShown() {
    return hasClass(this.collapseEl, 'show') || hasClass(this.collapseEl, 'collapsing');
  }

  handleToggle(config) {
    if (_has(config, 'parent') && config.ignoreAccordion !== true) {
      // if it has a parent then it is part of an accordion
      let accordionParentEl;
      if (_isElement(config.parent)) {
        accordionParentEl = config.parent;
      } else {
        accordionParentEl = document.querySelector(config.parent);
        if (!accordionParentEl) {
          console.warn(`unable to find accordion parent by selector: "${config.parent}"`);
        }
      }
      if (accordionParentEl) {
        const childCollapseArr = Array.prototype.slice.call(accordionParentEl.querySelectorAll('.collapse'));
        for (let j = 0, len = childCollapseArr.length; j < len; j += 1) {
          if (hasClass(childCollapseArr[j], 'show')) {
            const isAMemberOfThisAccordion = elementMatches(accordionParentEl, childCollapseArr[j].dataset.parent);
            if (isAMemberOfThisAccordion) {
              config.collapseElPlannedToBeClosed.push(childCollapseArr[j]);
            }
          }
        }
      }
    }
    if (config.toggle === 'show') {
      config.collapseElPlannedToBeOpened.push(this.collapseEl);
      this.show(this.collapseEl, config);
      return;
    }
    if (config.toggle === 'hide') {
      config.collapseElPlannedToBeClosed.push(this.collapseEl);
      this.hideCollapse(this.collapseEl, config);
      return;
    }
    // const thisCollapseIsShown = hasClass(this.collapseEl, 'show') || hasClass(this.collapseEl, 'collapsing');
    if (this.thisCollapseIsShown()) {
      config.collapseElPlannedToBeClosed.push(this.collapseEl);
      this.hideCollapse(this.collapseEl, config);
      return;
    }
    config.collapseElPlannedToBeOpened.push(this.collapseEl);
    this.show(this.collapseEl, config);
  }

  show(targetEl, config) {
    if (hasClass(targetEl, 'show') || hasClass(targetEl, 'collapsing')) {
      return;
    }
    const showEvent = customEvent(targetEl, this.showEventName, {}, config.relatedTarget);
    if (showEvent.defaultPrevented) {
      return;
    }
    const dimension = BsCollapse.getDimension(targetEl);
    const scrollSize = `scroll${_upperFirst(dimension)}`;
    addClass(targetEl, 'collapsing');
    removeClass(targetEl, 'collapse');
    if (config.ignoreAccordion !== true) {
      this.closeOtherOpenAccordions(config);
    }
    if (config.ignoreDataToggles !== true) {
      BsCollapse.handleToggleDataToggles(config);
    }
    const collapsingTransitionDuration = getTransitionDurationFromElement(targetEl);
    setTimeout(() => {
      removeClass(targetEl, 'collapsing');
      addClass(targetEl, 'collapse');
      addClass(targetEl, 'show');
      // eslint-disable-next-line no-param-reassign
      targetEl.style[dimension] = '';
      if (config.relatedTarget) {
        this.relatedTarget = config.relatedTarget;
      }
      customEvent(targetEl, this.shownEventName, {}, config.relatedTarget);
    }, collapsingTransitionDuration);
    // eslint-disable-next-line no-param-reassign
    targetEl.style[dimension] = `${targetEl[scrollSize]}px`;
  }

  hideCollapse(targetEl, config) {
    if (!hasClass(targetEl, 'show')) {
      return;
    }
    const hideEvent = customEvent(targetEl, this.hideEventName, {}, this.relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const dimension = BsCollapse.getDimension(targetEl);
    // eslint-disable-next-line no-param-reassign
    targetEl.style[dimension] = `${targetEl.getBoundingClientRect()[dimension]}px`;
    reflow(targetEl);
    addClass(targetEl, 'collapsing');
    removeClass(targetEl, 'collapse');
    removeClass(targetEl, 'show');
    // eslint-disable-next-line no-param-reassign
    targetEl.style[dimension] = '';
    if (config.ignoreDataToggles !== true) {
      BsCollapse.handleToggleDataToggles(config);
    }
    const collapsingTransitionDuration = getTransitionDurationFromElement(targetEl);
    setTimeout(() => {
      removeClass(targetEl, 'collapsing');
      addClass(targetEl, 'collapse');
      customEvent(targetEl, this.hiddenEventName, {}, this.relatedTarget);
      this.relatedTarget = null;
    }, collapsingTransitionDuration);
  }

  static getDimension(el) {
    const hasWidth = hasClass(el, 'width');
    return hasWidth ? 'width' : 'height';
  }

  @Watch('showCollapse')
  handlePresentWatch(newValue /* , oldValue */) {
    if (newValue === true) {
      this.handleToggle(this.getConfig({ toggle: 'show' }));
    } else if (newValue === false) {
      this.handleToggle(this.getConfig({ toggle: 'hide' }));
    }
  }

  @Method()
  collapse(collapseOptions, relatedTarget = null) {
    if (_size(collapseOptions) === 0) {
      return this.collapseEl;
    }
    if (collapseOptions === 'toggle') {
      this.handleToggle(this.getConfig({ toggle: 'toggle' }, relatedTarget));
      return true;
    }
    if (collapseOptions === 'show') {
      this.handleToggle(this.getConfig({ toggle: 'show' }, relatedTarget));
      return true;
    }
    if (collapseOptions === 'hide') {
      this.handleToggle(this.getConfig({ toggle: 'hide' }, relatedTarget));
      return true;
    }
    if (typeof collapseOptions === 'string') {
      throw new Error(`No method named "${collapseOptions}"`);
    }
    if (typeof collapseOptions === 'object') {
      this.handleToggle(this.getConfig(collapseOptions, relatedTarget));
      return true;
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
