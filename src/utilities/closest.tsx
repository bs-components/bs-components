// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
// supports IE9+

import elementMatches from './element-matches';

export default function closest(element, selectors) {
  if (Element.prototype.closest) {
    return element.closest(selectors);
  } else {
    let currentEl = element;
    if (!document.documentElement.contains(currentEl)) {
      return null;
    }
    do {
      if (elementMatches(currentEl, selectors)) {
        return currentEl;
      }
      currentEl = currentEl.parentElement || currentEl.parentNode;
    } while (currentEl !== null && currentEl.nodeType === 1);
    return null;
  }
}
