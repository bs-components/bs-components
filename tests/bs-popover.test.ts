/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components popover tests').page('./bs.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/popover.js

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

const callPopoverMethodAndWaitForEventById = ClientFunction((id, passedOption, eventName) => new Promise((resolve) => {
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


const getStyleDisplayById = ClientFunction((id) => {
  // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
  const el = document.getElementById(id);
  const style = window.getComputedStyle(el);
  return style.display;
});


const triggerRealClickBySelector = ClientFunction((selector) => {
  const elements = Array.prototype.slice.call(document.querySelectorAll(selector));
  for (let j = 0; j < elements.length; j += 1) {
    elements[j].click();
  }
  return true;
});


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

  await t.expect(await callPopoverMethodAndWaitForEventById('popover-test', 'disable', 'disabled.bs.popover')).ok();

  // await t.expect(await callPopoverById('popover-test', 'disable')).ok();
  // await t.wait(500); // transition time
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed', { timeout: 5000 });
  // const postDisposePopoverConfig = await getPopoverConfig('popover-test');
  // // console.log('postDisposePopoverConfig: ', postDisposePopoverConfig);
  // await t.expect(_.size(postDisposePopoverConfig)).eql(0, 'popover does not have config');
  await t.click('#popover-test');
  await t.expect(await insertedPopover.nth(0).exists).notOk('does not open after click');
  await t.hover('#popover-test');
  await t.expect(await insertedPopover.nth(0).exists).notOk('does not open after hover');
});

test('should render popover element using delegated selector', async (t) => {
  // not sure why you would ever do this...
  // just add a separate web component bs-tooltip wrapper for every item you want a popover on even if dynamic
  const popoverHtml = '<bs-tooltip id="popover-test" data-animation="false" data-toggle="popover" title="Ace" data-content="Ace Backer"><a href="#">ace</a></bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const myPopoverConfig = {
    selector: 'a',
    trigger: 'click',
  };
  await t.expect(await callPopoverById('popover-test', myPopoverConfig)).ok();
  await t.expect(await triggerRealClickBySelector('#popover-test')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was not inserted');
  await t.expect(await triggerRealClickBySelector('a')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await triggerRealClickBySelector('a')).ok();
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover was removed');
});


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
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await shouldDetachPopoverContentRatherThanRemovingItSoThatEventHandlersAreLeftIntact()).ok();
});


test('should do nothing when an attempt is made to hide an uninitialized popover', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" disabled data-toggle="popover" data-title="some title" data-content="some content">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  console.log('\t...Waiting on timeout for hide event...');
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'hide', 'hidden.bs.popover')).notOk('should not fire any popover events');
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover does not exist');
});


test('should fire inserted event', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const myPopoverConfig = {
    title: 'Test',
    content: 'Test',
  };
  await t.expect(await callPopoverById('popover-test', myPopoverConfig)).ok();
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'inserted.bs.popover')).ok('inserted event fired');
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
});


test('should throw an error when show is called on hidden elements', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover" data-title="some title" data-content="Ace Backer" style="display: none">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect((await callPopoverById('popover-test', 'show')).message).eql('Please use show on visible elements');
});


test('should hide popovers when their containing modal is closed', async (t) => {
  const templateHtml = `
    <bs-modal id="modal-test" class="modal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <bs-tooltip id="popover-test" class="btn btn-secondary" data-toggle="popover" data-placement="top" data-content="Popover">
              Popover on top
            </bs-tooltip>
          </div>
        </div>
      </div>
    </bs-modal>`;
  const myModal = Selector('#modal-test');
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  await t.expect(await appendHtml(_.trim(templateHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await myModal.exists).ok();
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'show', 'shown.bs.modal')).ok('shown event fired');
  await t.expect(getStyleDisplayById('modal-test')).eql('block', 'modal inserted into dom');
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await callModalMethodAndWaitForEventById('modal-test', 'hide', 'hidden.bs.modal')).ok('hidden event fired');
  await t.expect(getStyleDisplayById('modal-test')).eql('none', 'modal not visible');
  await t.wait(150); // the popover transition duration time (not needed if animation=false)
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover does not exist', { timeout: 5000 });
});


test('should convert number to string without error for content and title', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  const insertedPopoverHeader = Selector('.popover .popover-header');
  const insertedPopoverBody = Selector('.popover .popover-body');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const myPopoverConfig = {
    title: 5,
    content: 7,
  };
  await t.expect(await callPopoverById('popover-test', myPopoverConfig)).ok();
  await t.expect(await runPopoverMethodAndWaitForEventById('popover-test', 'show', 'shown.bs.popover')).ok();
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopoverHeader.nth(0).innerText).eql('5', 'title correctly inserted as string');
  await t.expect(await insertedPopoverBody.nth(0).innerText).eql('7', 'content correctly inserted as string');
});


test('popover should be shown right away after the call of disable/enable', async (t) => {
  const popoverHtml = '<bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>';
  const myPopover = Selector('#popover-test');
  const insertedPopover = Selector('.popover');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  const myPopoverConfig = {
    title: 'Test popover',
    content: 'with disable/enable',
  };
  await t.expect(await callPopoverById('popover-test', myPopoverConfig)).ok();
  await t.expect(await callPopoverById('popover-test', 'disable')).ok();
  await t.click(myPopover);
  await t.wait(200);
  await t.expect(await insertedPopover.nth(0).exists).notOk('popover does not exist');
  await t.expect(await callPopoverById('popover-test', 'enable')).ok();
  await t.click(myPopover);
  await t.expect(await insertedPopover.nth(0).exists).ok('popover was inserted');
  await t.expect(await insertedPopover.nth(0).hasClass('show')).ok('popover has show class');
});


test('popover should call content function only once', async (t) => {
  const popoverShouldCallContentFunctionOnlyOnce = ClientFunction(() => new Promise((resolve) => {
    let contentFunctionCallCount = 0;
    const myPopoverConfig = {
      content: () => {
        contentFunctionCallCount += 1;
        const clonedEl: any = document.getElementById('popover').cloneNode(true);
        clonedEl.style.display = '';
        return clonedEl;
      },
    };
    const el:any = document.getElementById('popover-test');
    el.popover(myPopoverConfig);
    document.getElementById('popover-test').addEventListener('shown.bs.popover', () => {
      resolve(contentFunctionCallCount);
    }, { once: true });
    el.popover('show');
  }));
  const popoverHtml = `
    <div>
      <div id="popover" style="display:none">content</div>
      <bs-tooltip id="popover-test" data-toggle="popover">ace</bs-tooltip>
    </div>`;
  const myPopover = Selector('#popover-test');
  await t.expect(await appendHtml(_.trim(popoverHtml))).ok();
  await t.expect(await myPopover.exists).ok();
  await t.expect(await popoverShouldCallContentFunctionOnlyOnce()).eql(1, 'call content function only once');
});
