import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  Element,
  Method, // eslint-disable-line no-unused-vars
  Watch, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import _size from 'lodash/size';

import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import reflow from '../../utilities/reflow';
import customEvent from '../../utilities/custom-event';
import removeClass from '../../utilities/remove-class';
import closest from '../../utilities/closest';
import elementMatches from '../../utilities/element-matches';
import getTargetSelector from '../../utilities/get-target-selector';

@Component({ tag: 'bs-tab', styleUrl: 'bs-tab.css', shadow: false })
export class BsTab { // eslint-disable-line import/prefer-default-export
  @Element() tabEl: HTMLElement;

  @Prop() showEventName: string = 'show.bs.tab';
  @Prop() shownEventName: string = 'shown.bs.tab';
  @Prop() hideEventName: string = 'hide.bs.tab';
  @Prop() hiddenEventName: string = 'hidden.bs.tab';

  @Prop({ mutable: true }) ignoreDataToggles: boolean = false;
  @Prop({ mutable: true }) dispatchEventsOnTab: boolean = false;
  @Prop({ mutable: true }) showTab: boolean = false;

  componentWillLoad() {
    if (!this.showTab) {
      return;
    }
    const hasTransition = hasClass(this.tabEl, 'fade');
    if (!hasTransition) {
      this.show();
      return;
    }
    removeClass(this.tabEl, 'fade');
    this.tabEl.addEventListener(this.shownEventName, () => {
      addClass(this.tabEl, 'fade');
    }, { once: true });
    this.show();
  }

  show(triggeringButton = null) {
    if (hasClass(this.tabEl, 'disabled')) {
      return;
    }
    let toggler;
    if (triggeringButton) {
      toggler = triggeringButton;
    } else if (!this.ignoreDataToggles && !triggeringButton) {
      toggler = this.searchForTriggeringButton();
    } else {
      toggler = null;
    }
    if (!this.ignoreDataToggles && toggler && hasClass(toggler, 'disabled')) {
      return;
    }
    if (this.tabEl.parentNode && this.tabEl.parentNode.nodeType === Node.ELEMENT_NODE && hasClass(this.tabEl, 'active')) {
      return;
    }
    const previousActiveTabs = BsTab.getActiveElements(this.tabEl, this.tabEl.parentNode);
    const previousActiveButtons = this.getActiveButtons(toggler);
    const eventArr = [];
    let relatedTarget;
    if (this.dispatchEventsOnTab || this.ignoreDataToggles || !toggler) {
      for (let j = 0, len = previousActiveTabs.length; j < len; j += 1) {
        relatedTarget = previousActiveTabs[j];
        eventArr.push(customEvent(previousActiveTabs[j], this.hideEventName, {}, this.tabEl));
      }
      eventArr.push(customEvent(this.tabEl, this.showEventName, {}, relatedTarget));
    } else {
      for (let j = 0, len = previousActiveButtons.length; j < len; j += 1) {
        relatedTarget = previousActiveButtons[j];
        eventArr.push(customEvent(previousActiveButtons[j], this.hideEventName, {}, toggler));
      }
      eventArr.push(customEvent(toggler, this.showEventName, {}, relatedTarget));
    }
    if (eventArr.some(showOrHideEvent => showOrHideEvent.defaultPrevented)) {
      return;
    }
    if (!this.ignoreDataToggles && toggler) {
      BsTab.activate(toggler, previousActiveButtons);
    }
    BsTab.activate(this.tabEl, previousActiveTabs, () => {
      if (this.dispatchEventsOnTab || this.ignoreDataToggles || !toggler) {
        for (let x = 0, len = previousActiveTabs.length; x < len; x += 1) {
          customEvent(previousActiveTabs[x], this.hiddenEventName, {}, this.tabEl);
        }
        customEvent(this.tabEl, this.shownEventName, {}, relatedTarget);
      } else {
        for (let x = 0, len = previousActiveButtons.length; x < len; x += 1) {
          customEvent(previousActiveButtons[x], this.hiddenEventName, {}, toggler);
        }
        customEvent(toggler, this.shownEventName, {}, relatedTarget);
      }
    });
  }

