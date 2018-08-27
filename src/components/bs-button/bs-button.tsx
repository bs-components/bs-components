import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Listen, // eslint-disable-line no-unused-vars
  Element,
  Method, // eslint-disable-line no-unused-vars
} from '@stencil/core';


import _size from 'lodash/size';
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

  @State() addFocusClass: boolean;

  componentWillLoad() {
    this.addFocusClass = false;
    if (this.tabindex === '-1') {
      this.tabindex = '';
    }
    if (this.tabindex === '0') {
      const input = this.bsButtonEl.querySelector('input');
      const buttonsToggler = closest(this.bsButtonEl, '[data-toggle="buttons"]');
      if (buttonsToggler && input) {
        this.addFocusClass = true;
        this.tabindex = '';
      }
    }
  }

  @Listen('focusin')
  handleFocusIn(event) {
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    if (this.tabindex === '-1') {
      this.tabindex = '';
    }
    if (this.addFocusClass) {
      const closestButton = closest(event.target, '.btn');
      addClass(closestButton, 'focus');
    }
  }

  @Listen('focusout')
  handleFocusOut() {
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    if (this.addFocusClass) {
      removeClass(this.bsButtonEl, 'focus');
    }
  }


  @Listen('keydown')
  handleKeyUp(event) {
    // console.log('event: ', event);
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    if (event.which === 32) { // space
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.handleToggle(this.bsButtonEl);
      return;
    }
    if (event.which === 13) { // enter
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.handleToggle(this.bsButtonEl);
      return;
    }
    if (event.which === 27) { // esc
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.bsButtonEl.blur();
      if (this.addFocusClass) {
        removeClass(this.bsButtonEl, 'focus');
      }
    }
  }


  @Listen('click')
  handleButtonClick(event) {
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    this.handleToggle(event.target);
  }


  handleToggle(element) {
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    if (!element || !this.bsButtonEl.contains(element)) {
      throw new Error('Invalid element unable to toggle');
    }
    let triggerChangeEvent = true;
    let addAriaPressed = true;
    const buttonsToggler = closest(element, '[data-toggle="buttons"]');
    if (buttonsToggler) {
      // button group
      // <div class="btn-group-toggle" data-toggle="buttons">
      //   <bs-button class="btn btn-secondary active">
      //     <input type="checkbox" checked autocomplete="off"> Checked
      //   </bs-button>
      // </div>
      const input = this.bsButtonEl.querySelector('input');
      if (input) {
        if (input.type === 'radio') {
          if (input.checked && hasClass(input, 'active')) {
            triggerChangeEvent = false;
          } else {
            const activeElement = buttonsToggler.querySelector('.active');
            if (activeElement) {
              removeClass(activeElement, 'active');
            }
          }
        }
        if (triggerChangeEvent) {
          input.checked = !hasClass(this.bsButtonEl, 'active');
          customEvent(input, 'change');
        }
        if (this.addFocusClass) {
          input.focus();
        }
        addAriaPressed = false;
      }
      if (addAriaPressed) {
        this.bsButtonEl.setAttribute('aria-pressed', hasClass(this.bsButtonEl, 'active') ? 'false' : 'true');
      }
      if (triggerChangeEvent) {
        toggleClass(this.bsButtonEl, 'active');
      }
      return;
    }
    if (this.bsButtonEl.dataset.toggle === 'button') {
      // standard button toggler
      //  <bs-button class="btn btn-primary" data-toggle="button" aria-pressed="false">
      //    Single toggle
      //  </bs-button>
      this.bsButtonEl.setAttribute('aria-pressed', hasClass(this.bsButtonEl, 'active') ? 'false' : 'true');
      toggleClass(this.bsButtonEl, 'active');
    }
    if (this.bsButtonEl.dataset.toggle === 'modal') {
      // modal toggler
      // <bs-button class="btn" data-toggle="modal" data-target="#exampleModal">modal</bs-button>
      const modalTargetSelector = this.bsButtonEl.dataset.target;
      if (modalTargetSelector) {
        const modalTargetEl: any = document.querySelector(modalTargetSelector);
        if (modalTargetEl.modalToggleButtonClicked) {
          modalTargetEl.modalToggleButtonClicked(this.bsButtonEl);
        }
      }
    }
  }

  @Method()
  button(buttonOptions:any = {}) {
    if (_size(buttonOptions) === 0) {
      return this.bsButtonEl;
    }
    if (buttonOptions === 'toggle') {
      this.handleToggle(this.bsButtonEl);
      return true;
    }
    if (typeof buttonOptions === 'string') {
      throw new Error(`No method named "${buttonOptions}"`);
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
