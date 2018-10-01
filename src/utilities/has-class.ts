// http://youmightnotneedjquery.com/
export default function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  }
  // eslint-disable-next-line prefer-template
  return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}
