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


const runPopoverMethodAndWaitForEventById = ClientFunction((id, passedOption, eventName) => new Promise((resolve) => {
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
  const el:any = document.getElementById(id);
  el.popover(passedOption);
}));

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

// const getDatasetBySelector = ClientFunction((selector, attribute) => {
//   const el:any = document.querySelector(selector);
//   return el.dataset[attribute];
// });

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

// const getParentElementInnerHTMLBySelector = ClientFunction((selector) => {
//   const el = document.querySelector(selector);
//   return el.parentElement.innerHTML;
// });

const getInnerHTMLBySelector = ClientFunction((selector) => {
  const el = document.querySelector(selector);
  return el.innerHTML;
});

const getPopoverConfig = ClientFunction((selector) => {
  const el:any = document.getElementById(selector);
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
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover" title="ace" data-content="AceBacker">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(_.size(await getPopoverConfig('popover-test'))).gt(0, 'popover config exists');
});


test('should store popover trigger in config', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover" title="ace" data-content="AceBacker">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const popoverConfig = await getPopoverConfig('popover-test');
  // console.log('popoverConfig: ', popoverConfig);
  await t.expect(popoverConfig.trigger).eql('click');
});

test('should get title and content from options', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  const insertedPopoverHeader = Selector('.popover .popover-header');
  const insertedPopoverBody = Selector('.popover .popover-body');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const myPopoverConfig = {
    title: () => 'AceBacker',
    content: () => 'loves writing tests （╯°□°）╯︵ ┻━┻',
  };
  await t.expect(await callPopoverById('popover-test', myPopoverConfig)).ok();
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopoverHeader.nth(0).innerText).eql('AceBacker', 'title correctly inserted');
  await t.expect(await insertedPopoverBody.nth(0).innerText).eql('loves writing tests （╯°□°）╯︵ ┻━┻', 'content correctly inserted');
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
});


test('should allow DOMElement title and content (html: true)', async (t) => {
  const shouldAllowDOMElementTitleAndContentHtmlTrue = ClientFunction((id, titleText, contentHtml) => {
    const popoverEl:any = document.getElementById(id);
    const titleTextNode = document.createTextNode(titleText);
    const template = document.createElement('div');
    template.innerHTML = contentHtml;
    const contentEl = template.firstChild;
    try {
      return popoverEl.popover({ html: true, title: titleTextNode, content: contentEl });
    } catch (err) {
      return err;
    }
  });
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  const insertedPopoverHeader = Selector('.popover .popover-header');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await shouldAllowDOMElementTitleAndContentHtmlTrue('popover-test', '<3 writing tests', '<i>¯\\_(ツ)_/¯</i>')).ok();
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopoverHeader.nth(0).innerText).eql('<3 writing tests', 'title inserted');
  await t.expect(await getInnerHTMLBySelector('.popover .popover-body')).eql('<i>¯\\_(ツ)_/¯</i>', 'content inserted');
});


test('should allow DOMElement title and content (html: false)', async (t) => {
  const shouldAllowDOMElementTitleAndContentHtmlFalse = ClientFunction((id, titleText, contentHtml) => {
    const popoverEl:any = document.getElementById(id);
    const titleTextNode = document.createTextNode(titleText);
    const template = document.createElement('div');
    template.innerHTML = contentHtml;
    const contentEl = template.firstChild;
    try {
      return popoverEl.popover({ html: false, title: titleTextNode, content: contentEl });
    } catch (err) {
      return err;
    }
  });
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  const insertedPopoverHeader = Selector('.popover .popover-header');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await shouldAllowDOMElementTitleAndContentHtmlFalse('popover-test', '<3 writing tests', '<i>¯\\_(ツ)_/¯</i>')).ok();
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopoverHeader.nth(0).innerText).eql('<3 writing tests', 'title inserted');
  await t.expect(await getInnerHTMLBySelector('.popover .popover-body')).eql('¯\\_(ツ)_/¯', 'content inserted');
});

test('should not duplicate HTML object', async (t) => {
  const shouldNotDuplicateHtmlObject = ClientFunction((id, contentHtml) => {
    const popoverEl:any = document.getElementById(id);
    const template = document.createElement('div');
    template.innerHTML = contentHtml;
    const contentEl = template.firstChild;
    try {
      return popoverEl.popover({ html: true, content: contentEl });
    } catch (err) {
      return err;
    }
  });
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await shouldNotDuplicateHtmlObject('popover-test', '<div>loves writing tests （╯°□°）╯︵ ┻━┻</div>')).ok();
  // first open / close start
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopover.count).eql(1, 'there is only one popover inserted');
  await t.expect(await getInnerHTMLBySelector('.popover .popover-body')).eql('<div>loves writing tests （╯°□°）╯︵ ┻━┻</div>');
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
  await t.expect(await insertedPopover.count).eql(0, 'no inserted popovers on page');
  // second open / close start
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopover.count).eql(1, 'there is only one popover inserted');
  await t.expect(await getInnerHTMLBySelector('.popover .popover-body')).eql('<div>loves writing tests （╯°□°）╯︵ ┻━┻</div>');
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
  await t.expect(await insertedPopover.count).eql(0, 'no inserted popovers on page');
});


test('should get title and content from attributes', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover" title="Ace Backer" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  const insertedPopoverHeader = Selector('.popover .popover-header');
  const insertedPopoverBody = Selector('.popover .popover-body');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopoverHeader.nth(0).innerText).eql('Ace Backer', 'title correctly inserted');
  await t.expect(await insertedPopoverBody.nth(0).innerText).eql('loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted');
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
});


