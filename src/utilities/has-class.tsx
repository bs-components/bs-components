export default function hasClass(el, className) {
  return (" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(` ${className} `) > -1;
}
