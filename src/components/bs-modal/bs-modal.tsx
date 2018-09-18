import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Element,
  Method, // eslint-disable-line no-unused-vars
  Watch, // eslint-disable-line no-unused-vars
} from '@stencil/core';


import _size from 'lodash/size';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _toLower from 'lodash/toLower';

import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
import reflow from '../../utilities/reflow';
import customEvent from '../../utilities/custom-event';
import getConfigBoolean from '../../utilities/get-config-boolean';

@Component({ tag: 'bs-modal', styleUrl: 'bs-modal.css', shadow: false })
export class BsModal { // eslint-disable-line import/prefer-default-export
  @Element() modalEl: HTMLElement;

  @Prop() showEventName: string = 'show.bs.modal';
  @Prop() shownEventName: string = 'shown.bs.modal';
  @Prop() hideEventName: string = 'hide.bs.modal';
  @Prop() hiddenEventName: string = 'hidden.bs.modal';

  @Prop({ mutable: true }) showModal: boolean = false;

  @State() isShown: boolean;
  @State() isTransitioning: boolean;
  @State() isBodyOverflowing: boolean;
  @State() scrollbarWidth: number;
  @State() backdrop: any;
  @State() config: any;
  @State() relatedTarget: HTMLElement;

  componentWillLoad() {
    this.isShown = hasClass(this.modalEl, 'show');
    this.isTransitioning = false;
    if (this.showModal && !this.isShown) {
      this.getConfig();
      if (!hasClass(this.modalEl, 'fade')) {
        this.show();
        return;
      }
      removeClass(this.modalEl, 'fade'); // no animation when setting the initial state
      const transitionDuration = getTransitionDurationFromElement(this.modalEl);
      this.show();
      setTimeout(() => {
        addClass(this.modalEl, 'fade');
      }, transitionDuration);
    } else if (!this.showModal && this.isShown) {
      this.getConfig();
      if (!hasClass(this.modalEl, 'fade')) {
        this.hide();
        return;
      }
      const transitionDuration = getTransitionDurationFromElement(this.modalEl);
      removeClass(this.modalEl, 'fade'); // no animation when setting the initial state
      this.hide();
      setTimeout(() => {
        addClass(this.modalEl, 'fade');
      }, transitionDuration);
    }
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

  @Method()
  getScrollbarWidth() { // eslint-disable-line class-methods-use-this
    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  checkScrollbar() {
    const rect = document.body.getBoundingClientRect();
    this.isBodyOverflowing = rect.left + rect.right < window.innerWidth;
    this.scrollbarWidth = this.getScrollbarWidth();
  }

  setScrollbar() {
    if (this.isBodyOverflowing) {
      const fixedContent = Array.prototype.slice.call(document.querySelectorAll('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'));
      const stickyContent = Array.prototype.slice.call(document.querySelectorAll('.sticky-top'));
      // Adjust fixed content padding
      for (let j = 0, len = fixedContent.length; j < len; j += 1) {
        const actualPadding = fixedContent[j].style.paddingRight;
        const calculatedPadding = window.getComputedStyle(fixedContent[j])['padding-right'];
        fixedContent[j].dataset.paddingRight = actualPadding;
        fixedContent[j].style.paddingRight = `${parseFloat(calculatedPadding) + this.scrollbarWidth}px`;
      }
      // Adjust sticky content margin
      for (let j = 0, len = stickyContent.length; j < len; j += 1) {
        const actualMargin = stickyContent[j].style.marginRight;
        const calculatedMargin = window.getComputedStyle(stickyContent[j])['margin-right'];
        stickyContent[j].dataset.marginRight = actualMargin;
        stickyContent[j].style.marginRight = `${parseFloat(calculatedMargin) - this.scrollbarWidth}px`;
      }
      // Adjust body padding
      const actualPadding = document.body.style.paddingRight;
      const calculatedPadding = window.getComputedStyle(document.body)['padding-right'];
      document.body.dataset.paddingRight = actualPadding;
      document.body.style.paddingRight = `${parseFloat(calculatedPadding) + this.scrollbarWidth}px`;
    }
  }

  static resetScrollbar() {
    // Restore fixed content padding
    const fixedContent = Array.prototype.slice.call(document.querySelectorAll('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'));
    for (let j = 0, len = fixedContent.length; j < len; j += 1) {
      const padding = fixedContent[j].dataset.paddingRight;
      delete fixedContent[j].dataset.paddingRight;
      fixedContent[j].style.paddingRight = padding || '';
    }
    // Restore sticky content
    const stickyContent = Array.prototype.slice.call(document.querySelectorAll('.sticky-top'));
    for (let j = 0, len = stickyContent.length; j < len; j += 1) {
      const margin = stickyContent[j].dataset.marginRight;
      if (typeof margin !== 'undefined') {
        stickyContent[j].style.marginRight = margin;
        delete stickyContent[j].dataset.marginRight;
      }
    }
    // Restore body padding
    const padding = document.body.dataset.paddingRight;
    delete document.body.dataset.paddingRight;
    document.body.style.paddingRight = padding || '';
  }

  adjustDialog() {
    const isModalOverflowing = this.modalEl.scrollHeight > document.documentElement.clientHeight;
    if (!this.isBodyOverflowing && isModalOverflowing) {
      this.modalEl.style.paddingLeft = `${this.scrollbarWidth}px`;
    }
    if (this.isBodyOverflowing && !isModalOverflowing) {
      this.modalEl.style.paddingRight = `${this.scrollbarWidth}px`;
    }
  }

  hide() {
    // console.log('hide');
    if (this.isTransitioning || !this.isShown) {
      return;
    }
    const hideEvent = customEvent(this.modalEl, this.hideEventName);
    if (!this.isShown || hideEvent.defaultPrevented) {
      return;
    }
    this.isShown = false;
    const transition = hasClass(this.modalEl, 'fade');
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
      removeClass(document.body, 'modal-open');
      this.resetAdjustments();
      BsModal.resetScrollbar();
      if (this.relatedTarget) {
        this.relatedTarget.focus();
        this.relatedTarget = null;
      }
      const modalTransitionDuration = getTransitionDurationFromElement(this.modalEl);
      // console.log('modalTransitionDuration: ', modalTransitionDuration);
      setTimeout(() => {
        window.requestAnimationFrame(() => { // trick to ensure all page updates are completed before running code
          window.requestAnimationFrame(() => { // discussed here:  https://www.youtube.com/watch?v=aCMbSyngXB4&t=11m
            customEvent(this.modalEl, this.hiddenEventName);
          });
        });
      }, modalTransitionDuration);

      this.unbindAllEventListenersUsed();
    });
  }

