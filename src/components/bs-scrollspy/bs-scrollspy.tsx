import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Element,
  Method, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import mezr from 'mezr';

import _size from 'lodash/size';
import _has from 'lodash/has';
import _toNumber from 'lodash/toNumber';
import _isNaN from 'lodash/isNaN';
import _isElement from 'lodash/isElement';

import getUniqueId from '../../utilities/get-unique-id';
import addClass from '../../utilities/add-class';
import hasClass from '../../utilities/has-class';
import removeClass from '../../utilities/remove-class';
import customEvent from '../../utilities/custom-event';
import closest from '../../utilities/closest';
import elementMatches from '../../utilities/element-matches';
import getTargetSelector from '../../utilities/get-target-selector';

@Component({ tag: 'bs-scrollspy', styleUrl: 'bs-scrollspy.css', shadow: false })
export class BsScrollspy { // eslint-disable-line import/prefer-default-export
  @Element() scrollspyEl: HTMLElement;

  @Prop() activateEventName: string = 'activate.bs.scrollspy';
  @Prop() useBodyForScrollElement: boolean = false;

  @Prop() defaults = {
    offset: 10,
    method: 'auto',
    target: '',
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
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.handleScrollElement);
    }
    this.scrollElement = null;
    this.config = null;
    this.selector = null;
    this.offsets = null;
    this.targets = null;
    this.activeTarget = null;
    this.scrollHeight = null;
  }

  handleScrollElement = () => this.process();

  getConfig(overrideConfig:any = {}) {
    const config: any = {};
    if (_has(overrideConfig, 'target')) {
      config.target = overrideConfig.target;
    } else if (_has(this.scrollspyEl.dataset, 'target')) {
      config.target = this.scrollspyEl.dataset.target;
    } else {
      config.target = this.defaults.target;
    }
    if (_isElement(config.target)) {
      let id = config.target.getAttribute('id');
      if (!id) {
        id = getUniqueId('scrollspy');
        config.target.setAttribute('id', id);
      }
      config.target = `#${id}`;
    }
    if (_has(overrideConfig, 'offset')) {
      config.offset = _toNumber(overrideConfig.offset);
    } else if (_has(this.scrollspyEl.dataset, 'offset')) {
      config.offset = _toNumber(this.scrollspyEl.dataset.offset);
    } else {
      config.offset = this.defaults.offset;
    }
    if (_isNaN(config.offset)) {
      config.offset = this.defaults.offset;
    }
    if (_has(overrideConfig, 'method')) {
      config.method = _toNumber(overrideConfig.method);
    } else if (_has(this.scrollspyEl.dataset, 'method')) {
      config.method = this.scrollspyEl.dataset.method;
    } else {
      config.method = this.defaults.method;
    }
    return config;
  }

  static getCalculatedStyle(elem, key) {
    return window.getComputedStyle(elem)[key];
  }

  // static calculatedPosition(elem) {
  //   const offset = elem.offset();
  //   // Account for the *real* offset parent, which can be the document or its root element
  //   // when a statically positioned element is identified
  //   const doc = elem.ownerDocument;
  //   let offsetParent = elem.offsetParent || doc.documentElement;
  //   while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && BsScrollspy.getCalculatedStyle(offsetParent, 'position') === 'static') {
  //     offsetParent = offsetParent.parentNode;
  //   }
  //   if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {

  //     // Incorporate borders into its offset, since they are outside its content origin
  //     const parentOffset = offsetParent.offset(); // https://github.com/jquery/jquery/blob/e743cbd28553267f955f71ea7248377915613fd9/src/offset.js#L74

  //     parentOffset.top += BsScrollspy.getCalculatedStyle(offsetParent, 'borderTopWidth');
  //     parentOffset.left += BsScrollspy.getCalculatedStyle(offsetParent, 'borderLeftWidth');
  //   }
  // }

  // static findPos(obj) {
  //   let curleft = 0;
  //   let curtop = 0;
  //   if (obj.offsetParent) {
  //     do {
  //       curleft += obj.offsetLeft;
  //       curtop += obj.offsetTop;
  //     } while (obj = obj.offsetParent);
  //   }
  //   return [curleft, curtop];
  // }


  static offset(el) {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }


  refresh() {
    if (!this.config.target || _size(this.config.target) === 0) {
      return;
    }
    const autoMethod = this.scrollElement === this.scrollElement.window ? 'offset' : 'position';
    const offsetMethod = this.config.method === 'auto' ? autoMethod : this.config.method;
    const offsetBase = offsetMethod === 'position' ? this.getScrollTop() : 0;
    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();
    // const scrollspyBCR = this.scrollspyEl.getBoundingClientRect();
    const container = document.querySelector(this.config.target);
    const targets = Array.prototype.slice.call(container.querySelectorAll(this.selector));
    const scrollspyCalculatedPosition = BsScrollspy.getCalculatedStyle(this.scrollspyEl, 'position');
    targets.map((element) => {
      let target;
      const targetSelector = getTargetSelector(element);
      if (targetSelector) {
        target = document.querySelector(targetSelector);
      }
      if (target) {
        const targetBCR = target.getBoundingClientRect();
        if (targetBCR.width || targetBCR.height) {
          // const returnVal = [targetBCR.top - scrollspyBCR.top + offsetBase, targetSelector];

          // https://github.com/jquery/jquery/blob/e743cbd28553267f955f71ea7248377915613fd9/src/offset.js#L20

          // https://github.com/jquery/jquery/blob/e743cbd28553267f955f71ea7248377915613fd9/src/offset.js#L110

          // const returnVal = [targetBCR.top + offsetBase, targetSelector];

          let myOffsets;
          if (scrollspyCalculatedPosition === 'relative') {
            myOffsets = mezr.offset(target, this.scrollspyEl);
          } else if (scrollspyCalculatedPosition === 'static') {
            myOffsets = targetBCR;
          } else {
            // https://github.com/jquery/jquery/blob/e743cbd28553267f955f71ea7248377915613fd9/src/offset.js#L122
            myOffsets = targetBCR;
          }


          const returnVal = [myOffsets.top + offsetBase, targetSelector];


          console.log('target: ', target);


          console.log("BsScrollspy.getCalculatedStyle(target, 'position'): ", BsScrollspy.getCalculatedStyle(target, 'position'));
          console.log("BsScrollspy.getCalculatedStyle(this.scrollspyEl, 'position'): ", BsScrollspy.getCalculatedStyle(this.scrollspyEl, 'position'));


          // console.log('target.offsetParent: ', target.offsetParent);
          // // console.log('target.getOffsetParent(): ', target.getOffsetParent());

          // console.log('BsScrollspy.offset(target): ', BsScrollspy.offset(target));

          // console.log('targetBCR: ', targetBCR);


          // // console.log("mezr.offset(target, 'content'): ", mezr.offset(target, 'content'));
          // // console.log("mezr.offset(target, 'padding'): ", mezr.offset(target, 'padding'));
          // // console.log("mezr.offset(target, 'scroll'): ", mezr.offset(target, 'scroll'));
          // // console.log("mezr.offset(target, 'border'): ", mezr.offset(target, 'border'));
          // // console.log('mezr.offset(target, this.scrollspyEl): ', mezr.offset(target, this.scrollspyEl));

          // console.log('mezr.offset(target, this.scrollspyEl): ', mezr.offset(target, this.scrollspyEl));

          // // console.log('mezr.offset(target, mezr.containingBlock(this.scrollspyEl)): ', mezr.offset(target, mezr.containingBlock(this.scrollspyEl)));

          // console.log('mezr.offset(target, mezr.containingBlock(this.scrollspyEl, "absolute")): ', mezr.offset(target, mezr.containingBlock(this.scrollspyEl, 'absolute')));


          // // console.log('mezr.offset(target, mezr.containingBlock(target, "fixed")): ', mezr.offset(target, mezr.containingBlock(target, 'fixed')));


          // console.log('target.offsetTop: ', target.offsetTop);
          // // console.log('target.position(): ', target.position());
          // console.log('window.getComputedStyle(target).top: ', window.getComputedStyle(target).top);
          // console.log('window.getComputedStyle(target).position: ', window.getComputedStyle(target).position);
          // // console.log('window.getComputedStyle(target).offset: ', (window.getComputedStyle(target) as any).offset);


          // console.log('targetBCR.top - scrollspyBCR.top: ', targetBCR.top - scrollspyBCR.top);
          // console.log('offsetMethod: ', offsetMethod);
          // console.log('offsetBase: ', offsetBase);


          console.log('returnVal: ', returnVal);
          return returnVal;
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

  isActiveTarget(index, scrollTop) {
    if (this.activeTarget === this.targets[index]) {
      return false;
    }
    if (scrollTop < this.offsets[index]) {
      return false;
    }
    if (typeof this.offsets[index + 1] === 'undefined') {
      return true;
    }
    if (scrollTop < this.offsets[index + 1]) {
      return true;
    }
    return false;
  }

  process() {
    if (!this.config.target || _size(this.config.target) === 0) {
      return;
    }
    const scrollTop = this.getScrollTop() + this.config.offset;
    const scrollHeight = this.getScrollHeight();
    const maxScroll = this.config.offset + scrollHeight - this.getOffsetHeight();
    const container = document.querySelector(this.config.target);
    if (this.scrollHeight !== scrollHeight) {
      this.refresh();
    }
    if (scrollTop >= maxScroll) {
      const target = this.targets[this.targets.length - 1];
      if (this.activeTarget !== target) {
        this.activate(target);
      }
      return;
    }
    if (this.activeTarget && scrollTop < this.offsets[0] && this.offsets[0] > 0) {
      this.activeTarget = null;
      this.clear(container);
      return;
    }
    for (let i = _size(this.offsets) - 1; i >= 0; i -= 1) {
      if (this.isActiveTarget(i, scrollTop)) {
        this.activate(this.targets[i]);
      }
    }
  }

  clear(container) {
    const nodeArr = Array.prototype.slice.call(container.querySelectorAll(this.selector));
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
    const matchingLinks = [];
    const possibleLinkArr = Array.prototype.slice.call(container.querySelectorAll('.nav-link, .list-group-item, .dropdown-item'));
    for (let j = 0; j < possibleLinkArr.length; j += 1) {
      const targetSelector = getTargetSelector(possibleLinkArr[j]);
      if (targetSelector && elementMatches(activeTargetEl, targetSelector)) {
        matchingLinks.push(possibleLinkArr[j]);
      }
    }
    return matchingLinks;
  }

  static getParentArrBySelector(el, selector) {
    const returnArr = [];
    let closestMatching;
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
    if (!this.config.target || _size(this.config.target) === 0) {
      return;
    }
    this.activeTarget = target;
    const container = document.querySelector(this.config.target);
    this.clear(container);
    const linkArr = BsScrollspy.getLinkArr(target, container);
    for (let j = 0; j < linkArr.length; j += 1) {
      if (hasClass(linkArr[j], 'dropdown-item')) {
        const closestDropdown = closest(linkArr[j], '.dropdown');
        if (closestDropdown && container.contains(closestDropdown)) {
          const dropdownToggle = closestDropdown.querySelector('.dropdown-toggle');
          if (dropdownToggle) {
            addClass(dropdownToggle, 'active');
          }
        }
        addClass(linkArr[j], 'active');
      } else {
        addClass(linkArr[j], 'active');
        const parentSelector = '.nav, .list-group';
        let currentEl = linkArr[j];
        do {
          currentEl = currentEl.parentElement || currentEl.parentNode;
          currentEl = closest(currentEl, parentSelector);
          const prevEl = currentEl ? currentEl.previousElementSibling : null;
          if (currentEl && prevEl) {
            if (elementMatches(prevEl, '.nav-link, .list-group-item')) {
              addClass(currentEl.previousElementSibling, 'active');
            }
            // Handle special case when .nav-link is inside .nav-item
            if (elementMatches(prevEl, '.nav-item')) {
              const listItemChildren = Array.prototype.slice.call(prevEl.children);
              for (let x = 0; x < listItemChildren.length; x += 1) {
                if (elementMatches(listItemChildren[x], '.nav-link')) {
                  addClass(listItemChildren[x], 'active');
                }
              }
            }
          }
        } while (currentEl && container.contains(currentEl));
      }
    }
    customEvent(this.scrollElement, this.activateEventName, {}, target);
  }

  @Method()
  scrollspy(scrollspyOptions = {}) {
    if (_size(scrollspyOptions) === 0) {
      return this.scrollspyEl;
    }
    if (scrollspyOptions === 'refresh') {
      this.refresh();
      return true;
    }
    if (scrollspyOptions === 'getActiveTarget') {
      return this.activeTarget;
    }
    if (typeof scrollspyOptions === 'object') {
      this.config = this.getConfig(scrollspyOptions);
      this.refresh();
      this.process();
      return true;
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
