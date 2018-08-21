import { Selector, ClientFunction } from 'testcafe';

// const _ = require('lodash');

fixture `bs-components tooltip tests`.page `./test-bs-tooltip.html`;

  // similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tooltip.js


const callTooltipById = ClientFunction((id, passedOption) => {
  const tooltipEl:any = document.getElementById(id);
  try {
    return tooltipEl.tooltip(passedOption);
  } catch(err) {
    return err;
  }
});

const waitForEventOnElementById = ClientFunction((id, eventName) => {
  return new Promise((resolve) => {
    document.getElementById(id).addEventListener(eventName, (event) => {
      resolve(event);
    }, { once: true });
  });
});

const runTooltipMethodAndWaitForEventById = ClientFunction((id, passedOption, eventName) => {
  return new Promise((resolve) => {
    document.getElementById(id).addEventListener(eventName, (event) => {
      resolve(event);
    }, { once: true });
    const tooltipEl:any = document.getElementById(id);
    tooltipEl.tooltip(passedOption);
  });
});


// test('tooltip method is defined', async t => {
//   // http://devexpress.github.io/testcafe/documentation/test-api/obtaining-data-from-the-client/examples-of-using-client-functions.html
//   const hasTooltipMethod = ClientFunction(() => {
//     const topTooltip:any = document.getElementById('top-tooltip-button'); // .parentElement.innerHTML;
//     return typeof topTooltip.tooltip;
//   });
//   await t
//   .expect(await Selector('#top-tooltip-button').visible).ok()
//   .expect(await hasTooltipMethod()).eql('function');
// });

// test('should throw explicit error on undefined method', async t => {
//   await t
//   .expect(await Selector('#top-tooltip-button').visible).ok()
//   .expect((await callTooltipById('top-tooltip-button', 'noMethod')).message).eql('No method named "noMethod"');
// });

// test('should return the element', async t => {
//   const returnsItself = ClientFunction(() => {
//     const topTooltip:any = document.getElementById('top-tooltip-button');
//     return topTooltip === topTooltip.tooltip();
//   });
//   await t
//   .expect(await Selector('#top-tooltip-button').visible).ok()
//   .expect(await returnsItself()).ok();
// });

// test('should expose default settings', async t => {
//   const getDefaults = ClientFunction(() => {
//     const topTooltip:any = document.getElementById('top-tooltip-button');
//     return topTooltip.defaults;
//   });
//   await t
//   .expect(await Selector('#top-tooltip-button').visible).ok()
//   .expect(await getDefaults()).ok()
//   .expect(typeof await getDefaults()).eql('object');
// });

// test('should empty title attribute', async t => {
//   await t
//   .expect(await Selector('#top-tooltip-button').visible).ok()
//   .expect(await Selector('#top-tooltip-button').getAttribute('title')).eql('');
// });


// test('should add data attribute for referencing original title', async t => {
//   await t
//   .expect(await Selector('#bottom-tooltip-button').visible).ok()
//   .expect(await Selector('#another-tooltip').getAttribute('data-original-title')).eql('Another tooltip');
// });


// test('should add aria-describedby to the trigger on show', async t => {
//   await t
//   .expect(await Selector('#top-tooltip-button').visible).ok()
//   .expect(await callTooltipById('top-tooltip-button', 'show')).ok()
//   .expect(await waitForEventOnElementById('top-tooltip-button', 'shown.bs.tooltip')).ok()
//   .expect((await Selector('#top-tooltip-button').getAttribute('aria-describedby')).length > 0).ok()
//   .expect((await Selector('.tooltip').getAttribute('id')).length > 0).ok()
//   .expect(await Selector('#top-tooltip-button').getAttribute('aria-describedby')).eql(await Selector('.tooltip').getAttribute('id'))
// });


// test('should remove aria-describedby from trigger on hide', async t => {
//   await t
//   .expect(await Selector('#bottom-tooltip-button').visible).ok()
//   .expect(await callTooltipById('right-tooltip-button', 'show')).ok()
//   .expect(await waitForEventOnElementById('right-tooltip-button', 'shown.bs.tooltip')).ok()
//   .expect(await Selector('#right-tooltip-button').getAttribute('aria-describedby')).ok()
//   .expect(await callTooltipById('right-tooltip-button', 'hide')).ok()
//   .expect(await waitForEventOnElementById('right-tooltip-button', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector('#right-tooltip-button').getAttribute('aria-describedby')).notOk()
// });

// test('should assign a unique id tooltip element', async t => {
//   await t
//   .expect(await Selector('#bottom-tooltip-button').visible).ok()
//   const tooltipId = await Selector('#another-tooltip').getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .expect(tooltipId.indexOf('tooltip')).eql(0, 'tooltip id has prefix')
//   .expect(await callTooltipById('another-tooltip', 'show')).ok()
//   .expect(await Selector(`#${tooltipId}`).count).eql(1, 'tooltip has a unique id');
// });

// test('should place tooltips relative to placement option', async t => {
//   await t
//   .expect(await Selector('#bottom-tooltip-button').visible).ok()
//   .expect(await callTooltipById('bottom-tooltip-button', { placement: 'bottom' })).ok(); // gives it a new id
//   const tooltipId = await Selector('#bottom-tooltip-button').getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .expect(await callTooltipById('bottom-tooltip-button', 'show')).ok()
//   .expect(await waitForEventOnElementById('bottom-tooltip-button', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).hasClass('fade')).ok()
//   .expect(await Selector(`#${tooltipId}`).hasClass('bs-tooltip-bottom')).ok()
//   .expect(await Selector(`#${tooltipId}`).hasClass('show')).ok()
//   .expect(await callTooltipById('bottom-tooltip-button', 'hide')).ok()
//   .expect(await waitForEventOnElementById('bottom-tooltip-button', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).count).eql(0, 'tooltip removed')
// });

