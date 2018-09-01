/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components dropdown tests').page('./bs-dropdown.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/dropdown.js

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


const callDropdownBySelector = ClientFunction((selector, passedOption) => {
  const el:any = document.querySelector(selector);
  try {
    if (el.dropdown(passedOption)) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
});


const runDropdownMethodAndWaitForParentEventBySelector = ClientFunction((selector, passedOption, eventName) => new Promise((resolve) => {
  const myTimeout = setTimeout(() => {
    // 6 seconds should be more than long enough for any reasonable real world transition
    // eslint-disable-next-line no-use-before-define
    document.querySelector(selector).parentNode.removeEventListener(eventName, handleEventHappened);
    resolve(false);
  }, 6000);
  const handleEventHappened = () => {
    clearTimeout(myTimeout);
    resolve(true);
  };
  document.querySelector(selector).parentNode.addEventListener(eventName, handleEventHappened, { once: true });
  const el:any = document.querySelector(selector);
  el.dropdown(passedOption);
}));

const clickBySelectorAndWaitForEventBySelector = ClientFunction((clickSelector, eventSelector, eventName) => new Promise((resolve) => {
  const myTimeout = setTimeout(() => {
    // 6 seconds should be more than long enough for any reasonable real world transition
    // eslint-disable-next-line no-use-before-define
    document.querySelector(eventSelector).removeEventListener(eventName, handleEventHappened);
    resolve(false);
  }, 6000);
  const handleEventHappened = () => {
    clearTimeout(myTimeout);
    resolve(true);
  };
  document.querySelector(eventSelector).addEventListener(eventName, handleEventHappened, { once: true });
  const el:any = document.querySelector(clickSelector);
  el.click();
}));

const triggerKeyboardEventBySelector = ClientFunction((selector, eventType, keyCode) => {
  const el = document.querySelector(selector);
  const eventObj = (document as any).createEventObject ? (document as any).createEventObject() : document.createEvent('Events');
  if (eventObj.initEvent) {
    eventObj.initEvent(eventType, true, true);
  }
  eventObj.keyCode = keyCode;
  eventObj.which = keyCode;
  el.dispatchEvent(eventObj);
  return true;
});


// const triggerKeyboardEventAndWaitForEvent = ClientFunction((keyboardSelector, eventSelector, eventTypeToCreate, keyCode, eventNameToWaitFor) => new Promise((resolve) => {
//   const myTimeout = setTimeout(() => {
//     // 6 seconds should be more than long enough for any reasonable real world transition
//     // eslint-disable-next-line no-use-before-define
//     document.querySelector(eventSelector).removeEventListener(eventNameToWaitFor, handleEventHappened);
//     resolve(false);
//   }, 6000);
//   const handleEventHappened = () => {
//     clearTimeout(myTimeout);
//     resolve(true);
//   };
//   document.querySelector(eventSelector).addEventListener(eventNameToWaitFor, handleEventHappened, { once: true });
//   const el = document.querySelector(keyboardSelector);
//   const eventObj = (document as any).createEventObject ? (document as any).createEventObject() : document.createEvent('Events');
//   if (eventObj.initEvent) {
//     eventObj.initEvent(eventTypeToCreate, true, true);
//   }
//   eventObj.keyCode = keyCode;
//   eventObj.which = keyCode;
//   el.dispatchEvent(eventObj);
// }));

const hasFocusByQuerySelectorAll = ClientFunction((selector, nth) => {
  const elArr = Array.prototype.slice.call(document.querySelectorAll(selector));
  return elArr[nth] === document.activeElement;
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
// });


// const triggerRealClickBySelector = ClientFunction((selector) => {
//   const elements = Array.prototype.slice.call(document.querySelectorAll(selector));
//   for (let j = 0; j < elements.length; j += 1) {
//     elements[j].click();
//   }
//   return true;
// });


// const getInnerHTMLBySelector = ClientFunction((selector) => {
//   const el = document.querySelector(selector);
//   return el.innerHTML;
// });

// const getPopoverConfig = ClientFunction((selector) => {
//   const el:any = document.getElementById(selector);
//   return el.config;
// });

// test('dropdown method is defined', async (t) => {
//   const hasDropdownMethodBySelector = ClientFunction((selector) => {
//     const el:any = document.querySelector(selector);
//     return typeof el.dropdown;
//   });
//   const dropdownHtml = `
//     <bs-dropdown class="dropdown">
//       <bs-button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//         Dropdown
//       </bs-button>
//       <div class="dropdown-menu" aria-labelledby="dropdown">
//         <a class="dropdown-item" href="#">Action</a>
//         <a class="dropdown-item" href="#">Another action</a>
//         <a class="dropdown-item" href="#">Something else here</a>
//       </div>
//     </bs-dropdown>`;
//   const myDropdown = Selector('.dropdown');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await hasDropdownMethodBySelector('bs-button')).eql('function'); // proxy method
//   await t.expect(await hasDropdownMethodBySelector('bs-dropdown')).eql('function');
// });

// test('should throw explicit error on undefined method', async (t) => {
//   const dropdownHtml = `
//     <bs-dropdown class="dropdown">
//       <bs-button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//         Dropdown
//       </bs-button>
//       <div class="dropdown-menu" aria-labelledby="dropdown">
//         <a class="dropdown-item" href="#">Action</a>
//         <a class="dropdown-item" href="#">Another action</a>
//         <a class="dropdown-item" href="#">Something else here</a>
//       </div>
//     </bs-dropdown>`;
//   const myDropdown = Selector('.dropdown');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect((await callDropdownBySelector('bs-dropdown', 'noMethod')).message).eql('No method named "noMethod"');
//   await t.expect((await callDropdownBySelector('bs-button', 'noMethod')).message).eql('No method named "noMethod"');
// });

// test('should return the element', async (t) => {
//   const dropdownHtml = `
//     <bs-dropdown class="dropdown">
//       <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//         Dropdown
//       </button>
//       <div class="dropdown-menu" aria-labelledby="dropdown">
//         <a class="dropdown-item" href="#">Action</a>
//         <a class="dropdown-item" href="#">Another action</a>
//         <a class="dropdown-item" href="#">Something else here</a>
//       </div>
//     </bs-dropdown>`;
//   const myDropdown = Selector('.dropdown');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   const returnsItself = ClientFunction((selector) => {
//     const el:any = document.querySelector(selector);
//     return el === el.dropdown();
//   });
//   await t.expect(await returnsItself('bs-dropdown')).ok();
// });


// test('should not open dropdown if target is disabled via attribute', async (t) => {
//   const dropdownHtml = `
//     <bs-dropdown class="dropdown">
//       <button disabled class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//         Dropdown
//       </button>
//       <div class="dropdown-menu" aria-labelledby="dropdown">
//         <a class="dropdown-item" href="#">Action</a>
//         <a class="dropdown-item" href="#">Another action</a>
//         <a class="dropdown-item" href="#">Something else here</a>
//       </div>
//     </bs-dropdown>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   console.log('\t...waiting for timeout trying to open a disabled dropdown...');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).notOk('dropdown did not open');
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).notOk('dropdown did not open');
// });

// test('should not add class position-static to dropdown if boundary not set', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <bs-button class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//           Dropdown
//         </bs-button>
//         <div class="dropdown-menu" aria-labelledby="dropdown">
//           <a class="dropdown-item" href="#">Action</a>
//           <a class="dropdown-item" href="#">Another action</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await runDropdownMethodAndWaitForParentEventBySelector('bs-button', 'toggle', 'shown.bs.dropdown')).ok();
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).ok('dropdown opened');
//   await t.expect(await myDropdown.hasClass('position-static')).notOk('"position-static" class not added');
// });


// test('should add class position-static to dropdown if boundary not scrollParent', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <bs-button class="btn btn-secondary dropdown-toggle"
//         data-boundary="viewport" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//           Dropdown
//         </bs-button>
//         <div class="dropdown-menu" aria-labelledby="dropdown">
//           <a class="dropdown-item" href="#">Action</a>
//           <a class="dropdown-item" href="#">Another action</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await runDropdownMethodAndWaitForParentEventBySelector('bs-button', 'toggle', 'shown.bs.dropdown')).ok();
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).ok('dropdown opened');
//   await t.expect(await myDropdown.hasClass('position-static')).ok('"position-static" class added');
// });


