import { Component, Element, Method, State, Prop } from '@stencil/core';

import get from 'lodash/get';
import has from 'lodash/has';
import toLower from 'lodash/toLower';

import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import reflow from '../../utilities/reflow';
import customEvent from '../../utilities/custom-event';
import getConfigBoolean from '../../utilities/get-config-boolean';

@Component({
  tag: 'bs-modal',
  shadow: false
})
export class BsModal {
  @Element() modalEl: HTMLElement;

  @Prop() showEventName: string = 'show.bs.modal';
  @Prop() shownEventName: string = 'shown.bs.modal';
  @Prop() hideEventName: string = 'hide.bs.modal';
  @Prop() hiddenEventName: string = 'hidden.bs.modal';

  @State() isShown: boolean;
  @State() isTransitioning: boolean;
  @State() isBodyOverflowing: boolean;
  @State() scrollbarWidth: number;
  @State() backdrop: any;
  @State() config: any;

  componentWillLoad() {
    this.isShown = hasClass(this.modalEl, 'show');
    this.isTransitioning = false;
  }

  componentDidUnload() {
    this.unbindAllEventListenersUsed();
  }

  unbindAllEventListenersUsed() {
    document.removeEventListener('focusin', this.handleFocusIn);
    this.modalEl.removeEventListener('click', this.backdropClickDismiss);
    document.removeEventListener('click', this.handleDataDismissModalClick);
    window.removeEventListener('resize', this.handleResizeEvent);
    document.removeEventListener('keydown', this.hideModalBecauseEscapePressed);
  }

  getScrollbarWidth() {
    let scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv);
    let scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  checkScrollbar() {
    let rect = document.body.getBoundingClientRect();
    this.isBodyOverflowing = rect.left + rect.right < window.innerWidth;
    this.scrollbarWidth = this.getScrollbarWidth();
  }

  setScrollbar() {
    if (this.isBodyOverflowing) {
      const fixedContent = Array.prototype.slice.call(document.querySelectorAll('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'));
      const stickyContent = Array.prototype.slice.call(document.querySelectorAll('.sticky-top'));
      // Adjust fixed content padding
      for (let j = 0, len = fixedContent.length; j < len; j++) {
        let actualPadding = fixedContent[j].style.paddingRight;
        let calculatedPadding = window.getComputedStyle(fixedContent[j])['padding-right'];
        fixedContent[j].dataset.paddingRight = actualPadding;
        fixedContent[j].style.paddingRight = parseFloat(calculatedPadding) + this.scrollbarWidth + "px";
      }
      // Adjust sticky content margin
      for (let j = 0, len = stickyContent.length; j < len; j++) {
        let actualMargin = stickyContent[j].style.marginRight;
        let calculatedMargin = window.getComputedStyle(stickyContent[j])['margin-right'];
        stickyContent[j].dataset.marginRight = actualMargin;
        stickyContent[j].style.marginRight = parseFloat(calculatedMargin) - this.scrollbarWidth + "px";
      }
      // Adjust body padding
      let actualPadding = document.body.style.paddingRight;
      let calculatedPadding = window.getComputedStyle(document.body)['padding-right'];
      document.body.dataset.paddingRight = actualPadding;
      document.body.style.paddingRight = parseFloat(calculatedPadding) + this.scrollbarWidth + "px";
    }
  }

  resetScrollbar() {
    // Restore fixed content padding
    const fixedContent = Array.prototype.slice.call(document.querySelectorAll('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'));
    for (let j = 0, len = fixedContent.length; j < len; j++) {
      const padding = fixedContent[j].dataset.paddingRight;
      delete fixedContent[j].dataset.paddingRight;
      fixedContent[j].style.paddingRight = padding ? padding : '';
    }
    // Restore sticky content
    const stickyContent = Array.prototype.slice.call(document.querySelectorAll('.sticky-top'));
    for (let j = 0, len = stickyContent.length; j < len; j++) {
      const margin = stickyContent[j].dataset.marginRight;
      if (typeof margin !== 'undefined') {
        stickyContent[j].style.marginRight = margin;
        delete stickyContent[j].dataset.marginRight;
      }
    }
    // Restore body padding
    const padding = document.body.dataset.paddingRight;
    delete document.body.dataset.paddingRight;
    document.body.style.paddingRight = padding ? padding : '';
  }


  adjustDialog() {
    let isModalOverflowing = this.modalEl.scrollHeight > document.documentElement.clientHeight;
    if (!this.isBodyOverflowing && isModalOverflowing) {
      this.modalEl.style.paddingLeft = this.scrollbarWidth + "px";
    }
    if (this.isBodyOverflowing && !isModalOverflowing) {
      this.modalEl.style.paddingRight = this.scrollbarWidth + "px";
    }
  }

