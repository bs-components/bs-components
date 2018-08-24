// http://youmightnotneedjquery.com/
export default function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    // eslint-disable-next-line prefer-template, no-param-reassign
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}
