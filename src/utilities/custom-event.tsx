// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
// Supports IE9+

export default function customEvent(el, eventName, payload = {}) {
  let event;
  if (typeof (window as any).CustomEvent === "function") {
    event = new CustomEvent(eventName, { detail: payload });
  } else {
    const bubbles = true;
    const cancelable = true;
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, bubbles, cancelable, { detail: payload });
  }
  el.dispatchEvent(event);
}
