import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  Element,
  Method, // eslint-disable-line no-unused-vars
  // Watch, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import _size from 'lodash/size';

import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import reflow from '../../utilities/reflow';
import customEvent from '../../utilities/custom-event';
import removeClass from '../../utilities/remove-class';
import closest from '../../utilities/closest';


@Component({ tag: 'bs-tab', styleUrl: 'bs-tab.css', shadow: false })
export class BsTab { // eslint-disable-line import/prefer-default-export
  @Element() tabEl: HTMLElement;

  @Prop() showEventName: string = 'show.bs.tab';
  @Prop() shownEventName: string = 'shown.bs.tab';
  @Prop() hideEventName: string = 'hide.bs.tab';
  @Prop() hiddenEventName: string = 'hidden.bs.tab';

  @Prop({ mutable: true }) ignoreDataToggles: boolean = false;

  show(triggeringButton = null) {
    if (hasClass(this.tabEl, 'disabled')) {
      return;
    }
    if (triggeringButton && hasClass(triggeringButton, 'disabled')) {
      return;
    }
    if (this.tabEl.parentNode && this.tabEl.parentNode.nodeType === Node.ELEMENT_NODE && hasClass(this.tabEl, 'active')) {
      return;
    }
    const previousActiveTabs = BsTab.getActiveElements(this.tabEl, this.tabEl.parentNode);
    const eventArr = [];
    let relatedTarget;
    for (let j = 0, len = previousActiveTabs.length; j < len; j += 1) {
      relatedTarget = previousActiveTabs[j];
      eventArr.push(customEvent(previousActiveTabs[j], this.hideEventName, {}, previousActiveTabs[j]));
    }
    eventArr.push(customEvent(this.tabEl, this.showEventName, {}, relatedTarget));
    if (eventArr.some(showOrHideEvent => showOrHideEvent.defaultPrevented)) {
      return;
    }
    if (!this.ignoreDataToggles || !triggeringButton) {
      const previousActiveButtons = BsTab.getActiveButtons(triggeringButton);
      BsTab.activate(triggeringButton, previousActiveButtons);
    }
    BsTab.activate(this.tabEl, previousActiveTabs, () => {
      for (let x = 0, len = previousActiveTabs.length; x < len; x += 1) {
        customEvent(previousActiveTabs[x], this.hiddenEventName, {}, previousActiveTabs[x]);
      }
      customEvent(this.tabEl, this.shownEventName, {}, relatedTarget);
    });
  }

  // static elementIsTabToggler(element) {
  //   if (element.dataset.toggle === 'tab') {
  //     return true;
  //   }
  //   if (element.dataset.toggle === 'pill') {
  //     return true;
  //   }
  //   if (element.dataset.toggle === 'list') {
  //     return true;
  //   }
  //   return false;
  // }

  static getActiveButtons(element) {
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
