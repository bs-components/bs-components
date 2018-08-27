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
import elementMatches from '../../utilities/element-matches';


@Component({ tag: 'bs-button-old', shadow: false })
export class BsButton { // eslint-disable-line import/prefer-default-export
  @Element() bsButtonEl: HTMLElement;

  @Prop({ mutable: true, reflectToAttr: true }) tabindex: string = '0';

  @Listen('focusin')
  handleFocusIn(event) {
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    if (this.tabindex === '-1' || hasClass(this.bsButtonEl, 'btn-group')) {
      this.tabindex = '';
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
    // console.log('click');
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }

    this.handleToggle(event.target);
  }

  static toggleDataToggleButtons(element, rootElement) {
    // note that this tends to get called twice once on the input and once on the button
    //    Unless it's just a button
    // console.log('element: ', element);
    // console.log('rootElement: ', rootElement);
    let triggerChangeEvent = true;
    let addAriaPressed = true;

    const isInput = elementMatches(element, 'input');
    // const input = element.querySelector('input');
    if (isInput) {
      if (element.type === 'radio') {
        if (element.checked && hasClass(element, 'active')) {
          triggerChangeEvent = false;
        } else {
          const activeElement = rootElement.querySelector('.active');
          if (activeElement) {
            removeClass(activeElement, 'active');
          }
        }
      }
      if (triggerChangeEvent) {
        if (element.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || hasClass(element, 'disabled') || hasClass(rootElement, 'disabled')) {
          return;
        }
        // eslint-disable-next-line no-param-reassign
        element.checked = !hasClass(element, 'active');
        customEvent(element, 'change');
      }
      element.focus();
      // because we don't add aria pressed to input's
      addAriaPressed = false;
      // triggerChangeEvent = false;
    }
    if (addAriaPressed) {
      element.setAttribute('aria-pressed', !hasClass(element, 'active'));
    }
    if (triggerChangeEvent) {
      toggleClass(element, 'active');
    }
  }

  static toggleDataToggleButton(buttonEl) {
    buttonEl.setAttribute('aria-pressed', !hasClass(buttonEl, 'active'));
    toggleClass(buttonEl, 'active');
  }

  handleToggle(element) {
    if (!element) {
      console.error('Invalid element unable to toggle');
      return;
    }
    const buttonsToggler = closest(element, '[data-toggle="buttons"]');
    if (buttonsToggler) {
      // const hasBtnClass = hasClass(element, 'btn');
      // if (hasBtnClass) {
      //   return;
      // }
      // const closestButton = closest(element, '.btn');
      // if (!closestButton || !this.bsButtonEl.contains(closestButton)) {
      //   throw new Error("Unable to find input's parent .btn class");
      // }

      BsButton.toggleDataToggleButtons(element, buttonsToggler);
      return;
    }
    const buttonToggler = closest(element, '[data-toggle="button"]');
    if (buttonToggler && this.bsButtonEl.contains(buttonToggler)) {
      BsButton.toggleDataToggleButton(buttonToggler);
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
      const buttonToToggle = this.bsButtonEl.querySelector(selector);
      if (!buttonToToggle) {
        throw new Error(`Unable to find element "${selector}" to toggle`);
      }
      const closestButton = closest(buttonToToggle, '.btn');
      if (!closestButton || !this.bsButtonEl.contains(closestButton)) {
        throw new Error(`Selector "${selector}" is not of class btn`);
      }
      this.handleToggle(closestButton);
      return true;
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
