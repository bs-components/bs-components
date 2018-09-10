/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
/* tslint:disable */

import '@stencil/core';




declare global {
  interface HTMLElement {
    componentOnReady?: () => Promise<this | null>;
  }

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}

  namespace StencilComponents {

    interface BsAlert {
      'alert': (alertOptions: any) => true | HTMLElement;
      'close': () => void;
      'closeEventName': string;
      'closedEventName': string;
      'dismiss': boolean;
      'noSelfRemoveFromDom': boolean;
      'open': () => void;
      'openEventName': string;
      'openedEventName': string;
    }

    interface BsButton {
      'active': boolean;
      'button': (buttonOptions?: any) => true | HTMLElement;
      'changeEventName': string;
      'dropdown': (dropdownOptions?: any) => any;
      'tabindex': string|number;
    }

    interface BsCollapse {
      'collapse': (collapseOptions: any, relatedTarget?: any) => true | HTMLElement;
      'hiddenEventName': string;
      'hideEventName': string;
      'showEventName': string;
      'shownEventName': string;
    }

    interface BsDropdown {
      'config': any;
      'defaults': any;
      'dropdown': (dropdownOptions?: {}, relatedTarget?: any) => true | HTMLElement;
      'hiddenEventName': string;
      'hideEventName': string;
      'show': boolean;
      'showEventName': string;
      'shownEventName': string;
    }

    interface BsModal {
      'getScrollbarWidth': () => number;
      'hiddenEventName': string;
      'hideEventName': string;
      'modal': (modalOptions?: {}, relatedTarget?: any) => true | HTMLElement;
      'showEventName': string;
      'shownEventName': string;
    }

    interface BsTooltip {
      'bsContent': string;
      'bsTitle': string;
      'config': any;
      'defaults': any;
      'hiddenEventName': string;
      'hideEventName': string;
      'insertedEventName': string;
      'noEnableOnLoad': boolean;
      'popover': (popoverOptions?: any) => boolean | HTMLElement;
      'showEventName': string;
      'shownEventName': string;
      'tabindex': string;
      'tooltip': (tooltipOptions?: any) => boolean | HTMLElement;
    }
  }


    interface HTMLBsAlertElement extends StencilComponents.BsAlert, HTMLStencilElement {}

    var HTMLBsAlertElement: {
      prototype: HTMLBsAlertElement;
      new (): HTMLBsAlertElement;
    };
    

    interface HTMLBsButtonElement extends StencilComponents.BsButton, HTMLStencilElement {}

    var HTMLBsButtonElement: {
      prototype: HTMLBsButtonElement;
      new (): HTMLBsButtonElement;
    };
    

    interface HTMLBsCollapseElement extends StencilComponents.BsCollapse, HTMLStencilElement {}

    var HTMLBsCollapseElement: {
      prototype: HTMLBsCollapseElement;
      new (): HTMLBsCollapseElement;
    };
    

    interface HTMLBsDropdownElement extends StencilComponents.BsDropdown, HTMLStencilElement {}

    var HTMLBsDropdownElement: {
      prototype: HTMLBsDropdownElement;
      new (): HTMLBsDropdownElement;
    };
    

    interface HTMLBsModalElement extends StencilComponents.BsModal, HTMLStencilElement {}

    var HTMLBsModalElement: {
      prototype: HTMLBsModalElement;
      new (): HTMLBsModalElement;
    };
    

    interface HTMLBsTooltipElement extends StencilComponents.BsTooltip, HTMLStencilElement {}

    var HTMLBsTooltipElement: {
      prototype: HTMLBsTooltipElement;
      new (): HTMLBsTooltipElement;
    };
    

  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {
    'bs-alert': JSXElements.BsAlertAttributes;
    'bs-button': JSXElements.BsButtonAttributes;
    'bs-collapse': JSXElements.BsCollapseAttributes;
    'bs-dropdown': JSXElements.BsDropdownAttributes;
    'bs-modal': JSXElements.BsModalAttributes;
    'bs-tooltip': JSXElements.BsTooltipAttributes;
    }
  }

  namespace JSXElements {

    export interface BsAlertAttributes extends HTMLAttributes {
      'closeEventName'?: string;
      'closedEventName'?: string;
      'dismiss'?: boolean;
      'noSelfRemoveFromDom'?: boolean;
      'openEventName'?: string;
      'openedEventName'?: string;
    }

    export interface BsButtonAttributes extends HTMLAttributes {
      'active'?: boolean;
      'changeEventName'?: string;
      'tabindex'?: string|number;
    }

    export interface BsCollapseAttributes extends HTMLAttributes {
      'hiddenEventName'?: string;
      'hideEventName'?: string;
      'showEventName'?: string;
      'shownEventName'?: string;
    }

    export interface BsDropdownAttributes extends HTMLAttributes {
      'config'?: any;
      'defaults'?: any;
      'hiddenEventName'?: string;
      'hideEventName'?: string;
      'show'?: boolean;
      'showEventName'?: string;
      'shownEventName'?: string;
    }

    export interface BsModalAttributes extends HTMLAttributes {
      'hiddenEventName'?: string;
      'hideEventName'?: string;
      'showEventName'?: string;
      'shownEventName'?: string;
    }

    export interface BsTooltipAttributes extends HTMLAttributes {
      'bsContent'?: string;
      'bsTitle'?: string;
      'config'?: any;
      'defaults'?: any;
      'hiddenEventName'?: string;
      'hideEventName'?: string;
      'insertedEventName'?: string;
      'noEnableOnLoad'?: boolean;
      'showEventName'?: string;
      'shownEventName'?: string;
      'tabindex'?: string;
    }
  }

  interface HTMLElementTagNameMap {
    'bs-alert': HTMLBsAlertElement
    'bs-button': HTMLBsButtonElement
    'bs-collapse': HTMLBsCollapseElement
    'bs-dropdown': HTMLBsDropdownElement
    'bs-modal': HTMLBsModalElement
    'bs-tooltip': HTMLBsTooltipElement
  }

  interface ElementTagNameMap {
    'bs-alert': HTMLBsAlertElement;
    'bs-button': HTMLBsButtonElement;
    'bs-collapse': HTMLBsCollapseElement;
    'bs-dropdown': HTMLBsDropdownElement;
    'bs-modal': HTMLBsModalElement;
    'bs-tooltip': HTMLBsTooltipElement;
  }
}
declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;