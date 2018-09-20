import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Element,
  Method, // eslint-disable-line no-unused-vars
  // Watch, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import _size from 'lodash/size';
import _has from 'lodash/has';
import _toNumber from 'lodash/toNumber';
import _isNaN from 'lodash/isNaN';
// import _isElement from 'lodash/isElement';

import getUniqueId from '../../utilities/get-unique-id';
// import getTransitionDurationFromElement from '../../utilities/get-transition-duration-from-element';
import hasClass from '../../utilities/has-class';
// import addClass from '../../utilities/add-class';
// import reflow from '../../utilities/reflow';
// import customEvent from '../../utilities/custom-event';
import removeClass from '../../utilities/remove-class';
import closest from '../../utilities/closest';
import elementMatches from '../../utilities/element-matches';
import getTargetSelector from '../../utilities/get-target-selector';
import addClass from '../../utilities/add-class';

@Component({ tag: 'bs-scrollspy', styleUrl: 'bs-scrollspy.css', shadow: false })
export class BsScrollspy { // eslint-disable-line import/prefer-default-export
  @Element() scrollspyEl: HTMLElement;

  @Prop() showEventName: string = 'activate.bs.scrollspy';
  @Prop() useBodyForScrollElement: boolean = false;

  @Prop() defaults = {
    offset: 10,
    method: 'auto',
    target: '',
    // spy: 'scroll', // is this used anywhere?
  };

  @State() scrollElement: any;
  @State() config: any;
  @State() selector: string;
  @State() offsets: any;
  @State() targets: any;
  @State() activeTarget: any;
  @State() scrollHeight: any;


  componentWillLoad() {
    this.scrollElement = this.useBodyForScrollElement === true ? window : this.scrollspyEl;
    this.config = this.getConfig();
    // console.log('this.config', this.config);
    this.selector = `${this.config.target} .nav-link,${this.config.target} .list-group-item,${this.config.target} .dropdown-item`;
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;
    this.scrollElement.addEventListener('scroll', this.handleScrollElement);
    this.refresh();
    this.process();
  }

  componentDidUnload() {
    this.scrollElement.removeEventListener('scroll', this.handleScrollElement);
    this.scrollElement = null;
    this.config = null;
    this.selector = null;
    this.offsets = null;
    this.targets = null;
    this.activeTarget = null;
    this.scrollHeight = null;
  }

  handleScrollElement = () => this.process();

  getConfig() {
    const config: any = {};
    if (_has(this.scrollspyEl.dataset, 'target')) {
      if (typeof this.scrollspyEl.dataset.target !== 'string') {
        let id = (this.scrollspyEl.dataset.target as any).getAttribute('id');
        if (!id) {
          id = getUniqueId('scrollspy');
          (this.scrollspyEl.dataset.target as any).setAttribute('id', id);
        }
        config.target = `#${id}`;
      } else {
        config.target = this.scrollspyEl.dataset.target;
      }
    } else {
      config.target = this.defaults.target;
    }

    if (_has(this.scrollspyEl.dataset, 'offset')) {
      config.offset = _toNumber(this.scrollspyEl.dataset.offset);
    } else {
      config.offset = this.defaults.offset;
    }
    if (_isNaN(config.offset)) {
      config.offset = this.defaults.offset;
    }

    if (_has(this.scrollspyEl.dataset, 'method')) {
      config.method = this.scrollspyEl.dataset.method;
    } else {
      config.method = this.defaults.method;
    }

    if (_has(this.scrollspyEl.dataset, 'spy')) {
      config.spy = this.scrollspyEl.dataset.spy;
    }

    return config;
  }