// test('should set aria-expanded="true" on target when dropdown menu is shown', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//           Dropdown
//         </a>
//         <div class="dropdown-menu" aria-labelledby="dropdown">
//           <a class="dropdown-item" href="#">Action</a>
//           <a class="dropdown-item" href="#">Another action</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   const myDropdownMenuButton = Selector('[data-toggle="dropdown"]');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).ok('dropdown opened');
//   await t.expect(await myDropdownMenuButton.nth(0).getAttribute('aria-expanded')).eql('true', 'aria-expanded is set to string "true" on click');
//   // await t.debug();
// });


// test('should set aria-expanded="false" on target when dropdown menu is hidden', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//           Dropdown
//         </a>
//         <div class="dropdown-menu" aria-labelledby="dropdown">
//           <a class="dropdown-item" href="#">Action</a>
//           <a class="dropdown-item" href="#">Another action</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   const myDropdownMenuButton = Selector('[data-toggle="dropdown"]');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).ok('dropdown opened');
//   await t.expect(await myDropdownMenuButton.nth(0).getAttribute('aria-expanded')).eql('true', 'aria-expanded is set to string "true" on click');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('body', '.dropdown', 'hidden.bs.dropdown')).ok();
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).notOk('dropdown closed');
//   await t.expect(await myDropdownMenuButton.nth(0).getAttribute('aria-expanded')).eql('false', 'aria-expanded is set to string "false" on click');
// });


