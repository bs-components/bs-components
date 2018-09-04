/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components collapse tests').page('./bs.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/collapse.js

// https://github.com/DevExpress/testcafe/tree/master/examples
// https://marketplace.visualstudio.com/items?itemName=hdorgeval.testcafe-snippets#user-content-tc-selector-with-options

const setHtml = ClientFunction((innerHtml: string) => {
  // const template = document.createElement('div');
  // template.innerHTML = innerHtml;
  // const el = template.firstChild;
  const parentEl = document.getElementById('page-container');
  parentEl.innerHTML = innerHtml;
  return true;
  // return true;
  // if () {
  // // if (parentEl.appendChild(el)) {
  //   return true;
  // }
  // return false;
});


const callCollapseBySelector = ClientFunction((selector, passedOption) => {
  const el:any = document.querySelector(selector);
  try {
    if (el.collapse(passedOption)) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
});

// const runCollapseMethodAndWaitForEventBySelector = ClientFunction((selector, passedOption, eventName) => new Promise((resolve) => {
//   const myTimeout = setTimeout(() => {
//     // 6 seconds should be more than long enough for any reasonable real world transition
//     // eslint-disable-next-line no-use-before-define
//     document.querySelector(selector).removeEventListener(eventName, handleEventHappened);
//     resolve(false);
//   }, 6000);
//   const handleEventHappened = () => {
//     clearTimeout(myTimeout);
//     resolve(true);
//   };
//   document.querySelector(selector).addEventListener(eventName, handleEventHappened, { once: true });
//   const el:any = document.querySelector(selector);
//   el.collapse(passedOption);
// }));


// const waitForReady = ClientFunction(() => new Promise((resolve) => {
//   // firefox really needed this for some reason (I thought testcafe took care of this)
//   const myReadyTimeout = setTimeout(() => {
//     resolve();
//   }, 2000);
//   if ((document as any).attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
//     resolve();
//   } else {
//     document.addEventListener('DOMContentLoaded', () => {
//       clearTimeout(myReadyTimeout);
//       resolve();
//     }, { once: true });
//   }
// }));


const runCollapseMethodAndWaitForEventBySelector = ClientFunction((selector, passedOption, eventName) => new Promise((resolve) => {
  function waitForEventBySelector(eventSelector, myEventName) {
    return new Promise((resolveWait) => {
      const myTimeout = setTimeout(() => {
        // 6 seconds should be more than long enough for any reasonable real world transition
        // eslint-disable-next-line no-use-before-define
        document.querySelector(eventSelector).removeEventListener(myEventName, handleEventHappened);
        // const elArr = Array.prototype.slice.call(document.querySelectorAll(eventSelector));
        // if (elArr && elArr[0]) {
        //   // eslint-disable-next-line no-use-before-define
        //   elArr[0].removeEventListener(myEventName, handleEventHappened);
        // }
        resolveWait(false);
      }, 6000);
      const handleEventHappened = () => {
        clearTimeout(myTimeout);
        resolveWait(true);
      };
      document.querySelector(eventSelector).addEventListener(myEventName, handleEventHappened, { once: true });
      // const elArr = Array.prototype.slice.call(document.querySelectorAll(eventSelector));
      // if (elArr && elArr[0]) {
      //   elArr[0].addEventListener(myEventName, handleEventHappened, { once: true });
      // }
    });
  }
  function delayedRunCollapseMethodBySelector(collapseSelector, collapseOption, delay) {
    return new Promise((resolveRun) => {
      setTimeout(() => {
        const el:any = document.querySelector(collapseSelector);
        el.collapse(collapseOption);
        resolveRun(true);
      }, delay);
    });
  }
  Promise.all([
    waitForEventBySelector(selector, eventName),
    delayedRunCollapseMethodBySelector(selector, passedOption, 150),
  ]).then((resultArr) => {
    resolve(resultArr.every(result => result === true));
  });
}));


// const clickBySelectorAndWaitForEventBySelector = ClientFunction((clickSelector, eventSelector, eventName) => new Promise((resolve) => {
//   const myTimeout = setTimeout(() => {
//     // 6 seconds should be more than long enough for any reasonable real world transition
//     // eslint-disable-next-line no-use-before-define
//     document.querySelector(eventSelector).removeEventListener(eventName, handleEventHappened);
//     resolve(false);
//   }, 6000);
//   const handleEventHappened = () => {
//     clearTimeout(myTimeout);
//     resolve(true);
//   };
//   document.querySelector(eventSelector).addEventListener(eventName, handleEventHappened, { once: true });
//   const el:any = document.querySelector(clickSelector);
//   el.click();
// }));


const clickBySelectorAndWaitForEventBySelector = ClientFunction((clickSelector, eventSelector, eventName) => new Promise((resolve) => {
  function waitForEventBySelector(myEventSelector, myEventName) {
    return new Promise((resolveWait) => {
      const myTimeout = setTimeout(() => {
        // 6 seconds should be more than long enough for any reasonable real world transition
        // eslint-disable-next-line no-use-before-define
        document.querySelector(eventSelector).removeEventListener(myEventName, handleEventHappened);
        // const elArr = Array.prototype.slice.call(document.querySelectorAll(myEventSelector));
        // if (elArr && elArr[0]) {
        //   // eslint-disable-next-line no-use-before-define
        //   elArr[0].removeEventListener(myEventName, handleEventHappened);
        // }
        resolveWait(false);
      }, 6000);
      const handleEventHappened = () => {
        clearTimeout(myTimeout);
        resolveWait(true);
      };
      document.querySelector(myEventSelector).addEventListener(myEventName, handleEventHappened, { once: true });
      // const elArr = Array.prototype.slice.call(document.querySelectorAll(myEventSelector));
      // if (elArr && elArr[0]) {
      //   elArr[0].addEventListener(myEventName, handleEventHappened, { once: true });
      // }
    });
  }
  function delayedClickBySelector(myClickSelector, delay) {
    return new Promise((resolveClick) => {
      setTimeout(() => {
        const el:any = document.querySelector(myClickSelector);
        el.click();
        resolveClick(true);
      }, delay);
    });
  }
  Promise.all([
    waitForEventBySelector(eventSelector, eventName),
    delayedClickBySelector(clickSelector, 150),
  ]).then((resultArr) => {
    resolve(resultArr.every(result => result === true));
  });
}));


// const hasFocusByQuerySelectorAll = ClientFunction((selector, nth) => {
//   const elArr = Array.prototype.slice.call(document.querySelectorAll(selector));
//   return elArr[nth] === document.activeElement;
// });


// const focusBySelector = ClientFunction((selector) => {
//   document.querySelector(selector).focus();
//   return true;
// });

const getCssComputedStyleBySelector = ClientFunction((selector, styleName) => {
  const el = document.querySelector(selector);
  const style = window.getComputedStyle(el);
  return style[styleName];
});

const getInlineCssStyleBySelector = ClientFunction((selector, styleName) => {
  const el = document.querySelector(selector);
  return el.style[styleName];
});


// test('collapse method is defined', async (t) => {
//   const collapseHtml = `
//     <div>
//       <p>
//         <bs-button class="btn btn-secondary" data-toggle="collapse" data-target="#collapse-test" aria-expanded="false">
//           Button
//         </bs-button>
//       </p>
//       <bs-collapse class="collapse" id="collapse-test">
//         <div class="card card-body">
//           It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness,
//         </div>
//       </bs-collapse>
//     </div>`;
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   // await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok({ timeout: 5000 });
//   const hasCollapseMethodBySelector = ClientFunction((selector) => {
//     const el:any = document.querySelector(selector);
//     return typeof el.collapse;
//   });
//   await t.expect(await hasCollapseMethodBySelector('#collapse-test')).eql('function');
// });


// test('should throw explicit error on undefined method', async (t) => {
//   const collapseHtml = `
//     <div>
//       <p>
//         <bs-button class="btn btn-secondary" data-toggle="collapse" data-target="#collapse-test" aria-expanded="false">
//           Button
//         </bs-button>
//       </p>
//       <bs-collapse class="collapse" id="collapse-test">
//         <div class="card card-body">
//           It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness,
//         </div>
//       </bs-collapse>
//     </div>`;
//   const myCollapse = Selector('.collapse');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   // await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok({ timeout: 5000 });
//   await t.expect(await myCollapseToggle.nth(0).visible).ok({ timeout: 5000 });
//   await t.expect(_.toLower((await callCollapseBySelector('#collapse-test', 'noMethod')).message)).eql('no method named "nomethod"', { timeout: 5000 });
// });

// test('should return the element', async (t) => {
//   const collapseHtml = `
//     <div>
//       <p>
//         <bs-button class="btn btn-secondary" data-toggle="collapse" data-target="#collapse-test" aria-expanded="false">
//           Button
//         </bs-button>
//       </p>
//       <bs-collapse class="collapse" id="collapse-test">
//         <div class="card card-body">
//           It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness,
//         </div>
//       </bs-collapse>
//     </div>`;
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   // await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok({ timeout: 5000 });
//   const returnsItself = ClientFunction((selector) => {
//     const el:any = document.querySelector(selector);
//     return el === el.collapse();
//   });
//   await t.expect(await returnsItself('#collapse-test')).ok();
// });


// test('should show a collapsed element', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse"></bs-collapse>';
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok({ timeout: 5000 });
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('.collapse', 'show', 'shown.bs.collapse')).ok({ timeout: 5000 });
//   await t.expect(await myCollapse.nth(0).hasClass('show')).ok('dropdown opened');
// });


