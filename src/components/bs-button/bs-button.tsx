import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Listen, // eslint-disable-line no-unused-vars
  Element,
  Method, // eslint-disable-line no-unused-vars
  Watch, // eslint-disable-line no-unused-vars
} from '@stencil/core';


import _ from 'lodash';
// import _toLower from 'lodash/toLower';

import closest from '../../utilities/closest';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import toggleClass from '../../utilities/toggle-class';
import removeClass from '../../utilities/remove-class';
import customEvent from '../../utilities/custom-event';
import getDuplicatesInArray from '../../utilities/get-duplicates-In-array';
import getTargetSelector from '../../utilities/get-target-selector';

@Component({ tag: 'bs-button', shadow: false })

export class BsButton { // eslint-disable-line import/prefer-default-export
  @Element() bsButtonEl: HTMLElement;

  @Prop({ mutable: true, reflectToAttr: true }) tabindex: string|number = '0';

  @Prop() activeEventName: string = 'active.bs.button';
  @Prop() inactiveEventName: string = 'inactive.bs.button';

  @Prop({ mutable: true }) active: boolean = false;

  @State() addFocusClass: boolean;

  componentWillLoad() {
    this.addFocusClass = false;
    if (this.tabindex === '-1') {
      this.tabindex = -1;
    }
    if (this.tabindex === '0') {
      const input = this.bsButtonEl.querySelector('input');
      const buttonsToggler = closest(this.bsButtonEl, '[data-toggle="buttons"]');
      if (buttonsToggler && input) {
        this.addFocusClass = true;
        this.tabindex = -1;
      }
    }
    // make sure the button activeState matches the dom
    let buttonTogglerEl;
    if (this.bsButtonEl.dataset.toggle === 'button') {
      buttonTogglerEl = this.bsButtonEl;
    } else {
      buttonTogglerEl = this.bsButtonEl.querySelector('[data-toggle="button"]');
    }
    if (buttonTogglerEl && this.active === true) {
      addClass(buttonTogglerEl, 'active');
      buttonTogglerEl.setAttribute('aria-pressed', 'true');
    }
    const buttonsToggler = closest(this.bsButtonEl, '[data-toggle="buttons"]');
    if (buttonsToggler && this.active === true) {
      addClass(this.bsButtonEl, 'active');
      const input = this.bsButtonEl.querySelector('input');
      if (input) {
        input.checked = true;
        input.setAttribute('checked', 'checked');
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
      this.tabindex = -1;
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
        if (_.toLower(event.target.tagName) === 'button'
          && event.target.dataset.toggle !== 'collapse'
          && event.target.dataset.toggle !== 'modal') {
          // we let space go through if the button is not a collapse or modal trigger
          return;
        }
        if (_.toLower(event.target.tagName) === 'a'
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
        if (_.toLower(event.target.tagName) === 'button'
          && event.target.dataset.toggle !== 'collapse'
          && event.target.dataset.toggle !== 'modal') {
          // we let enter go through if the button is not a collapse or modal trigger
          return; // leaving without preventing default
        }
        if (_.toLower(event.target.tagName) === 'a'
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
    if (_.toLower(event.target.tagName) === 'a' && event.stopPropagation) {
      event.stopPropagation();
      event.preventDefault();
    }
    const closestCollapseToggleEl = closest(event.target, '[data-toggle="collapse"]');
    if (closestCollapseToggleEl && this.bsButtonEl.contains(closestCollapseToggleEl)) {
      // if (event.stopPropagation) {
      //   event.stopPropagation();
      //   event.preventDefault();
      // }
      BsButton.handleCollapseToggle(closestCollapseToggleEl);
    }
    const closestModalToggleEl = closest(event.target, '[data-toggle="modal"]');
    if (closestModalToggleEl && this.bsButtonEl.contains(closestModalToggleEl)) {
      // if (event.stopPropagation) {
      //   event.stopPropagation();
      //   event.preventDefault();
      // }
      BsButton.handleModalToggle(closestModalToggleEl);
    }
    const closestTabToggleEl = closest(event.target, '[data-toggle="tab"]');
    if (closestTabToggleEl && this.bsButtonEl.contains(closestTabToggleEl)) {
      // if (event.stopPropagation) {
      //   event.stopPropagation();
      //   event.preventDefault();
      // }
      this.handleTabToggle(closestTabToggleEl);
    }
    const closestPillToggleEl = closest(event.target, '[data-toggle="pill"]');
    if (closestPillToggleEl && this.bsButtonEl.contains(closestPillToggleEl)) {
      // if (event.stopPropagation) {
      //   event.stopPropagation();
      //   event.preventDefault();
      // }
      this.handleTabToggle(closestPillToggleEl);
    }
    const closestListToggleEl = closest(event.target, '[data-toggle="list"]');
    if (closestListToggleEl && this.bsButtonEl.contains(closestListToggleEl)) {
      // if (event.stopPropagation) {
      //   event.stopPropagation();
      //   event.preventDefault();
      // }
      this.handleTabToggle(closestListToggleEl);
    }

    this.handleToggle(event.target);
  }


  static handleCollapseToggle(relatedTarget) {
    const targetSelector = getTargetSelector(relatedTarget);
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
        console.warn(`Found multiple instances for selector ${parentDupes[j]}
                      You are trying to toggle multiple collapses that have the same parent accordion (${parentDupes[j]}).
                      Normally only one item in an accordion is toggled at one time.`);
      }
    }
  }

  static handleModalToggle(relatedTarget) {
    const targetSelector = getTargetSelector(relatedTarget);
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

  handleTabToggle(triggeringButton) {
    const tabToggler = this.getTabToggler(triggeringButton);
    if (!tabToggler) {
      throw new Error('tab method can only be run on a bs-button that contains [data-toggle="tab"], [data-toggle="pill"], or data-toggle="list"');
    }
    const targetSelector = getTargetSelector(tabToggler);
    if (!targetSelector) {
      throw new Error(`invalid tab selector: "${targetSelector}"`);
    }
    try {
      const targetEl: any = document.querySelector(targetSelector);
      if (!targetEl) {
        throw new Error(`unable to find tab target selector "${targetSelector}"`);
      }
      if (targetEl.tab) {
        targetEl.tab('show', tabToggler);
      }
    } catch (err) {
      console.log('bs-button modal toggle target must be a valid css selector string');
      console.error(err.message);
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
          if (input.checked && hasClass(this.bsButtonEl, 'active')) {
            triggerChangeEvent = false;
          } else {
            const activeBsButton:any = buttonsToggler.querySelector('.active');
            if (activeBsButton) {
              removeClass(activeBsButton, 'active');
              customEvent(activeBsButton, this.inactiveEventName, {}, this.bsButtonEl);
            }
          }
        }
        if (triggerChangeEvent) {
          if (hasClass(this.bsButtonEl, 'active')) {
            input.checked = false;
            input.removeAttribute('checked');
          } else {
            input.checked = true;
            input.setAttribute('checked', 'checked');
          }
          customEvent(input, 'change');
        }
        if (this.addFocusClass) {
          input.focus();
        }
        addAriaPressed = false;
      }

      if (triggerChangeEvent) {
        const changeEventName = hasClass(this.bsButtonEl, 'active') === true ? this.inactiveEventName : this.activeEventName;
        const handleChangeEvent = customEvent(this.bsButtonEl, changeEventName, { active: !hasClass(this.bsButtonEl, 'active') });
        if (handleChangeEvent.defaultPrevented) {
          return;
        }
        toggleClass(this.bsButtonEl, 'active');
      }
      if (addAriaPressed) {
        this.bsButtonEl.setAttribute('aria-pressed', hasClass(this.bsButtonEl, 'active') ? 'true' : 'false');
      }
      return;
    }
    const buttonTogglerEl = closest(element, '[data-toggle="button"]');
    if (!this.bsButtonEl.contains(buttonTogglerEl)) {
      return;
    }
    if (buttonTogglerEl) {
      // standard button toggler
      //  <bs-button class="btn btn-primary" data-toggle="button" aria-pressed="false">
      //    Single toggle
      //  </bs-button>
      const changeEventName = hasClass(this.bsButtonEl, 'active') ? this.inactiveEventName : this.activeEventName;
      const handleChangeEvent = customEvent(buttonTogglerEl, changeEventName);
      if (handleChangeEvent.defaultPrevented) {
        return;
      }
      toggleClass(buttonTogglerEl, 'active');
      buttonTogglerEl.setAttribute('aria-pressed', hasClass(this.bsButtonEl, 'active') ? 'true' : 'false');
    }
  }


  @Watch('active')
  handleActiveWatch(newValue /* , oldValue */) {
    const buttonsToggler = closest(this.bsButtonEl, '[data-toggle="buttons"]');
    if (buttonsToggler) {
      if (!newValue && !hasClass(this.bsButtonEl, 'active')) {
        return;
      }
      if (newValue && hasClass(this.bsButtonEl, 'active')) {
        return;
      }
      this.handleToggle(this.bsButtonEl);
      return;
    }
    let buttonTogglerEl;
    if (this.bsButtonEl.dataset.toggle === 'button') {
      buttonTogglerEl = this.bsButtonEl;
    } else {
      buttonTogglerEl = this.bsButtonEl.querySelector('[data-toggle="button"]');
    }
    if (buttonTogglerEl) {
      if (!newValue && !hasClass(buttonTogglerEl, 'active')) {
        return;
      }
      if (newValue && hasClass(buttonTogglerEl, 'active')) {
        return;
      }
      this.handleToggle(buttonTogglerEl);
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

  getTabToggler(element) {
    if (element.dataset.toggle === 'tab' || element.dataset.toggle === 'pill' || element.dataset.toggle === 'list') {
      return element;
    }
    const tabToggler = this.bsButtonEl.querySelector('[data-toggle="tab"]');
    if (tabToggler) {
      return tabToggler;
    }
    const pillToggler = this.bsButtonEl.querySelector('[data-toggle="pill"]');
    if (pillToggler) {
      return pillToggler;
    }
    const listToggler = this.bsButtonEl.querySelector('[data-toggle="list"]');
    if (listToggler) {
      return listToggler;
    }
    return null;
  }

  @Method()
  tab(tabOptions:any = {}) {
    // this is a proxy
    const tabToggler = this.getTabToggler(this.bsButtonEl);
    if (!tabToggler) {
      throw new Error('tab method can only be run on a bs-button that contains [data-toggle="tab"], [data-toggle="pill"], or data-toggle="list"');
    }
    const targetSelector = getTargetSelector(tabToggler);
    if (!targetSelector) {
      throw new Error(`invalid tab selector: "${targetSelector}"`);
    }
    try {
      const targetEl: any = document.querySelector(targetSelector);
      if (!targetEl) {
        throw new Error(`unable to find tab target selector "${targetSelector}"`);
      }
      if (targetEl.tab) {
        return targetEl.tab(tabOptions, tabToggler);
      }
    } catch (err) {
      console.log('bs-button modal toggle target must be a valid css selector string');
      console.error(err.message);
    }
    return null;
  }

  @Method()
  button(buttonOptions:any = {}) {
    if (_.size(buttonOptions) === 0) {
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
