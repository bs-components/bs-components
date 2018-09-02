import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  Element,
  State,
  Method, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import _get from 'lodash/get';
import _has from 'lodash/has';
import _size from 'lodash/size';
import _upperFirst from 'lodash/upperFirst';

import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import customEvent from '../../utilities/custom-event';
import reflow from '../../utilities/reflow';

@Component({ tag: 'bs-collapse', styleUrl: 'bs-collapse.css', shadow: false })
export class BsCollapse { // eslint-disable-line import/prefer-default-export
  @Element() collapseEl: HTMLElement;

  @Prop() showEventName: string = 'show.bs.collapse';
  @Prop() shownEventName: string = 'shown.bs.collapse';
  @Prop() hideEventName: string = 'hide.bs.collapse';
  @Prop() hiddenEventName: string = 'hidden.bs.collapse';

  @State() relatedTarget: Element;

  componentDidUnload() {
    this.relatedTarget = null;
  }

  getConfig(overrideConfig:any = {}, relatedTarget:any = null) {
    // console.log('overrideConfig: ', overrideConfig);
    const config: any = {};
    config.relatedTarget = relatedTarget;
    config.toggle = _get(overrideConfig, 'toggle', 'toggle');
    if (_has(overrideConfig, 'target')) {
      config.targetSelector = overrideConfig.target;
    } else if (relatedTarget && _has(relatedTarget.dataset, 'target')) {
      config.targetSelector = relatedTarget.dataset.target;
    }
    if (_has(overrideConfig, 'parent') && _size(overrideConfig.parent) > 0) {
      if (typeof overrideConfig.parent === 'object' && overrideConfig.parent.nodeValue) {
        config.parent = overrideConfig.parent.nodeValue;
      } else {
        config.parent = overrideConfig.parent;
      }
    } else if (_has(this.collapseEl.dataset, 'parent')) {
      config.parent = this.collapseEl.dataset.parent;
    }
    return config;
  }

  static closeOtherOpenAccordions(AllOtherOpenCollapses) {
    for (let j = 0, len = AllOtherOpenCollapses.length; j < len; j += 1) {
      if (AllOtherOpenCollapses[j].collapse) {
        AllOtherOpenCollapses[j].collapse({ toggle: 'hide', parent: '' });
      } else {
        console.error('Unable to toggle collapse for all targets due to unavailable bs-collapse method "collapse');
      }
    }
  }

  handleToggle(config) {
    const AllOtherOpenCollapses = [];
    if (_has(config, 'parent') && config.parent !== null) {
      // if it has a parent then it is part of an accordion
      const accordionParentEl = document.querySelector(config.parent);
      const childCollapseArr = Array.prototype.slice.call(accordionParentEl.querySelectorAll('.collapse'));
      for (let j = 0, len = childCollapseArr.length; j < len; j += 1) {
        if (!this.collapseEl.isEqualNode(childCollapseArr[j]) && hasClass(childCollapseArr[j], 'show')) {
          AllOtherOpenCollapses.push(childCollapseArr[j]);
        }
      }
    }
    if (config.toggle === 'show') {
      this.showCollapse(this.collapseEl, config.relatedTarget);
      BsCollapse.closeOtherOpenAccordions(AllOtherOpenCollapses);
      return;
    }
    if (config.toggle === 'hide') {
      this.hideCollapse(this.collapseEl);
      return;
    }
    if (hasClass(this.collapseEl, 'show') || hasClass(this.collapseEl, 'collapsing')) {
      this.hideCollapse(this.collapseEl);
      return;
    }
    this.showCollapse(this.collapseEl, config.relatedTarget);
    BsCollapse.closeOtherOpenAccordions(AllOtherOpenCollapses);
  }

  showCollapse(targetEl, relatedTarget) {
    if (hasClass(targetEl, 'show') || hasClass(targetEl, 'collapsing')) {
      return;
    }
    customEvent(targetEl, this.showEventName, {}, relatedTarget);
    const dimension = BsCollapse.getDimension(targetEl);
    const scrollSize = `scroll${_upperFirst(dimension)}`;
    addClass(targetEl, 'collapsing');
    removeClass(targetEl, 'collapse');
    const collapsingTransitionDuration = getTransitionDurationFromElement(targetEl);
    setTimeout(() => {
      removeClass(targetEl, 'collapsing');
      addClass(targetEl, 'collapse');
      addClass(targetEl, 'show');
      // eslint-disable-next-line no-param-reassign
      targetEl.style[dimension] = '';
      if (relatedTarget) {
        relatedTarget.setAttribute('aria-expanded', 'true');
        this.relatedTarget = relatedTarget;
      }
      customEvent(targetEl, this.shownEventName, {}, relatedTarget);
    }, collapsingTransitionDuration);
    // eslint-disable-next-line no-param-reassign
    targetEl.style[dimension] = `${targetEl[scrollSize]}px`;
  }

  hideCollapse(targetEl) {
    if (!hasClass(targetEl, 'show')) {
      return;
    }
    customEvent(targetEl, this.hideEventName, {}, this.relatedTarget);
    const dimension = BsCollapse.getDimension(targetEl);
    // eslint-disable-next-line no-param-reassign
    targetEl.style[dimension] = `${targetEl.getBoundingClientRect()[dimension]}px`;
    reflow(targetEl);
    addClass(targetEl, 'collapsing');
    removeClass(targetEl, 'collapse');
    removeClass(targetEl, 'show');
    // eslint-disable-next-line no-param-reassign
    targetEl.style[dimension] = '';
    const collapsingTransitionDuration = getTransitionDurationFromElement(targetEl);
    setTimeout(() => {
      removeClass(targetEl, 'collapsing');
      addClass(targetEl, 'collapse');
      if (this.relatedTarget) {
        this.relatedTarget.setAttribute('aria-expanded', 'false');
      }
      customEvent(targetEl, this.hiddenEventName, {}, this.relatedTarget);
      this.relatedTarget = null;
    }, collapsingTransitionDuration);
  }

  static getDimension(el) {
    const hasWidth = hasClass(el, 'width');
    return hasWidth ? 'width' : 'height';
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