// test('should allow html entities', async t => {
//   await t
//   .expect(await Selector('#html-tooltip-button').visible).ok()
//   .expect(await callTooltipById('html-tooltip-button', { html: true })).ok(); // gives it a new id
//   const tooltipId = await Selector('#html-tooltip-button').getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .expect(await callTooltipById('html-tooltip-button', 'show')).ok()
//   .expect(await waitForEventOnElementById('html-tooltip-button', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId} b`).count).eql(1, 'b tag was inserted')
//   .expect(await callTooltipById('html-tooltip-button', 'hide')).ok()
//   .expect(await waitForEventOnElementById('html-tooltip-button', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).count).eql(0, 'tooltip removed')
// });

test('should allow DOMElement title (html: false)', async t => {
  const setTextNode = ClientFunction((id, text) => {
    const tooltipEl:any = document.getElementById(id);
    try {
      return tooltipEl.tooltip({ title: document.createTextNode(text) });
    } catch(err) {
      return err;
    }
  });
  await t
  .expect(await Selector('#dom-title-tooltip-button').visible).ok();
  const mySetTextNode = await setTextNode('dom-title-tooltip-button', '<3 writing tests');
  const tooltipId = await Selector('#dom-title-tooltip-button').getAttribute('data-bs-id');
  await t
  .expect(await mySetTextNode).ok()
  .expect(await tooltipId.length).gt(0)
  .expect(await callTooltipById('dom-title-tooltip-button', 'show')).ok()
  .expect(await waitForEventOnElementById('dom-title-tooltip-button', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId} .tooltip-inner`).innerText).eql('<3 writing tests', 'title inserted')
  .expect(await callTooltipById('dom-title-tooltip-button', 'hide')).ok()
  .expect(await waitForEventOnElementById('dom-title-tooltip-button', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).count).eql(0, 'tooltip removed')
});


test('should allow DOMElement title (html: true)', async t => {
  const setTextNode = ClientFunction((id, text) => {
    const tooltipEl:any = document.getElementById(id);
    try {
      return tooltipEl.tooltip({ html: true, title: document.createTextNode(text) });
    } catch(err) {
      return err;
    }
  });
  await t
  .expect(await Selector('#dom-title-with-html-tooltip').visible).ok();
  const mySetTextNode = await setTextNode('dom-title-with-html-tooltip', '<3 writing tests');
  const tooltipId = await Selector('#dom-title-with-html-tooltip').getAttribute('data-bs-id');
  await t
  .expect(await mySetTextNode).ok()
  .expect(await tooltipId.length).gt(0)
  .expect(await callTooltipById('dom-title-with-html-tooltip', 'show')).ok()
  .expect(await waitForEventOnElementById('dom-title-with-html-tooltip', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId} .tooltip-inner`).innerText).eql('<3 writing tests', 'title inserted')
  .expect(await callTooltipById('dom-title-with-html-tooltip', 'hide')).ok()
  .expect(await waitForEventOnElementById('dom-title-with-html-tooltip', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).count).eql(0, 'tooltip removed')
});


test('should respect custom classes', async t => {
  const addTemplate = ClientFunction((id, text) => {
    const tooltipEl:any = document.getElementById(id);
    try {
      return tooltipEl.tooltip({
        template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'
      });
    } catch(err) {
      return err;
    }
  });
  await t
  .expect(await Selector('#tooltip-with-custom-class').visible).ok();
  const myAddedClassTemplate = await addTemplate('tooltip-with-custom-class', '<3 writing tests');
  const tooltipId = await Selector('#tooltip-with-custom-class').getAttribute('data-bs-id');
  await t
  .expect(myAddedClassTemplate).ok()
  .expect(tooltipId.length).gt(0)
  .expect(await callTooltipById('tooltip-with-custom-class', 'show')).ok()
  .expect(await waitForEventOnElementById('tooltip-with-custom-class', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}.tooltip`).hasClass('some-class')).ok('custom class is present')
  .expect(await callTooltipById('tooltip-with-custom-class', 'hide')).ok()
  .expect(await waitForEventOnElementById('tooltip-with-custom-class', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).count).eql(0, 'tooltip removed')
});


test('should fire show event', async t => {
  await t
  .expect(await Selector('#tooltip-with-custom-class').visible).ok()
  .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'show.bs.tooltip')).ok()
});


test('should throw an error when show is called on hidden elements', async t => {
  const showOnHiddenElement = await callTooltipById('tooltip-with-display-none', 'show');
  await t
  .expect(showOnHiddenElement.message).eql('Please use show on visible elements');
});


test('should fire inserted event', async t => {
  await t
  .expect(await Selector('#fire-inserted-me-laddo').visible).ok()

  // const tooltipId = await Selector('#fire-inserted-me-laddo').getAttribute('data-bs-id');

  // const wasInserted = await runTooltipMethodAndWaitForEventById('fire-inserted-me-laddo', 'show', 'inserted.bs.tooltip');

  // console.log('wasInserted: ', wasInserted);


  // .expect(await wasInserted).ok()
  .expect(await runTooltipMethodAndWaitForEventById('fire-inserted-me-laddo', 'show', 'inserted.bs.tooltip')).ok()
  // .expect(await Selector(`#${tooltipId}`).count).eql(1, 'tooltip was inserted');
});