  hide() {
    if (this.isTransitioning || !this.isShown) {
      return;
    }
    const hideEvent = customEvent(this.modalEl, this.hideEventName);
    if (!this.isShown || hideEvent.defaultPrevented) {
      return;
    }
    this.isShown = false;
    let transition = hasClass(this.modalEl, 'fade');
    if (transition) {
      this.isTransitioning = true;
    }

    this.setEscapeEvent();

    this.setResizeEvent();
    document.removeEventListener('focusin', this.handleFocusIn);
    removeClass(this.modalEl, 'show');
    document.removeEventListener('click', this.handleDataDismissModalClick);
    if (transition) {
      const transitionDuration = getTransitionDurationFromElement(this.modalEl);
      setTimeout(() => {
        this.hideModal();
      }, transitionDuration);
    } else {
      this.hideModal();
    }
  }

  hideModal() {
    this.modalEl.style.display = 'none';
    this.modalEl.setAttribute('aria-hidden', 'true');
    this.isTransitioning = false;
    this.showBackdrop(() => {
      removeClass(document.body, 'modal-open')
      this.resetAdjustments();
      this.resetScrollbar();
      customEvent(this.modalEl, this.hiddenEventName);
      this.unbindAllEventListenersUsed();
    });
  }

  resetAdjustments() {
    this.modalEl.style.paddingLeft = '';
    this.modalEl.style.paddingRight = '';
  }

  show(passedRelatedTarget = {}) {
    if (this.isTransitioning || this.isShown) {
      return;
    }
    if (hasClass(this.modalEl, 'fade')) {
      this.isTransitioning = true;
    }
    const showEvent = customEvent(this.modalEl, this.showEventName, {}, passedRelatedTarget);
    if (this.isShown || showEvent.defaultPrevented) {
      return;
    }
    this.isShown = true;
    this.checkScrollbar();
    this.setScrollbar();
    this.adjustDialog();
    addClass(document.body, 'modal-open');
    this.setEscapeEvent();
    this.setResizeEvent();
    this.setClicksThatCanCloseModalEvent();
    this.showBackdrop(() => this.showElement(passedRelatedTarget));
  }

  elementIsOrInADataDismissForThisModal(element) {
    const modalDataDismissArr = Array.prototype.slice.call(this.modalEl.querySelectorAll('[data-dismiss="modal"]'));
    for (let j = 0, len = modalDataDismissArr.length; j < len; j++) {
      if (modalDataDismissArr[j].contains(element)) {
        return true;
      }
    }
    return false;
  }

  handleDataDismissModalClick = (event) => {
    // close the modal if the backdrop is clicked on
    if (!this.modalEl.contains(event.target)) {
      this.hide();
    }
    // Close the modal if a [data-dismiss="modal"] is clicked on
    if (this.elementIsOrInADataDismissForThisModal(event.target)) {
      this.hide();
    }
  }

  setClicksThatCanCloseModalEvent() {
    if (this.isShown) {
      setTimeout(() => {
        document.addEventListener('click', this.handleDataDismissModalClick);
      }, 0);
    } else if (!this.isShown) {
      document.removeEventListener('click', this.handleDataDismissModalClick);
    }
  }

  handleResizeEvent = () => {
    this.adjustDialog();
  }

  setResizeEvent() {
    if (this.isShown) {
      window.addEventListener('resize', this.handleResizeEvent);
    } else {
      window.removeEventListener('resize', this.handleResizeEvent);
    }
  }

  hideModalBecauseEscapePressed = (event) => {
    const escapeKeycode = 27;
    if (event.which === escapeKeycode) {
      // event.preventDefault();
      this.hide();
    }
  }

  setEscapeEvent() {
    if (this.isShown && this.config.keyboard) {
      document.addEventListener('keydown', this.hideModalBecauseEscapePressed);
    } else if (!this.isShown) {
      document.removeEventListener('keydown', this.hideModalBecauseEscapePressed);
    }
  }