  resetAdjustments() {
    this.modalEl.style.paddingLeft = '';
    this.modalEl.style.paddingRight = '';
  }

  show(relatedTarget = null) {
    if (this.isTransitioning || this.isShown) {
      return;
    }
    if (hasClass(this.modalEl, 'fade')) {
      this.isTransitioning = true;
    }
    const showEvent = customEvent(this.modalEl, this.showEventName, {}, relatedTarget);
    if (this.isShown || showEvent.defaultPrevented) {
      return;
    }
    if (relatedTarget) {
      this.relatedTarget = relatedTarget;
    }
    this.isShown = true;
    this.checkScrollbar();
    this.setScrollbar();
    this.adjustDialog();
    addClass(document.body, 'modal-open');
    this.setEscapeEvent();
    this.setResizeEvent();
    this.setClicksThatCanCloseModalEvent();
    this.showBackdrop(() => this.showElement());
  }

  elementIsOrInADataDismissForThisModal(element) {
    const modalDataDismissArr = Array.prototype.slice.call(this.modalEl.querySelectorAll('[data-dismiss="modal"]'));
    for (let j = 0, len = modalDataDismissArr.length; j < len; j += 1) {
      if (modalDataDismissArr[j].contains(element)) {
        return true;
      }
    }
    return false;
  }

  handleDataDismissModalClick = (event) => {
    // console.log('handleDataDismissModalClick');
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
    if (_has(overrideConfig, 'backdrop')) {
      const backdrop = _toLower(_get(overrideConfig, 'backdrop', 'true'));
      config.backdrop = backdrop === 'static' ? 'static' : getConfigBoolean(backdrop);
    } else if (_has(this.modalEl.dataset, 'backdrop')) {
      const backdrop = _toLower(this.modalEl.dataset.backdrop);
      config.backdrop = backdrop === 'static' ? 'static' : getConfigBoolean(backdrop);
    } else {
      config.backdrop = true;
    }
    if (_has(overrideConfig, 'focus')) {
      config.focus = getConfigBoolean(_get(overrideConfig, 'focus', true));
    } else if (_has(this.modalEl.dataset, 'focus')) {
      config.focus = getConfigBoolean(this.modalEl.dataset.focus);
    } else {
      config.focus = true;
    }
    if (_has(overrideConfig, 'keyboard')) {
      config.keyboard = getConfigBoolean(_get(overrideConfig, 'keyboard', true));
    } else if (_has(this.modalEl.dataset, 'keyboard')) {
      config.keyboard = getConfigBoolean(this.modalEl.dataset.keyboard);
    } else {
      config.keyboard = true;
    }
    if (_has(overrideConfig, 'show')) {
      config.show = getConfigBoolean(_get(overrideConfig, 'show', true));
    } else if (_has(this.modalEl.dataset, 'show')) {
      config.show = getConfigBoolean(this.modalEl.dataset.show);
    } else {
      config.show = true;
    }
    this.config = config;
  }