  refresh() {
    const autoMethod = this.scrollElement === this.scrollElement.window ? 'offset' : 'position';
    const offsetMethod = this.config.method === 'auto' ? autoMethod : this.config.method;
    const offsetBase = offsetMethod === 'position' ? this.getScrollTop() : 0;
    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    // const container = document.querySelector(this.config.target);

    // console.log('container: ', container);
    // const containerBCR = container.getBoundingClientRect();
    // console.log('containerBCR: ', containerBCR);
    // const bottomOfContainer = containerBCR.top + containerBCR.height;
    // console.log('bottomOfContainer: ', bottomOfContainer);

    const scrollspyBCR = this.scrollspyEl.getBoundingClientRect();
    // console.log('scrollspyBCR: ', scrollspyBCR);


    const targets = Array.prototype.slice.call(document.querySelectorAll(this.selector));
    targets.map((element) => {
      let target;
      const targetSelector = getTargetSelector(element);

      // var targetSelector = Util.getSelectorFromElement(element);

      if (targetSelector) {
        target = document.querySelector(targetSelector);
      }

      if (target) {
        const targetBCR = target.getBoundingClientRect();

        if (targetBCR.width || targetBCR.height) {
          // console.log('target: ', target);
          // // console.log('element: ', element);
          // console.log('offsetMethod: ', offsetMethod);
          // console.log('offsetBase: ', offsetBase);
          // console.log('targetBCR: ', targetBCR);
          // const elementBCR = element.getBoundingClientRect();
          // console.log('elementBCR: ', elementBCR);
          //   {
          //     top: rect.top + document.body.scrollTop,
          //     left: rect.left + document.body.scrollLeft
          //   }

          const returnVal = [targetBCR.top - scrollspyBCR.top + offsetBase, targetSelector];
          // console.log('returnVal: ', returnVal);
          return returnVal;
          // TODO (fat): remove sketch reliance on jQuery position/offset
          // return [$$$1(target)[offsetMethod]().top + offsetBase, targetSelector];
        }
      }

      return null;
    })
      .filter(item => item)
      .sort((a, b) => a[0] - b[0])
      .forEach((item) => {
        this.offsets.push(item[0]);
        this.targets.push(item[1]);
      });
  }

  getScrollTop() {
    return this.scrollElement === window ? this.scrollElement.pageYOffset : this.scrollElement.scrollTop;
  }

  getScrollHeight() {
    return this.scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  }

  getOffsetHeight() {
    return this.scrollElement === window ? window.innerHeight : this.scrollElement.getBoundingClientRect().height;
  }

  process() {
    // console.log('process event: ', event);
    const scrollTop = this.getScrollTop() + this.config.offset;
    const scrollHeight = this.getScrollHeight();
    const maxScroll = this.config.offset + scrollHeight - this.getOffsetHeight();
    if (this.scrollHeight !== scrollHeight) {
      this.refresh();
    }
    // debugger;
    if (scrollTop >= maxScroll) {
      const target = this.targets[this.targets.length - 1];
      if (this.activeTarget !== target) {
        this.activate(target);
      }
      return;
    }
    if (this.activeTarget && scrollTop < this.offsets[0] && this.offsets[0] > 0) {
      this.activeTarget = null;
      this.clear();
      return;
    }
    const offsetLength = this.offsets.length;
    // console.log('offsetLength: ', offsetLength);

    // eslint-disable-next-line no-cond-assign
    // for (let i = offsetLength; i -= 1;) {
    for (let i = offsetLength - 1; i >= 0; i -= 1) {
      // console.log('i: ', i);
      const isActiveTarget = this.activeTarget !== this.targets[i] && scrollTop >= this.offsets[i] && (typeof this.offsets[i + 1] === 'undefined' || scrollTop < this.offsets[i + 1]);

      // console.log('this.targets[i]: ', this.targets[i]);

      if (isActiveTarget) {
        this.activate(this.targets[i]);
      }
    }
  }

  clear() {
    const nodeArr = Array.prototype.slice.call(document.querySelectorAll(this.selector));
    for (let j = 0; j < nodeArr.length; j += 1) {
      if (hasClass(nodeArr[j], 'active')) {
        removeClass(nodeArr[j], 'active');
      }
    }
  }

  static getLinkArr(target, container) {
    const activeTargetEl = document.querySelector(target);
    if (!activeTargetEl) {
      return [];
    }
    // console.log('activeTargetEl: ', activeTargetEl);
    const matchingLinks = [];
    const possibleLinkArr = Array.prototype.slice.call(container.querySelectorAll('.nav-link, .list-group-item, .dropdown-item'));
    // console.log('possibleLinkArr: ', possibleLinkArr);
    for (let j = 0; j < possibleLinkArr.length; j += 1) {
      const targetSelector = getTargetSelector(possibleLinkArr[j]);
      // console.log('targetSelector: ', targetSelector);
      if (targetSelector && elementMatches(activeTargetEl, targetSelector)) {
        matchingLinks.push(possibleLinkArr[j]);
      }
    }
    return matchingLinks;
  }

  static getParentArrBySelector(el, selector) {
    const returnArr = [];
    let closestMatching;
    // let currentEl = el;
    let currentEl = el.parentElement || el.parentNode;
    do {
      closestMatching = closest(currentEl, selector);
      if (closestMatching) {
        returnArr.push(closestMatching);
        currentEl = closestMatching.parentElement || closestMatching.parentNode;
      }
    } while (closestMatching);
    return returnArr;
  }