// test('should not open dropdown if target is disabled via class', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <button class="btn dropdown-toggle disabled" data-toggle="dropdown">
//           Dropdown
//         </button>
//         <div class="dropdown-menu" aria-labelledby="dropdown">
//           <a class="dropdown-item" href="#">Secondary link</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item" href="#">Another link</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   console.log('\t...waiting for timeout trying to open a disabled dropdown...');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).notOk('dropdown did not open');
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).notOk('dropdown did not open');
// });


// test('should add class show to menu if clicked', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <a href="#" class="dropdown-toggle" data-toggle="dropdown">
//           Dropdown
//         </a>
//         <div class="dropdown-menu">
//           <a class="dropdown-item" href="#">Secondary link</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item" href="#">Another link</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await myDropdown.nth(0).hasClass('show')).notOk();
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).notOk();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
//   await t.expect(await myDropdown.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).ok('"show" class added on click');
// });


// test('should test if element has a # before assuming it is a selector', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <a href="/foo/" class="dropdown-toggle" data-toggle="dropdown">
//           Dropdown
//         </a>
//         <div class="dropdown-menu">
//           <a class="dropdown-item" href="#">Secondary link</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item" href="#">Another link</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await myDropdown.nth(0).hasClass('show')).notOk();
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).notOk();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
//   await t.expect(await myDropdown.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).ok('"show" class added on click');
// });


// test('should remove "show" class if body is clicked', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <a href="#" class="dropdown-toggle" data-toggle="dropdown">
//           Dropdown
//         </a>
//         <div class="dropdown-menu">
//           <a class="dropdown-item" href="#">Secondary link</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item" href="#">Another link</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   const myDropdownMenu = Selector('.dropdown-menu');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await myDropdown.nth(0).hasClass('show')).notOk();
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).notOk();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
//   await t.expect(await myDropdown.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('body', '.dropdown', 'hidden.bs.dropdown')).ok();
//   await t.expect(await myDropdown.nth(0).hasClass('show')).notOk('"show" class removed');
//   await t.expect(await myDropdownMenu.nth(0).hasClass('show')).notOk('"show" class removed');
// });


