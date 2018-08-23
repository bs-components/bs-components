// http://youmightnotneedjquery.com/
export default function hasClass(el, className) {
  // console.log('el: ', el);
  // console.log('className: ', className);
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}