// test('should show multiple collapsed elements', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" href=".multi"></a>
//       </bs-button>
//       <bs-collapse class="collapse multi"></bs-collapse>
//       <bs-collapse class="collapse multi"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="collapse"]', '.collapse', 'shown.bs.collapse')).ok();
//   await t.expect(await myCollapse.nth(0).hasClass('show')).ok('first collapse opened');
//   await t.expect(await myCollapse.nth(1).hasClass('show')).ok('second collapse opened');
//   await t.expect(await _.toLower(myCollapse.nth(0).getAttribute('style'))).notContains('height', 'has height reset');
//   await t.expect(await _.toLower(myCollapse.nth(2).getAttribute('style'))).notContains('height', 'has height reset');
// });


// test('should collapse only the first collapse', async (t) => {
//   const collapseHtml = `
//     <div>
//       <div class="panel-group" id="accordion1">
//         <div class="panel">
//           <bs-collapse id="collapse1" class="collapse"></bs-collapse>
//         </div>
//       </div>
//       <div class="panel-group" id="accordion2">
//         <div class="panel">
//           <bs-collapse id="collapse2" class="collapse show"></bs-collapse>
//         </div>
//       </div>
//     </div>`;
//   const collapse1 = Selector('#collapse1');
//   const collapse2 = Selector('#collapse2');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await collapse1.exists).ok();
//   await t.expect(await collapse2.exists).ok();
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('#collapse1', 'show', 'shown.bs.collapse')).ok();
//   await t.expect(await collapse1.hasClass('show')).ok('first collapse opened');
//   await t.expect(await collapse2.hasClass('show')).ok('second collapse opened');
// });


