import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

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
      resolve(true);
    }, { once: true });
    const tooltipEl:any = document.getElementById(id);
    tooltipEl.tooltip(passedOption);
    // setTimeout(() => {
    //   resolve(false);
    // }, 6000);
  });
});


test('tooltip method is defined', async t => {
  // http://devexpress.github.io/testcafe/documentation/test-api/obtaining-data-from-the-client/examples-of-using-client-functions.html
  const hasTooltipMethod = ClientFunction(() => {
    const topTooltip:any = document.getElementById('top-tooltip-button'); // .parentElement.innerHTML;
    return typeof topTooltip.tooltip;
  });
  await t
  .expect(await Selector('#top-tooltip-button').visible).ok()
  .expect(await hasTooltipMethod()).eql('function');
});

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

// test('should allow DOMElement title (html: false)', async t => {
//   const setTextNode = ClientFunction((id, text) => {
//     const tooltipEl:any = document.getElementById(id);
//     try {
//       return tooltipEl.tooltip({ title: document.createTextNode(text) });
//     } catch(err) {
//       return err;
//     }
//   });
//   await t.expect(await Selector('#dom-title-tooltip-button').visible).ok()
//   const mySetTextNode = setTextNode('dom-title-tooltip-button', '<3 writing tests');
//   await t.expect(await mySetTextNode).ok();
//   const tooltipId = await Selector('#dom-title-tooltip-button').getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .expect(await runTooltipMethodAndWaitForEventById('dom-title-tooltip-button', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('<3 writing tests', 'title inserted')
//   .expect(await runTooltipMethodAndWaitForEventById('dom-title-tooltip-button', 'hide', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
// });


// test('should allow DOMElement title (html: true)', async t => {
//   const setTextNode = ClientFunction((id, text) => {
//     const tooltipEl:any = document.getElementById(id);
//     try {
//       return tooltipEl.tooltip({ html: true, title: document.createTextNode(text) });
//     } catch(err) {
//       return err;
//     }
//   });
//   await t.expect(await Selector('#dom-title-with-html-tooltip').visible).ok()
//   const mySetTextNode = setTextNode('dom-title-with-html-tooltip', '<3 writing tests');
//   await t.expect(await mySetTextNode).ok();
//   const tooltipId = await Selector('#dom-title-with-html-tooltip').getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .expect(await runTooltipMethodAndWaitForEventById('dom-title-with-html-tooltip', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('<3 writing tests', 'title inserted')
//   .expect(await runTooltipMethodAndWaitForEventById('dom-title-with-html-tooltip', 'hide', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
// });


// test('should respect custom classes', async t => {
//   const addTemplate = ClientFunction((id, text) => {
//     const tooltipEl:any = document.getElementById(id);
//     try {
//       return tooltipEl.tooltip({
//         template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'
//       });
//     } catch(err) {
//       return err;
//     }
//   });
//   await t
//   .expect(await Selector('#tooltip-with-custom-class').visible).ok();
//   const myAddedClassTemplate = await addTemplate('tooltip-with-custom-class', '<3 writing tests');
//   const tooltipId = await Selector('#tooltip-with-custom-class').getAttribute('data-bs-id');
//   await t
//   .expect(myAddedClassTemplate).ok()
//   .expect(tooltipId.length).gt(0)
//   .expect(await callTooltipById('tooltip-with-custom-class', 'show')).ok()
//   .expect(await waitForEventOnElementById('tooltip-with-custom-class', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}.tooltip`).hasClass('some-class')).ok('custom class is present')
//   .expect(await callTooltipById('tooltip-with-custom-class', 'hide')).ok()
//   .expect(await waitForEventOnElementById('tooltip-with-custom-class', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).count).eql(0, 'tooltip removed')
// });


// test('should fire show event', async t => {
//   await t
//   .expect(await Selector('#tooltip-with-custom-class').visible).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'show.bs.tooltip')).ok()
// });


// test('should throw an error when show is called on hidden elements', async t => {
//   await t
//   .expect(await Selector('#tooltip-with-display-none').visible).ok();
//   const hideById = ClientFunction((id) => {
//     document.getElementById(id).style.display = 'none';
//   });
//   await hideById('tooltip-with-display-none');
//   const showOnHiddenElement = await callTooltipById('tooltip-with-display-none', 'show');
//   const errorMessage = _.get(showOnHiddenElement, 'message', '');
//   if (_.size(errorMessage) === 0) {
//     console.log('showOnHiddenElement: ', showOnHiddenElement);
//   }
//   const tooltipId = await Selector('#tooltip-with-display-none').getAttribute('data-bs-id');
//   await t
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('No tooltip was shown')
//   .expect(errorMessage).eql('Please use show on visible elements');
// });


// test('should fire inserted event', async t => {
//   await t
//   .expect(await Selector('#fire-inserted-me-laddo').visible).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('fire-inserted-me-laddo', 'show', 'inserted.bs.tooltip')).ok()
// });

// test('should fire shown event', async t => {
//   await t
//   .expect(await Selector('#should-fire-shown-tooltip').visible).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'show', 'shown.bs.tooltip')).ok()
// });


