import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture `bs-components tooltip tests`
  .page `./test-bs-tooltip.html`;


  // similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tooltip.js
  // NOTE: Ideally, every test should leave the page state the same way it was before the test started.


const callTooltipById = ClientFunction((id, passedOption) => {
  const tooltipEl:any = document.getElementById(id);
  try {
    if (tooltipEl.tooltip(passedOption)) {
      return true;
    } else {
      return false;
    }
  } catch(err) {
    return err;
  }
});

const waitForEventOnElementById = ClientFunction((id, eventName) => {
  return new Promise((resolve) => {
    const myTimeout = setTimeout(() => {
      // 6 seconds should be more than long enough for any reasonable real world transition
      document.getElementById(id).removeEventListener(eventName, handleEventHappened);
      resolve(false);
    }, 6000);
    const handleEventHappened = (event) => {
      clearTimeout(myTimeout);
      resolve(true);
    };
    document.getElementById(id).addEventListener(eventName, handleEventHappened);
  });
});

const runTooltipMethodAndWaitForEventById = ClientFunction((id, passedOption, eventName) => {
  return new Promise((resolve) => {
    const myTimeout = setTimeout(() => {
      // 6 seconds should be more than long enough for any reasonable real world transition
      document.getElementById(id).removeEventListener(eventName, handleEventHappened);
      resolve(false);
    }, 6000);
    const handleEventHappened = (event) => {
      clearTimeout(myTimeout);
      resolve(true);
    };
    document.getElementById(id).addEventListener(eventName, handleEventHappened, { once: true });
    const tooltipEl:any = document.getElementById(id);
    tooltipEl.tooltip(passedOption);
  });
});

// const triggerEventById = ClientFunction((id, eventName) => {
//   if (document.getElementById(id).dispatchEvent(new Event('eventName'))) {
//     return true;
//   } else {
//     return false;
//   }
// });