// test('should hide a collapsed element', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse"></bs-collapse>';
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await callCollapseBySelector('.collapse', 'hide')).ok();
//   await t.wait(750); // just to be sure any transitions would have finished
//   await t.expect(await myCollapse.nth(0).hasClass('show')).notOk('does not have class "show"');
// });

// test('should not fire shown when show is prevented', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse"></bs-collapse>';
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   const shouldNotFireShownEventWhenShowWasPrevented = ClientFunction(selector => new Promise((resolve) => {
//     const handleShowEvent = (event) => {
//       event.preventDefault();
//     };
//     const handleShownEvent = () => {
//       console.log('Made it to shown event');
//       // eslint-disable-next-line no-use-before-define
//       clearTimeout(myTimeout);
//       document.querySelector(selector).removeEventListener('show.bs.collapse', handleShowEvent);
//       document.querySelector(selector).removeEventListener('shown.bs.collapse', handleShownEvent);
//       resolve(false);
//     };
//     document.querySelector(selector).addEventListener('show.bs.collapse', handleShowEvent);
//     document.querySelector(selector).addEventListener('shown.bs.collapse', handleShownEvent);
//     const el:any = document.querySelector(selector);
//     el.collapse('show');
//     const myTimeout = setTimeout(() => {
//       // 6 seconds should be long enough for any transition
//       document.querySelector(selector).removeEventListener('show.bs.collapse', handleShowEvent);
//       document.querySelector(selector).removeEventListener('shown.bs.collapse', handleShownEvent);
//       resolve(true);
//     }, 6000);
//   }));
//   console.log('\t...waiting for timeout on show event...');
//   await t.expect(await shouldNotFireShownEventWhenShowWasPrevented('.collapse')).ok('show event prevented shown event');
//   await t.expect(await myCollapse.nth(0).hasClass('show')).notOk('does not have class "show"');
// });


// test('should reset style to auto after finishing opening collapse', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse" style="height: 0px"></bs-collapse>';
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await getInlineCssStyleBySelector('.collapse', 'height')).eql('0px', 'height is 0px');
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('.collapse', 'show', 'shown.bs.collapse')).ok();
//   await t.expect(await getInlineCssStyleBySelector('.collapse', 'height')).eql('', 'height is auto');
// });


// test('should reset style to auto after finishing closing collapse', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse"></bs-collapse>';
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await getCssComputedStyleBySelector('.collapse', 'height')).eql('auto', 'height is auto');
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('.collapse', 'show', 'shown.bs.collapse')).ok();
//   await t.expect(await getCssComputedStyleBySelector('.collapse', 'height')).notEql('auto', 'height is not auto');
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('.collapse', 'hide', 'hidden.bs.collapse')).ok();
//   await t.expect(await getCssComputedStyleBySelector('.collapse', 'height')).eql('auto', 'height is auto');
// });


