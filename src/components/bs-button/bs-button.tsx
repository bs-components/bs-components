import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  Listen, // eslint-disable-line no-unused-vars
  Element,
  Method, // eslint-disable-line no-unused-vars
} from '@stencil/core';


import _size from 'lodash/size';
import _get from 'lodash/get';

import closest from '../../utilities/closest';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import toggleClass from '../../utilities/toggle-class';
import customEvent from '../../utilities/custom-event';


@Component({ tag: 'bs-button', shadow: false })
export class BsButton { // eslint-disable-line import/prefer-default-export
  @Element() bsButtonEl: HTMLElement;

  @Prop({ mutable: true, reflectToAttr: true }) tabindex: string = '0';

  @Listen('focusin')
  handleFocusIn(event) {
    if (this.tabindex === '-1') {
      this.tabindex = '';
    }
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    const buttonToggleData = _get(this.bsButtonEl, 'dataset.toggle', '');
    if (buttonToggleData === 'button') {
      // focus is handled by the tabindex attribute
      // const isDisabled = hasClass(this.bsButtonEl, 'disabled');
      // if (isDisabled) {
      //   // put the focus back where it was
      //   if (event.relatedTarget) {
      //     event.relatedTarget.focus();
      //   } else {
      //     (document.activeElement as any).blur();
      //   }
      //   event.preventDefault();
      //   return;
      // }
      // TODO: add listeners to keydown space and keydown enter to click to toggle
      return;
    }
    const closestButton = closest(event.target, '.btn');
    if (!closestButton || !this.bsButtonEl.contains(closestButton)) {
      return;
    }
    addClass(closestButton, 'focus');
  }

  @Listen('focusout')
  handleFocusOut(event) {
    const buttonToggleData = _get(this.bsButtonEl, 'dataset.toggle', '');
    if (buttonToggleData === 'button') {
      // focus is handled by the tabindex attribute
      // TODO: remove the listeners to keydown space and keydown enter
      return;
    }
    const closestButton = closest(event.target, '.btn');
    if (!closestButton || !this.bsButtonEl.contains(closestButton)) {
      return;
    }
    removeClass(closestButton, 'focus');
  }


  @Listen('keyup')
  handleKeyUp(event) {
    console.log('event: ', event);
    if (event.which === 32) {
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.handleToggle(this.bsButtonEl);
      return;
    }
    if (event.which === 13) {
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.handleToggle(this.bsButtonEl);
      return;
    }
    if (event.which === 27) {
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.bsButtonEl.blur();
      // this.handleToggle(this.bsButtonEl);
    }
  }


  @Listen('click')
  handleButtonClick(event) {
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    const buttonToggleData = _get(event, 'target.dataset.toggle', '');
    if (buttonToggleData === 'modal') {
      const modalTargetSelector = _get(event, 'target.dataset.target', '');
      if (_size(modalTargetSelector) > 0) {
        const modalTarget = document.querySelector(modalTargetSelector);
        if (modalTarget.modalToggleButtonClicked) {
          modalTarget.modalToggleButtonClicked(event.target);
        }
      }
    }
    const hasBtnClass = hasClass(event.target, 'btn');
    if (!hasBtnClass) {
      return;
    }
    this.handleToggle(event.target);
  }

  handleToggle(element) {
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    const rootElement = closest(element, '[data-toggle="buttons"]');
    let triggerChangeEvent = true;
    let addAriaPressed = true;
    if (rootElement) {
      const input = element.querySelector('input');
      if (input) {
        if (input.type === 'radio') {
          if (input.checked && hasClass(element, 'active')) {
            triggerChangeEvent = false;
          } else {
            const activeElement = rootElement.querySelector('.active');
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
      const buttonToggleData = _get(this.bsButtonEl, 'dataset.toggle', '');
      if (buttonToggleData !== 'button') {
        triggerChangeEvent = false;
      }
    }
    if (addAriaPressed) {
      element.setAttribute('aria-pressed', !hasClass(element, 'active'));
    }
    if (triggerChangeEvent) {
      toggleClass(element, 'active');
    }
  }

  @Method()
  button(buttonOptions:any = {}, selector:string = '') {
    if (_size(buttonOptions) === 0) {
      return this.bsButtonEl;
    }
    if (buttonOptions === 'toggle' && _size(selector) === 0) {
      this.handleToggle(this.bsButtonEl);
      return true;
    }
    if (buttonOptions === 'toggle' && _size(selector) > 0) {
      this.handleToggle(this.bsButtonEl.querySelector(selector));
      return true;
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
