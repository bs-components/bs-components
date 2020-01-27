import {
  Component, // eslint-disable-line no-unused-vars
  Prop,
  State,
  Element,
  Method, h, // eslint-disable-line no-unused-vars
} from '@stencil/core';

import _ from 'lodash';
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

  @Prop() verboseLogging: boolean = false;

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
    if (_.has(overrideConfig, 'target')) {
      config.target = overrideConfig.target;
    } else if (_.has(this.scrollspyEl.dataset, 'target')) {
      config.target = this.scrollspyEl.dataset.target;
    } else {
      config.target = this.defaults.target;
    }
    if (_.isElement(config.target)) {
      let id = config.target.getAttribute('id');
      if (!id) {
        id = getUniqueId('scrollspy');
        config.target.setAttribute('id', id);
      }
      config.target = `#${id}`;
    }
    if (_.has(overrideConfig, 'offset')) {
      config.offset = _.toNumber(overrideConfig.offset);
    } else if (_.has(this.scrollspyEl.dataset, 'offset')) {
      config.offset = _.toNumber(this.scrollspyEl.dataset.offset);
    } else {
      config.offset = this.defaults.offset;
    }
    if (_.isNaN(config.offset)) {
      config.offset = this.defaults.offset;
    }
    if (_.has(overrideConfig, 'method')) {
      config.method = _.toNumber(overrideConfig.method);
    } else if (_.has(this.scrollspyEl.dataset, 'method')) {
      config.method = this.scrollspyEl.dataset.method;
    } else {
      config.method = this.defaults.method;
    }
    return config;
  }


  /**
   * Get an element's distance from the top of the Document.
   * @private
   * @param  {Node} elem The element
   * @return {Number}    Distance from the top in pixels
   */
  getOffsetTop(element) {
    // original: https://github.com/cferdinandi/gumshoe/blob/master/src/js/gumshoe.js#L138
    let location = 0;
    let currentEl = element;
    if (currentEl.offsetParent) {
      do {
        location += currentEl.offsetTop;
        currentEl = currentEl.offsetParent;
      } while (currentEl);
    } else {
      location = currentEl.offsetTop;
    }
    // location = location - headerHeight - this.offset;
    location -= this.config.offset;
    return location >= 0 ? location : 0;
  }

  refresh() {
    if (!this.config.target || _.size(this.config.target) === 0) {
      return;
    }
    // const autoMethod = this.scrollElement === this.scrollElement.window ? 'offset' : 'position';
    // const offsetMethod = this.config.method === 'auto' ? autoMethod : this.config.method;
    // const offsetBase = offsetMethod === 'position' ? this.getScrollTop() : 0;
    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();
    // const scrollspyBCR = this.scrollElement.getBoundingClientRect();
    const scrollElementTop = this.getOffsetTop(this.scrollElement);
    const container = document.querySelector(this.config.target);
    if (!container) {
      console.warn(`unable to locate target selector "${this.config.target}"`);
      return;
    }
    const targets = Array.prototype.slice.call(container.querySelectorAll(this.selector));
    targets.map((element) => {
      let target;
      const targetSelector = getTargetSelector(element);
      if (targetSelector) {
        target = document.querySelector(targetSelector);
      }
      if (target) {
        const targetBCR = target.getBoundingClientRect();
        if (targetBCR.width || targetBCR.height) {
          const targetTop = this.getOffsetTop(target);
          // const returnVal = [targetBCR.top - scrollspyBCR.top, targetSelector];
          const returnVal = [targetTop - scrollElementTop, targetSelector];
          // if (this.verboseLogging) {
          //   console.log('returnVal: ', returnVal);
          //   // console.log('this.getOffsetTop(this.scrollElement): ', this.getOffsetTop(this.scrollElement));
          //   // console.log('this.getOffsetTop(target): ', this.getOffsetTop(target));
          // }
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
    if (this.scrollElement === window) {
      return this.scrollElement.pageYOffset;
    }
    return this.scrollElement.scrollTop;
  }

  getScrollHeight() {
    return this.scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  }

  getOffsetHeight() {
    if (this.scrollElement === window) {
      return window.innerHeight;
    }
    return this.scrollElement.getBoundingClientRect().height;
  }

  isActiveTarget(index, scrollTop) {
    if (this.activeTarget === this.targets[index]) {
      return false;
    }
    if (scrollTop < this.offsets[index]) {
      return false;
    }
    if (typeof this.offsets[index + 1] === 'undefined') {
      if (this.verboseLogging) {
        console.log(`at end of list activating "${this.targets[index]}"`);
      }

      return true;
    }
    if (scrollTop < this.offsets[index + 1]) {
      if (this.verboseLogging) {
        console.log(`scrollTop of ${scrollTop} in range of ${this.offsets[index]} - ${this.offsets[index + 1]} activating "${this.targets[index]}"`);
      }
      return true;
    }
    return false;
  }

  process() {
    if (!this.config.target || _.size(this.config.target) === 0) {
      return;
    }
    const scrollTop = this.getScrollTop() + this.config.offset;
    if (this.verboseLogging) {
      console.log('scrollTop + offset = ', scrollTop);
    }
    const scrollHeight = this.getScrollHeight();
    const maxScroll = this.config.offset + scrollHeight - this.getOffsetHeight();
    const container = document.querySelector(this.config.target);
    if (!container) {
      return;
    }
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
    // console.log('this.offsets: ', this.offsets);
    // console.log('this.targets: ', this.targets);
    for (let i = _.size(this.offsets) - 1; i >= 0; i -= 1) {
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
    if (!this.config.target || _.size(this.config.target) === 0) {
      return;
    }
    let relatedTarget;
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
        relatedTarget = linkArr[j];
      } else {
        addClass(linkArr[j], 'active');
        relatedTarget = linkArr[j];
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
    customEvent(this.scrollElement, this.activateEventName, { target }, relatedTarget);
  }

  @Method()
  async scrollspy(scrollspyOptions = {}): Promise<HTMLElement | boolean> {
    if (_.size(scrollspyOptions) === 0) {
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