// test('should remove "show" class if tabbing outside of menu', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <a href="#" class="dropdown-toggle" data-toggle="dropdown">
//           Dropdown
//         </a>
//         <div class="dropdown-menu">
//           <a class="dropdown-item" href="#">Secondary link</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item" href="#">Another link</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.click('[data-toggle="dropdown"]');
//   await t.expect(await myDropdown.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await hasFocusByQuerySelectorAll('[data-toggle="dropdown"]', 0)).ok('dropdown toggle has focus');
//   await t.pressKey('tab');
//   await t.expect(await myDropdown.nth(0).hasClass('show')).ok('still has show class');
//   await t.expect(await hasFocusByQuerySelectorAll('.dropdown-item', 0)).ok('First menu item has focus');
//   await t.pressKey('tab');
//   await t.expect(await myDropdown.nth(0).hasClass('show')).ok('still has show class');
//   await t.expect(await hasFocusByQuerySelectorAll('.dropdown-item', 1)).ok('Second menu item has focus');
//   await t.pressKey('tab');
//   await t.expect(await myDropdown.nth(0).hasClass('show')).ok('still has show class');
//   await t.expect(await hasFocusByQuerySelectorAll('.dropdown-item', 2)).ok('Third menu item has focus');
//   await t.pressKey('tab'); // out of the dropdown now
//   await t.expect(await myDropdown.nth(0).hasClass('show')).notOk('"show" class removed');
// });


// test('should remove "show" class if body is clicked, with multiple dropdowns', async (t) => {
//   const dropdownHtml = `
//     <div>
//       <div class="nav">
//         <bs-dropdown class="dropdown" id="testmenu">
//           <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <span class="caret"/></a>
//           <div class="dropdown-menu">
//               <a class="dropdown-item" href="#sub1">Submenu 1</a>
//           </div>
//         </bs-dropdown>
//       </div>
//       <bs-dropdown class="btn-group">
//         <button class="btn">Actions</button>
//         <button class="btn dropdown-toggle" data-toggle="dropdown"></button>
//         <div class="dropdown-menu">
//           <a class="dropdown-item" href="#">Action 1</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const firstDropdown = Selector('.dropdown');
//   const firstDropdownToggle = firstDropdown.child('[data-toggle="dropdown"]');
//   const lastDropdown = Selector('.btn-group');
//   const lastDropdownToggle = lastDropdown.child('[data-toggle="dropdown"]');
//   const shownDropdownMenus = Selector('.dropdown-menu.show');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await firstDropdown.nth(0).exists).ok();
//   await t.expect(await firstDropdownToggle.nth(0).exists).ok();
//   await t.expect(await lastDropdown.nth(0).exists).ok();
//   await t.expect(await lastDropdownToggle.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('.dropdown [data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
//   await t.expect(await firstDropdown.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await shownDropdownMenus.count).eql(1, 'only one dropdown is shown');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('body', '.dropdown', 'hidden.bs.dropdown')).ok();
//   await t.expect(await shownDropdownMenus.count).eql(0, '"show" class removed');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('.btn-group [data-toggle="dropdown"]', '.btn-group', 'shown.bs.dropdown')).ok();
//   await t.expect(await lastDropdown.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await shownDropdownMenus.count).eql(1, 'only one dropdown is shown');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('body', '.btn-group', 'hidden.bs.dropdown')).ok();
//   await t.expect(await shownDropdownMenus.count).eql(0, '"show" class removed');
// });


// test('should remove "show" class if body if tabbing outside of menu, with multiple dropdowns', async (t) => {
//   const dropdownHtml = `
//     <div>
//       <div class="nav">
//         <bs-dropdown class="dropdown" id="testmenu">
//           <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <span class="caret"/></a>
//           <div class="dropdown-menu">
//               <a class="dropdown-item" href="#sub1">Submenu 1</a>
//           </div>
//         </bs-dropdown>
//       </div>
//       <bs-dropdown class="btn-group">
//         <button class="btn">Actions</button>
//         <button class="btn dropdown-toggle" data-toggle="dropdown"></button>
//         <div class="dropdown-menu">
//           <a class="dropdown-item" href="#">Action 1</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const firstDropdown = Selector('.dropdown');
//   const firstDropdownToggle = firstDropdown.child('[data-toggle="dropdown"]');
//   const lastDropdown = Selector('.btn-group');
//   const lastDropdownToggle = lastDropdown.child('[data-toggle="dropdown"]');
//   const shownDropdownMenus = Selector('.dropdown-menu.show');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await firstDropdown.nth(0).exists).ok();
//   await t.expect(await firstDropdownToggle.nth(0).exists).ok();
//   await t.expect(await lastDropdown.nth(0).exists).ok();
//   await t.expect(await lastDropdownToggle.nth(0).exists).ok();

