import { Component, Prop, State, Element, Event, EventEmitter, Method } from '@stencil/core';

import getUniqueId from '../../utilities/get-unique-id';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import hasClass from '../../utilities/has-class';
import isAChildOfBsId from '../../utilities/is-a-child-of-bs-id';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';


@Component({
  tag: 'boss-dropdown',
  // styleUrl: 'boss-dropdown.css',
  shadow: false
})
export class BossDropdown {
  @Element() dropdownEl: HTMLElement;

  @Prop({ mutable: true }) show: boolean = false;
  @Prop() keepopen: boolean = false;

  @State() dropdownId: string;
  @State() expanded: boolean;

  @Event() showBossDropdown: EventEmitter;
  @Event() shownBossDropdown: EventEmitter;
  @Event() hideBossDropdown: EventEmitter;
  @Event() hiddenBossDropdown: EventEmitter;

  componentWillLoad() {
    if (hasClass(this.dropdownEl, 'show') && this.show === false) {
      this.show = true;
    }
    this.expanded = this.show;
    this.dropdownId = getUniqueId('dropdown');
    this.dropdownEl.setAttribute('data-boss-id', this.dropdownId);
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    for (var i = 0, len = toggles.length; i < len; i++) {
      toggles[i].removeEventListener('click', this.handleToggleDropdownOnToggleClick);
      toggles[i].addEventListener('click', this.handleToggleDropdownOnToggleClick);
    }
    if (this.expanded === true) {
      addClass(this.dropdownEl, 'show');
      this.handleShowDropdown();
    } else {
      removeClass(this.dropdownEl, 'show');
      this.handleHideDropdown();
    }
  }

  componentDidUnload() {
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    for (var i = 0, len = toggles.length; i < len; i++) {
      toggles[i].removeEventListener('click', this.handleToggleDropdownOnToggleClick);
    }
  }

  handleDropdownClickOutside = (event) => {
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    // handleDropdownClickOutside is an arrow function so that removeEventListener will work
    if (!this.expanded) {
      return;
    }
    const clickWasInside = isAChildOfBsId(event.target, this.dropdownId);
    if (!clickWasInside || !this.keepopen) {
      document.removeEventListener('click', this.handleDropdownClickOutside);
      this.expanded = false;
      this.show = true;
      this.handleHideDropdown();
    }
  }

  handleShowDropdown() {
    this.expanded = true;
    this.show = true;
    this.showBossDropdown.emit(event);
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    addClass(this.dropdownEl, 'show');
    addClass(dropdownMenuEl, 'show');
    for (var i = 0, len = toggles.length; i < len; i++) {
      toggles[i].setAttribute('aria-expanded', 'true');
    }
    document.removeEventListener('click', this.handleDropdownClickOutside);
    setTimeout(() => {
      document.removeEventListener('click', this.handleDropdownClickOutside);
      document.addEventListener('click', this.handleDropdownClickOutside);
    }, 0);
    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
    setTimeout(() => {
      this.shownBossDropdown.emit(event);
    }, dropdownMenuTransitionDuration);
  }

  handleHideDropdown() {
    this.expanded = false;
    this.show = false;
    this.hideBossDropdown.emit(event);
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    document.removeEventListener('click', this.handleDropdownClickOutside);
    removeClass(this.dropdownEl, 'show');
    removeClass(dropdownMenuEl, 'show');
    for (var i = 0, len = toggles.length; i < len; i++) {
      toggles[i].setAttribute('aria-expanded', 'false');
    }
    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
    setTimeout(() => {
      this.hiddenBossDropdown.emit(event);
    }, dropdownMenuTransitionDuration);
  }

  handleToggleDropdownOnToggleClick = () => {
    if (this.expanded === true) {
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