// test('should remove "collapsed" class from target when collapse is shown', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" href="#test1"></a>
//       </bs-button>
//       <bs-collapse class="collapse" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="collapse"]', '.collapse', 'shown.bs.collapse')).ok();
//   await t.expect(await myCollapse.nth(0).hasClass('show')).ok('collapse opened');
//   await t.expect(await myCollapseToggle.nth(0).hasClass('collapsed')).notOk('target does not have collapsed class');
// });


// test('should add "collapsed" class to target when collapse is hidden', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" href="#test1"></a>
//       </bs-button>
//       <bs-collapse class="collapse show" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   // await t.debug();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="collapse"]', '.collapse', 'hidden.bs.collapse')).ok();
//   await t.expect(await myCollapse.nth(0).hasClass('show')).notOk('collapse closed');
//   await t.expect(await myCollapseToggle.nth(0).hasClass('collapsed')).ok('target has collapsed class');
// });


// test('should remove "collapsed" class from all triggers targeting the collapse when the collapse is shown', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" id="first-collapse-trigger" href="#test1"></a>
//       </bs-button>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" href="#test1"></a>
//       </bs-button>
//       <bs-collapse class="collapse" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#first-collapse-trigger', '.collapse', 'shown.bs.collapse')).ok();
//   await t.expect(await myCollapse.nth(0).hasClass('show')).ok('collapse opened');
//   await t.expect(await myCollapseToggle.nth(0).hasClass('collapsed')).notOk('first collapse trigger does not have collapsed class');
//   await t.expect(await myCollapseToggle.nth(1).hasClass('collapsed')).notOk('second collapse trigger does not have collapsed class');
// });


// test('should add "collapsed" class to all triggers targeting the collapse when the collapse is hidden', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" id="first-collapse-trigger" href="#test1"></a>
//       </bs-button>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" href="#test1"></a>
//       </bs-button>
//       <bs-collapse class="collapse show" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#first-collapse-trigger', '.collapse', 'hidden.bs.collapse')).ok();
//   await t.expect(await myCollapse.nth(0).hasClass('show')).notOk('collapse closed');
//   await t.expect(await myCollapseToggle.nth(0).hasClass('collapsed')).ok('first collapse trigger has collapsed class');
//   await t.expect(await myCollapseToggle.nth(1).hasClass('collapsed')).ok('second collapse trigger has collapsed class');
// });


// test('should not close a collapse when initialized with "show" option if already shown', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse show" id="test1"></bs-collapse>';
//   const myCollapse = Selector('#test1');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   console.log('\t...waiting for timeout on hide event (trying to show already shown event)...');
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('.collapse', 'show', 'hide.bs.collapse')).notOk();
// });


// test('should open a collapse when initialized with "show" option if not already shown', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse" id="test1"></bs-collapse>';
//   const myCollapse = Selector('#test1');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('.collapse', 'show', 'show.bs.collapse')).ok();
// });

// test('should not show a collapse when initialized with "hide" option if already hidden', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse"></bs-collapse>';
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   console.log('\t...waiting for timeout on hide event (trying to hide already hidden collapse)...');
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('.collapse', 'hide', 'show.bs.collapse')).notOk();
// });

// test('should hide a collapse when initialized with "hide" option if not already hidden', async (t) => {
//   const collapseHtml = '<bs-collapse class="collapse show"></bs-collapse>';
//   const myCollapse = Selector('.collapse');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('.collapse', 'hide', 'hide.bs.collapse')).ok();
// });


