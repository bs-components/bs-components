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

  componentDidUnload() {
    document.removeEventListener('click', this.removeFocusFromBsButtonEl);
  }

  removeFocusFromBsButtonEl = () => {
    removeClass(this.bsButtonEl, 'focus');
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

  @Listen('focusin')
  handleFocusIn(event) {
    // only hit by input's inside the bs-button
    const closestButton = this.getClosestButtonInsideComponent(event.target);
    addClass(closestButton, 'focus');
  }

  @Listen('focusout')
  handleFocusOut(event) {
    // only hit by input's inside the bs-button
    const closestButton = this.getClosestButtonInsideComponent(event.target);
    removeClass(closestButton, 'focus');
  }

  @Listen('click')
  handleButtonClick(event) {
    const hasBtnClass = hasClass(event.target, 'btn');
    if (!hasBtnClass) {
      return;
    }
    this.handleToggle(event.target);

    const buttonToggleData = get(event, 'target.dataset.toggle', '');
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
      setTimeout(() => {
        addClass(this.bsButtonEl, 'focus');
        document.addEventListener('click', this.removeFocusFromBsButtonEl, { once: true });
      }, 0);
    }
    if (addAriaPressed) {
      element.setAttribute('aria-pressed', !hasClass(element, 'active'));
    }
    if (triggerChangeEvent) {
      toggleClass(element, 'active');
    }
  }

  @Method()
  removeFocus() {
    document.removeEventListener('click', this.removeFocusFromBsButtonEl);
  }


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