test('should get title and content from attributes ignoring options passed via js', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover" title="Ace Backer" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  const insertedPopoverHeader = Selector('.popover .popover-header');
  const insertedPopoverBody = Selector('.popover .popover-body');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const myPopoverConfig = {
    title: () => 'ignored title option',
    content: () => 'ignored content option',
  };
  await t.expect(await callPopoverById('popover-test', myPopoverConfig)).ok();
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopoverHeader.nth(0).innerText).eql('Ace Backer', 'title correctly inserted');
  await t.expect(await insertedPopoverBody.nth(0).innerText).eql('loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted');
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
});


test('should respect custom template', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  // const insertedPopoverHeader = Selector('.popover .popover-header');
  // const insertedPopoverBody = Selector('.popover .popover-body');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const myPopoverConfig = {
    title: 'Test',
    content: 'Test',
    template: '<div class="popover foobar"><div class="arrow"></div><div class="inner"><h3 class="title"/><div class="content"><p/></div></div></div>',
  };
  await t.expect(await callPopoverById('popover-test', myPopoverConfig)).ok();
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopover.nth(0).hasClass('foobar')).ok('custom class is present');
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
});


test('should destroy popover', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await callPopoverById('popover-test', { trigger: 'hover' })).ok();
  const popoverConfig = await getPopoverConfig('popover-test');
  // console.log('popoverConfig: ', popoverConfig);
  await t.expect(popoverConfig.trigger).contains('hover', 'popover has hover event');
  await t.expect(popoverConfig.trigger).notContains('click', 'no extra click event');
  await t.hover('#popover-test');
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await callPopoverById('popover-test', 'dispose')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
  const postDisposePopoverConfig = await getPopoverConfig('popover-test');
  // console.log('postDisposePopoverConfig: ', postDisposePopoverConfig);
  await t.expect(_.size(postDisposePopoverConfig)).eql(0, 'popover does not have config');
  await t.click('#popover-test');
  await t.expect(await insertedPopover.nth(0).exists).notOk('does not open after click');
  await t.hover('#popover-test');
  await t.expect(await insertedPopover.nth(0).exists).notOk('does not open after hover');
});

// // TODO: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/popover.js#L275
// // 'should render popover element using delegated selector'


test('should detach popover content rather than removing it so that event handlers are left intact', async (t) => {
  const shouldDetachPopoverContentRatherThanRemovingItSoThatEventHandlersAreLeftIntact = ClientFunction(() => new Promise((resolve) => {
    let myTimeout;
    let handleButtonClickedWasCalled = false;
    const handleButtonClicked = () => {
      handleButtonClickedWasCalled = true;
      clearTimeout(myTimeout);
      resolve(true);
    };
    document.getElementById('button-event-here').addEventListener('click', handleButtonClicked, { once: true });
    const myPopoverConfig = {
      html: true,
      trigger: 'manual',
      container: 'body',
      animation: false,
      content: () => document.querySelector('.content-with-handler'),
    };
    const el:any = document.getElementById('popover-test');
    el.popover(myPopoverConfig);
    document.getElementById('popover-test').addEventListener('shown.bs.popover', () => {
      // popover opened the first time
      document.getElementById('popover-test').addEventListener('hidden.bs.popover', () => {
        // popover closed
        document.getElementById('popover-test').addEventListener('shown.bs.popover', () => {
          // popover opened second time
          const buttonEl = document.getElementById('button-event-here');
          if (!buttonEl) {
            throw new Error('"#button-event-here" can not be found in dom');
          }
          buttonEl.click();
          myTimeout = setTimeout(() => {
            if (!handleButtonClickedWasCalled) {
              resolve(false);
            }
          }, 6000); // 6 second timeout
        }, { once: true });
        el.popover('show');
      }, { once: true });
      el.popover('hide');
    }, { once: true });
    el.popover('show');
  }));


  const popoverHtml = `
    <div>
      <div class="content-with-handler">
        <a id="button-event-here" class="btn btn-warning">Button with event handler</a>
      </div>
      <bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>
    </div>`;
  const myPopover = Selector('#popover-test');
  // const insertedPopover = Selector('.popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  // await t.debug();
  await t.expect(await shouldDetachPopoverContentRatherThanRemovingItSoThatEventHandlersAreLeftIntact()).ok();
  // // first open / close start
  // await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  // await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  // await t.expect(await insertedPopover.count).eql(1, 'there is only one popover inserted');
  // await t.expect(await getInnerHTMLBySelector('.popover .popover-body')).eql('<div>loves writing tests （╯°□°）╯︵ ┻━┻</div>');
  // await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).ok();
  // await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
  // await t.expect(await insertedPopover.count).eql(0, 'no inserted popovers on page');
  // // second open / close start
  // await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  // await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  // await t.expect(await insertedPopover.count).eql(1, 'there is only one popover inserted');
  // await t.expect(await getInnerHTMLBySelector('.popover .popover-body')).eql('<div>loves writing tests （╯°□°）╯︵ ┻━┻</div>');
  // await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).ok();
  // await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
  // await t.expect(await insertedPopover.count).eql(0, 'no inserted popovers on page');
});


// https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/popover.js#L82


// await t.expect(getDatasetBySelector('#popover-test', 'originalTitle')).eql('mdo');
// await t.expect(getDatasetBySelector('#popover-test', 'content')).eql('https://twitter.com/mdo');
// await t.expect(_.size(getDatasetBySelector('#popover-test', 'bsId'))).gt(0);
