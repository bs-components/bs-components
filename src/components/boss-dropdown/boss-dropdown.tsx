import { Component, Prop, State, Element, Event, EventEmitter, Listen, Method } from '@stencil/core';
import get from 'lodash/get';

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
    // console.log('Component is about to be rendered');
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
    // console.log('Component removed from the DOM');
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    for (var i = 0, len = toggles.length; i < len; i++) {
      toggles[i].removeEventListener('click', this.handleToggleDropdownOnToggleClick);
    }
  }

  handleDropdownClickOutside = (event) => {
    // console.log('handleDropdownClickOutside');
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    // handleDropdownClickOutside is an arrow function so that removeEventListener will work
    if (!this.expanded) {
      return;
    }
    const clickWasInside = isAChildOfBsId(event.target, this.dropdownId);
    if (!clickWasInside || !this.keepopen) {
      document.removeEventListener('click', this.handleDropdownClickOutside);
      // this.dropdownEl.setAttribute('show', 'false');
      this.expanded = false;
      this.show = true;
      this.handleHideDropdown();
    }
  }

  // @Watch('show')
  // watchHandler(newValue: boolean) {
  //   this.expanded = newValue;
  //   if (this.expanded === true) {
  //     this.handleShowDropdown();
  //   } else {
  //     this.handleHideDropdown();
  //   }
  // }

  handleShowDropdown() {
    this.expanded = true;
    this.show = true;
    this.showBossDropdown.emit(event);
    // const transitionEvent = this.whichTransitionEvent();
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    // dropdownMenuEl.removeEventListener(transitionEvent, this.handleHiddenBossDropdownEvent);

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
    // dropdownMenuEl.removeEventListener(transitionEvent, this.handleShownBossDropdownEvent);
    // const hasTransition = this.hasCssAnimation(dropdownMenuEl);
    // // console.log('hasTransition: ', hasTransition);
    // if (!hasTransition) {
    //   this.shownBossDropdown.emit(event);
    //   return;
    // }
    // dropdownMenuEl.addEventListener(transitionEvent, this.handleShownBossDropdownEvent, { once: true });

    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
    // console.log('dropdownMenuDuration: ', dropdownMenuDuration);
    setTimeout(() => {
      this.shownBossDropdown.emit(event);
    }, dropdownMenuTransitionDuration);
  }

  // @Method()
  // handleHiddenBossDropdownEvent = () => {
  //   this.hiddenBossDropdown.emit(event);
  // }

  handleHideDropdown() {
    this.expanded = false;
    this.show = false;
    this.hideBossDropdown.emit(event);
    // const transitionEvent = this.whichTransitionEvent();
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    // dropdownMenuEl.removeEventListener(transitionEvent, this.handleShownBossDropdownEvent);

    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    document.removeEventListener('click', this.handleDropdownClickOutside);
    removeClass(this.dropdownEl, 'show');
    removeClass(dropdownMenuEl, 'show');
    for (var i = 0, len = toggles.length; i < len; i++) {
      toggles[i].setAttribute('aria-expanded', 'false');
    }
    // dropdownMenuEl.removeEventListener(transitionEvent, this.handleHiddenBossDropdownEvent);
    // const hasTransition = this.hasCssAnimation(dropdownMenuEl);
    // if (!hasTransition) {
    //   this.hiddenBossDropdown.emit(event);
    //   return;
    // }
    // dropdownMenuEl.addEventListener(transitionEvent, this.handleHiddenBossDropdownEvent, { once: true });

    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
    // console.log('dropdownMenuDuration: ', dropdownMenuDuration);
    setTimeout(() => {
      this.hiddenBossDropdown.emit(event);
    }, dropdownMenuTransitionDuration);
  }

  handleToggleDropdownOnToggleClick = () => {
    if (this.expanded === true) {
      // this.dropdownEl.setAttribute('show', 'false');
      this.handleHideDropdown();
    } else {
      this.handleShowDropdown();
      // this.dropdownEl.setAttribute('show', 'true');
    }
  }


  todoCompletedHandler(event: CustomEvent) {
    console.log('Received the custom todoCompleted event: ', event.detail);
  }


  // @Listen('toggleDropdown')
  @Method()
  toggleDropdown() {
    this.handleToggleDropdownOnToggleClick();
  }

  @Listen('showDropdown')
  showDropdown() {
    this.handleShowDropdown();
  }

  @Listen('hideDropdown')
  hideDropdown() {
    this.handleHideDropdown();
  }

  @Listen('setDropdownVisibility')
  setDropdownVisibility(event: CustomEvent) {
    const toShow = get(event, 'detail.show', false);
    console.log('event: ', event);
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
