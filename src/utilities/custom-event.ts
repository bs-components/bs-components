// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

// function preventDefault() {
//   Object.defineProperty(this,
//     'defaultPrevented', {
//       get: () => true,
//     });
// }

export default function customEvent(el, eventName, payload = {}, relatedTarget = {}) {
  const myPayload = Object.assign({}, { sentAtTime: new Date().getTime() }, payload);
  let event;
  if (typeof (window as any).CustomEvent === 'function') {
    event = new CustomEvent(eventName, { bubbles: true, cancelable: true, detail: myPayload });
  } else {
    const bubbles = true;
    const cancelable = true;
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, bubbles, cancelable, { detail: myPayload });
  }
  // Object.defineProperties(event, {
  //   preventDefault: {
  //     value: preventDefault,
  //     writable: true,
  //   },
  //   // bubbles: {
  //   //   value: true,
  //   //   writable: true,
  //   // },
  // });
  if (relatedTarget instanceof Element) {
    Object.defineProperties(event, {
      relatedTarget: {
        value: relatedTarget,
        writable: true,
      },
    });
  }
  // console.log('event: ', event);
  el.dispatchEvent(event);
  return event;
}
