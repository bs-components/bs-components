import { Component, Element, Method, State, Event, EventEmitter } from '@stencil/core';

// import cloneDeep from 'lodash/cloneDeep';
// import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import toLower from 'lodash/toLower';

import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
// import closest from '../../utilities/closest';
// import elementMatches from '../../utilities/element-matches';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
// import addClass from '../../utilities/add-class';
import removeClass from '../../utilities/remove-class';
// import toggleClass from '../../utilities/toggle-class';
// import customEvent from '../../utilities/custom-event';
import reflow from '../../utilities/reflow';

@Component({
  tag: 'bs-modal',
  // styleUrl: 'my-component.css',
  shadow: false
})
export class BsModal {

  @Element() modalEl: HTMLElement;

  @State() isShown: boolean;
  @State() isTransitioning: boolean;
  @State() isBodyOverflowing: boolean;
  @State() scrollbarWidth: number;
  @State() backdrop: any;

  @Event() show_bs_modal: EventEmitter;
  @Event() shown_bs_modal: EventEmitter;
  @Event() hide_bs_modal: EventEmitter;
  @Event() hidden_bs_modal: EventEmitter;


  // TODO: when triggering customEvent show.bs.modal make the payload = this.modalButtonEl.dataset to support the relatedTarget stuff

  componentWillLoad() {
    this.isShown = hasClass(this.modalEl, 'show');
    this.isTransitioning = false;
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
      let fixedContent = Array.prototype.slice.call(document.querySelectorAll('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'));
      let stickyContent = Array.prototype.slice.call(document.querySelectorAll('.sticky-top'));
      // Adjust fixed content padding
      for (let j = 0, len = fixedContent.length; j < len; j++) {
        let actualPadding = fixedContent[j].style.paddingRight;
        let calculatedPadding = window.getComputedStyle(fixedContent[j])['padding-right'];
        fixedContent[j].dataset.paddingRight = actualPadding;
        fixedContent[j].style.paddingRight = parseFloat(calculatedPadding) + this.scrollbarWidth + "px";
      }
      // forEach(fixedContent, (element) => {
      //   let actualPadding = element.style.paddingRight;
      //   let calculatedPadding = window.getComputedStyle(element)['padding-right'];
      //   element.dataset.paddingRight = actualPadding;
      //   element.style.paddingRight = parseFloat(calculatedPadding) + this.scrollbarWidth + "px";
      // });
      // Adjust sticky content margin

      for (let j = 0, len = stickyContent.length; j < len; j++) {
        let actualMargin = stickyContent[j].style.marginRight;
        let calculatedMargin = window.getComputedStyle(stickyContent[j])['margin-right'];
        stickyContent[j].dataset.marginRight = actualMargin;
        stickyContent[j].style.marginRight = parseFloat(calculatedMargin) - this.scrollbarWidth + "px";
      }

      // forEach(stickyContent, (element) => {
      //   let actualMargin = element.style.marginRight;
      //   let calculatedMargin = window.getComputedStyle(element)['margin-right'];
      //   element.dataset.marginRight = actualMargin;
      //   element.style.marginRight = parseFloat(calculatedMargin) - this.scrollbarWidth + "px";
      // });
      // Adjust body padding
      let actualPadding = document.body.style.paddingRight;
      let calculatedPadding = window.getComputedStyle(document.body)['padding-right'];
      document.body.dataset.paddingRight = actualPadding;
      document.body.style.paddingRight = parseFloat(calculatedPadding) + this.scrollbarWidth + "px";
    }
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
    console.log('hide modal');
  }

  show(config, passedRelatedTarget) {
    if (this.isTransitioning || this.isShown) {
      return;
    }
    if (hasClass(this.modalEl, 'fade')) {
      this.isTransitioning = true;
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
    const eventWithRelatedTarget = Object.defineProperties(event, {
      relatedTarget: {
        value: passedRelatedTarget,
        writable: true,
      },
    });
    this.show_bs_modal.emit(eventWithRelatedTarget);
    if (this.isShown || event.defaultPrevented) {
      return;
    }
    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.adjustDialog();

    addClass(document.body, 'modal-open');

    // this._setEscapeEvent(); // TODO
    // this._setResizeEvent(); // TODO

    // TODO: add all the bind events (make sure to remove the listeners in the unmounted life cycle)
    // $$$1(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
    //   return _this.hide(event);
    // });
    // $$$1(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
    //   $$$1(_this._element).one(Event.MOUSEUP_DISMISS, function (event) {
    //     if ($$$1(event.target).is(_this._element)) {
    //       _this._ignoreBackdropClick = true;
    //     }
    //   });
    // });


    // TODO: add backdrop with a callback and then show the actual modal
    this.showBackdrop(config, () => this.showElement(config, eventWithRelatedTarget));


  }


  getConfig(overrideConfig = {}) {
    const config: any = {};
    if (has(overrideConfig, 'backdrop')) {
      const backdrop = toLower(get(overrideConfig, 'backdrop', 'true'));
      config.backdrop = backdrop === 'static' ? 'static' : backdrop === 'true';
    } else if (has(this.modalEl, 'dataset.backdrop')) {
      const backdrop = toLower(get(this.modalEl, 'dataset.backdrop', 'true'));
      config.backdrop = backdrop === 'static' ? 'static' : backdrop === 'true';
    } else {
      config.backdrop = true;
    }
    if (has(overrideConfig, 'focus')) {
      config.focus = toLower(get(overrideConfig, 'dataset.focus', 'true')) === 'true';
    } else if (has(this.modalEl, 'dataset.focus')) {
      config.focus = toLower(get(this.modalEl, 'dataset.focus', 'true')) === 'true';
    } else {
      config.focus = true;
    }
    if (has(overrideConfig, 'keyboard')) {
      config.keyboard = toLower(get(overrideConfig, 'dataset.keyboard', 'true')) === 'true';
    } else if (has(this.modalEl, 'dataset.keyboard')) {
      config.keyboard = toLower(get(this.modalEl, 'dataset.keyboard', 'true')) === 'true';
    } else {
      config.keyboard = true;
    }
    if (has(overrideConfig, 'show')) {
      config.show = toLower(get(overrideConfig, 'dataset.show', 'true')) === 'true';
    } else if (has(this.modalEl, 'dataset.show')) {
      config.show = toLower(get(this.modalEl, 'dataset.show', 'true')) === 'true';
    } else {
      config.show = true;
    }
    return config;
  };


  // enforceFocus() {
  //   document.removeEventListener('focusin', this.handleFocusIn);
  //   document.addEventListener('focusin', this.handleFocusIn);
  // };


//   GetPlacementFlags (node1, node2) {
//     var flags = [];
//     var relation = node1.compareDocumentPosition (node2);
//     if (relation & Node.DOCUMENT_POSITION_PRECEDING) {
//         flags.push (" preceding");
//     }
//     if (relation & Node.DOCUMENT_POSITION_FOLLOWING) {
//         flags.push (" following");
//     }
//     if (relation & Node.DOCUMENT_POSITION_CONTAINS) {
//         flags.push (" contains");
//     }
//     if (relation & Node.DOCUMENT_POSITION_CONTAINED_BY) {
//         flags.push (" contained by");
//     }
//     if (relation & Node.DOCUMENT_POSITION_DISCONNECTED) {
//         flags.push (" disconnected");
//     }
//     if (relation & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC) {
//         flags.push (" implementation specific");
//     }
//     return flags.toString ();
// }

  elementIsDescendant(firstEl, suspectedDescendantEl) {
    if (firstEl.isEqualNode(suspectedDescendantEl)) {
      // It is not a descendent if it's the same element
      return false;
    }
    return firstEl.contains(suspectedDescendantEl);
  }


  // handleFocusIn = (event) => {
  //   console.log('handleFocusIn event: ', event);
  //   console.log('this.modalEl: ', this.modalEl);
  //   // if (document !== event.target && this.modalEl !== event.target && this.modalEl.isEqualNode(event.target)) {


  //     console.log('this.modalEl !== event.target', this.modalEl !== event.target);


  //     // console.log('document.compareDocumentPosition(event.target)', document.compareDocumentPosition(event.target));

  //     // const modalAndEventTargetRelation = document.compareDocumentPosition(event.target); // === Node.DOCUMENT_POSITION_CONTAINED_BY;


  //     // const eventIsChildOfModal = (modalAndEventTargetRelation & Node.DOCUMENT_POSITION_CONTAINED_BY);

  //     const eventIsDescendantOfModal = this.elementIsDescendant(this.modalEl, event.target)

  //     console.log('eventIsDescendantOfModal: ', eventIsDescendantOfModal);


  //     // if (document !== event.target && _this4._element !== event.target && $$$1(_this4._element).has(event.target).length === 0) {
  //     if (document !== event.target && this.modalEl !== event.target && !this.elementIsDescendant(this.modalEl, event.target)) {
  //     // if (document !== event.target && this.modalEl.isEqualNode(event.target)) {

  //       console.log('Made it');
  //       this.modalEl.focus();
  //     }



  //   // if (document !== event.target && !this.modalEl.contains(event.target)) {
  //   // // } !== event.target && this.modalEl.isEqualNode(event.target)) {
  //   //   console.log('Made it');
  //   //   this.modalEl.focus();
  //   // }



  // }


  showElement(config, eventWithRelatedTarget) {
    // console.log('eventWithRelatedTarget: ', eventWithRelatedTarget);
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
    // if (config.focus) {
    //   this.enforceFocus();
    // }
    if (transition) {
      const transitionDuration = getTransitionDurationFromElement(this.modalEl);
      setTimeout(() => {
        if (config.focus) {
          this.modalEl.focus();
        }
        this.isTransitioning = false;
        this.shown_bs_modal.emit(eventWithRelatedTarget);
      }, transitionDuration);
    }

  }

  showBackdrop(config, callback) {
    // TODO: show the backdrop and do the callback after the transition finishes


    let animate = hasClass(this.modalEl, 'fade') ? 'fade' : '';

    if (this.isShown && config.backdrop) {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'modal-backdrop';

      if (animate) {
        this.backdrop.classList.add(animate);
      }

      // this.backdrop.appendChild(document.body);
      document.body.appendChild(this.backdrop);
      // $$$1(this._backdrop).appendTo(document.body);

      // TODO: event listeners for click dismiss
      // $$$1(this._element).on(Event.CLICK_DISMISS, function (event) {
      //   if (_this8._ignoreBackdropClick) {
      //     _this8._ignoreBackdropClick = false;
      //     return;
      //   }

      //   if (event.target !== event.currentTarget) {
      //     return;
      //   }

      //   if (_this8._config.backdrop === 'static') {
      //     _this8._element.focus();
      //   } else {
      //     _this8.hide();
      //   }
      // });

      if (animate) {
        reflow(this.backdrop);
      }

      addClass(this.backdrop, 'show');

      // $$$1(this._backdrop).addClass(ClassName.SHOW);

      if (!callback) {
        return;
      }

      if (!animate) {
        callback();
        return;
      }

      // TODO: some sort of event gets fired here that does something
      // var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
      // $$$1(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);


    } else if (!this.isShown && this.backdrop) {

      removeClass(this.backdrop, 'show');
      // $$$1(this._backdrop).removeClass(ClassName.SHOW);

      // TODO: what is this callback remove thing?
      // var callbackRemove = function callbackRemove() {
      //   _this8._removeBackdrop();

      //   if (callback) {
      //     callback();
      //   }
      // };

      // TODO: some sort of event to remove something with a transition duration here
      // if ($$$1(this._element).hasClass(ClassName.FADE)) {
      //   var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
      //   $$$1(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
      // } else {
      //   callbackRemove();
      // }


    } else if (callback) {
      callback();
    }



    callback();
  }

  @Method()
  modalToggleButtonClicked(relatedTarget) {
    // console.log('modalToggleButtonClicked');
    this.getConfig();
    if (this.isShown) {
      this.hide();
    } else {
      this.show(this.getConfig(), relatedTarget);
    }
  }

  @Method()
  modal(modalOptions) {
    console.log('modalOptions: ', modalOptions);

  if (typeof modalOptions === 'object') {
  } else if (typeof modalOptions === 'string') {

  }

    if (modalOptions === 'handleUpdate') {
      this.adjustDialog();
    }
  }

  render() {
    return ( <slot /> );
  }

}