import { Component, Element, Listen, Method } from '@stencil/core';

import get from 'lodash/get';
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

@Component({
  tag: 'boss-collapse',
  shadow: false
})
export class BossCollapse {

  @Element() collapseEl: HTMLElement;

  @Listen('click')
  handleClick() {
    this.handleToggle(this.getConfig());
  }

  getConfig(overrideConfig = {}) {
    console.log('overrideConfig: ', overrideConfig);
    const targetSelector = get(this.collapseEl, 'dataset.target', '');
    if (targetSelector.length === 0) {
      console.log('boss-collapse data-target has not been set');
      return {};
    }
    const targetArr = Array.prototype.slice.call(document.querySelectorAll(targetSelector));
    let closeListArr = [];
    for (let j = 0, len = targetArr.length; j < len; j++) {
      const parentSelector = get(targetArr[j], 'dataset.parent', '');
      if (size(parentSelector) > 0) {
        const parentEl = document.querySelector(parentSelector);
        const childCollapses = Array.prototype.slice.call(parentEl.querySelectorAll(`[data-parent="${parentSelector}"]`));
        closeListArr = filter(childCollapses, (el) => {
          if (el.isEqualNode(targetArr[j])) {
            // don't include the current collapse even if it is open
            return false;
          }
          return hasClass(el, 'show')
        });
      }
    }
    const toggle = get(overrideConfig, 'toggle', true);
    const visibility = get(overrideConfig, 'visibility', true);
    return { toggle, visibility, targetSelector, targetArr, closeListArr };
  }

  checkIfElementInListOfElements(el, elArr) {
    for (let j = 0, len = elArr.length; j < len; j++) {
      if (el.isEqualNode(elArr[j]) === true) {
        return true;
      }
    }
    return false;
  }

  handleToggle(config) {
    const AllOpenedSelectorArr = [];
    const AllClosedSelectorArr = [];
    // actually toggle the collapses that the user will see
    for (let j = 0, len = config.targetArr.length; j < len; j++) {
      if (hasClass(config.targetArr[j], 'show')) {
        this.hideCollapse(config.targetArr[j]);
        AllClosedSelectorArr.push(config.targetArr[j]);
      } else {
        this.showCollapse(config.targetArr[j]);
        AllOpenedSelectorArr.push(config.targetArr[j]);
      }
    }
    // close the other collapses in the accordion (if any)
    for (let j = 0, len = config.closeListArr.length; j < len; j++) {
      this.hideCollapse(config.closeListArr[j]);
      AllClosedSelectorArr.push(config.closeListArr[j]);
    }
    // now handle all of the toggler [data-toggle="collapse"] dom state (mark them expanded or not)
    const allCollapsesOnPage = Array.prototype.slice.call(document.querySelectorAll('[data-toggle="collapse"]'));
    for (let j = 0, len = allCollapsesOnPage.length; j < len; j++) {
      const targetSelector = get(allCollapsesOnPage[j], 'dataset.target', '');
      // const AllOpenedCollapsesArr = [];
      let thisCollapseWasOpened = false;
      // see if we need to open this collapse
      for (let x = 0, len = AllOpenedSelectorArr.length; x < len; x++) {
        const shouldOpen = elementMatches(AllOpenedSelectorArr[x], targetSelector);
        if (shouldOpen === true) {
          thisCollapseWasOpened = true;
          this.setCollapseTogglerToCollapsedTrue(allCollapsesOnPage[j]);
          // AllOpenedCollapsesArr.push(allCollapsesOnPage[j]);
        }
      }
      // see if we need to close this collapse
      if (thisCollapseWasOpened === false) {
        for (let x = 0, len = AllClosedSelectorArr.length; x < len; x++) {
          const shouldClose = elementMatches(AllClosedSelectorArr[x], targetSelector);
          if (shouldClose === true) {
            const preExistingOpenTargets = document.querySelectorAll(`${targetSelector}.show`);
            if (size(preExistingOpenTargets) === 0) {
              this.setCollapseTogglerToCollapsedFalse(allCollapsesOnPage[j]);
            }
          }
        }
      }
    }
  }

  setCollapseTogglerToCollapsedTrue(el) {
    removeClass(el, 'collapsed');
    el.setAttribute('aria-expanded', 'true');
  }

  setCollapseTogglerToCollapsedFalse(el) {
    addClass(el, 'collapsed');
    el.setAttribute('aria-expanded', 'false');
  }

  showCollapse(targetEl) {
    if (hasClass(targetEl, 'show') || hasClass(targetEl, 'collapsing')) {
      return;
    }
    customEvent(targetEl, 'showBossCollapse');
    const dimension = this.getDimension(targetEl);
    const scrollSize = "scroll" + upperFirst(dimension);
    addClass(targetEl, 'collapsing');
    removeClass(targetEl, 'collapse');
    const collapsingTransitionDuration = getTransitionDurationFromElement(targetEl);
    setTimeout(() => {
      removeClass(targetEl, 'collapsing');
      addClass(targetEl, 'collapse');
      addClass(targetEl, 'show');
      targetEl.style[dimension] = '';
      customEvent(targetEl, 'shownBossCollapse');
    }, collapsingTransitionDuration);
    targetEl.style[dimension] = targetEl[scrollSize] + "px";
  }

  hideCollapse(targetEl) {
    if (!hasClass(targetEl, 'show')) {
      return;
    }
    customEvent(targetEl, 'hideBossCollapse');
    const dimension = this.getDimension(targetEl);
    targetEl.style[dimension] = targetEl.getBoundingClientRect()[dimension] + "px";
    this.reflow(targetEl);
    addClass(targetEl, 'collapsing');
    removeClass(targetEl, 'collapse');
    removeClass(targetEl, 'show');
    targetEl.style[dimension] = '';
    const collapsingTransitionDuration = getTransitionDurationFromElement(targetEl);
    setTimeout(() => {
      removeClass(targetEl, 'collapsing');
      addClass(targetEl, 'collapse');
      customEvent(targetEl, 'hiddenBossCollapse');
    }, collapsingTransitionDuration);
  }

  reflow(element) {
    // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    return element.offsetHeight;
  }

  getDimension(el) {
    const hasWidth = hasClass(el, 'width');
    return hasWidth ? 'width' : 'height';
  };

  // TODO: collapse method
    // .collapse('toggle') // triggers a default toggle
          // what to go on accordion?
    // .collapse('show') // shows instead of toggles
          // what to go on accordion?  show all maybe?
    // .collapse('hide') // collapses instead of toggles
    // .collapse({ action: 'toggle', target: '.selector', parent: '.selector' })
    // if its an object then anything not set is derived
    // collapse with an overridden target setting
    // collapse with an overridden parent setting
    // collapse with using a different parent setting (none for disabling accordion activity for one toggle)
    // collapse using show, or hide instead of toggle

  @Method()
  collapse(passedConfig) {
    // console.log('passedConfig: ', passedConfig);
    console.log('typeof passedConfig: ', typeof passedConfig);
    if (size(passedConfig) === 0) {
      this.handleToggle(this.getConfig());
    } else if (typeof passedConfig === 'string') {
      if (toLower(passedConfig) === 'show') {
        this.handleToggle(this.getConfig({ visibility: 'show' }));
      } else if (toLower(passedConfig) === 'hide') {
        this.handleToggle(this.getConfig({ visibility: 'hide' }));
      } else {
        this.handleToggle(this.getConfig());
      }
    } else if (typeof passedConfig === 'object') {
      this.handleToggle(this.getConfig(passedConfig));
    } else {
      this.handleToggle(this.getConfig());
    }
  }

  render() {
    return ( <slot /> );
  }
}