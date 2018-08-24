
import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Element,
  Method, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import Popper from 'popper.js';

import getPopperDropdownConfig from './get-popper-dropdown-config';

import getUniqueId from '../../utilities/get-unique-id';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import hasClass from '../../utilities/has-class';
import clickWasInside from '../../utilities/click-was-inside';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import closest from '../../utilities/closest';
import customEvent from '../../utilities/custom-event';

// TODO:
// data-offset="10,20"
// data-reference="parent"
// popper.js stuff:
// offset
// flip
// boundary
// reference
// display

@Component({ tag: 'bs-dropdown', shadow: false })
export class BsDropdown { // eslint-disable-line import/prefer-default-export
  @Element() dropdownEl: HTMLElement;

  @Prop({ mutable: true }) show: boolean = false;
  @Prop() keepOpen: boolean = false;

  @Prop() offset: any = 0;
  @Prop() flip: boolean = true;
  @Prop() boundary: any = 'scrollParent';
  @Prop() reference: any = 'toggle';
  @Prop() display: string = 'dynamic';

  @Prop() showEventName: string = 'show.bs.dropdown';
  @Prop() shownEventName: string = 'shown.bs.dropdown';
  @Prop() hideEventName: string = 'hide.bs.dropdown';
  @Prop() hiddenEventName: string = 'hidden.bs.dropdown';

  @State() dropdownId: string;
  @State() inNavbar: boolean;
  @State() popperHandle: any;

  componentWillLoad() {
    if (hasClass(this.dropdownEl, 'show') && this.show === false) {
      this.show = true;
    }
    if (this.show === true) {
      setTimeout(() => {
        document.removeEventListener('click', this.handleDropdownClickOutside);
        document.addEventListener('click', this.handleDropdownClickOutside);
      }, 0);
    }
    this.dropdownId = getUniqueId('dropdown');
    this.dropdownEl.dataset.bsId = this.dropdownId;
    // this.dropdownEl.setAttribute('data-bs-id', this.dropdownId);
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    for (let j = 0, len = toggles.length; j < len; j += 1) {
      toggles[j].removeEventListener('click', this.handleToggleDropdownOnToggleClick);
      toggles[j].addEventListener('click', this.handleToggleDropdownOnToggleClick);
    }
  }

  componentDidUnload() {
    document.removeEventListener('click', this.handleDropdownClickOutside);
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    for (let j = 0, len = toggles.length; j < len; j += 1) {
      toggles[j].removeEventListener('click', this.handleToggleDropdownOnToggleClick);
    }
    if (this.popperHandle !== null) {
      this.popperHandle.destroy();
      this.popperHandle = null;
    }
  }

  initPopper(dropdownMenuEl) {
    this.inNavbar = BsDropdown.detectNavbar(this.dropdownEl);
    if (!this.inNavbar) {
      const popperSettings = {
        offset: this.offset,
        flip: this.flip,
        boundary: this.boundary,
        display: this.display,
      };
      const popperConfig: any = getPopperDropdownConfig(this.dropdownEl, dropdownMenuEl, popperSettings);

      // If boundary is not `scrollParent`, then set position to `static`
      // to allow the menu to "escape" the scroll parent's boundaries
      // https://github.com/twbs/bootstrap/issues/24251
      if (this.boundary !== 'scrollParent') {
        addClass(this.dropdownEl, 'position-static');
      }

      let referenceElement: any = this.dropdownEl;
      if (this.reference === 'parent') {
        referenceElement = this.dropdownEl.parentNode;
      } else if (this.reference instanceof Element) {
        referenceElement = this.reference;
      }
      this.popperHandle = new Popper(referenceElement, dropdownMenuEl, popperConfig);
    }
  }

  static detectNavbar(el) {
    return closest(el, '.navbar') !== null;
  }

  handleDropdownClickOutside = (event) => {
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    // handleDropdownClickOutside is an arrow function so that removeEventListener will work
    if (!this.show) {
      return;
    }
    const clickWasInsideDropdown = clickWasInside(event.target, `[data-bs-id="${this.dropdownId}"]`);
    if (!clickWasInsideDropdown || !this.keepOpen) {
      document.removeEventListener('click', this.handleDropdownClickOutside);
      this.show = true;
      this.handleHideDropdown();
    }
  }

  handleShowDropdown() {
    this.show = true;
    // this.show_bs_dropdown.emit(event);
    customEvent(this.dropdownEl, this.showEventName);
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    addClass(this.dropdownEl, 'show');
    addClass(dropdownMenuEl, 'show');
    for (let j = 0, len = toggles.length; j < len; j += 1) {
      toggles[j].setAttribute('aria-expanded', 'true');
    }
    document.removeEventListener('click', this.handleDropdownClickOutside);
    setTimeout(() => {
      document.removeEventListener('click', this.handleDropdownClickOutside);
      document.addEventListener('click', this.handleDropdownClickOutside);
    }, 0);
    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
    this.initPopper(dropdownMenuEl);
    setTimeout(() => {
      customEvent(this.dropdownEl, this.shownEventName);
      // this.shown_bs_dropdown.emit(event);
    }, dropdownMenuTransitionDuration);
  }

  handleHideDropdown() {
    this.show = false;
    customEvent(this.dropdownEl, this.hideEventName);
    // this.hide_bs_dropdown.emit(event);
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    document.removeEventListener('click', this.handleDropdownClickOutside);
    removeClass(this.dropdownEl, 'show');
    removeClass(dropdownMenuEl, 'show');
    for (let j = 0, len = toggles.length; j < len; j += 1) {
      toggles[j].setAttribute('aria-expanded', 'false');
    }
    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
    setTimeout(() => {
      // this.hidden_bs_dropdown.emit(event);
      customEvent(this.dropdownEl, this.hiddenEventName);
    }, dropdownMenuTransitionDuration);
  }

  handleToggleDropdownOnToggleClick = () => {
    if (this.show === true) {
      this.handleHideDropdown();
    } else {
      this.handleShowDropdown();
    }
  }

  @Method()
  toggle() {
    this.handleToggleDropdownOnToggleClick();
  }

  @Method()
  update() {
    this.inNavbar = BsDropdown.detectNavbar(this.dropdownEl);
    if (this.popperHandle !== null) {
      this.popperHandle.scheduleUpdate();
    }
  }

  @Method()
  showDropdown() {
    this.handleShowDropdown();
  }

  @Method()
  hideDropdown() {
    this.handleHideDropdown();
  }

  @Method()
  setDropdownVisibility(toShow) {
    if (toShow) {
      this.handleShowDropdown();
    } else {
      this.handleHideDropdown();
    }
  }

  render() {
    return (<slot />);
  }
}
