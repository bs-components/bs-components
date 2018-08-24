import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  Element,
  Listen, // eslint-disable-line no-unused-vars
  Method, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import get from 'lodash/get';
import has from 'lodash/has';
import size from 'lodash/size';
import filter from 'lodash/filter';
import upperFirst from 'lodash/upperFirst';
import toLower from 'lodash/toLower';

import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import elementMatches from '../../utilities/element-matches';
import customEvent from '../../utilities/custom-event';
import reflow from '../../utilities/reflow';

@Component({ tag: 'bs-collapse', shadow: false })
export class BsCollapse { // eslint-disable-line import/prefer-default-export
  @Element() collapseEl: HTMLElement;

  @Prop({ mutable: true, reflectToAttr: true }) tabindex: string = '0';

  @Prop() showEventName: string = 'show.bs.collapse';
  @Prop() shownEventName: string = 'shown.bs.collapse';
  @Prop() hideEventName: string = 'hide.bs.collapse';
  @Prop() hiddenEventName: string = 'hidden.bs.collapse';

  // componentDidLoad() {
  //   const currentTabIndex = this.collapseEl.getAttribute('tabindex');
  //   if (size(currentTabIndex) === 0) {
  //     // without tabindex set the bs-collapse can not receive focus
  //     this.collapseEl.setAttribute('tabindex', '0');
  //   }
  // }

  // componentDidUnload() {
  //   document.removeEventListener('click', this.removeFocusFromBsCollapseEl);
  // }

  @Listen('focusin')
  handleFocusIn(event) {
    const isDisabled = hasClass(this.collapseEl, 'disabled');
    if (isDisabled) {
      // put the focus back where it was
      if (event.relatedTarget) {
        event.relatedTarget.focus();
      } else {
        (document.activeElement as any).blur();
      }
      event.preventDefault();
    }
    // TODO: remove/add listeners to keydown space and keydown enter to click to toggle
    // TODO: remove listeners on focus out
  }

  @Listen('click')
  handleClick() {
    this.handleToggle(this.getConfig());
  }

  getConfig(overrideConfig = {}) {
    const config: any = {};
    config.toggle = get(overrideConfig, 'toggle', 'toggle');
    if (has(overrideConfig, 'target')) {
      config.targetSelector = get(overrideConfig, 'target', '');
    } else {
      config.targetSelector = get(this.collapseEl, 'dataset.target', '');
    }
    if (size(config.targetSelector) === 0) {
      return {};
    }
    config.targetArr = Array.prototype.slice.call(document.querySelectorAll(config.targetSelector));
    config.closeListArr = [];
    for (let j = 0, len = config.targetArr.length; j < len; j += 1) {
      let useDataParentSelector;
      if (has(overrideConfig, 'parent')) {
        useDataParentSelector = false;
        config.parentSelector = get(overrideConfig, 'parent', '');
      } else {
        useDataParentSelector = true;
        config.parentSelector = get(config.targetArr[j], 'dataset.parent', '');
      }
      if (size(config.parentSelector) > 0) {
        const parentEl = document.querySelector(config.parentSelector);
        let childCollapses;
        if (useDataParentSelector === true) {
          childCollapses = Array.prototype.slice.call(parentEl.querySelectorAll(`[data-parent="${config.parentSelector}"]`));
        } else {
          childCollapses = Array.prototype.slice.call(parentEl.querySelectorAll('.collapse'));
        }
        config.closeListArr = config.closeListArr.concat(filter(childCollapses, (el) => {
          if (el.isEqualNode(config.targetArr[j])) {
            // don't include the current collapse even if it is open
            return false;
          }
          return hasClass(el, 'show');
        }));
      }
    }
    return config;
  }

