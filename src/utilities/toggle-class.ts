// http://youmightnotneedjquery.com/
export default function toggleClass(el: HTMLElement, className) {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    const classes = el.className.split(' ');
    const existingIndex = classes.indexOf(className);
    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1);
    } else {
      classes.push(className);
    }
    // eslint-disable-next-line no-param-reassign
    el.className = classes.join(' ');
  }
}