  activate(target) {
    this.activeTarget = target;
    this.clear();
    const container = document.querySelector(this.config.target);
    const linkArr = BsScrollspy.getLinkArr(target, container);
    console.log('linkArr: ', linkArr);


    for (let j = 0; j < linkArr.length; j += 1) {
      if (hasClass(linkArr[j], 'dropdown-item')) {
        const closestDropdown = closest(linkArr[j], '.dropdown');
        if (closestDropdown) {
          const dropdownToggle = closestDropdown.querySelector('.dropdown-toggle');
          if (dropdownToggle) {
            addClass(dropdownToggle, 'active');
          }
        }
        addClass(linkArr[j], 'active');
      } else {
        // Set triggered link as active
        addClass(linkArr[j], 'active');
        this.activateParents(linkArr[j]);

        // console.log('active linkArr[j]: ', linkArr[j]);


        // // const parentLinksAndItems = BsScrollspy.getParentArrBySelector(linkArr[j], '.nav-link, .list-group-item');
        // // console.log('parentLinksAndItems: ', parentLinksAndItems);

        // const parentSelector = '.nav, .list-group';
        // const firstParent = closest(linkArr[j], parentSelector);

        // const parentNavListGroupArr = BsScrollspy.getParentArrBySelector(linkArr[j], parentSelector);
        // console.log('parentNavListGroupArr: ', parentNavListGroupArr);

        // for (let x = 0; x < parentNavListGroupArr.length; x += 1) {
        //   console.log('parentNavListGroupArr[x]: ', parentNavListGroupArr[x]);
        //   const prevArr = Array.prototype.slice.call(parentNavListGroupArr[x].children);

        //   console.log('prevArr: ', prevArr);

        //   if (prevArr[0] && elementMatches(prevArr[0], '.nav-link, .list-group-item')) {
        //     // Handle special case when .nav-link is inside .nav-item
        //     addClass(prevArr[0], 'active');
        //   }

        //   if (prevArr[0] && elementMatches(prevArr[0], '.nav-item')) {
        //     // addClass(prevArr[0], 'active');
        //     const listChildren = Array.prototype.slice.call(prevArr[0].children);
        //     for (let y = 0; y < listChildren.length; y += 1) {
        //       if (elementMatches(listChildren[y], '.nav-link')) {
        //         // addClass(listChildren[y], 'active');
        //       }
        //     }
        //   }
        // }

        // // $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_LINKS + ", " + Selector.LIST_ITEMS).addClass(ClassName.ACTIVE); // Handle special case when .nav-link is inside .nav-item

        // // $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_ITEMS).children(Selector.NAV_LINKS).addClass(ClassName.ACTIVE);

        // // Set triggered links parents as active
        // // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      }

      // if ($link.hasClass(ClassName.DROPDOWN_ITEM)) {
      //   $link.closest(Selector.DROPDOWN).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
      //   $link.addClass(ClassName.ACTIVE);
      // } else {
      //   // Set triggered link as active
      //   $link.addClass(ClassName.ACTIVE);
      //   // Set triggered links parents as active
      //   // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

      //   $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_LINKS + ", " + Selector.LIST_ITEMS).addClass(ClassName.ACTIVE);

      //   // Handle special case when .nav-link is inside .nav-item
      //     $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_ITEMS).children(Selector.NAV_LINKS).addClass(ClassName.ACTIVE);
      // }


    }

    // TODO: event




    // $$$1(this._scrollElement).trigger(Event.ACTIVATE, {
    //   relatedTarget: target
    // });

  }

  activateParents(target) {
    // console.log('target: ', target);
    const container = document.querySelector(this.config.target);
    // console.log('container: ', container);
    const parentSelector = '.nav, .list-group';
    let currentEl = target;
    do {
      currentEl = currentEl.parentElement || currentEl.parentNode;
      currentEl = closest(currentEl, parentSelector);
      if (currentEl) {
        // console.log('currentEl: ', currentEl);
        // console.log('currentEl.previousElementSibling: ', currentEl.previousElementSibling);
        addClass(currentEl.previousElementSibling, 'active');
      }
    } while (currentEl && container.contains(currentEl));
  }


  @Method()
  scrollspy(scrollspyOptions = {}) {
    if (_size(scrollspyOptions) === 0) {
      return this.scrollspyEl;
    }
    if (scrollspyOptions === 'refresh') {
      // TODO:
      return true;
    }
    if (scrollspyOptions === 'getActiveTarget') {
      return this.activeTarget;
    }
    if (typeof scrollspyOptions === 'string') {
      throw new Error(`No method named "${scrollspyOptions}"`);
    }
    return null;
  }

  render() {
    return (<slot />);
  }
}
