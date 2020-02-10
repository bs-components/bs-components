import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  Listen, // eslint-disable-line no-unused-vars
  Element,
  Method, // eslint-disable-line no-unused-vars
  Watch, h, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import _ from 'lodash';
import closest from '../../utilities/closest';
import customEvent from '../../utilities/custom-event';
import removeClass from '../../utilities/remove-class';
import addClass from '../../utilities/add-class';
import hasClass from '../../utilities/has-class';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';

@Component({tag: 'bs-toast', styleUrl: 'bs-toast.css', shadow: false})
export class BsToast { // eslint-disable-line import/prefer-default-export
  @Element() toastEl: HTMLElement;

  @Prop() showEventName: string = 'show.bs.toast';
  @Prop() shownEventName: string = 'shown.bs.toast';
  @Prop() hideEventName: string = 'hide.bs.toast';
  @Prop() hiddenEventName: string = 'hidden.bs.toast';

  @Prop() noSelfRemoveFromDom: boolean = true;
  @Prop({mutable: true}) autohide: boolean = true;
  @Prop({mutable: true}) delay: number = 500;

  componentWillLoad() {
  }

  @Listen('click')
  handleFocusOut(event) {
    const closestDismissEl = closest(event.target, '[data-dismiss="toast"]');
    if (closestDismissEl && this.toastEl.contains(closestDismissEl)) {
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.hide();
    }
  }

  @Listen('shown.bs.toast')
  handleShown() {
    if(!this.autohide)
      return;

    setTimeout(() => this.hide(), this.delay);
  }

  destroyToast() {
    if (!this.noSelfRemoveFromDom) {
      this.toastEl.parentNode.removeChild(this.toastEl);
    }
    window.requestAnimationFrame(() => { // trick to ensure all page updates are completed before running code
      window.requestAnimationFrame(() => { // discussed here:  https://www.youtube.com/watch?v=aCMbSyngXB4&t=11m
        setTimeout(() => {
          customEvent(this.toastEl, this.hiddenEventName);
        }, 0);
      });
    });
  }

  @Method()
  async hide() {
    if (!hasClass(this.toastEl, 'show')) {
      return;
    }

    const closeEvent = customEvent(this.toastEl, this.hideEventName);
    if (closeEvent.defaultPrevented) {
      return;
    }

    removeClass(this.toastEl, 'show');

    if (!hasClass(this.toastEl, 'fade')) {
      this.destroyToast();
      return;
    }
    const transitionDuration = getTransitionDurationFromElement(this.toastEl);
    setTimeout(() => {
      this.destroyToast();
    }, transitionDuration);
  }

  @Method()
  async show() {
    if (hasClass(this.toastEl, 'show')) {
      return;
    }

    const openEvent = customEvent(this.toastEl, this.showEventName);

    if (openEvent.defaultPrevented) {
      return;
    }

    removeClass(this.toastEl, 'hide');
    addClass(this.toastEl, 'show');
    const transitionDuration = getTransitionDurationFromElement(this.toastEl);
    setTimeout(() => {
      window.requestAnimationFrame(() => { // trick to ensure all page updates are completed before running code
        window.requestAnimationFrame(() => { // discussed here:  https://www.youtube.com/watch?v=aCMbSyngXB4&t=11m
          setTimeout(() => {
            customEvent(this.toastEl, this.shownEventName);
          }, 0);
        });
      });
    }, transitionDuration);
  }

  @Method()
  async toast(toastOptions): Promise<any> {
    if (_.size(toastOptions) === 0) {
      return this.toastEl;
    }
    if (toastOptions === 'hide') {
      await this.hide();
      return true;
    }
    if (toastOptions === 'show') {
      await this.show();
      return true;
    }
    if (toastOptions === 'dispose') {
      await this.hide();
      return true;
    }
    if (typeof toastOptions === 'string') {
      throw new Error(`No method named "${toastOptions}"`);
    }
    return null;
  }

  render() {
    return (<slot/>);
  }
}