//   // open first dropdown
//   await t.click(firstDropdownToggle.nth(0));
//   await t.expect(await firstDropdown.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await shownDropdownMenus.count).eql(1, 'only one dropdown is shown');
//   await t.expect(await hasFocusByQuerySelectorAll('.dropdown [data-toggle="dropdown"]', 0)).ok('first dropdown toggle has focus');
//   await t.pressKey('tab');
//   await t.expect(await firstDropdown.nth(0).hasClass('show')).ok('still has show class');
//   await t.expect(await hasFocusByQuerySelectorAll('.dropdown .dropdown-item', 0)).ok('First menu item has focus of first dropdown');
//   await t.pressKey('tab'); // out of the first dropdown now
//   await t.expect(await shownDropdownMenus.count).eql(0, '"show" class removed');

//   // open second dropdown
//   await t.click(lastDropdownToggle.nth(0));
//   await t.expect(await lastDropdown.nth(0).hasClass('show')).ok('"show" class added on click');
//   await t.expect(await shownDropdownMenus.count).eql(1, 'only one dropdown is shown');
//   await t.expect(await hasFocusByQuerySelectorAll('.btn-group [data-toggle="dropdown"]', 0)).ok('last dropdown toggle has focus');
//   await t.pressKey('tab');
//   await t.expect(await lastDropdown.nth(0).hasClass('show')).ok('still has show class');
//   await t.expect(await hasFocusByQuerySelectorAll('.btn-group .dropdown-item', 0)).ok('First menu item has focus of last dropdown');
//   await t.pressKey('tab'); // out of the last dropdown now
//   await t.expect(await shownDropdownMenus.count).eql(0, '"show" class removed');
// });


// test('should fire show and hide event', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <a href="#" class="dropdown-toggle" data-toggle="dropdown">
//           Dropdown
//         </a>
//         <div class="dropdown-menu">
//           <a class="dropdown-item" href="#">Secondary link</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item" href="#">Another link</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'show.bs.dropdown')).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('body', '.dropdown', 'hide.bs.dropdown')).ok();
// });

// test('should fire shown and hidden event', async (t) => {
//   const dropdownHtml = `
//     <div class="tabs">
//       <bs-dropdown class="dropdown">
//         <a href="#" class="dropdown-toggle" data-toggle="dropdown">
//           Dropdown
//         </a>
//         <div class="dropdown-menu">
//           <a class="dropdown-item" href="#">Secondary link</a>
//           <a class="dropdown-item" href="#">Something else here</a>
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item" href="#">Another link</a>
//         </div>
//       </bs-dropdown>
//     </div>`;
//   const myDropdown = Selector('.dropdown');
//   await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
//   await t.expect(await myDropdown.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('body', '.dropdown', 'hidden.bs.dropdown')).ok();
// });


