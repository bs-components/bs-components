import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Listen, // eslint-disable-line no-unused-vars
  Element,
  Method, // eslint-disable-line no-unused-vars
} from '@stencil/core';


import _size from 'lodash/size';
import _toLower from 'lodash/toLower';
import closest from '../../utilities/closest';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import toggleClass from '../../utilities/toggle-class';
import customEvent from '../../utilities/custom-event';
import getDuplicatesInArray from '../../utilities/get-duplicates-In-array';

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
  handleKeyDown(event) {
    const isDisabled = hasClass(this.bsButtonEl, 'disabled');
    if (isDisabled) {
      return;
    }
    if (!this.bsButtonEl.contains(event.target)) {
      return;
    }
    if (event.which === 32) { // space
      if (!this.bsButtonEl.isEqualNode(event.target)) {
        // user pressed enter on some element element wrapped within bs-button
        if (_toLower(event.target.tagName) === 'button'
          && event.target.dataset.toggle !== 'collapse'
          && event.target.dataset.toggle !== 'modal') {
          // we let space go through if the button is not a collapse or modal trigger
          return;
        }
        if (_toLower(event.target.tagName) === 'a'
          // && event.target.dataset.toggle !== 'collapse'
          && event.target.dataset.toggle !== 'modal') {
          // we let space go through if the button is not a modal trigger
          return;
        }
      }
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      console.log('space event: ', event);
      if (event.target.dataset.toggle === 'collapse') {
        BsButton.handleCollapseToggle(event.target);
        return;
      }
      if (event.target.dataset.toggle === 'modal') {
        BsButton.handleModalToggle(event.target);
        return;
      }
      this.handleToggle(this.bsButtonEl);
      return;
    }
    if (event.which === 13) { // enter
      if (!this.bsButtonEl.isEqualNode(event.target)) {
        // user pressed enter on some element element wrapped within bs-button
        if (_toLower(event.target.tagName) === 'button'
          && event.target.dataset.toggle !== 'collapse'
          && event.target.dataset.toggle !== 'modal') {
          // we let enter go through if the button is not a collapse or modal trigger
          return; // leaving without preventing default
        }
        if (_toLower(event.target.tagName) === 'a'
          && event.target.dataset.toggle !== 'collapse'
          && event.target.dataset.toggle !== 'modal') {
          // we let enter go through if the anchor is not a collapse or modal trigger
          return; // leaving without preventing default
        }
      }
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (event.target.dataset.toggle === 'collapse') {
        BsButton.handleCollapseToggle(event.target);
        return;
      }
      if (event.target.dataset.toggle === 'modal') {
        BsButton.handleModalToggle(event.target);
        return;
      }
      this.handleToggle(this.bsButtonEl);
      return;
    }
    if (event.which === 27) { // esc
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      (document.activeElement as any).blur();
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
    const closestCollapseToggleEl = closest(event.target, '[data-toggle="collapse"]');
    if (closestCollapseToggleEl && this.bsButtonEl.contains(closestCollapseToggleEl)) {
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      BsButton.handleCollapseToggle(closestCollapseToggleEl);
      return;
    }
    const closestModalToggleEl = closest(event.target, '[data-toggle="modal"]');
    if (closestModalToggleEl && this.bsButtonEl.contains(closestModalToggleEl)) {
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      BsButton.handleModalToggle(closestModalToggleEl);
    }
    this.handleToggle(event.target);
  }

  static getTargetSelector(relatedTarget) {
    if (_toLower(relatedTarget.tagName) === 'a') {
      return relatedTarget.getAttribute('href');
    }
    return relatedTarget.dataset.target;
  }


  static handleCollapseToggle(relatedTarget) {
    const targetSelector = BsButton.getTargetSelector(relatedTarget);
    if (targetSelector) {
      const parentArr = [];
      const targetElArr: any = Array.prototype.slice.call(document.querySelectorAll(targetSelector));
      for (let j = 0, len = targetElArr.length; j < len; j += 1) {
        if (targetElArr[j].collapse) {
          targetElArr[j].collapse('toggle', relatedTarget);
          if (targetElArr[j].dataset.parent) {
            parentArr.push(targetElArr[j].dataset.parent);
          }
        } else {
          console.error('Unable to toggle collapse for all targets due to unavailable bs-collapse method "collapse');
        }
      }
      const parentDupes = getDuplicatesInArray(parentArr);
      for (let j = 0, len = parentDupes.length; j < len; j += 1) {
        console.warn(`You are trying to toggle multiple collapses that have the same parent accordion (${parentDupes[j]}).
                      Normally only one item in an accordion is toggled at one time.`);
      }
    }
  }

  static handleModalToggle(relatedTarget) {
    const targetSelector = BsButton.getTargetSelector(relatedTarget);
    if (targetSelector) {
      try {
        const targetEl: any = document.querySelector(targetSelector);
        if (targetEl.modal) {
          targetEl.modal('toggle', relatedTarget);
        }
      } catch (err) {
        console.log('bs-button modal toggle target must be a valid css selector string');
        console.error(err.message);
      }
    }
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
  }


  @Method()
  dropdown(dropdownOptions:any = {}) {
    // this is a proxy
    if (this.bsButtonEl.dataset.toggle !== 'dropdown') {
      throw new Error('dropdown method can only be run on a bs-button with [data-toggle="dropdown"]');
    }
    const bsDropdownEl:any = closest(this.bsButtonEl, 'bs-dropdown');
    if (!bsDropdownEl) {
      throw new Error('unable to find parent bs-dropdown component');
    }
    if (dropdownOptions === 'get-show') {
      return bsDropdownEl.show;
    }
    if (dropdownOptions === 'get-config') {
      return bsDropdownEl.config;
    }
    if (dropdownOptions === 'get-defaults') {
      return bsDropdownEl.defaults;
    }
    return bsDropdownEl.dropdown(dropdownOptions, this.bsButtonEl);
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
