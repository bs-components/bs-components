// // http://youmightnotneedjquery.com/
// export default function triggerCustomEvent(element, eventName, payload = {}) {
//   let event;
//   if (window.CustomEvent) {
//     event = new CustomEvent(eventName, {detail: payload});
//   } else {
//     event = document.createEvent('CustomEvent');
//     event.initCustomEvent(eventName, true, true, payload);
//   }
//   element.dispatchEvent(event);
// }