  // static checkIfElementInListOfElements(el, elArr) {
  //   for (let j = 0, len = elArr.length; j < len; j += 1) {
  //     if (el.isEqualNode(elArr[j]) === true) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  handleToggle(config) {
    // console.log('config: ', config);
    if (!has(config, 'targetSelector')) {
      console.log('bs-collapse data-target has not been set');
      return;
    }
    const AllOpenedSelectorArr = [];
    const AllClosedSelectorArr = [];
    // actually toggle the collapses that the user will see
    for (let j = 0, len = config.targetArr.length; j < len; j += 1) {
      if (config.toggle === 'show') {
        this.showCollapse(config.targetArr[j]);
        AllOpenedSelectorArr.push(config.targetArr[j]);
      } else if (config.toggle === 'hide') {
        this.hideCollapse(config.targetArr[j]);
        AllClosedSelectorArr.push(config.targetArr[j]);
      } else if (hasClass(config.targetArr[j], 'show')) {
        this.hideCollapse(config.targetArr[j]);
        AllClosedSelectorArr.push(config.targetArr[j]);
      } else {
        this.showCollapse(config.targetArr[j]);
        AllOpenedSelectorArr.push(config.targetArr[j]);
      }
    }
    // close the other collapses in the accordion (if any)
    for (let j = 0, len = config.closeListArr.length; j < len; j += 1) {
      this.hideCollapse(config.closeListArr[j]);
      AllClosedSelectorArr.push(config.closeListArr[j]);
    }
    // now handle all of the toggler [data-toggle="collapse"] dom state (mark them expanded or not)
    const allCollapsesOnPage = Array.prototype.slice.call(document.querySelectorAll('[data-toggle="collapse"]'));
    for (let j = 0, len = allCollapsesOnPage.length; j < len; j += 1) {
      const targetSelector = get(allCollapsesOnPage[j], 'dataset.target', '');
      let thisCollapseWasOpened = false;
      // see if we need to open this collapse
      for (let x = 0, innerLen = AllOpenedSelectorArr.length; x < innerLen; x += 1) {
        const shouldOpen = elementMatches(AllOpenedSelectorArr[x], targetSelector);
        if (shouldOpen === true) {
          thisCollapseWasOpened = true;
          BsCollapse.setCollapseTogglerToCollapsedTrue(allCollapsesOnPage[j]);
        }
      }
      // see if we need to close this collapse
      if (thisCollapseWasOpened === false) {
        for (let x = 0, innerLen = AllClosedSelectorArr.length; x < innerLen; x += 1) {
          const shouldClose = elementMatches(AllClosedSelectorArr[x], targetSelector);
          if (shouldClose === true) {
            const preExistingOpenTargets = document.querySelectorAll(`${targetSelector}.show`);
            if (size(preExistingOpenTargets) === 0) {
              BsCollapse.setCollapseTogglerToCollapsedFalse(allCollapsesOnPage[j]);
            }
          }
        }
      }
    }
  }

  static setCollapseTogglerToCollapsedTrue(el) {
    removeClass(el, 'collapsed');
    el.setAttribute('aria-expanded', 'true');
  }

  static setCollapseTogglerToCollapsedFalse(el) {
    addClass(el, 'collapsed');
    el.setAttribute('aria-expanded', 'false');
  }

  showCollapse(targetEl) {
    if (hasClass(targetEl, 'show') || hasClass(targetEl, 'collapsing')) {
      return;
    }
    customEvent(targetEl, this.showEventName);
    const dimension = BsCollapse.getDimension(targetEl);
    const scrollSize = `scroll${upperFirst(dimension)}`;
    addClass(targetEl, 'collapsing');
    removeClass(targetEl, 'collapse');
    const collapsingTransitionDuration = getTransitionDurationFromElement(targetEl);
    setTimeout(() => {
      removeClass(targetEl, 'collapsing');
      addClass(targetEl, 'collapse');
      addClass(targetEl, 'show');
      // eslint-disable-next-line no-param-reassign
      targetEl.style[dimension] = '';
      customEvent(targetEl, this.shownEventName);
    }, collapsingTransitionDuration);
    // eslint-disable-next-line no-param-reassign
    targetEl.style[dimension] = `${targetEl[scrollSize]}px`;
  }

  hideCollapse(targetEl) {
    if (!hasClass(targetEl, 'show')) {
      return;
    }
    customEvent(targetEl, this.hideEventName);
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
      customEvent(targetEl, this.hiddenEventName);
    }, collapsingTransitionDuration);
  }

  static getDimension(el) {
    const hasWidth = hasClass(el, 'width');
    return hasWidth ? 'width' : 'height';
  }

  @Method()
  collapse(passedConfig) {
    // .collapse('toggle|show|hide')
    // .collapse({ toggle: 'toggle|show|hide', target: '.selector', parent: '.selector' })
    if (typeof passedConfig === 'string') {
      this.handleToggle(this.getConfig({ toggle: toLower(passedConfig) }));
    } else if (typeof passedConfig === 'object') {
      this.handleToggle(this.getConfig(passedConfig));
    } else {
      this.handleToggle(this.getConfig());
    }
  }

  render() {
    return (<slot />);
  }
}
