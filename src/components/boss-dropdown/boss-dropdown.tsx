import { Component, Prop, State, Element, Event, EventEmitter, Method } from '@stencil/core';
import Popper from 'popper.js';

import getPopperDropdownConfig from './get-popper-dropdown-config';

import getUniqueId from '../../utilities/get-unique-id';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import hasClass from '../../utilities/has-class';
import clickWasInside from '../../utilities/click-was-inside';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import closest from '../../utilities/closest';

@Component({
  tag: 'boss-dropdown',
  shadow: false
})
export class BossDropdown {
  @Element() dropdownEl: HTMLElement;

  @Prop({ mutable: true }) show: boolean = false;
  @Prop() keepOpen: boolean = false;

  @Prop() offset: any = 0;
  @Prop() flip: boolean = true;
  @Prop() boundary: any = 'scrollParent';
  @Prop() reference: any = 'toggle';
  @Prop() display: string = 'dynamic';

  @State() dropdownId: string;
  @State() inNavbar: boolean;
  @State() popperHandle: any;

  @Event() showBossDropdown: EventEmitter;
  @Event() shownBossDropdown: EventEmitter;
  @Event() hideBossDropdown: EventEmitter;
  @Event() hiddenBossDropdown: EventEmitter;

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
    this.dropdownEl.setAttribute('data-boss-id', this.dropdownId);
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    for (let j = 0, len = toggles.length; j < len; j++) {
      toggles[j].removeEventListener('click', this.handleToggleDropdownOnToggleClick);
      toggles[j].addEventListener('click', this.handleToggleDropdownOnToggleClick);
    }
  }

  componentDidUnload() {
    document.removeEventListener('click', this.handleDropdownClickOutside);
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    for (let j = 0, len = toggles.length; j < len; j++) {
      toggles[j].removeEventListener('click', this.handleToggleDropdownOnToggleClick);
    }
    if (this.popperHandle !== null) {
      this.popperHandle.destroy()
      this.popperHandle = null
    }
  }

  initPopper(dropdownMenuEl) {
    this.inNavbar = this.detectNavbar(this.dropdownEl);
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
      this.popperHandle = new Popper(referenceElement, dropdownMenuEl, popperConfig)
    }
  }

  detectNavbar(el) {
    return closest(el, '.navbar') !== null;
  }

  handleDropdownClickOutside = (event) => {
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    // handleDropdownClickOutside is an arrow function so that removeEventListener will work
    if (!this.show) {
      return;
    }
    const clickWasInsideDropdown = clickWasInside(event.target, `[data-boss-id="${this.dropdownId}"]`);
    if (!clickWasInsideDropdown || !this.keepOpen) {
      document.removeEventListener('click', this.handleDropdownClickOutside);
      this.show = true;
      this.handleHideDropdown();
    }
  }

  handleShowDropdown() {
    this.show = true;
    this.showBossDropdown.emit(event);
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    addClass(this.dropdownEl, 'show');
    addClass(dropdownMenuEl, 'show');
    for (let j = 0, len = toggles.length; j < len; j++) {
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
      this.shownBossDropdown.emit(event);
    }, dropdownMenuTransitionDuration);
  }

  handleHideDropdown() {
    this.show = false;
    this.hideBossDropdown.emit(event);
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    document.removeEventListener('click', this.handleDropdownClickOutside);
    removeClass(this.dropdownEl, 'show');
    removeClass(dropdownMenuEl, 'show');
    for (let j = 0, len = toggles.length; j < len; j++) {
      toggles[j].setAttribute('aria-expanded', 'false');
    }
    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
    setTimeout(() => {
      this.hiddenBossDropdown.emit(event);
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
    this.inNavbar = this.detectNavbar(this.dropdownEl);
    if (this.popperHandle !== null) {
      this.popperHandle.scheduleUpdate()
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
    return ( <slot /> );
  }
}
