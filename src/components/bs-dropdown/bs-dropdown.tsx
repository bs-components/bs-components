import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Listen, // eslint-disable-line no-unused-vars
  Element,
  Method, // eslint-disable-line no-unused-vars
  Watch, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import Popper from 'popper.js';
import _size from 'lodash/size';
import _has from 'lodash/has';
import _toLower from 'lodash/toLower';

import getUniqueId from '../../utilities/get-unique-id';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import hasClass from '../../utilities/has-class';
import clickWasInside from '../../utilities/click-was-inside';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import closest from '../../utilities/closest';
import customEvent from '../../utilities/custom-event';
import getConfigBoolean from '../../utilities/get-config-boolean';

@Component({ tag: 'bs-dropdown', shadow: false })
export class BsDropdown { // eslint-disable-line import/prefer-default-export
  @Element() dropdownEl: HTMLElement;

  @Prop() showEventName: string = 'show.bs.dropdown';
  @Prop() shownEventName: string = 'shown.bs.dropdown';
  @Prop() hideEventName: string = 'hide.bs.dropdown';
  @Prop() hiddenEventName: string = 'hidden.bs.dropdown';

  @Prop({ mutable: true, reflectToAttr: true }) showDropdown: boolean = false;

  @Prop({ mutable: true }) show: boolean = false;
  @Prop({ mutable: true }) config: any = {};
  @Prop() defaults = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic',
  };

  @State() dropdownId: string;
  @State() inNavbar: boolean;
  @State() popperHandle: any;
  @State() relatedTarget: Element;

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
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    for (let j = 0, len = toggles.length; j < len; j += 1) {
      toggles[j].removeEventListener('click', this.handleToggleBsDropdown);
      toggles[j].addEventListener('click', this.handleToggleBsDropdown);
    }
    // obey initial show-dropdown prop
    if (this.showDropdown === true && this.show === false) {
      const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
      if (!dropdownMenuEl) {
        return;
      }
      const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
      if (hasClass(dropdownMenuEl, 'fade')) {
        removeClass(dropdownMenuEl, 'fade');
        this.handleShowDropdown();
        setTimeout(() => {
          addClass(dropdownMenuEl, 'fade');
        }, dropdownMenuTransitionDuration);
      } else {
        this.handleShowDropdown();
      }
    } else if (this.showDropdown === false && this.show === true) {
      this.handleHideDropdown();
    }
  }

  componentDidUnload() {
    this.dispose();
  }

  dispose() {
    if (this.show === true) {
      this.handleHideDropdown();
    }
    document.removeEventListener('click', this.handleDropdownClickOutside);
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    this.relatedTarget = null;
    for (let j = 0, len = toggles.length; j < len; j += 1) {
      toggles[j].removeEventListener('click', this.handleToggleBsDropdown);
    }
    if (this.popperHandle && this.popperHandle.destroy) {
      this.popperHandle.destroy();
      this.popperHandle = null;
    }
  }

  initPopper(dropdownMenuEl) {
    this.inNavbar = BsDropdown.detectNavbar(this.dropdownEl);
    if (!this.inNavbar) {
      // console.log('this.config: ', this.config);
      const popperConfig: any = BsDropdown.getPopperDropdownConfig(this.dropdownEl, dropdownMenuEl, this.config);

      // console.log('popperConfig: ', popperConfig);

      // If boundary is not `scrollParent`, then set position to `static`
      // to allow the menu to "escape" the scroll parent's boundaries
      // https://github.com/twbs/bootstrap/issues/24251
      if (this.config.boundary !== 'scrollParent') {
        addClass(this.dropdownEl, 'position-static');
      }

      let referenceElement:any = this.relatedTarget;
      if (this.config.reference === 'parent') {
        referenceElement = this.relatedTarget.parentNode;
      } else if (this.config.reference instanceof Element) {
        referenceElement = this.config.reference;
      }
      // console.log('this.config: ', this.config);
      // console.log('referenceElement: ', referenceElement);
      // console.log('dropdownMenuEl: ', dropdownMenuEl);
      // console.log('popperConfig: ', popperConfig);
      this.popperHandle = new Popper(referenceElement, dropdownMenuEl, popperConfig);
    }
  }

  static detectNavbar(el) {
    return closest(el, '.navbar') !== null;
  }

  handleDropdownClickOutside = (event) => {
    // console.log('event: ', event);
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    // handleDropdownClickOutside is an arrow function so that removeEventListener will work
    if (!this.show) {
      return;
    }
    const clickWasInsideDropdown = clickWasInside(event.target, `[data-bs-id="${this.dropdownId}"]`);

    if (clickWasInsideDropdown) {
      const closestForm = closest(event.target, 'form');
      if (this.dropdownEl.contains(closestForm)) {
        // the user clicked on a form that is inside the dropdown
        // so keep the dropdown open
        return;
      }
      if (_toLower(event.target.tagName) === 'input' || _toLower(event.target.tagName) === 'textarea') {
        return;
      }
    }
    document.removeEventListener('click', this.handleDropdownClickOutside);
    this.show = true;
    this.handleHideDropdown();
  }

  setConfig(relatedTarget) {
    this.config = {};
    const config: any = {};
    if (_has(relatedTarget.dataset, 'offset')) {
      config.offset = relatedTarget.dataset.offset;
    } else {
      config.offset = this.defaults.offset;
    }
    if (_has(relatedTarget.dataset, 'relatedTarget')) {
      config.flip = getConfigBoolean(relatedTarget.dataset.flip);
    } else {
      config.flip = this.defaults.flip;
    }
    if (_has(relatedTarget.dataset, 'boundary')) {
      config.boundary = relatedTarget.dataset.boundary;
    } else {
      config.boundary = this.defaults.boundary;
    }
    if (_has(relatedTarget.dataset, 'reference')) {
      config.reference = relatedTarget.dataset.reference;
    } else {
      config.reference = this.defaults.reference;
    }
    if (_has(relatedTarget.dataset, 'display')) {
      config.display = relatedTarget.dataset.display;
    } else {
      config.display = this.defaults.display;
    }
    this.config = config;
    // console.log('this.config: ', this.config);
  }

  getAssumedRelatedTarget() {
    const assumedRelatedTarget = this.dropdownEl.querySelector('[data-toggle="dropdown"]');
    if (assumedRelatedTarget) {
      return assumedRelatedTarget;
    }
    return this.dropdownEl;
  }

  handleShowDropdown(passedRelatedTarget:HTMLElement = null) {
    // console.log('handleShowDropdown relatedTarget: ', relatedTarget);
    this.relatedTarget = passedRelatedTarget || this.getAssumedRelatedTarget();
    if (this.relatedTarget.hasAttribute('disabled') || hasClass(this.relatedTarget, 'disabled')) {
      return;
    }
    const showEvent = customEvent(this.dropdownEl, this.showEventName, {}, this.relatedTarget);
    this.setConfig(this.relatedTarget);
    if (this.show || showEvent.defaultPrevented) {
      return;
    }
    this.show = true;
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    if (!dropdownMenuEl) {
      return;
    }
    // const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    addClass(this.dropdownEl, 'show');
    addClass(dropdownMenuEl, 'show');
    this.relatedTarget.setAttribute('aria-expanded', 'true');
    // for (let j = 0, len = toggles.length; j < len; j += 1) {
    //   toggles[j].setAttribute('aria-expanded', 'true');
    // }
    document.removeEventListener('click', this.handleDropdownClickOutside);
    setTimeout(() => {
      document.removeEventListener('click', this.handleDropdownClickOutside);
      document.addEventListener('click', this.handleDropdownClickOutside);
    }, 0);
    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);


    this.initPopper(dropdownMenuEl);
    setTimeout(() => {
      customEvent(this.dropdownEl, this.shownEventName, {}, this.relatedTarget);
    }, dropdownMenuTransitionDuration);
  }

  handleHideDropdown() {
    // console.log('handleHideDropdown relatedTarget: ', relatedTarget);
    const hideEvent = customEvent(this.dropdownEl, this.hideEventName, {}, this.relatedTarget);
    if (!this.show || hideEvent.defaultPrevented) {
      return;
    }
    this.show = false;
    const dropdownMenuEl = this.dropdownEl.querySelector('.dropdown-menu');
    if (!dropdownMenuEl) {
      return;
    }
    const toggles = this.dropdownEl.querySelectorAll('[data-toggle="dropdown"]');
    document.removeEventListener('click', this.handleDropdownClickOutside);
    removeClass(this.dropdownEl, 'show');
    removeClass(dropdownMenuEl, 'show');
    for (let j = 0, len = toggles.length; j < len; j += 1) {
      toggles[j].setAttribute('aria-expanded', 'false');
    }
    const dropdownMenuTransitionDuration = getTransitionDurationFromElement(dropdownMenuEl);
    setTimeout(() => {
      customEvent(this.dropdownEl, this.hiddenEventName, {}, this.relatedTarget);
      this.relatedTarget = null;
    }, dropdownMenuTransitionDuration);
  }

  handleToggleBsDropdown = (event) => {
    event.preventDefault();
    if (this.show === true) {
      this.handleHideDropdown();
    } else {
      this.handleShowDropdown(event.target);
    }
  }

  static getPlacement(dropdownEl, dropdownMenuEl) {
    const AttachmentMap = {
      top: 'top-start',
      topend: 'top-end',
      bottom: 'bottom-start',
      bottomend: 'bottom-end',
      right: 'right-start',
      // RIGHTEND: 'right-end',
      left: 'left-start',
      // LEFTEND: 'left-end',
    };
    const ClassName = {
      // DISABLED: 'disabled',
      // SHOW: 'show',
      dropup: 'dropup',
      dropright: 'dropright',
      dropleft: 'dropleft',
      menuright: 'dropdown-menu-right',
      // MENULEFT: 'dropdown-menu-left',
      // POSITION_STATIC: 'position-static',
    };
    let placement = AttachmentMap.bottom;
    if (hasClass(dropdownEl, ClassName.dropup)) {
      placement = AttachmentMap.top;
      if (hasClass(dropdownMenuEl, ClassName.menuright)) {
        placement = AttachmentMap.topend;
      }
    } else if (hasClass(dropdownEl, ClassName.dropright)) {
      placement = AttachmentMap.right;
    } else if (hasClass(dropdownEl, ClassName.dropleft)) {
      placement = AttachmentMap.left;
    } else if (hasClass(dropdownEl, ClassName.menuright)) {
      placement = AttachmentMap.bottomend;
    }
    return placement;
  }

  static getPopperDropdownConfig(dropdownEl, dropdownMenuEl, popperSettings) {
    const popperConfig: any = {
      placement: BsDropdown.getPlacement(dropdownEl, dropdownMenuEl),
      modifiers: {
        offset: { offset: popperSettings.offset },
        flip: {
          enabled: popperSettings.flip,
        },
        preventOverflow: {
          boundariesElement: popperSettings.boundary,
        },
      },
    };

    // Disable Popper.js if we have a static display
    if (popperSettings.display === 'static') {
      popperConfig.modifiers.applyStyle = {
        enabled: false,
      };
    }
    return popperConfig;
  }


  @Listen('focusout')
  handleFocusOut(event) {
    if (this.show && !this.dropdownEl.contains(event.relatedTarget)) {
      this.handleHideDropdown();
    }
  }

  keydownIsADropdownCommand(event) {
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    const ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key
    const SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
    const ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
    const ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
    // const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`);
    if (_toLower(event.target.tagName) === 'input' || _toLower(event.target.tagName) === 'textarea') {
      if (event.which === SPACE_KEYCODE) {
        return false;
      }
      if (event.which === ESCAPE_KEYCODE) {
        return true;
      }
      const dropdownMenu = this.dropdownEl.querySelector('.dropdown-menu');
      if (dropdownMenu.contains(event.target)) {
        return false;
      }
      if (event.which === ARROW_DOWN_KEYCODE) {
        if (event.target.dataset.toggle === 'dropdown') {
          return true;
        }
        return false;
      }
      if (event.which === ARROW_UP_KEYCODE) {
        if (event.target.dataset.toggle === 'dropdown') {
          return true;
        }
        return false;
      }
    } else {
      if (event.which === ARROW_UP_KEYCODE) {
        return true;
      }
      if (event.which === ARROW_DOWN_KEYCODE) {
        return true;
      }
      if (event.which === ESCAPE_KEYCODE) {
        return true;
      }
      if (event.which === SPACE_KEYCODE) {
        return true;
      }
    }
    return false;
  }


  @Listen('keydown')
  handleKeyDown(event) {
    // console.log('handleKeyDown event: ', event);
    const ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key
    const SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
    // const TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
    const ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
    const ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
    // const RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)
    // const REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
    if (!this.keydownIsADropdownCommand(event)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (event.target.hasAttribute('disabled') || hasClass(event.target, 'disabled')) {
      return;
    }
    const relatedTarget:any = this.getAssumedRelatedTarget();
    if (event.which === ESCAPE_KEYCODE) {
      if (this.show === true) {
        this.handleHideDropdown();
      } else {
        this.handleShowDropdown(relatedTarget);
      }
      relatedTarget.focus();
      return;
    }
    if (event.which === SPACE_KEYCODE) {
      if (relatedTarget === document.activeElement) {
        if (this.show === true) {
          this.handleHideDropdown();
        } else {
          this.handleShowDropdown(relatedTarget);
        }
      }
      return;
    }
    if (event.which === ARROW_DOWN_KEYCODE && !this.show) {
      this.handleShowDropdown(relatedTarget);
      relatedTarget.focus();
      return;
    }
    if (event.which === ARROW_UP_KEYCODE && !this.show) {
      this.handleShowDropdown(relatedTarget);
      relatedTarget.focus();
      return;
    }
    if (event.which !== 38 && event.which !== 40) {
      console.warn('unhandled event.which: ', event.which);
    }
    const dropdownMenuItems = Array.prototype.slice.call(this.dropdownEl.querySelectorAll('.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'));
    if (dropdownMenuItems.length === 0) {
      return;
    }
    let myIndex = dropdownMenuItems.indexOf(document.activeElement);

    // console.log('dropdownMenuItems: ', dropdownMenuItems);
    // console.log('myIndex: ', myIndex);

    if (event.which === ARROW_UP_KEYCODE && myIndex > 0) { // Up
      myIndex -= 1;
    }
    if (event.which === ARROW_DOWN_KEYCODE && myIndex < dropdownMenuItems.length - 1) { // Down
      myIndex += 1;
    }
    if (myIndex < 0) {
      myIndex = 0;
    }
    // console.log('myIndex: ', myIndex);
    dropdownMenuItems[myIndex].focus();
  }

  @Watch('showDropdown')
  handlePresentWatch(newValue /* , oldValue */) {
    if (newValue === true && this.show === false) {
      this.handleShowDropdown();
    } else if (newValue === false && this.show === true) {
      this.handleHideDropdown();
    }
  }


  @Method()
  dropdown(dropdownOptions = {}, relatedTarget = null) {
    if (_size(dropdownOptions) === 0) {
      return this.dropdownEl;
    }
    if (dropdownOptions === 'toggle') {
      if (this.show === true) {
        this.handleHideDropdown();
      } else {
        this.handleShowDropdown(relatedTarget);
      }
      return true;
    }
    if (dropdownOptions === 'update') {
      this.inNavbar = BsDropdown.detectNavbar(this.dropdownEl);
      if (this.popperHandle !== null) {
        this.popperHandle.scheduleUpdate();
      }
      return true;
    }
    // if (dropdownOptions === 'dispose') {
    //   this.dispose();
    //   return true;
    // }
    if (typeof dropdownOptions === 'string') {
      throw new Error(`No method named "${dropdownOptions}"`);
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
