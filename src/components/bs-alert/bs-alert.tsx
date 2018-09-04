import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  Listen, // eslint-disable-line no-unused-vars
  Element,
  Method, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import _size from 'lodash/size';

import closest from '../../utilities/closest';
import customEvent from '../../utilities/custom-event';
import removeClass from '../../utilities/remove-class';
import hasClass from '../../utilities/has-class';
import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';

@Component({ tag: 'bs-alert', styleUrl: 'bs-alert.css', shadow: false })
export class BsAlert { // eslint-disable-line import/prefer-default-export
  @Element() alertEl: HTMLElement;

  @Prop() closeEventName: string = 'close.bs.alert';
  @Prop() closedEventName: string = 'closed.bs.alert';

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
    this.alertEl.parentNode.removeChild(this.alertEl);
    customEvent(this.alertEl, this.closedEventName);
  }

  @Method()
  close() {
    const closeEvent = customEvent(this.alertEl, this.closeEventName);
    if (closeEvent.defaultPrevented) {
      return;
    }
    removeClass(this.alertEl, 'show');
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
  alert(alertOptions) {
    if (_size(alertOptions) === 0) {
      return this.alertEl;
    }
    if (alertOptions === 'close') {
      this.close();
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
