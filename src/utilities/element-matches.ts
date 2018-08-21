// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
// https://caniuse.com/#feat=matchesselector

// supports IE9+

export default function elementMatches(el, selector) {
  if (Element.prototype.msMatchesSelector) {
    return el.msMatchesSelector(selector);
  }
  return el.matches(selector);
}