// test('should remove "collapsed" class from active accordion target', async (t) => {
//   const collapseHtml = `
//     <div id="accordion">
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a role="button" id="target1" data-toggle="collapse" href="#body1"></a>
//         </bs-button>
//         <bs-collapse id="body1" class="collapse show" data-parent="#accordion"></bs-collapse>
//       </div>
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a class="collapsed" id="target2" data-toggle="collapse" role="button" href="#body2"></a>
//         </bs-button>
//         <bs-collapse id="body2" class="collapse" data-parent="#accordion"></bs-collapse>
//       </div>
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a class="collapsed" id="target3" data-toggle="collapse" role="button" href="#body3"></a>
//         </bs-button>
//         <bs-collapse id="body3" class="collapse" data-parent="#accordion"></bs-collapse>
//       </div>
//     </div>`;
//   const target1 = Selector('#target1');
//   const target2 = Selector('#target2');
//   const target3 = Selector('#target3');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await target3.exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#target3', '#body3', 'shown.bs.collapse')).ok();
//   await t.expect(await target1.hasClass('collapsed')).ok('inactive target 1 does have class "collapsed"');
//   await t.expect(await target2.hasClass('collapsed')).ok('inactive target 2 does have class "collapsed"');
//   await t.expect(await target3.hasClass('collapsed')).notOk('active target 3 does not have class "collapsed"');
// });


// test('should allow dots in data-parent', async (t) => {
//   const collapseHtml = `
//     <div class="accordion">
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a role="button" id="target1" data-toggle="collapse" href="#body1"></a>
//         </bs-button>
//         <bs-collapse id="body1" class="collapse show" data-parent=".accordion"></bs-collapse>
//       </div>
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a class="collapsed" id="target2" data-toggle="collapse" role="button" href="#body2"></a>
//         </bs-button>
//         <bs-collapse id="body2" class="collapse" data-parent=".accordion"></bs-collapse>
//       </div>
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a class="collapsed" id="target3" data-toggle="collapse" role="button" href="#body3"></a>
//         </bs-button>
//         <bs-collapse id="body3" class="collapse" data-parent=".accordion"></bs-collapse>
//       </div>
//     </div>`;
//   const target1 = Selector('#target1');
//   const target2 = Selector('#target2');
//   const target3 = Selector('#target3');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await target3.exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#target3', '#body3', 'shown.bs.collapse')).ok();
//   await t.expect(await target1.hasClass('collapsed')).ok('inactive target 1 does have class "collapsed"');
//   await t.expect(await target2.hasClass('collapsed')).ok('inactive target 2 does have class "collapsed"');
//   await t.expect(await target3.hasClass('collapsed')).notOk('active target 3 does not have class "collapsed"');
// });


// test('should set aria-expanded="true" on trigger/control when collapse is shown', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"></a>
//       </bs-button>
//       <bs-collapse class="collapse show" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="collapse"]', '.collapse', 'hidden.bs.collapse')).ok();
//   await t.expect(await myCollapse.nth(0).hasClass('show')).notOk('collapse not open');
//   await t.expect(await myCollapseToggle.nth(0).getAttribute('aria-expanded')).eql('false', 'aria-expanded on target is "false"');
// });


// test('should set aria-expanded="true" on all triggers targeting the collapse when the collapse is shown', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" id="first-collapse-trigger" href="#test1" aria-expanded="false"></a>
//       </bs-button>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"></a>
//       </bs-button>
//       <bs-collapse class="collapse" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#first-collapse-trigger', '.collapse', 'shown.bs.collapse')).ok();
//   await t.expect(await myCollapse.nth(0).hasClass('show')).ok('collapse opened');
//   await t.expect(await myCollapseToggle.nth(0).getAttribute('aria-expanded')).eql('true', 'aria-expanded on trigger/control is "true"');
//   await t.expect(await myCollapseToggle.nth(1).getAttribute('aria-expanded')).eql('true', 'aria-expanded on alternative trigger/control is "true"');
// });


// test('should set aria-expanded="false" on all triggers targeting the collapse when the collapse is hidden', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" id="first-collapse-trigger" href="#test1" aria-expanded="true"></a>
//       </bs-button>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"></a>
//       </bs-button>
//       <bs-collapse class="collapse show" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.nth(0).exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#first-collapse-trigger', '.collapse', 'hidden.bs.collapse')).ok();
//   await t.expect(await myCollapse.nth(0).hasClass('show')).notOk('collapse closed');
//   await t.expect(await myCollapseToggle.nth(0).getAttribute('aria-expanded')).eql('false', 'aria-expanded on trigger/control is "false"');
//   await t.expect(await myCollapseToggle.nth(1).getAttribute('aria-expanded')).eql('false', 'aria-expanded on alternative trigger/control is "false"');
// });