  getConfig(overrideConfig:any = {}) {
    this.config = {};
    const config: any = {};
    if (has(overrideConfig, 'backdrop')) {
      const backdrop = toLower(get(overrideConfig, 'backdrop', 'true'));
      config.backdrop = backdrop === 'static' ? 'static' : getConfigBoolean(backdrop);
    } else if (has(this.modalEl, 'dataset.backdrop')) {
      const backdrop = toLower(get(this.modalEl, 'dataset.backdrop', 'true'));
      config.backdrop = backdrop === 'static' ? 'static' : getConfigBoolean(backdrop);
    } else {
      config.backdrop = true;
    }
    if (has(overrideConfig, 'focus')) {
      config.focus = getConfigBoolean(get(overrideConfig, 'focus', true));
    } else if (has(this.modalEl, 'dataset.focus')) {
      config.focus = getConfigBoolean(get(this.modalEl, 'dataset.focus', true));
    } else {
      config.focus = true;
    }
    if (has(overrideConfig, 'keyboard')) {
      config.keyboard = getConfigBoolean(get(overrideConfig, 'keyboard', true));
    } else if (has(this.modalEl, 'dataset.keyboard')) {
      config.keyboard = getConfigBoolean(get(this.modalEl, 'dataset.keyboard', true));
    } else {
      config.keyboard = true;
    }
    if (has(overrideConfig, 'show')) {
      config.show = getConfigBoolean(get(overrideConfig, 'show', true));
    } else if (has(this.modalEl, 'dataset.show')) {
      config.show = getConfigBoolean(get(this.modalEl, 'dataset.show', true));
    } else {
      config.show = true;
    }
    this.config = config;
  };

  handleFocusIn = (event) => {
    if (document !== event.target && !this.modalEl.contains(event.target)) {
      this.modalEl.focus();
    }
  }

  enforceFocus() {
    document.removeEventListener('focusin', this.handleFocusIn);
    document.addEventListener('focusin', this.handleFocusIn);
  };

  showElement(passedRelatedTarget = {}) {
    let transition = hasClass(this.modalEl, 'fade');
    if (!this.modalEl.parentNode || this.modalEl.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.appendChild(this.modalEl);
    }
    this.modalEl.style.display = 'block';
    this.modalEl.removeAttribute('aria-hidden');
    this.modalEl.scrollTop = 0;
    if (transition) {
      reflow(this.modalEl);
    }
    addClass(this.modalEl, 'show');
    if (this.config.focus) {
      this.enforceFocus();
    }
    if (transition) {
      const transitionDuration = getTransitionDurationFromElement(this.modalEl);
      setTimeout(() => {
        if (this.config.focus) {
          this.modalEl.focus();
        }
        this.isTransitioning = false;
        customEvent(this.modalEl, this.shownEventName, {}, passedRelatedTarget);
      }, transitionDuration);
    }
  }

  backdropClickDismiss = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (get(this.config, 'backdrop', '') === 'static') {
      this.modalEl.focus();
    } else {
      this.hide();
    }
  }

  showBackdrop(callback:Function = () => {}) {
    let animate = hasClass(this.modalEl, 'fade') ? 'fade' : '';
    if (this.isShown && this.config.backdrop) {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'modal-backdrop';
      if (animate) {
        this.backdrop.classList.add(animate);
      }
      document.body.appendChild(this.backdrop);
      this.modalEl.addEventListener('click', this.backdropClickDismiss);
      if (animate) {
        reflow(this.backdrop);
      }
      addClass(this.backdrop, 'show');
      if (!callback) {
        return;
      }
      if (!animate) {
        callback();
        return;
      }
      const backdropTransitionDuration = getTransitionDurationFromElement(this.backdrop);
      setTimeout(() => {
        callback();
      }, backdropTransitionDuration);
    } else if (!this.isShown && this.backdrop) {
      removeClass(this.backdrop, 'show');
      const hasBackdropRemoveAnimation = hasClass(this.modalEl, 'fade');
      if (hasBackdropRemoveAnimation) {
        const removeBackdropTransitionDuration = getTransitionDurationFromElement(this.backdrop);
        setTimeout(() => {
          this.removeBackdrop(callback);
        }, removeBackdropTransitionDuration);
      } else {
        this.removeBackdrop();
      }
    } else {
      callback();
    }
  }

  removeBackdrop(callback:Function = () => {}) {
    if (this.backdrop) {
      this.backdrop.parentNode.removeChild(this.backdrop);
      this.backdrop = null;
    }
    callback();
  }

  @Method()
  modalToggleButtonClicked(relatedTarget = {}) {
    this.getConfig();
    if (this.isShown) {
      this.hide();
    } else {
      this.show(relatedTarget);
    }
  }

  @Method()
  modal(modalOptions = {}) {
    // console.log('modalOptions: ', modalOptions);
    if (typeof modalOptions === 'object') {
      this.getConfig(modalOptions);
      if (this.config.show && !this.isShown) {
        this.show();
      }
    } else if (modalOptions === 'toggle' || modalOptions === {}) {
      this.getConfig();
      if (this.isShown) {
        this.hide();
      } else {
        this.show();
      }
    } else if (modalOptions === 'show') {
      this.getConfig();
      this.show();
    } else if (modalOptions === 'hide') {
      // this.getConfig();
      this.hide();
    } else if (modalOptions === 'handleUpdate') {
      this.adjustDialog();
    }
  }

  render() {
    return ( <slot /> );
  }

}