// test('should not fire shown event when show was prevented', async t => {
//   const shouldNotFireShownEventWhenShowWasPrevented = ClientFunction(() => {
//     return new Promise((resolve) => {
//       var myTimeout;
//       const handleShowEvent = (event) => {
//         event.preventDefault();
//       };
//       const handleShownEvent = (event) => {
//         clearTimeout(myTimeout);
//         document.getElementById('should-not-show-tooltip').removeEventListener('show.bs.tooltip', handleShowEvent);
//         document.getElementById('should-not-show-tooltip').removeEventListener('shown.bs.tooltip', handleShownEvent);
//         resolve(false);
//       };
//       document.getElementById('should-not-show-tooltip').addEventListener('show.bs.tooltip', handleShowEvent);
//       document.getElementById('should-not-show-tooltip').addEventListener('shown.bs.tooltip', handleShownEvent);
//       const tooltipEl:any = document.getElementById('should-not-show-tooltip');
//       tooltipEl.tooltip('show');
//       myTimeout = setTimeout(() => {
//         // 6 seconds should be long enough for any transition
//         document.getElementById('should-not-show-tooltip').removeEventListener('show.bs.tooltip', handleShowEvent);
//         document.getElementById('should-not-show-tooltip').removeEventListener('shown.bs.tooltip', handleShownEvent);
//         resolve(true);
//       }, 6000);
//     });
//   });
//   await t
//   .expect(await Selector('#should-not-show-tooltip').visible).ok()
//   .expect(await shouldNotFireShownEventWhenShowWasPrevented()).ok()
// });


// test('should fire hide event', async t => {
//   await t
//   .expect(await Selector('#tooltip-with-custom-class').visible).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'hide', 'hide.bs.tooltip')).ok()
// });


// test('should fire hidden event', async t => {
//   await t
//   .expect(await Selector('#tooltip-with-custom-class').visible).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'hide', 'hidden.bs.tooltip')).ok()
// });


// test('should not fire hidden event when hide was prevented', async t => {
//   await t
//   .expect(await Selector('#tooltip-with-custom-class').visible).ok();
//   const shouldNotFireHiddenEventWhenHideWasPrevented = ClientFunction(() => {
//     return new Promise((resolve) => {
//       var myTimeout;
//       const handleHideEvent = (event) => {
//         event.preventDefault();
//       };
//       const handleHiddenEvent = (event) => {
//         clearTimeout(myTimeout);
//         document.getElementById('tooltip-with-custom-class').removeEventListener('hide.bs.tooltip', handleHideEvent);
//         document.getElementById('tooltip-with-custom-class').removeEventListener('hidden.bs.tooltip', handleHiddenEvent);
//         resolve(false);
//       };
//       document.getElementById('tooltip-with-custom-class').addEventListener('hide.bs.tooltip', handleHideEvent);
//       document.getElementById('tooltip-with-custom-class').addEventListener('hidden.bs.tooltip', handleHiddenEvent);
//       const tooltipEl:any = document.getElementById('tooltip-with-custom-class');
//       tooltipEl.tooltip('hide');
//       myTimeout = setTimeout(() => {
//         // 6 seconds should be long enough for any transition
//         document.getElementById('tooltip-with-custom-class').removeEventListener('hide.bs.tooltip', handleHideEvent);
//         document.getElementById('tooltip-with-custom-class').removeEventListener('hidden.bs.tooltip', handleHiddenEvent);
//         resolve(true);
//       }, 6000);
//     });
//   });

//   await t
//   .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await shouldNotFireHiddenEventWhenHideWasPrevented()).ok()
// });



test('should destroy tooltip', async t => {
  // note this only unloads all memory items.
  // to truely destroy this webcomponent delete it from the dom and the unload events will release the
  // same rerources as .tooltip('disable')
  await t
  .expect(await Selector('#tooltip-with-custom-class').visible).ok()
  .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'shown.bs.tooltip')).ok();
  const tooltipId = await Selector('#tooltip-with-custom-class').getAttribute('data-bs-id');
  await t
  .expect(await callTooltipById('tooltip-with-custom-class', 'disable')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).notOk('No tooltip was shown')
  .hover('#tooltip-with-custom-class')
  .expect(await Selector(`#${tooltipId}`).exists).notOk('No tooltip was shown')
  .click('#tooltip-with-custom-class')
  .expect(await Selector(`#${tooltipId}`).exists).notOk('No tooltip was shown')
  .expect(await callTooltipById('tooltip-with-custom-class', 'enable')).ok(); // just leaving it as we found it
});


test('should show tooltip when toggle is called', async t => {
  await t
  .expect(await Selector('#should-fire-shown-tooltip').visible).ok();
  const tooltipId = await Selector('#should-fire-shown-tooltip').getAttribute('data-bs-id');
  await t
  .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'toggle', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).ok('tooltip is visisble')
  .expect(await Selector(`#${tooltipId}`).hasClass('fade')).ok('tooltip is faded active')
  .expect(await Selector(`#${tooltipId}`).hasClass('show')).ok('tooltip is faded active');
});

// https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tooltip.js#L382