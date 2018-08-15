import { Component, Prop, Element, Method } from '@stencil/core';

// import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
// import hasClass from '../../utilities/has-class';
// import addClass from '../../utilities/add-class';
// import removeClass from '../../utilities/remove-class';
// import reflow from '../../utilities/reflow';
// import customEvent from '../../utilities/custom-event';
// import getConfigBoolean from '../../utilities/get-config-boolean';


@Component({
  tag: 'bs-tooltip',
  shadow: false
})
export class BsTooltip {
  @Element() tooltipEl: HTMLElement;

  @Prop() selector: string = '';

  @Prop() showEventName: string = 'show.bs.tooltip';
  @Prop() shownEventName: string = 'shown.bs.tooltip';
  @Prop() hideEventName: string = 'hide.bs.tooltip';
  @Prop() hiddenEventName: string = 'hidden.bs.tooltip';
  @Prop() insertedEventName: string = 'inserted.bs.tooltip';


  @Method()
  tooltip(tooltipOptions = {}) {
    console.log('tooltipOptions: ', tooltipOptions);
  }

  render() {
    return ( <slot /> );
  }
}