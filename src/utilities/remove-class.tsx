// http://youmightnotneedjquery.com/
export default function removeClass(el, className) {
  console.log('el: ', el);
  console.log('className: ', className);
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}