// test('should change aria-expanded from active accordion trigger/control to "false" and set the trigger/control for the newly active one to "true"', async (t) => {
//   const collapseHtml = `
//     <div id="accordion">
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a role="button" id="target1" data-toggle="collapse" href="#body1" aria-expanded="true" ></a>
//         </bs-button>
//         <bs-collapse id="body1" class="collapse show" data-parent="#accordion"></bs-collapse>
//       </div>
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a class="collapsed" id="target2" data-toggle="collapse" role="button" href="#body2" aria-expanded="false" ></a>
//         </bs-button>
//         <bs-collapse id="body2" class="collapse" data-parent="#accordion"></bs-collapse>
//       </div>
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a class="collapsed" id="target3" data-toggle="collapse" role="button" href="#body3" aria-expanded="false"></a>
//         </bs-button>
//         <bs-collapse id="body3" class="collapse" data-parent="#accordion"></bs-collapse>
//       </div>
//     </div>`;
//   const target1 = Selector('#target1');
//   const target2 = Selector('#target2');
//   const target3 = Selector('#target3');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await target3.exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#target3', '#body3', 'shown.bs.collapse')).ok();
//   await t.expect(await target1.getAttribute('aria-expanded')).eql('false', 'inactive trigger/control 1 has aria-expanded="false"');
//   await t.expect(await target2.getAttribute('aria-expanded')).eql('false', 'inactive trigger/control 2 has aria-expanded="false"');
//   await t.expect(await target3.getAttribute('aria-expanded')).eql('true', 'active trigger/control 3 has aria-expanded="true"');
// });


// test('should not fire show event if show is prevented because other element is still transitioning', async (t) => {
//   const collapseHtml = `
//     <div id="accordion">
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a role="button" id="target1" data-toggle="collapse" href="#body1"></a>
//         </bs-button>
//         <bs-collapse id="body1" class="collapse show" data-parent="#accordion"></bs-collapse>
//       </div>
//       <div class="card">
//         <bs-button tabindex="-1">
//           <a class="collapsed" id="target2" data-toggle="collapse" role="button" href="#body2"></a>
//         </bs-button>
//         <bs-collapse id="body2" class="collapse" data-parent="#accordion"></bs-collapse>
//       </div>
//     </div>`;
//   const target1 = Selector('#target1');
//   const target2 = Selector('#target2');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await target1.exists).ok();
//   await t.expect(await target2.exists).ok();
//   const toggleClassNamesBySelector = ClientFunction((selector, toggleClasses) => {
//     document.querySelector(selector).classList.toggle(toggleClasses);
//     return true;
//   });
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#target2', '#body2', 'show.bs.collapse')).ok();
//   await t.expect(await toggleClassNamesBySelector('#body2', 'show')).ok();
//   await t.expect(await toggleClassNamesBySelector('#body2', 'collapsing')).ok();
//   console.log('\t...waiting for timeout on show event (trying to click toggle that is transitioning...');
//   // NOTE: the idea here is that the css transition is still happening so this second click trigger will fail.
//   // on a very slow computer this test might fail
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#target1', '#body1', 'show.bs.collapse')).notOk('show event did not fire');
// });


// test('should add "collapsed" class to target when collapse is hidden via manual invocation', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" href="#test1"></a>
//       </bs-button>
//       <bs-collapse class="collapse show" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.exists).ok();
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('#test1', 'hide', 'hidden.bs.collapse')).ok({ timeout: 5000 });
//   await t.expect(await myCollapse.hasClass('show')).notOk('collapse not open');
//   await t.expect(await myCollapseToggle.nth(0).hasClass('collapsed')).ok();
// });


// test('should remove "collapsed" class from target when collapse is shown via manual invocation', async (t) => {
//   const collapseHtml = `
//     <div>
//       <bs-button tabindex="-1">
//         <a role="button" data-toggle="collapse" class="collapsed" href="#test1"></a>
//       </bs-button>
//       <bs-collapse class="collapse" id="test1"></bs-collapse>
//     </div>`;
//   const myCollapse = Selector('#test1');
//   const myCollapseToggle = Selector('[data-toggle="collapse"]');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await myCollapse.exists).ok();
//   await t.expect(await runCollapseMethodAndWaitForEventBySelector('#test1', 'show', 'shown.bs.collapse')).ok({ timeout: 5000 });
//   await t.expect(await myCollapse.hasClass('show')).ok('dropdown opened');
//   // await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="collapse"]', '.collapse', 'hidden.bs.collapse')).ok();
//   // await t.expect(await myCollapse.nth(0).hasClass('show')).notOk('collapse not open');
//   await t.expect(await myCollapseToggle.nth(0).hasClass('collapsed')).notOk();
// });


