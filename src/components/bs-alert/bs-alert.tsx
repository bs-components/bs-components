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

@Component({ tag: 'bs-alert', styleUrl: 'bs-alert.css', shadow: false })
export class BsAlert { // eslint-disable-line import/prefer-default-export
  @Element() alertEl: HTMLElement;

  @Prop() openEventName: string = 'open.bs.alert';
  @Prop() openedEventName: string = 'opened.bs.alert';
  @Prop() closeEventName: string = 'close.bs.alert';
  @Prop() closedEventName: string = 'closed.bs.alert';

  @Prop() noSelfRemoveFromDom: boolean = false;
  @Prop({ mutable: true }) dismiss: boolean = false;

  componentWillLoad() {
    if (this.dismiss === true) {
      if (!hasClass(this.alertEl, 'fade')) {
        removeClass(this.alertEl, 'show');
        if (!this.noSelfRemoveFromDom) {
          this.alertEl.parentNode.removeChild(this.alertEl);
        }
        return;
      }
      removeClass(this.alertEl, 'fade'); // no animation when setting the initial state
      removeClass(this.alertEl, 'show');
      const transitionDuration = getTransitionDurationFromElement(this.alertEl);
      setTimeout(() => {
        addClass(this.alertEl, 'fade');
        if (!this.noSelfRemoveFromDom) {
          this.alertEl.parentNode.removeChild(this.alertEl);
        }
      }, transitionDuration);
      this.close();
    }
  }

  @Listen('click')
  handleFocusOut(event) {
    const closestDismissEl = closest(event.target, '[data-dismiss="alert"]');
    if (closestDismissEl && this.alertEl.contains(closestDismissEl)) {
      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.close();
    }
  }

  destroyAlert() {
    if (!this.noSelfRemoveFromDom) {
      this.alertEl.parentNode.removeChild(this.alertEl);
    } else {
      addClass(this.alertEl, 'd-none');
    }
    window.requestAnimationFrame(() => { // trick to ensure all page updates are completed before running code
      window.requestAnimationFrame(() => { // discussed here:  https://www.youtube.com/watch?v=aCMbSyngXB4&t=11m
        setTimeout(() => {
          customEvent(this.alertEl, this.closedEventName);
        }, 0);
      });
    });
  }

  @Watch('dismiss')
  handleActiveWatch(newValue /* , oldValue */) {
    // console.log('newValue: ', newValue);
    if (newValue === true) {
      this.close();
      return;
    }
    this.open();
  }


  @Method()
  async close() {
    if (!hasClass(this.alertEl, 'show')) {
      return;
    }
    // console.log('close');
    const closeEvent = customEvent(this.alertEl, this.closeEventName);
    if (closeEvent.defaultPrevented) {
      return;
    }
    // console.log('made it');
    // debugger;

    removeClass(this.alertEl, 'show');
    // console.log('this.alertEl: ', this.alertEl);
    if (!hasClass(this.alertEl, 'fade')) {
      this.destroyAlert();
      return;
    }
    const transitionDuration = getTransitionDurationFromElement(this.alertEl);
    setTimeout(() => {
      this.destroyAlert();
    }, transitionDuration);
  }

  @Method()
  async open() {
    if (hasClass(this.alertEl, 'show') && !hasClass(this.alertEl, 'd-none')) {
      return;
    }
    const openEvent = customEvent(this.alertEl, this.openEventName);
    if (openEvent.defaultPrevented) {
      return;
    }
    if (this.noSelfRemoveFromDom) {
      removeClass(this.alertEl, 'd-none');
    }
    addClass(this.alertEl, 'show');
    const transitionDuration = getTransitionDurationFromElement(this.alertEl);
    setTimeout(() => {
      window.requestAnimationFrame(() => { // trick to ensure all page updates are completed before running code
        window.requestAnimationFrame(() => { // discussed here:  https://www.youtube.com/watch?v=aCMbSyngXB4&t=11m
          setTimeout(() => {
            customEvent(this.alertEl, this.openedEventName);
          }, 0);
        });
      });
    }, transitionDuration);
  }

  @Method()
  async alert(alertOptions): Promise<any> {
    if (_.size(alertOptions) === 0) {
      return this.alertEl;
    }
    if (alertOptions === 'close') {
      await this.close();
      return true;
    }
    if (alertOptions === 'open') {
      await this.open();
      return true;
    }
    if (typeof alertOptions === 'string') {
      throw new Error(`No method named "${alertOptions}"`);
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