test('refresh page to clear cache', async t => {
  await t.eval(() => location.reload(true));
  await t.expect(true).ok()
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



// test('should destroy tooltip', async t => {
//   // note this only unloads all memory items.
//   // to truly destroy this web component delete it from the dom and the unload events will release the
//   // same resources as .tooltip('disable')
//   await t
//   .expect(await Selector('#tooltip-with-custom-class').visible).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'shown.bs.tooltip')).ok();
//   const tooltipId = await Selector('#tooltip-with-custom-class').getAttribute('data-bs-id');
//   await t
//   .expect(await callTooltipById('tooltip-with-custom-class', 'disable')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('No tooltip was shown')
//   .hover('#tooltip-with-custom-class')
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('No tooltip was shown')
//   .click('#tooltip-with-custom-class')
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('No tooltip was shown')
//   .expect(await callTooltipById('tooltip-with-custom-class', 'enable')).ok(); // just leaving it as we found it
// });


// test('should show tooltip when toggle is called', async t => {
//   await t
//   .expect(await Selector('#should-fire-shown-tooltip').visible).ok();
//   const tooltipId = await Selector('#should-fire-shown-tooltip').getAttribute('data-bs-id');
//   await t
//   .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'toggle', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).ok('tooltip is visible')
//   .expect(await Selector(`#${tooltipId}`).hasClass('fade')).ok('tooltip is faded active')
//   .expect(await Selector(`#${tooltipId}`).hasClass('show')).ok('tooltip is faded active');
// });


// test('should hide previously shown tooltip when toggle is called on tooltip', async t => {
//   await t
//   .expect(await Selector('#should-fire-shown-tooltip').visible).ok();
//   const tooltipId = await Selector('#should-fire-shown-tooltip').getAttribute('data-bs-id');
//   await t
//   .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'toggle', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip is not in dom tree')
//   // .expect(await Selector(`#${tooltipId}`).hasClass('fade')).notOk('tooltip was faded out')
//   // .expect(await Selector(`#${tooltipId}`).hasClass('show')).notOk('tooltip was faded out');
// });


// test('should place tooltips inside body when container is body', async t => {
//   await t
//   .expect(await Selector('#should-fire-shown-tooltip').visible).ok()
//   .expect(await callTooltipById('bottom-tooltip-button', { container: 'body' })).ok(); // gives it a new id
//   const tooltipId = await Selector('#should-fire-shown-tooltip').getAttribute('data-bs-id');
//   await t
//   .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`body > #${tooltipId}`).exists).ok('tooltip is not in parent')
//   .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'hide', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip is not in dom tree')
// });


// test('should add position class before positioning so that position-specific styles are taken into account', async t => {
//   const addStylesToHead = ClientFunction(() => {
//     const template = document.createElement('template');
//     template.innerHTML = '<style>' +
//     '.bs-tooltip-right { white-space: nowrap; }' +
//     '.bs-tooltip-right .tooltip-inner { max-width: 0px; }' +
//     '</style>';
//     const styles = template.content.firstChild;
//     if (document.head.appendChild(styles)) {
//       return true;
//     } else {
//       return false;
//     }
//   });
//   const removeStylesFromHead = ClientFunction(() => {
//     const styleEl = document.head.querySelector('style');
//     if (styleEl) {
//       styleEl.parentNode.removeChild(styleEl);
//       return true;
//     }
//     return false;
//   });
//   await t
//   .expect(await Selector('#very-very-long-tooltip').visible).ok()
//   .expect(await addStylesToHead()).ok()
//   .expect(await callTooltipById('very-very-long-tooltip', { placement: 'right', trigger: 'manual' })).ok(); // gives it a new id
//   const tooltipId = await Selector('#very-very-long-tooltip').getAttribute('data-bs-id');
//   await t
//   .expect(await runTooltipMethodAndWaitForEventById('very-very-long-tooltip', 'show', 'inserted.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).hasClass('bs-tooltip-right')).ok()
//   .expect(await removeStylesFromHead()).ok()
// });



// test('should use title attribute for tooltip text', async t => {
//   await t
//   .expect(await Selector('#simple-tooltip').visible).ok();
//   const tooltipId = await Selector('#simple-tooltip').getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .expect(await runTooltipMethodAndWaitForEventById('simple-tooltip', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('Simple tooltip', 'title from title attribute is set')
//   .expect(await runTooltipMethodAndWaitForEventById('simple-tooltip', 'hide', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
// });



// test('should prefer title attribute over title option', async t => {
//   await t
//   .expect(await Selector('#simple-tooltip').visible).ok()
//   .expect(await callTooltipById('simple-tooltip', { title: 'This is a tooltip with some content' })).ok(); // gives it a new id
//   const tooltipId = await Selector('#simple-tooltip').getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .expect(await runTooltipMethodAndWaitForEventById('simple-tooltip', 'show', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('Simple tooltip', 'title from title attribute is set')
//   .expect(await runTooltipMethodAndWaitForEventById('simple-tooltip', 'hide', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
// });


// test('should use title option', async t => {
//   const id = 'should-use-title-option-tooltip';
//   await t
//   .expect(await Selector(`#${id}`).visible).ok()
//   .expect(await callTooltipById(id, { title: 'This is a tooltip with some content' })).ok(); // gives it a new id
//   const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'shown.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('This is a tooltip with some content', 'title from title option is set')
//   .expect(await runTooltipMethodAndWaitForEventById(id, 'hide', 'hidden.bs.tooltip')).ok()
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
// });

// // 'should not error when trying to show a top-placed tooltip that has been removed from the dom'
// // The code for a web component lives inside the element.  so if the element is removed
// // from the dom then there is nothing to throw an error.  Skipping this test.

// test('should show tooltip if leave event has not occurred before delay expires', async t => {
//   const id = 'another-tooltip';
//   await t
//   .expect(await Selector(`#${id}`).visible).ok()
//   .expect(await callTooltipById(id, { delay: 150 })).ok(); // gives it a new id
//   const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .hover(`#${id}`)
//   .wait(100)
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('100ms: tooltip is not present')
//   .wait(100);
//   await t
//   .expect(await Selector(`#${tooltipId}`).exists).ok('200ms: tooltip is present')
//   .expect(await callTooltipById(id, {})).ok(); // gives it a new id
// });


// test('should not show tooltip if leave event occurs before delay expires', async t => {
//   const id = 'top-tooltip-button';
//   await t
//   .expect(await Selector(`#${id}`).visible).ok()
//   .expect(await callTooltipById(id, { animation: false, delay: 150 })).ok(); // gives it a new id
//   const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
//   await t
//   .expect(tooltipId.length).gt(0)
//   .hover(`#${id}`)
//   .wait(100)
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('100ms: tooltip is not present')
//   .hover('#not-a-tooltip')
//   .wait(100);
//   await t
//   .expect(await Selector(`#${tooltipId}`).exists).notOk('200ms: tooltip is present')
//   .expect(await callTooltipById(id, {})).ok(); // gives it a new id
// });


test('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', async t => {
  const id = 'top-tooltip-button';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { delay: { show: 0, hide: 150 } })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t.expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(1);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok('1ms: tooltip is present')
  .hover('#not-a-tooltip')
  .wait(100);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok('100ms: tooltip is still present')
  .hover(`#${id}`)
  .wait(100);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok('200ms: tooltip is still present')
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});


test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', async t => {
  const id = 'top-tooltip-button';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { animation: false, delay: { show: 150, hide: 0 } })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(100)
  .expect(await Selector(`#${tooltipId}`).exists).notOk('100ms: tooltip is not present')
  .hover('#not-a-tooltip')
  .wait(100);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).notOk('200ms: tooltip is present')
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});


// https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tooltip.js#L651



