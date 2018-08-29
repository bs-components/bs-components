/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components popover tests').page('./bs-popover.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/popover.js
// NOTE: Ideally, every test should leave the page state the same way it was before the test started.
// NOTE: times were increased to make up for testcafe platform compared tp jsdom based unit tests

// https://github.com/DevExpress/testcafe/tree/master/examples
// https://marketplace.visualstudio.com/items?itemName=hdorgeval.testcafe-snippets#user-content-tc-selector-with-options

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

// const appendHtmlToHead = ClientFunction((innerHtml) => {
//   const template = document.createElement('div');
//   template.innerHTML = innerHtml;
//   const el = template.firstChild;
//   if (document.head.appendChild(el)) {
//     return true;
//   }
//   return false;
// });


const callPopoverById = ClientFunction((id, passedOption) => {
  const el:any = document.getElementById(id);
  try {
    if (el.popover(passedOption)) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
});

// const callModalMethodAndWaitForEventById = ClientFunction((id, passedOption, eventName) => new Promise((resolve) => {
//   const myTimeout = setTimeout(() => {
//     // 6 seconds should be more than long enough for any reasonable real world transition
//     // eslint-disable-next-line no-use-before-define
//     document.getElementById(id).removeEventListener(eventName, handleEventHappened);
//     resolve(false);
//   }, 6000);
//   const handleEventHappened = () => {
//     clearTimeout(myTimeout);
//     resolve(true);
//   };
//   document.getElementById(id).addEventListener(eventName, handleEventHappened, { once: true });
//   const modalEl:any = document.getElementById(id);
//   modalEl.modal(passedOption);
// }));

// const getStyleDisplayById = ClientFunction((id) => {
//   // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
//   const el = document.getElementById(id);
//   const style = window.getComputedStyle(el);
//   return style.display;
//   // return (style.display === 'none');
// });


// const triggerRealClickByClass = ClientFunction((className) => {
//   const elements = Array.prototype.slice.call(document.getElementsByClassName(className));
//   for (let j = 0; j < elements.length; j += 1) {
//     elements[j].click();
//   }
//   return true;
// });

// const triggerRealClickById = ClientFunction((id) => {
//   const el = document.getElementById(id);
//   el.click();
//   return true;
// });


// const hasFocusById = ClientFunction((id) => {
//   const el = document.getElementById(id);
//   return el === document.activeElement;
// });

// const focusById = ClientFunction((id) => {
//   document.getElementById(id).focus();
//   return true;
// });

// const guaranteePageHasScrollBar = ClientFunction(() => {
//   const el = document.getElementById('page-container');
//   el.style.paddingBottom = '200vh';
//   return true;
// });


// const getScrollbarWidthById = ClientFunction((id) => {
//   const el:any = document.getElementById(id);
//   return el.getScrollbarWidth();
// });

// const setStyleBySelector = ClientFunction((selector, attribute, value) => {
//   const el:any = document.querySelector(selector);
//   el.style[attribute] = value;
//   return true;
// });

// const removeAttributeBySelector = ClientFunction((selector, attribute) => {
//   const el:any = document.querySelector(selector);
//   el.removeAttribute(attribute);
//   return true;
// });

const getDatasetBySelector = ClientFunction((selector, attribute) => {
  const el:any = document.querySelector(selector);
  return el.dataset[attribute];
});

// const getCssPaddingRightById = ClientFunction((id) => {
//   const el = document.getElementById(id);
//   const style = window.getComputedStyle(el);
//   return style.paddingRight;
// });

// const getCssComputedStyleBySelector = ClientFunction((selector, styleName) => {
//   const el = document.querySelector(selector);
//   const style = window.getComputedStyle(el);
//   return style[styleName];
// });

// const getInlineCssStyleBySelector = ClientFunction((selector, styleName) => {
//   const el = document.querySelector(selector);
//   // const style = window.getComputedStyle(el);
//   return el.style[styleName];
// });

// const triggerKeyboardEventBySelector = ClientFunction((selector, eventType, keyCode) => {
//   const el = document.querySelector(selector);
//   const eventObj = (document as any).createEventObject ? (document as any).createEventObject() : document.createEvent('Events');
//   if (eventObj.initEvent) {
//     eventObj.initEvent(eventType, true, true);
//   }
//   eventObj.keyCode = keyCode;
//   eventObj.which = keyCode;
//   el.dispatchEvent(eventObj);
//   return true;
// });

const getPopoverConfig = ClientFunction(() => {
  const el:any = document.getElementById('popover-test');
  return el.config;
});

test('popover method is defined', async (t) => {
  const hasPopoverMethodById = ClientFunction((selector) => {
    const myPopoverEl:any = document.getElementById(selector);
    return typeof myPopoverEl.popover;
  });
  const popoverHtml = '<bs-tooltip id="test-popover" data-toggle="popover"></bs-tooltip>';
  const myPopover = Selector('#test-popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await hasPopoverMethodById('test-popover')).eql('function');
});

test('should throw explicit error on undefined method', async (t) => {
  const popoverHtml = '<bs-tooltip id="test-popover" data-toggle="popover"></bs-tooltip>';
  const myPopover = Selector('#test-popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect((await callPopoverById('test-popover', 'noMethod')).message).eql('No method named "noMethod"');
});

test('should return the element', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover"></bs-tooltip>';
  const myPopover = Selector('#popover-test');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const returnsItself = ClientFunction(() => {
    const el:any = document.getElementById('popover-test');
    return el === el.popover();
  });
  await t.expect(await returnsItself()).ok();
});


test('should store popover config in props', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover" title="ace" data-content="AceBacker">@ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(_.size(await getPopoverConfig())).gt(0, 'popover config exists');
});


test('should store popover trigger in config', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover" title="ace" data-content="AceBacker">@ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const popoverConfig = await getPopoverConfig();
  console.log('popoverConfig: ', popoverConfig);
  await t.expect(popoverConfig.trigger).eql('click');
});

// https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/popover.js#L82


// await t.expect(getDatasetBySelector('#popover-test', 'originalTitle')).eql('mdo');
// await t.expect(getDatasetBySelector('#popover-test', 'content')).eql('https://twitter.com/mdo');
// await t.expect(_.size(getDatasetBySelector('#popover-test', 'bsId'))).gt(0);
