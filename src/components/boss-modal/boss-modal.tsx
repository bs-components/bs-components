import { Component, Element, Method, State, Event, EventEmitter } from '@stencil/core';

// import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';

// import closest from '../../utilities/closest';
// import elementMatches from '../../utilities/element-matches';
import hasClass from '../../utilities/has-class';
import addClass from '../../utilities/add-class';
// import addClass from '../../utilities/add-class';
// import removeClass from '../../utilities/remove-class';
// import toggleClass from '../../utilities/toggle-class';
// import customEvent from '../../utilities/custom-event';

@Component({
  tag: 'boss-modal',
  // styleUrl: 'my-component.css',
  shadow: false
})
export class BossModal {

  @Element() modalEl: HTMLElement;

  @State() isShown: boolean;
  @State() isTransitioning: boolean;
  @State() isBodyOverflowing: boolean;
  @State() scrollbarWidth: number;

  @Event() showBossModal: EventEmitter;
  @Event() shownBossModal: EventEmitter;
  @Event() hideBossModal: EventEmitter;
  @Event() hiddenBossModal: EventEmitter;


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
    var rect = document.body.getBoundingClientRect();
    this.isBodyOverflowing = rect.left + rect.right < window.innerWidth;
    this.scrollbarWidth = this.getScrollbarWidth();
  }

  setScrollbar() {
    if (this.isBodyOverflowing) {
      const FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
      const STICKY_CONTENT = '.sticky-top';
      // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
      //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
      var fixedContent = [].slice.call(document.querySelectorAll(FIXED_CONTENT));
      var stickyContent = [].slice.call(document.querySelectorAll(STICKY_CONTENT)); // Adjust fixed content padding
      // console.log('fixedContent: ', fixedContent);
      // console.log('stickyContent: ', stickyContent);
      forEach(fixedContent, (element) => {
        let actualPadding = element.style.paddingRight;
        let calculatedPadding = window.getComputedStyle(element)['padding-right'];
        // console.log('actualPadding: ', actualPadding);
        // console.log('calculatedPadding: ', calculatedPadding);
        element.dataset.paddingRight = actualPadding;
        element.style.paddingRight = parseFloat(calculatedPadding) + this.scrollbarWidth + "px";
      }); // Adjust sticky content margin
      forEach(stickyContent, (element) => {
        let actualMargin = element.style.marginRight;
        let calculatedMargin = window.getComputedStyle(element)['margin-right'];
        element.dataset.marginRight = actualMargin;
        element.style.marginRight = parseFloat(calculatedMargin) - this.scrollbarWidth + "px";
      }); // Adjust body padding
      let actualPadding = document.body.style.paddingRight;
      let calculatedPadding = window.getComputedStyle(document.body)['padding-right'];
      document.body.dataset.paddingRight = actualPadding;
      document.body.style.paddingRight = parseFloat(calculatedPadding) + this.scrollbarWidth + "px";
    }
  }

  adjustDialog() {
    var isModalOverflowing = this.modalEl.scrollHeight > document.documentElement.clientHeight;

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

  show(passedRelatedTarget) {
    if (this.isTransitioning || this.isShown) {
      return;
    }
    if (hasClass(this.modalEl, 'fade')) {
      this.isTransitioning = true;
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
    Object.defineProperties(event, {
      relatedTarget: {
        value: passedRelatedTarget,
        writable: true,
      },
    });
    this.showBossModal.emit(event);
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
    this.showBackdrop(() => this.showElement(passedRelatedTarget));


  }

  showElement(passedRelatedTarget) {
    console.log('passedRelatedTarget: ', passedRelatedTarget);
    // TODO: show the modal!
    let transition = hasClass(this.modalEl, 'fade');
    if (!this.modalEl.parentNode || this.modalEl.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.appendChild(this.modalEl);
    }
    this.modalEl.style.display = 'block';

    this.modalEl.removeAttribute('aria-hidden');

    this.modalEl.scrollTop = 0;
    if (transition) {
      this.reflow(this.modalEl);
    }

    addClass(this.modalEl, 'show');




  }

  reflow(element) {
    // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    return element.offsetHeight;
  }

  showBackdrop(callback) {
    // TODO: show the backdrop and do the callback after the transition finishes
    callback();
  }

  @Method()
  modalToggleButtonClicked(relatedTarget) {
    console.log('modalToggleButtonClicked');
    // console.log('relatedTarget: ', relatedTarget);
    if (this.isShown) {
      this.hide();
    } else {
      this.show(relatedTarget);
    }
  }

  @Method()
  modal(modalOptions) {
    console.log('modalOptions: ', modalOptions);

    if (modalOptions === 'handleUpdate') {
      this.adjustDialog();
    }
  }

  render() {
    return ( <slot /> );
  }

}