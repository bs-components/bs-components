import { Component, Element, Listen, Method } from '@stencil/core';

import size from 'lodash/size';
import get from 'lodash/get';

import closest from '../../utilities/closest';
import elementMatches from '../../utilities/element-matches';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import toggleClass from '../../utilities/toggle-class';
import customEvent from '../../utilities/custom-event';

@Component({
  tag: 'bs-button',
  shadow: false
})
export class BsButton {
  @Element() bsButtonEl: HTMLElement;

  componentDidLoad() {
    const currentTabIndex = this.bsButtonEl.getAttribute('tabindex');
    const buttonToggleData = get(this.bsButtonEl, 'dataset.toggle', '');
    if (size(currentTabIndex) === 0 && buttonToggleData === 'button') {
       // without tabindex set the bs-button can not receive focus
      this.bsButtonEl.setAttribute('tabindex', '0');
    }
  }

  // componentDidUnload() {
  //   document.removeEventListener('click', this.removeFocusFromBsButtonEl);
  // }

  // addFocusToBsButtonEl = () => {
  //   addClass(this.bsButtonEl, 'focus');
  //   document.addEventListener('click', this.removeFocusFromBsButtonEl, { once: true });
  //   (document.activeElement as any).blur();
  // }

  // removeFocusFromBsButtonEl = () => {
  //   document.removeEventListener('click', this.removeFocusFromBsButtonEl);
  //   removeClass(this.bsButtonEl, 'focus');
  // }

  @Listen('focusin')
  handleFocusIn(event) {
    const buttonToggleData = get(this.bsButtonEl, 'dataset.toggle', '');
    if (buttonToggleData === 'button') {
      // focus is handled by the tabindex attribute
      const isDisabled = hasClass(this.bsButtonEl, 'disabled');
      if (isDisabled) {
        // put the focus back where it was
        if (event.relatedTarget) {
          event.relatedTarget.focus();
        } else {
          (document.activeElement as any).blur();
        }
        event.preventDefault();
        return;
      }
      // TODO: add listeners to keydown space and keydown enter to click to toggle
      return;
    }
    const closestButton = this.getClosestButtonInsideComponent(event.target);
    addClass(closestButton, 'focus');
  }

  @Listen('focusout')
  handleFocusOut(event) {
    const buttonToggleData = get(this.bsButtonEl, 'dataset.toggle', '');
    if (buttonToggleData === 'button') {
      // focus is handled by the tabindex attribute
      // TODO: remove the listeners to keydown space and keydown enter
      return;
    }
    const closestButton = this.getClosestButtonInsideComponent(event.target);
    removeClass(closestButton, 'focus');
  }

  @Listen('click')
  handleButtonClick(event) {
    const hasBtnClass = hasClass(event.target, 'btn');
    if (!hasBtnClass) {
      return;
    }
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    const buttonToggleData = get(event, 'target.dataset.toggle', '');
    this.handleToggle(event.target);
    if (buttonToggleData === 'modal') {
      const modalTargetSelector = get(event, 'target.dataset.target', '');
      if (size(modalTargetSelector) > 0) {
        const modalTarget = document.querySelector(modalTargetSelector);
        if (modalTarget.modalToggleButtonClicked) {
          modalTarget.modalToggleButtonClicked(event.target);
        }
      }
    }
  }

  getClosestButtonInsideComponent(element) {
    let currentEl = element.parentElement || element.parentNode;
    while (currentEl !== null && currentEl.nodeType === 1) {
      if (elementMatches(currentEl, '.btn')) {
        return currentEl;
      }
      if (this.bsButtonEl.isEqualNode(currentEl)) {
        return null;
      }
      currentEl = element.parentElement || element.parentNode;
    }
    return null;
  }

  handleToggle(element) {
    const rootElement = closest(element, '[data-toggle="buttons"]');
    let triggerChangeEvent = true;
    let addAriaPressed = true;
    if (rootElement) {
      var input = element.querySelector('input');
      if (input) {
        if (input.type === 'radio') {
          if (input.checked && hasClass(element, 'active')) {
            triggerChangeEvent = false;
          } else {
            let activeElement = rootElement.querySelector('.active');
            if (activeElement) {
              removeClass(activeElement, 'active');
            }
          }
        }
        if (triggerChangeEvent) {
          if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || hasClass(input, 'disabled') || hasClass(rootElement, 'disabled')) {
            return;
          }
          input.checked = !hasClass(element, 'active');
          customEvent(input, 'change');
        }
        input.focus();
        addAriaPressed = false;
      }
    } else {
      // (this.bsButtonEl as any).tabStop = true;
      // this.bsButtonEl.setAttribute('tabindex', '0');

      const buttonToggleData = get(this.bsButtonEl, 'dataset.toggle', '');
      if (buttonToggleData !== 'button') {
        triggerChangeEvent = false;
      }
      // setTimeout(() => {
      //   this.addFocusToBsButtonEl();
      // }, 0);
    }
    if (addAriaPressed) {
      element.setAttribute('aria-pressed', !hasClass(element, 'active'));
    }
    if (triggerChangeEvent) {
      toggleClass(element, 'active');
    }
  }

  // @Method()
  // removeFocus() {
  //   document.removeEventListener('click', this.removeFocusFromBsButtonEl);
  // }

  @Method()
  toggle(selector) {
    if (size(selector) === 0) {
      this.handleToggle(this.bsButtonEl);
    } else {
      this.handleToggle(this.bsButtonEl.querySelector(selector));
    }
  }

  render() {
    return ( <slot /> );
  }
}