  searchForTriggeringButton() {
    const matchingTriggers = [];
    const tabTriggerArr = Array.prototype.slice.call(document.querySelectorAll('[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]'));
    for (let j = 0, len = tabTriggerArr.length; j < len; j += 1) {
      const targetSelector = getTargetSelector(tabTriggerArr[j]);
      if (targetSelector && elementMatches(this.tabEl, targetSelector)) {
        matchingTriggers.push(tabTriggerArr[j]);
      }
    }
    // const pillTriggerArr = Array.prototype.slice.call(document.querySelectorAll('[data-toggle="pill"]'));
    // for (let j = 0, len = pillTriggerArr.length; j < len; j += 1) {
    //   const targetSelector = getTargetSelector(pillTriggerArr[j]);
    //   if (targetSelector && elementMatches(this.tabEl, targetSelector)) {
    //     matchingTriggers.push(pillTriggerArr[j]);
    //   }
    // }
    // const listTriggerArr = Array.prototype.slice.call(document.querySelectorAll('[data-toggle="list"]'));
    // for (let j = 0, len = listTriggerArr.length; j < len; j += 1) {
    //   const targetSelector = getTargetSelector(listTriggerArr[j]);
    //   if (targetSelector && elementMatches(this.tabEl, targetSelector)) {
    //     matchingTriggers.push(listTriggerArr[j]);
    //   }
    // }
    if (matchingTriggers.length > 1) {
      console.warn('Unable to find tab toggle because more than one data toggle target matches this tab');
      return null;
    }
    if (matchingTriggers.length === 1) {
      return matchingTriggers[0];
    }
    return null;
  }

  getActiveButtons(element) {
    if (this.ignoreDataToggles || !element) {
      return [];
    }
    const listElement = closest(element, '.nav, .list-group');
    if (listElement) {
      if (listElement.nodeName !== 'UL') {
        return Array.prototype.slice.call(listElement.querySelectorAll('.active'));
      }
      const activeButtonElArr = [];
      const listChildren = Array.prototype.slice.call(listElement.children);
      for (let j = 0, len = listChildren.length; j < len; j += 1) {
        if (listChildren[j].nodeName === 'LI') {
          const activeInLi = Array.prototype.slice.call(listChildren[j].querySelectorAll('.active'));
          for (let x = 0, len2 = activeInLi.length; x < len2; x += 1) {
            activeButtonElArr.push(activeInLi[x]);
          }
        }
      }
      return activeButtonElArr;
    }
    return [];
  }


  static getActiveElements(element, container) {
    if (container.nodeName === 'UL') {
      return Array.prototype.slice.call((element.parentNode as any).querySelectorAll('> li > .active'));
    }
    const activeChildren = [];
    const children = Array.prototype.slice.call(element.parentNode.children);
    for (let j = 0, len = children.length; j < len; j += 1) {
      if (hasClass(children[j], 'active')) {
        activeChildren.push(children[j]);
      }
    }
    return activeChildren;
  }

  static activate(element, activeElements, callback = () => {}) {
    const active = activeElements[0];
    const isTransitioning = active && hasClass(active, 'fade');
    const closeTabTransitionDuration = getTransitionDurationFromElement(active);

    // close other tabs
    for (let j = 0, len = activeElements.length; j < len; j += 1) {
      removeClass(activeElements[j], 'show');
      removeClass(activeElements[j], 'active');
      const dropdownChild = activeElements[j].parentNode.querySelectorAll('.dropdown-menu .active');
      for (let x = 0, len2 = dropdownChild.length; x < len2; x += 1) {
        removeClass(dropdownChild[x], 'active');
      }
      if (active.getAttribute('role') === 'tab') {
        active.setAttribute('aria-selected', false);
      }
    }

    // open this tab
    addClass(element, 'active');
    if (element.getAttribute('role') === 'tab') {
      element.setAttribute('aria-selected', true);
    }
    reflow(element);
    addClass(element, 'show');
    if (element.parentNode && hasClass(element.parentNode, 'dropdown-menu')) {
      const dropdownElement = closest(element, '.dropdown');
      if (dropdownElement) {
        const dropdownToggleList = Array.prototype.slice.call(dropdownElement.querySelectorAll('.dropdown-toggle'));
        for (let i = 0, len3 = dropdownToggleList.length; i < len3; i += 1) {
          addClass(dropdownToggleList[i], 'active');
        }
      }
      element.setAttribute('aria-expanded', true);
    }

    if (isTransitioning) {
      setTimeout(() => {
        callback();
      }, closeTabTransitionDuration);
    } else {
      callback();
    }
  }

  @Watch('showTab')
  handleShowTabWatch(newValue /* , oldValue */) {
    if (newValue) {
      this.show();
    }
  }


  @Method()
  tab(tabOptions = {}, triggeringButton = null) {
    if (_size(tabOptions) === 0) {
      return this.tabEl;
    }
    if (tabOptions === 'show') {
      this.show(triggeringButton);
      return true;
    }
    if (typeof tabOptions === 'string') {
      throw new Error(`No method named "${tabOptions}"`);
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