// test('should allow accordion to use children other than card', async (t) => {
//   const collapseHtml = `
//     <div id="accordion">
//       <div class="item">
//         <bs-button tabindex="-1">
//           <a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>
//         </bs-button>
//         <bs-collapse id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></bs-collapse>
//       </div>
//       <div class="item">
//         <bs-button tabindex="-1">
//           <a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>
//         </bs-button>
//         <bs-collapse id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></bs-collapse>
//       </div>
//     </div>`;
//   const trigger = Selector('#linkTrigger');
//   const triggerTwo = Selector('#linkTriggerTwo');
//   const collapseOne = Selector('#collapseOne');
//   const collapseTwo = Selector('#collapseTwo');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await trigger.exists).ok();
//   await t.expect(await triggerTwo.exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#linkTrigger', '#collapseOne', 'shown.bs.collapse')).ok();
//   await t.expect(await collapseOne.hasClass('show')).ok('#collapseOne is shown');
//   await t.expect(await collapseTwo.hasClass('show')).notOk('#collapseTwo is not shown');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#linkTriggerTwo', '#collapseTwo', 'shown.bs.collapse')).ok();
//   await t.expect(await collapseOne.hasClass('show')).notOk('#collapseOne is not shown');
//   await t.expect(await collapseTwo.hasClass('show')).ok('#collapseTwo is shown');
// });


// test('should allow accordion to contain nested elements', async (t) => {
//   const collapseHtml = `
//     <div id="accordion">
//       <div class="row">
//         <div class="col-lg-6">
//           <div class="item">
//             <bs-button tabindex="-1">
//               <a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>
//             </bs-button>
//             <bs-collapse id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></bs-collapse>
//           </div>
//         </div>
//         <div class="col-lg-6">
//           <div class="item">
//             <bs-button tabindex="-1">
//               <a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>
//             </bs-button>
//             <bs-collapse id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></bs-collapse>
//           </div>
//         </div>
//       </div>
//     </div>`;
//   const trigger = Selector('#linkTrigger');
//   const triggerTwo = Selector('#linkTriggerTwo');
//   const collapseOne = Selector('#collapseOne');
//   const collapseTwo = Selector('#collapseTwo');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await trigger.exists).ok();
//   await t.expect(await triggerTwo.exists).ok();
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#linkTrigger', '#collapseOne', 'shown.bs.collapse')).ok();
//   await t.expect(await collapseOne.hasClass('show')).ok('#collapseOne is shown');
//   await t.expect(await collapseTwo.hasClass('show')).notOk('#collapseTwo is not shown');
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#linkTriggerTwo', '#collapseTwo', 'shown.bs.collapse')).ok();
//   await t.expect(await collapseOne.hasClass('show')).notOk('#collapseOne is not shown');
//   await t.expect(await collapseTwo.hasClass('show')).ok('#collapseTwo is shown');
// });


// test('should allow accordion to target multiple elements', async (t) => {
//   const collapseHtml = `
//     <div id="accordion">
//       <bs-button tabindex="-1">
//         <a id="linkTriggerOne" data-toggle="collapse" data-target=".collapseOne" href="#" aria-expanded="false" aria-controls="collapseOne"></a>
//       </bs-button>
//       <bs-button tabindex="-1">
//         <a id="linkTriggerTwo" data-toggle="collapse" data-target=".collapseTwo" href="#" aria-expanded="false" aria-controls="collapseTwo"></a>
//       </bs-button>
//       <bs-collapse id="collapseOneOne" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></bs-collapse>
//       <bs-collapse id="collapseOneTwo" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></bs-collapse>
//       <bs-collapse id="collapseTwoOne" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></bs-collapse>
//       <bs-collapse id="collapseTwoTwo" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></bs-collapse>
//     </div>`;
//   const trigger = Selector('#linkTriggerOne');
//   const triggerTwo = Selector('#linkTriggerTwo');
//   const collapseOneOne = Selector('#collapseOneOne');
//   const collapseOneTwo = Selector('#collapseOneTwo');
//   const collapseTwoOne = Selector('#collapseTwoOne');
//   const collapseTwoTwo = Selector('#collapseTwoTwo');
//   await t.expect(await setHtml(_.trim(collapseHtml))).ok();
//   await t.expect(await trigger.exists).ok();
//   await t.expect(await triggerTwo.exists).ok();

