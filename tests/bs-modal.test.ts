/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components modal tests').page('./bs-modal.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/button.js
// NOTE: Ideally, every test should leave the page state the same way it was before the test started.
// NOTE: times were increased to make up for testcafe platform compared tp jsdom based unit tests

// https://github.com/DevExpress/testcafe/tree/master/examples

const appendHtml = ClientFunction((innerHtml) => {
  const template = document.createElement('div');
  template.innerHTML = innerHtml;
  const el = template.firstChild;
  const parentEl = document.getElementById('page-container');
  if (parentEl.appendChild(el)) {
    return true;
  }
  return false;
});


const callModalById = ClientFunction((id, passedOption) => {
  const modalEl:any = document.getElementById(id);
  try {
    if (modalEl.modal(passedOption)) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
});

const callModalMethodAndWaitForEventById = ClientFunction((id, passedOption, eventName) => new Promise((resolve) => {
  const myTimeout = setTimeout(() => {
    // 6 seconds should be more than long enough for any reasonable real world transition
    // eslint-disable-next-line no-use-before-define
    document.getElementById(id).removeEventListener(eventName, handleEventHappened);
    resolve(false);
  }, 6000);
  const handleEventHappened = () => {
    clearTimeout(myTimeout);
    resolve(true);
  };
  document.getElementById(id).addEventListener(eventName, handleEventHappened, { once: true });
  const modalEl:any = document.getElementById(id);
  modalEl.modal(passedOption);
}));

const getStyleDisplayById = ClientFunction((id) => {
  // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
  const el = document.getElementById(id);
  const style = window.getComputedStyle(el);
  return style.display;
  // return (style.display === 'none');
});

const waitForEventOnElementById = ClientFunction((id, eventName) => new Promise((resolve) => {
  const myTimeout = setTimeout(() => {
    // 6 seconds should be more than long enough for any reasonable real world transition
    // eslint-disable-next-line no-use-before-define
    document.getElementById(id).removeEventListener(eventName, handleEventHappened);
    resolve(false);
  }, 6000);
  const handleEventHappened = () => {
    clearTimeout(myTimeout);
    resolve(true);
  };
  document.getElementById(id).addEventListener(eventName, handleEventHappened);
}));

const triggerRealClickByClass = ClientFunction((className) => {
  const elements = Array.prototype.slice.call(document.getElementsByClassName(className));
  for (let j = 0; j < elements.length; j += 1) {
    elements[j].click();
  }
  return true;
});

const triggerRealClickById = ClientFunction((id) => {
  const el = document.getElementById(id);
  el.click();
  return true;
});

const clickIdAndWaitForEventById = ClientFunction((clickId, listenId, eventName) => new Promise((resolve) => {
  const myTimeout = setTimeout(() => {
    // 6 seconds should be more than long enough for any reasonable real world transition
    // eslint-disable-next-line no-use-before-define
    document.getElementById(listenId).removeEventListener(eventName, handleEventHappened);
    resolve(false);
  }, 6000);
  const handleEventHappened = () => {
    clearTimeout(myTimeout);
    resolve(true);
  };
  document.getElementById(listenId).addEventListener(eventName, handleEventHappened, { once: true });
  const clickEl = document.getElementById(clickId);
  clickEl.click();
}));


const hasFocusById = ClientFunction((id) => {
  const el = document.getElementById(id);
  return el === document.activeElement;
});

const focusById = ClientFunction((id) => {
  document.getElementById(id).focus();
  return true;
});

const guaranteePageHasScrollBar = ClientFunction(() => {
  const el = document.getElementById('page-container');
  el.style.paddingBottom = '200vh';
  return true;
});

const getCssPaddingRightBody = ClientFunction(() => {
  const el = document.body;
  const style = window.getComputedStyle(el);
  return style.paddingRight;
});

const getScrollbarWidthById = ClientFunction((id) => {
  const el:any = document.getElementById(id);
  return el.getScrollbarWidth();
});

const setStyleBySelector = ClientFunction((selector, attribute, value) => {
  const el:any = document.querySelector(selector);
  el.style[attribute] = value;
  return true;
});

const removeAttributeBySelector = ClientFunction((selector, attribute) => {
  const el:any = document.querySelector(selector);
  el.removeAttribute(attribute);
  return true;
});

const getDatasetBySelector = ClientFunction((selector, attribute) => {
  const el:any = document.querySelector(selector);
  return el.dataset[attribute];
});

const getCssPaddingRightById = ClientFunction((id) => {
  const el = document.getElementById(id);
  const style = window.getComputedStyle(el);
  return style.paddingRight;
});

// test('modal method is defined', async (t) => {
//   const hasModalMethodById = ClientFunction((selector) => {
//     const myModalEl:any = document.getElementById(selector);
//     return typeof myModalEl.modal;
//   });
//   const modalHtml = '<bs-modal id="modal-method-test"></bs-modal>';
//   const myModal = Selector('#modal-method-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(await hasModalMethodById('modal-method-test')).eql('function');
// });

// test('should throw explicit error on undefined method', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect((await callModalById('modal-test', 'noMethod')).message).eql('No method named "noMethod"');
// });

// test('should return the element', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   // await t.expect(await Selector('#single-toggle-button').visible).ok();
//   const returnsItself = ClientFunction(() => {
//     const modal:any = document.getElementById('modal-test');
//     return modal === modal.modal();
//   });
//   await t.expect(await returnsItself()).ok();
// });


// test('should insert into dom when show method is called', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal inserted into dom');
// });


// test('should fire show event', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'show.bs.modal')).ok('show event fired');
// });


// test('should fire shown event', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   // await t.debug();
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('show event fired');
//   // await t.debug();
// });


// test('should not fire shown when show was prevented', async (t) => {
//   const shouldNotFireShownEventWhenShowWasPrevented = ClientFunction(() => new Promise((resolve) => {
//     const handleShowEvent = (event) => {
//       event.preventDefault();
//     };
//     const handleShownEvent = () => {
//       // eslint-disable-next-line no-use-before-define
//       clearTimeout(myTimeout);
//       document.getElementById('modal-test').removeEventListener('show.bs.modal', handleShowEvent);
//       document.getElementById('modal-test').removeEventListener('shown.bs.modal', handleShownEvent);
//       resolve(false);
//     };
//     document.getElementById('modal-test').addEventListener('show.bs.modal', handleShowEvent);
//     document.getElementById('modal-test').addEventListener('shown.bs.modal', handleShownEvent);
//     const modalEl:any = document.getElementById('modal-test');
//     modalEl.modal('show');
//     const myTimeout = setTimeout(() => {
//       // 6 seconds should be long enough for any transition
//       document.getElementById('modal-test').removeEventListener('show.bs.modal', handleShowEvent);
//       document.getElementById('modal-test').removeEventListener('shown.bs.modal', handleShownEvent);
//       resolve(true);
//     }, 6000);
//   }));

//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   console.log('\t...waiting for timeout on show event...');
//   await t.expect(await shouldNotFireShownEventWhenShowWasPrevented()).ok();
// });


// test('should hide modal when hide is called', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('hidden event fired');
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
// });


// test('should toggle when toggle is called', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'toggle', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'toggle', 'hidden.bs.modal')).ok('hidden event fired');
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
// });


// test('should remove from dom when click [data-dismiss="modal"]', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"><span class="close" data-dismiss="modal"/></bs-modal>';
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'toggle', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(triggerRealClickByClass('close')).ok();
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
// });


// test('should allow modal close with "backdrop:false"', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test" data-backdrop="false"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await myModalBackdrop.exists).notOk('no backdrop');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).notOk('still no backdrop');
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('hidden event fired');
//   await t.expect(await myModalBackdrop.exists).notOk('still no backdrop');
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
// });


// test('should close modal when clicking outside of modal-content', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"><div class="contents"/></bs-modal>';
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(triggerRealClickByClass('contents')).ok();
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(triggerRealClickById('modal-test')).ok();
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
// });


// test('should not close modal when clicking outside of modal-content if data-backdrop="false"', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test" data-backdrop="false"><div class="contents"/></bs-modal>';
//   const myModal = Selector('#modal-test');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(triggerRealClickById('modal-test')).ok().wait(1000); // waiting a sec to be sure
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('hidden event fired');
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
// });


// test('should close modal when escape key is pressed via keydown', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.pressKey('esc');
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
// });

// // 'should not close modal when escape key is pressed via keyup'
// // they only key listener in the bs-modal.tsx is keydown.
// // just not worried about this test should be impossible to fail

// test('should trigger hide event once when clicking outside of modal-content', async (t) => {
//   const clickIdAndGetHideEventCountById = ClientFunction((clickId, listenId, eventName) => new Promise((resolve) => {
//     let hideEventCount = 0;
//     const handleEventHappened = () => {
//       hideEventCount += 1;
//     };
//     setTimeout(() => {
//       // 6 seconds to count the hide events.
//       document.getElementById(listenId).removeEventListener(eventName, handleEventHappened);
//       resolve(hideEventCount);
//     }, 6000);
//     document.getElementById(listenId).addEventListener(eventName, handleEventHappened);
//     const clickEl = document.getElementById(clickId);
//     clickEl.click();
//   }));
//   const modalHtml = '<bs-modal id="modal-test"><div class="contents"/></bs-modal>';
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   console.log('\t...counting hide events for next 6 seconds (should only be one)...');
//   await t.expect(await clickIdAndGetHideEventCountById('modal-test', 'modal-test', 'hide.bs.modal')).eql(1, 'modal hide triggered once');
// });


// test('should remove aria-hidden attribute when shown, add it back when hidden', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test" aria-hidden="true"></bs-modal>';
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(await myModal.hasAttribute('aria-hidden')).ok();
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(await myModal.hasAttribute('aria-hidden')).notOk();
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
//   await t.expect(await myModal.hasAttribute('aria-hidden')).ok();
// });


// test('should close reopened modal with [data-dismiss="modal"] click', async (t) => {
//   const modalHtml = '<bs-modal id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></bs-modal>';
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(modalHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'toggle', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(triggerRealClickById('close')).ok();
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'toggle', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(triggerRealClickById('close')).ok();
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
// });


// test('should restore focus to toggling element when modal is hidden after having been opened via data-api', async (t) => {
//   const myHtml = `
//     <div>
//       <bs-button id="toggle-button" data-toggle="modal" data-target="#modal-test"></bs-button>
//       <bs-modal id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></bs-modal>
//     </div>`;
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(myHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   await t.expect(triggerRealClickById('toggle-button')).ok();
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(triggerRealClickById('close')).ok();
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
//   await t.expect(hasFocusById('toggle-button')).ok();
// });


// test('should not restore focus to toggling element if the associated show event gets prevented', async (t) => {
//   const shouldNotFireShownEventWhenShowWasPrevented = ClientFunction(() => new Promise((resolve) => {
//     const handleShowEvent = (event) => {
//       event.preventDefault();
//     };
//     const handleShownEvent = () => {
//       // eslint-disable-next-line no-use-before-define
//       clearTimeout(myTimeout);
//       document.getElementById('modal-test').removeEventListener('show.bs.modal', handleShowEvent);
//       document.getElementById('modal-test').removeEventListener('shown.bs.modal', handleShownEvent);
//       resolve(false);
//     };
//     document.getElementById('modal-test').addEventListener('show.bs.modal', handleShowEvent);
//     document.getElementById('modal-test').addEventListener('shown.bs.modal', handleShownEvent);
//     const clickEl = document.getElementById('toggle-button');
//     clickEl.click();
//     const myTimeout = setTimeout(() => {
//       // 6 seconds should be long enough for any transition
//       document.getElementById('modal-test').removeEventListener('show.bs.modal', handleShowEvent);
//       document.getElementById('modal-test').removeEventListener('shown.bs.modal', handleShownEvent);
//       resolve(true);
//     }, 6000);
//   }));

//   const myHtml = `
//     <div>
//       <bs-button id="toggle-button" data-toggle="modal" data-target="#modal-test"></bs-button>
//       <button id="other-btn"/>
//       <bs-modal id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></bs-modal>
//     </div>`;
//   const myModal = Selector('#modal-test');
//   const myModalBackdrop = Selector('.modal-backdrop');
//   await t.expect(await appendHtml(_.trim(myHtml))).ok();
//   await t.expect(await myModal.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline');
//   console.log('\t...waiting for timeout on show event...');
//   await t.expect(await shouldNotFireShownEventWhenShowWasPrevented()).ok();
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('inline', 'modal visiblity not changed');
//   await t.expect(await focusById('other-btn')).ok();
//   await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'toggle', 'shown.bs.modal')).ok('shown event fired');
//   await t.expect(await myModalBackdrop.exists).ok();
//   await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
//   await t.expect(triggerRealClickById('close')).ok();
//   await t.expect(await myModalBackdrop.exists).notOk();
//   await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
//   await t.expect(hasFocusById('toggle-button')).notOk();
// });


test('should adjust the inline padding of the modal when opening', async (t) => {
  const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
  const myModal = Selector('#modal-test');
  const myModalBackdrop = Selector('.modal-backdrop');
  await t.expect(guaranteePageHasScrollBar()).ok('there must be a scroll bar on the page');
  await t.expect(await appendHtml(_.trim(modalHtml))).ok();
  await t.expect(await myModal.exists).ok();
  await t.expect(getStyleDisplayById('modal-test')).eql('inline');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
  await t.expect(await myModalBackdrop.exists).ok();
  await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
  const expectedPadding = `${await getScrollbarWidthById('modal-test')}px`;
  const currentPadding = await getCssPaddingRightById('modal-test');
  await t.expect(currentPadding).eql(expectedPadding, 'modal padding should be adjusted while opening');
});


test('should adjust the inline body padding when opening and restore when closing', async (t) => {
  const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
  const myModal = Selector('#modal-test');
  const myModalBackdrop = Selector('.modal-backdrop');
  await t.expect(guaranteePageHasScrollBar()).ok('there must be a scroll bar on the page');
  await t.expect(await appendHtml(_.trim(modalHtml))).ok();
  await t.expect(await myModal.exists).ok();
  const originalPadding = await getCssPaddingRightBody();
  // console.log('originalPadding: ', originalPadding);
  await t.expect(getStyleDisplayById('modal-test')).eql('inline');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
  await t.expect(await myModalBackdrop.exists).ok();
  await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
  const expectedPadding = `${parseFloat(originalPadding) + await getScrollbarWidthById('modal-test')}px`;
  const afterShownPadding = await getCssPaddingRightBody();
  // console.log('expectedPadding: ', expectedPadding);
  // console.log('afterShownPadding: ', afterShownPadding);
  await t.expect(afterShownPadding).eql(expectedPadding, 'modal padding should be adjusted while opening');
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('hidden event fired');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
  const afterHiddenPadding = await getCssPaddingRightBody();
  await t.expect(afterHiddenPadding).eql(originalPadding, 'modal padding should be adjusted while opening');
  // console.log('afterHiddenPadding: ', afterHiddenPadding);
});


test('should store the original body padding in data-padding-right before showing', async (t) => {
  const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
  const myModal = Selector('#modal-test');
  const originalPadding = '0px';
  const myModalBackdrop = Selector('.modal-backdrop');
  await t.expect(guaranteePageHasScrollBar()).ok('there must be a scroll bar on the page');
  await t.expect(await appendHtml(_.trim(modalHtml))).ok();
  await t.expect(await myModal.exists).ok();
  await t.expect(setStyleBySelector('body', 'padding-right', originalPadding)).ok();
  await t.expect(getStyleDisplayById('modal-test')).eql('inline');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
  await t.expect(await myModalBackdrop.exists).ok();
  await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
  await t.expect(await getDatasetBySelector('body', 'paddingRight')).eql(originalPadding, 'original body padding should be stored in data-padding-right');
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('hidden event fired');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
  await t.expect(await getDatasetBySelector('body', 'paddingRight')).eql(undefined, 'data-padding-right should be cleared after closing');
  await t.expect(removeAttributeBySelector('body', 'style')).ok();
});


test('should not adjust the inline body padding when it does not overflow', async (t) => {
  const modalHtml = '<bs-modal id="modal-test"></bs-modal>';
  const myModal = Selector('#modal-test');
  const myModalBackdrop = Selector('.modal-backdrop');
  await t.expect(await appendHtml(_.trim(modalHtml))).ok();
  await t.expect(await myModal.exists).ok();
  const originalPadding = await getCssPaddingRightBody();
  // console.log('originalPadding: ', originalPadding);
  await t.expect(getStyleDisplayById('modal-test')).eql('inline');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
  await t.expect(await myModalBackdrop.exists).ok();
  await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
  const currentPadding = await getCssPaddingRightBody();
  // console.log('currentPadding: ', currentPadding);
  await t.expect(currentPadding).eql(originalPadding, 'body padding should not be adjusted');
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('hidden event fired');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
  await t.expect(guaranteePageHasScrollBar()).ok('adding a scrollbar');
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
  await t.expect(await myModalBackdrop.exists).ok();
  await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
  const withScrollbarPadding = await getCssPaddingRightBody();
  // console.log('withScrollbarPadding: ', withScrollbarPadding);
  await t.expect(withScrollbarPadding).notEql(originalPadding, 'body padding should be adjusted');
});


test('should adjust the inline padding of fixed elements when opening and restore when closing', async (t) => {
  const modalHtml = '<div id="my-fixed-top" class="fixed-top"><bs-modal id="modal-test"></bs-modal>';
  const myModal = Selector('#modal-test');
  const myFixedTop = Selector('#my-fixed-top');
  const myModalBackdrop = Selector('.modal-backdrop');
  await t.expect(await appendHtml(_.trim(modalHtml))).ok();
  await t.expect(await myFixedTop.exists).ok();
  await t.expect(await myModal.exists).ok();
  await t.expect(guaranteePageHasScrollBar()).ok('there must be a scroll bar on the page');
  const originalPadding = await getCssPaddingRightById('my-fixed-top');
  // console.log('originalPadding: ', originalPadding);
  await t.expect(getStyleDisplayById('modal-test')).eql('inline');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
  await t.expect(await myModalBackdrop.exists).ok();
  await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal visible');
  const expectedPadding = `${parseFloat(originalPadding) + await getScrollbarWidthById('modal-test')}px`;
  const afterShownPadding = await getCssPaddingRightById('my-fixed-top');
  // console.log('expectedPadding: ', expectedPadding);
  // console.log('afterShownPadding: ', afterShownPadding);
  await t.expect(afterShownPadding).eql(expectedPadding, 'fixed element padding should be adjusted while opening');
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('hidden event fired');
  await t.expect(await myModalBackdrop.exists).notOk();
  await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
  const afterHiddenPadding = await getCssPaddingRightById('my-fixed-top');
  // console.log('afterHiddenPadding: ', afterHiddenPadding);
  await t.expect(afterHiddenPadding).eql(originalPadding, 'fixed element padding should be reset after closing');
});

// https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/modal.js#L463