test('should fire shown and hidden event with a relatedTarget', async (t) => {
  const shouldFireShownAndHiddenEventWithARelatedTarget = ClientFunction((clickSelector, dropdownToggleSelector, eventSelector, eventName) => new Promise((resolve) => {
    const myTimeout = setTimeout(() => {
      // 6 seconds should be more than long enough for any reasonable real world transition
      // eslint-disable-next-line no-use-before-define
      document.querySelector(eventSelector).removeEventListener(eventName, handleEventHappened);
      resolve(false);
    }, 6000);
    const handleEventHappened = (event) => {
      clearTimeout(myTimeout);
      const dropdownToggleEl:any = document.querySelector(dropdownToggleSelector);
      resolve(dropdownToggleEl === event.relatedTarget);
    };
    document.querySelector(eventSelector).addEventListener(eventName, handleEventHappened, { once: true });
    const clickEl:any = document.querySelector(clickSelector);
    clickEl.click();
  }));
  const dropdownHtml = `
    <div class="tabs">
      <bs-dropdown class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
          Dropdown
        </a>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Secondary link</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Another link</a>
        </div>
      </bs-dropdown>
    </div>`;
  const myDropdown = Selector('.dropdown');
  await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
  await t.expect(await myDropdown.nth(0).exists).ok();
  await t.expect(await shouldFireShownAndHiddenEventWithARelatedTarget('[data-toggle="dropdown"]', '[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
  await t.expect(await shouldFireShownAndHiddenEventWithARelatedTarget('body', '[data-toggle="dropdown"]', '.dropdown', 'hidden.bs.dropdown')).ok();
});


test('should fire hide and hidden event with a clickEvent', async (t) => {
  const shouldFireHideAndHiddenEventWithAClickEvent = ClientFunction((clickSelector, eventSelector) => new Promise((resolve) => {
    let hasFiredHideEvent = false;
    const myTimeout = setTimeout(() => {
      // 6 seconds should be more than long enough for any reasonable real world transition
      // eslint-disable-next-line no-use-before-define
      document.querySelector(eventSelector).removeEventListener('hide.bs.dropdown', handleHideEvent);
      // eslint-disable-next-line no-use-before-define
      document.querySelector(eventSelector).removeEventListener('hidden.bs.dropdown', handleHiddenEvent);
      resolve(false);
    }, 6000);
    const handleHideEvent = () => {
      hasFiredHideEvent = true;
    };
    const handleHiddenEvent = () => {
      clearTimeout(myTimeout);
      if (hasFiredHideEvent) {
        // easier to read this way
        resolve(true);
      } else {
        resolve(false);
      }
    };
    document.querySelector(eventSelector).addEventListener('hide.bs.dropdown', handleHideEvent, { once: true });
    document.querySelector(eventSelector).addEventListener('hidden.bs.dropdown', handleHiddenEvent, { once: true });
    const el:any = document.querySelector(clickSelector);
    el.click();
  }));
  const dropdownHtml = `
    <div class="tabs">
      <bs-dropdown class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
          Dropdown
        </a>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Secondary link</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Another link</a>
        </div>
      </bs-dropdown>
    </div>`;
  const myDropdown = Selector('.dropdown');
  await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
  await t.expect(await myDropdown.nth(0).exists).ok();
  await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
  await t.expect(await shouldFireHideAndHiddenEventWithAClickEvent('body', '.dropdown')).ok();
});


test('should fire hide and hidden event without a clickEvent if event type is not click', async (t) => {
  const shouldFireHideAndHiddenEventWithoutAClickEventIfEventTypeIsNotClick = ClientFunction(() => {
    function waitForEventBySelector(eventSelector, eventName) {
      return new Promise((resolve) => {
        const myTimeout = setTimeout(() => {
          // 6 seconds should be more than long enough for any reasonable real world transition
          // eslint-disable-next-line no-use-before-define
          document.querySelector(eventSelector).removeEventListener(eventName, handleEventHappened);
          resolve(false);
        }, 6000);
        const handleEventHappened = () => {
          clearTimeout(myTimeout);
          resolve(true);
        };
        document.querySelector(eventSelector).addEventListener(eventName, handleEventHappened, { once: true });
      });
    }
    function delayedEscBySelector(escSelector, delayMs) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const el:any = document.querySelector(escSelector);
          const eventType = 'keydown';
          const keyCode = 27;
          const eventObj = (document as any).createEventObject ? (document as any).createEventObject() : document.createEvent('Events');
          if (eventObj.initEvent) {
            eventObj.initEvent(eventType, true, true);
          }
          eventObj.keyCode = keyCode;
          eventObj.which = keyCode;
          el.dispatchEvent(eventObj);
          resolve(true);
        }, delayMs);
      });
    }
    return Promise.all([
      waitForEventBySelector('.dropdown', 'hide.bs.dropdown'),
      waitForEventBySelector('.dropdown', 'hidden.bs.dropdown'),
      delayedEscBySelector('[data-toggle="dropdown"]', 1),
    ]);
  });
  const dropdownHtml = `
    <div class="tabs">
      <bs-dropdown class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
          Dropdown
        </a>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Secondary link</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Another link</a>
        </div>
      </bs-dropdown>
    </div>`;
  const myDropdown = Selector('.dropdown');
  await t.expect(await appendHtml(_.trim(dropdownHtml))).ok();
  await t.expect(await myDropdown.nth(0).exists).ok();
  await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="dropdown"]', '.dropdown', 'shown.bs.dropdown')).ok();
  const firedHideAndHiddenEvents = await shouldFireHideAndHiddenEventWithoutAClickEventIfEventTypeIsNotClick();
  await t.expect(await _.every(firedHideAndHiddenEvents)).ok('fired hide and hidden events');
});