//   // firstTest
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#linkTriggerOne', '#collapseOneOne', 'shown.bs.collapse')).ok();
//   await t.expect(await collapseOneOne.hasClass('show')).ok('#collapseOneOne is shown');
//   await t.expect(await collapseOneTwo.hasClass('show')).ok('#collapseOneTwo is shown');
//   await t.expect(await collapseTwoOne.hasClass('show')).notOk('#collapseTwoOne is not shown');
//   await t.expect(await collapseTwoTwo.hasClass('show')).notOk('#collapseTwoTwo is not shown');

//   // secondTest
//   await t.expect(await clickBySelectorAndWaitForEventBySelector('#linkTriggerTwo', '#collapseTwoOne', 'shown.bs.collapse')).ok();
//   await t.expect(await collapseOneOne.hasClass('show')).notOk('#collapseOneOne is not shown');
//   await t.expect(await collapseOneTwo.hasClass('show')).notOk('#collapseOneTwo is not shown');
//   await t.expect(await collapseTwoOne.hasClass('show')).ok('#collapseTwoOne is shown');
//   await t.expect(await collapseTwoTwo.hasClass('show')).ok('#collapseTwoTwo is shown');
// });


test('should collapse accordion children but not nested accordion children', async (t) => {
  const collapseHtml = `
    <div id="accordion">
      <div class="item">
        <bs-button tabindex="-1">
          <a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>
        </bs-button>
        <bs-collapse id="collapseOne" data-parent="#accordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">
          <div id="nestedAccordion">
            <div class="item">
              <bs-button tabindex="-1">
                <a id="nestedLinkTrigger" data-toggle="collapse" href="#nestedCollapseOne" aria-expanded="false" aria-controls="nestedCollapseOne"></a>
              </bs-button>
              <bs-collapse id="nestedCollapseOne" data-parent="#nestedAccordion" class="collapse" role="tabpanel" aria-labelledby="headingThree"></bs-collapse>
            </div>
          </div>
        </bs-collapse>
      </div>
      <div class="item">
        <bs-button tabindex="-1">
          <a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>
        </bs-button>
        <bs-collapse id="collapseTwo" data-parent="#accordion" class="collapse show" role="tabpanel" aria-labelledby="headingTwo"></bs-collapse>
      </div>
    </div>`;
  const trigger = Selector('#linkTrigger');
  const triggerTwo = Selector('#linkTriggerTwo');
  const nestedTrigger = Selector('#nestedLinkTrigger');
  const collapseOne = Selector('#collapseOne');
  const collapseTwo = Selector('#collapseTwo');
  const nestedCollapseOne = Selector('#nestedCollapseOne');


  await t.expect(await setHtml(_.trim(collapseHtml))).ok();
  await t.expect(await trigger.exists).ok();
  await t.expect(await triggerTwo.exists).ok();
  await t.expect(await nestedTrigger.exists).ok();

  await t.expect(await clickBySelectorAndWaitForEventBySelector('#linkTrigger', '#collapseOne', 'shown.bs.collapse')).ok();
  await t.expect(await collapseOne.hasClass('show')).ok('#collapseOne is shown');
  await t.expect(await collapseTwo.hasClass('show')).notOk('#collapseTwo is not shown');
  await t.expect(await nestedCollapseOne.hasClass('show')).notOk('#nestedCollapseOne is not shown');

  await t.expect(await clickBySelectorAndWaitForEventBySelector('#nestedLinkTrigger', '#nestedCollapseOne', 'shown.bs.collapse')).ok();
  await t.expect(await collapseOne.hasClass('show')).ok('#collapseOne is shown');
  await t.expect(await collapseTwo.hasClass('show')).notOk('#collapseTwo is not shown');
  await t.expect(await nestedCollapseOne.hasClass('show')).ok('#nestedCollapseOne is shown');

  await t.expect(await clickBySelectorAndWaitForEventBySelector('#linkTriggerTwo', '#collapseTwo', 'shown.bs.collapse')).ok();
  await t.expect(await collapseOne.hasClass('show')).notOk('#collapseOne is not shown');
  await t.expect(await collapseTwo.hasClass('show')).ok('#collapseTwo is shown');
  await t.expect(await nestedCollapseOne.hasClass('show')).ok('#nestedCollapseOne is shown');
});


// https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/collapse.js#L662