  handleFocusIn = (event) => {
    if (document !== event.target && !this.modalEl.contains(event.target)) {
      this.modalEl.focus();
    }
  }

  enforceFocus() {
    document.removeEventListener('focusin', this.handleFocusIn);
    document.addEventListener('focusin', this.handleFocusIn);
  }

  showElement() {
    // console.log('showElement');
    const transition = hasClass(this.modalEl, 'fade');
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
        window.requestAnimationFrame(() => { // trick to ensure all page updates are completed before running code
          window.requestAnimationFrame(() => { // discussed here:  https://www.youtube.com/watch?v=aCMbSyngXB4&t=11m
            setTimeout(() => {
              customEvent(this.modalEl, this.shownEventName, {}, this.relatedTarget);
            }, 0);
          });
        });
      }, transitionDuration);
    } else {
      window.requestAnimationFrame(() => { // trick to ensure all page updates are completed before running code
        window.requestAnimationFrame(() => { // discussed here:  https://www.youtube.com/watch?v=aCMbSyngXB4&t=11m
          setTimeout(() => {
            customEvent(this.modalEl, this.shownEventName, {}, this.relatedTarget);
          }, 0);
        });
      });
    }
  }

  backdropClickDismiss = (event) => {
    // console.log('backdropClickDismiss');
    // debugger;
    if (event.target !== event.currentTarget) {
      return;
    }
    if (_get(this.config, 'backdrop', '') === 'static') {
      this.modalEl.focus();
    } else {
      this.hide();
    }
  }

  showBackdrop(callback:Function = () => {}) {
    const animate = hasClass(this.modalEl, 'fade') ? 'fade' : '';
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
        // window.requestAnimationFrame(() => { // trick to ensure all page updates are completed before running code
        //   window.requestAnimationFrame(() => { // discussed here:  https://www.youtube.com/watch?v=aCMbSyngXB4&t=11m
        callback();
        //   });
        // });
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
        this.removeBackdrop(callback);
      }
    } else {
      callback();
    }
  }

  removeBackdrop(callback:Function = () => {}) {
    // console.log('removeBackdrop');
    if (this.backdrop) {
      this.backdrop.parentNode.removeChild(this.backdrop);
      this.backdrop = null;
    }
    callback();
  }

  // @Method()
  // modalToggleButtonClicked(relatedTarget) {
  //   this.getConfig();
  //   if (this.isShown) {
  //     this.hide();
  //   } else {
  //     this.show(relatedTarget);
  //     // console.log('relatedTarget: ', relatedTarget);
  //   }
  // }

  @Watch('showModal')
  handleActiveWatch(newValue /* , oldValue */) {
    if (newValue) {
      this.getConfig();
      this.show();
      return;
    }
    this.hide();
  }


  @Method()
  modal(modalOptions = {}, relatedTarget = null) {
    // console.log('modalOptions: ', modalOptions);
    if (_size(modalOptions) === 0) {
      return this.modalEl;
    }
    if (typeof modalOptions === 'object') {
      this.getConfig(modalOptions);
      if (this.config.show && !this.isShown) {
        this.show();
      }
      return true;
    }
    if (modalOptions === 'toggle') {
      this.getConfig();
      if (this.isShown) {
        this.hide();
      } else {
        this.show(relatedTarget);
      }
      return true;
    }
    if (modalOptions === 'show') {
      this.getConfig();
      this.show();
      return true;
    }
    if (modalOptions === 'hide') {
      // this.getConfig();
      this.hide();
      return true;
    }
    if (modalOptions === 'handleUpdate') {
      this.adjustDialog();
      return true;
    }
    if (typeof modalOptions === 'string') {
      throw new Error(`No method named "${modalOptions}"`);
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
