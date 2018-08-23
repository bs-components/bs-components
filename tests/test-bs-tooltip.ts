import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture `bs-components tooltip tests`.page `./test-bs-tooltip.html`;

  // similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tooltip.js
  // NOTE: Ideally, every test should leave the page state the same way it was before the test started.
  // NOTE: times were increased to make up for testcafe platform compared tp jsdom based unit tests

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

const runTooltipMethodAndWaitForEventById = ClientFunction(function (id, passedOption, eventName) {
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


const focusById = ClientFunction((id) => {
  document.getElementById(id).focus();
  return true;
});

const blurById = ClientFunction((id) => {
  document.getElementById(id).blur();
  return true;
});

const setAttributeById = ClientFunction((id, attribute, value) => {
  document.getElementById(id).setAttribute(attribute, value);
  return true;
});

const removeAttributeById = ClientFunction((id, attribute) => {
  document.getElementById(id).removeAttribute(attribute);
  return true;
});


test('refresh page to clear cache', async t => {
  await t.eval(() => location.reload(true));
  await t.expect(true).ok()
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

test('should throw explicit error on undefined method', async t => {
  await t
  .expect(await Selector('#top-tooltip-button').visible).ok()
  .expect((await callTooltipById('top-tooltip-button', 'noMethod')).message).eql('No method named "noMethod"');
});

test('should return the element', async t => {
  const returnsItself = ClientFunction(() => {
    const topTooltip:any = document.getElementById('top-tooltip-button');
    return topTooltip === topTooltip.tooltip();
  });
  await t
  .expect(await Selector('#top-tooltip-button').visible).ok()
  .expect(await returnsItself()).ok();
});

test('should expose default settings', async t => {
  const getDefaults = ClientFunction(() => {
    const topTooltip:any = document.getElementById('top-tooltip-button');
    return topTooltip.defaults;
  });
  await t
  .expect(await Selector('#top-tooltip-button').visible).ok()
  .expect(await getDefaults()).ok()
  .expect(typeof await getDefaults()).eql('object');
});

test('should empty title attribute', async t => {
  await t
  .expect(await Selector('#top-tooltip-button').visible).ok()
  .expect(await Selector('#top-tooltip-button').getAttribute('title')).eql('');
});


test('should add data attribute for referencing original title', async t => {
  await t
  .expect(await Selector('#bottom-tooltip-button').visible).ok()
  .expect(await Selector('#another-tooltip').getAttribute('data-original-title')).eql('Another tooltip');
});


test('should add aria-describedby to the trigger on show', async t => {
  const id = 'top-tooltip-button';
  await t.expect(await Selector(`#${id}`).visible).ok()
  await t.expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'shown.bs.tooltip')).ok()
  // .expect(await callTooltipById(id, 'show')).ok()
  // .expect(await waitForEventOnElementById('top-tooltip-button', 'shown.bs.tooltip')).ok()
  // await t.expect((await Selector(`#${id}`).getAttribute('aria-describedby')).length > 0).ok()
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t.expect(tooltipId.length).gt(0)
  // .expect((await Selector('.tooltip').getAttribute('id')).length > 0).ok()
  .expect(await Selector(`#${id}`).getAttribute('aria-describedby')).eql(tooltipId)
});


test('should remove aria-describedby from trigger on hide', async t => {
  await t
  .expect(await Selector('#bottom-tooltip-button').visible).ok()
  .expect(await callTooltipById('right-tooltip-button', 'show')).ok()
  .expect(await waitForEventOnElementById('right-tooltip-button', 'shown.bs.tooltip')).ok()
  .expect(await Selector('#right-tooltip-button').getAttribute('aria-describedby')).ok()
  .expect(await callTooltipById('right-tooltip-button', 'hide')).ok()
  .expect(await waitForEventOnElementById('right-tooltip-button', 'hidden.bs.tooltip')).ok()
  .expect(await Selector('#right-tooltip-button').getAttribute('aria-describedby')).notOk()
});

test('should assign a unique id tooltip element', async t => {
  await t
  .expect(await Selector('#bottom-tooltip-button').visible).ok()
  const tooltipId = await Selector('#another-tooltip').getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .expect(tooltipId.indexOf('tooltip')).eql(0, 'tooltip id has prefix')
  .expect(await callTooltipById('another-tooltip', 'show')).ok()
  .expect(await Selector(`#${tooltipId}`).count).eql(1, 'tooltip has a unique id');
});

test('should place tooltips relative to placement option', async t => {
  await t
  .expect(await Selector('#bottom-tooltip-button').visible).ok()
  .expect(await callTooltipById('bottom-tooltip-button', { placement: 'bottom' })).ok(); // gives it a new id
  const tooltipId = await Selector('#bottom-tooltip-button').getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .expect(await callTooltipById('bottom-tooltip-button', 'show')).ok()
  .expect(await waitForEventOnElementById('bottom-tooltip-button', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).hasClass('fade')).ok()
  .expect(await Selector(`#${tooltipId}`).hasClass('bs-tooltip-bottom')).ok()
  .expect(await Selector(`#${tooltipId}`).hasClass('show')).ok()
  .expect(await callTooltipById('bottom-tooltip-button', 'hide')).ok()
  .expect(await waitForEventOnElementById('bottom-tooltip-button', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).count).eql(0, 'tooltip removed')
});

test('should allow html entities', async t => {
  await t
  .expect(await Selector('#html-tooltip-button').visible).ok()
  .expect(await callTooltipById('html-tooltip-button', { html: true })).ok(); // gives it a new id
  const tooltipId = await Selector('#html-tooltip-button').getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .expect(await callTooltipById('html-tooltip-button', 'show')).ok()
  .expect(await waitForEventOnElementById('html-tooltip-button', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId} b`).count).eql(1, 'b tag was inserted')
  .expect(await callTooltipById('html-tooltip-button', 'hide')).ok()
  .expect(await waitForEventOnElementById('html-tooltip-button', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).count).eql(0, 'tooltip removed')
});

test('should allow DOMElement title (html: false)', async t => {
  const setTextNode = ClientFunction((id, text) => {
    const tooltipEl:any = document.getElementById(id);
    try {
      return tooltipEl.tooltip({ title: document.createTextNode(text) });
    } catch(err) {
      return err;
    }
  });
  await t.expect(await Selector('#dom-title-tooltip-button').visible).ok()
  const mySetTextNode = setTextNode('dom-title-tooltip-button', '<3 writing tests');
  await t.expect(await mySetTextNode).ok();
  const tooltipId = await Selector('#dom-title-tooltip-button').getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .expect(await runTooltipMethodAndWaitForEventById('dom-title-tooltip-button', 'show', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('<3 writing tests', 'title inserted')
  .expect(await runTooltipMethodAndWaitForEventById('dom-title-tooltip-button', 'hide', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
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
  await t.expect(await Selector('#dom-title-with-html-tooltip').visible).ok()
  const mySetTextNode = setTextNode('dom-title-with-html-tooltip', '<3 writing tests');
  await t.expect(await mySetTextNode).ok();
  const tooltipId = await Selector('#dom-title-with-html-tooltip').getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .expect(await runTooltipMethodAndWaitForEventById('dom-title-with-html-tooltip', 'show', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('<3 writing tests', 'title inserted')
  .expect(await runTooltipMethodAndWaitForEventById('dom-title-with-html-tooltip', 'hide', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
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
  await t
  .expect(await Selector('#tooltip-with-display-none').visible).ok();
  const hideById = ClientFunction((id) => {
    document.getElementById(id).style.display = 'none';
  });
  await hideById('tooltip-with-display-none');
  const showOnHiddenElement = await callTooltipById('tooltip-with-display-none', 'show');
  const errorMessage = _.get(showOnHiddenElement, 'message', '');
  if (_.size(errorMessage) === 0) {
    console.log('showOnHiddenElement: ', showOnHiddenElement);
  }
  const tooltipId = await Selector('#tooltip-with-display-none').getAttribute('data-bs-id');
  await t
  .expect(await Selector(`#${tooltipId}`).exists).notOk('No tooltip was shown')
  .expect(errorMessage).eql('Please use show on visible elements');
});


test('should fire inserted event', async t => {
  await t
  .expect(await Selector('#fire-inserted-me-laddo').visible).ok()
  .expect(await runTooltipMethodAndWaitForEventById('fire-inserted-me-laddo', 'show', 'inserted.bs.tooltip')).ok()
});

test('should fire shown event', async t => {
  await t
  .expect(await Selector('#should-fire-shown-tooltip').visible).ok()
  .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'show', 'shown.bs.tooltip')).ok()
});


test('should not fire shown event when show was prevented', async t => {
  const shouldNotFireShownEventWhenShowWasPrevented = ClientFunction(() => {
    return new Promise((resolve) => {
      var myTimeout;
      const handleShowEvent = (event) => {
        event.preventDefault();
      };
      const handleShownEvent = (event) => {
        clearTimeout(myTimeout);
        document.getElementById('should-not-show-tooltip').removeEventListener('show.bs.tooltip', handleShowEvent);
        document.getElementById('should-not-show-tooltip').removeEventListener('shown.bs.tooltip', handleShownEvent);
        resolve(false);
      };
      document.getElementById('should-not-show-tooltip').addEventListener('show.bs.tooltip', handleShowEvent);
      document.getElementById('should-not-show-tooltip').addEventListener('shown.bs.tooltip', handleShownEvent);
      const tooltipEl:any = document.getElementById('should-not-show-tooltip');
      tooltipEl.tooltip('show');
      myTimeout = setTimeout(() => {
        // 6 seconds should be long enough for any transition
        document.getElementById('should-not-show-tooltip').removeEventListener('show.bs.tooltip', handleShowEvent);
        document.getElementById('should-not-show-tooltip').removeEventListener('shown.bs.tooltip', handleShownEvent);
        resolve(true);
      }, 6000);
    });
  });
  await t.expect(await Selector('#should-not-show-tooltip').visible).ok()
  console.log('\t...waiting for timeout on show event...');
  await t.expect(await shouldNotFireShownEventWhenShowWasPrevented()).ok()
});


test('should fire hide event', async t => {
  await t
  .expect(await Selector('#tooltip-with-custom-class').visible).ok()
  .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'shown.bs.tooltip')).ok()
  .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'hide', 'hide.bs.tooltip')).ok()
});


test('should fire hidden event', async t => {
  await t
  .expect(await Selector('#tooltip-with-custom-class').visible).ok()
  .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'shown.bs.tooltip')).ok()
  .expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'hide', 'hidden.bs.tooltip')).ok()
});


test('should not fire hidden event when hide was prevented', async t => {
  await t
  .expect(await Selector('#tooltip-with-custom-class').visible).ok();
  const shouldNotFireHiddenEventWhenHideWasPrevented = ClientFunction(() => {
    return new Promise((resolve) => {
      var myTimeout;
      const handleHideEvent = (event) => {
        event.preventDefault();
      };
      const handleHiddenEvent = (event) => {
        clearTimeout(myTimeout);
        document.getElementById('tooltip-with-custom-class').removeEventListener('hide.bs.tooltip', handleHideEvent);
        document.getElementById('tooltip-with-custom-class').removeEventListener('hidden.bs.tooltip', handleHiddenEvent);
        resolve(false);
      };
      document.getElementById('tooltip-with-custom-class').addEventListener('hide.bs.tooltip', handleHideEvent);
      document.getElementById('tooltip-with-custom-class').addEventListener('hidden.bs.tooltip', handleHiddenEvent);
      const tooltipEl:any = document.getElementById('tooltip-with-custom-class');
      tooltipEl.tooltip('hide');
      myTimeout = setTimeout(() => {
        // 6 seconds should be long enough for any transition
        document.getElementById('tooltip-with-custom-class').removeEventListener('hide.bs.tooltip', handleHideEvent);
        document.getElementById('tooltip-with-custom-class').removeEventListener('hidden.bs.tooltip', handleHiddenEvent);
        resolve(true);
      }, 6000);
    });
  });
  await t.expect(await runTooltipMethodAndWaitForEventById('tooltip-with-custom-class', 'show', 'shown.bs.tooltip')).ok()
  console.log('\t...waiting for timeout on hide event...');
  await t.expect(await shouldNotFireHiddenEventWhenHideWasPrevented()).ok()
});



test('should destroy tooltip', async t => {
  // note this only unloads all memory items.
  // to truly destroy this web component delete it from the dom and the unload events will release the
  // same resources as .tooltip('disable')
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
  .expect(await Selector(`#${tooltipId}`).exists).ok('tooltip is visible')
  .expect(await Selector(`#${tooltipId}`).hasClass('fade')).ok('tooltip is faded active')
  .expect(await Selector(`#${tooltipId}`).hasClass('show')).ok('tooltip is faded active');
});


test('should hide previously shown tooltip when toggle is called on tooltip', async t => {
  await t
  .expect(await Selector('#should-fire-shown-tooltip').visible).ok();
  const tooltipId = await Selector('#should-fire-shown-tooltip').getAttribute('data-bs-id');
  await t
  .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'show', 'shown.bs.tooltip')).ok()
  .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'toggle', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip is not in dom tree')
  // .expect(await Selector(`#${tooltipId}`).hasClass('fade')).notOk('tooltip was faded out')
  // .expect(await Selector(`#${tooltipId}`).hasClass('show')).notOk('tooltip was faded out');
});


test('should place tooltips inside body when container is body', async t => {
  await t
  .expect(await Selector('#should-fire-shown-tooltip').visible).ok()
  .expect(await callTooltipById('bottom-tooltip-button', { container: 'body' })).ok(); // gives it a new id
  const tooltipId = await Selector('#should-fire-shown-tooltip').getAttribute('data-bs-id');
  await t
  .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'show', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`body > #${tooltipId}`).exists).ok('tooltip is not in parent')
  .expect(await runTooltipMethodAndWaitForEventById('should-fire-shown-tooltip', 'hide', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip is not in dom tree')
});


test('should add position class before positioning so that position-specific styles are taken into account', async t => {
  const addStylesToHead = ClientFunction(() => {
    const template = document.createElement('div');
    template.innerHTML = '<style>' +
    '.bs-tooltip-right { white-space: nowrap; }' +
    '.bs-tooltip-right .tooltip-inner { max-width: 0px; }' +
    '</style>';
    const styles = template.firstChild;
    if (document.head.appendChild(styles)) {
      return true;
    } else {
      return false;
    }
  });
  const removeStylesFromHead = ClientFunction(() => {
    const styleEl = document.head.querySelector('style');
    if (styleEl) {
      styleEl.parentNode.removeChild(styleEl);
      return true;
    }
    return false;
  });
  await t
  .expect(await Selector('#very-very-long-tooltip').visible).ok()
  .expect(await addStylesToHead()).ok()
  .expect(await callTooltipById('very-very-long-tooltip', { placement: 'right', trigger: 'manual' })).ok(); // gives it a new id
  const tooltipId = await Selector('#very-very-long-tooltip').getAttribute('data-bs-id');
  await t
  .expect(await runTooltipMethodAndWaitForEventById('very-very-long-tooltip', 'show', 'inserted.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).hasClass('bs-tooltip-right')).ok()
  .expect(await removeStylesFromHead()).ok()
});



test('should use title attribute for tooltip text', async t => {
  await t
  .expect(await Selector('#simple-tooltip').visible).ok();
  const tooltipId = await Selector('#simple-tooltip').getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .expect(await runTooltipMethodAndWaitForEventById('simple-tooltip', 'show', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('Simple tooltip', 'title from title attribute is set')
  .expect(await runTooltipMethodAndWaitForEventById('simple-tooltip', 'hide', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
});



test('should prefer title attribute over title option', async t => {
  await t
  .expect(await Selector('#simple-tooltip').visible).ok()
  .expect(await callTooltipById('simple-tooltip', { title: 'This is a tooltip with some content' })).ok(); // gives it a new id
  const tooltipId = await Selector('#simple-tooltip').getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .expect(await runTooltipMethodAndWaitForEventById('simple-tooltip', 'show', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('Simple tooltip', 'title from title attribute is set')
  .expect(await runTooltipMethodAndWaitForEventById('simple-tooltip', 'hide', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
});


test('should use title option', async t => {
  const id = 'should-use-title-option-tooltip';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { title: 'This is a tooltip with some content' })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'shown.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('This is a tooltip with some content', 'title from title option is set')
  .expect(await runTooltipMethodAndWaitForEventById(id, 'hide', 'hidden.bs.tooltip')).ok()
  .expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip removed');
});

// 'should not error when trying to show a top-placed tooltip that has been removed from the dom'
// The code for a web component lives inside the element.  so if the element is removed
// from the dom then there is nothing to throw an error.  Skipping this test.

test('should show tooltip if leave event has not occurred before delay expires', async t => {
  const id = 'another-tooltip';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { delay: 150 })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(100)
  .expect(await Selector(`#${tooltipId}`).exists).notOk('100ms: tooltip is not present')
  .wait(100);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok('200ms: tooltip is present')
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});


test('should not show tooltip if leave event occurs before delay expires', async t => {
  const id = 'top-tooltip-button';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { delay: 700 })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  const startTime = new Date().getTime();
  await t
  .expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(400)
  .expect(await Selector(`#${tooltipId}`).exists).notOk(`${new Date().getTime() - startTime}ms: tooltip is not present`)
  .hover('#not-a-tooltip')
  .wait(400)
  .expect(await Selector(`#${tooltipId}`).exists).notOk(`${new Date().getTime() - startTime}ms: tooltip is present`)
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});


test('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', async t => {
  const id = 'another-tooltip';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { delay: { show: 0, hide: 700 } })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  const startTime = new Date().getTime();
  await t
  .expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(1);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok(`${new Date().getTime() - startTime}ms: tooltip is present`)
  .hover('#not-a-tooltip')
  .wait(400)
  .expect(await Selector(`#${tooltipId}`).exists).ok(`${new Date().getTime() - startTime}ms: tooltip is still present`)
  .hover(`#${id}`)
  .wait(400)
  .expect(await Selector(`#${tooltipId}`).exists).ok(`${new Date().getTime() - startTime}ms: tooltip is still present`)
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});

test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', async t => {
  const id = 'top-tooltip-button';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { delay: { show: 700, hide: 0 } })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  const startTime = new Date().getTime();
  await t
  .expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(400)
  .expect(await Selector(`#${tooltipId}`).exists).notOk(`${new Date().getTime() - startTime}ms: tooltip is not present`)
  .hover('#not-a-tooltip')
  .wait(400)
  .expect(await Selector(`#${tooltipId}`).exists).notOk(`${new Date().getTime() - startTime}ms: tooltip is present`)
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});

test('should wait 900ms before hiding the tooltip', async t => {
  const id = 'right-tooltip-button';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { delay: { show: 0, hide: 700 } })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  const startTime = new Date().getTime();
  await t
  .expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(1);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok(`${new Date().getTime() - startTime}ms: tooltip is present`)
  .hover('#not-a-tooltip')
  .wait(500)
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok(`${new Date().getTime() - startTime}ms: tooltip is still present`)
  .wait(400)
  await t
  .expect(await Selector(`#${tooltipId}`).exists).notOk(`${new Date().getTime() - startTime}ms: tooltip removed`)
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});

test('should not reload the tooltip on subsequent mouseenter events', async t => {
  const id = 'tt-outer';
  const setupTooltip = ClientFunction((id) => {
    const titleHtml = () => {
      var uid = btoa(Math.random().toString()).substring(5, 20);
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>';
    }
    const tooltipEl:any = document.getElementById(id);
    if (tooltipEl.tooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500
      },
      // container: $tooltip,
      title: titleHtml
    })) {
      return true;
    } else {
      return false;
    }
  });
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await setupTooltip(id)).ok();
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  const startTime = new Date().getTime();
  await t
  .expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(1);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok(`${new Date().getTime() - startTime}ms: tooltip is present`);
  const startingUid = await Selector('#tt-content').innerText;
  await t
  .expect(startingUid.length).gt(0)
  .hover('#tt-content')
  .wait(100)
  .expect(await Selector('#tt-content').innerText).eql(startingUid);
  await t
  .hover(`#${id}`)
  .wait(100)
  await t
  .expect(await Selector('#tt-content').innerText).eql(startingUid)
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});

test('should not reload the tooltip if the mouse leaves and re-enters before hiding', async t => {
  const id = 'tt-outer';
  const setupTooltip = ClientFunction((id) => {
    const titleHtml = () => {
      var uid = btoa(Math.random().toString()).substring(5, 20);
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>';
    }
    const tooltipEl:any = document.getElementById(id);
    if (tooltipEl.tooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500
      },
      // container: $tooltip,
      title: titleHtml
    })) {
      return true;
    } else {
      return false;
    }
  });
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await setupTooltip(id)).ok();
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  const startTime = new Date().getTime();
  await t
  .expect(tooltipId.length).gt(0)
  .hover(`#${id}`)
  .wait(1);
  await t
  .expect(await Selector(`#${tooltipId}`).exists).ok(`${new Date().getTime() - startTime}ms: tooltip is present`);
  const startingUid = await Selector('#tt-content').innerText;
  await t
  .expect(startingUid.length).gt(0)
  .hover('#not-a-tooltip')
  .wait(100)
  .expect(await Selector('#tt-content').innerText).eql(startingUid);
  await t
  .hover(`#${id}`)
  .wait(100)
  .expect(await Selector('#tt-content').innerText).eql(startingUid)
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});


test('should do nothing when an attempt is made to hide an uninitialized tooltip', async t => {
  const id = 'top-tooltip-button';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, {})).ok() // gives it a new id
  .expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'shown.bs.tooltip')).ok()
  .expect(await callTooltipById(id, 'disable')).ok()
  .wait(150);
  console.log('\t...waiting for timeout on hide event...');
  await t
  .expect(await runTooltipMethodAndWaitForEventById(id, 'hide', 'hidden.bs.tooltip')).notOk()
  console.log('\t...waiting for timeout on show event...');
  await t
  .expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'shown.bs.tooltip')).notOk()
  .expect(await callTooltipById(id, {})).ok(); // just leaving it as we found it
});



test('should not remove tooltip if multiple triggers are set and one is still active', async t => {
  const id = 'top-tooltip-button';
  await t
  .expect(await Selector(`#${id}`).visible).ok()
  .expect(await callTooltipById(id, { trigger: 'click hover focus', animation: false })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t
  .expect(tooltipId.length).gt(0)

  // just hover
  await t.hover(`#${id}`);
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip on hover');
  await t.hover('#not-a-tooltip');
  await t.expect(await Selector(`#${tooltipId}`).exists).notOk('no active triggers');

  // just focus
  await t.expect(await focusById(id)).ok();
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip on focus');
  await t.expect(await blurById(id)).ok();
  await t.expect(await Selector(`#${tooltipId}`).exists).notOk('no active triggers');

  // click (hover and focus kind of go along with this one)
  await t.click(`#${id}`);
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip on click');
  await t.click(`#${id}`);
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip because it still has focus');
  await t.click('#not-a-tooltip');
  await t.expect(await Selector(`#${tooltipId}`).exists).notOk('no active triggers');

  // hover and focus
  await t.hover(`#${id}`);
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip on hover');
  await t.expect(await focusById(id)).ok();
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip with hover and focus');
  await t.hover('#not-a-tooltip');
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip with focus');
  await t.expect(await blurById(id)).ok();
  await t.expect(await Selector(`#${tooltipId}`).exists).notOk('no active triggers');

  await t.expect(await callTooltipById(id, {})).ok(); // gives it a new id
});




test('should show on first trigger after hide', async t => {
  const id = 'top-tooltip-button';
  await t.expect(await Selector(`#${id}`).visible).ok()
  await t.expect(await callTooltipById(id, { trigger: 'click hover focus', animation: false })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t.expect(tooltipId.length).gt(0)
  await t.click(`#${id}`);
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip on click');
  await t.expect(await runTooltipMethodAndWaitForEventById(id, 'hide', 'hidden.bs.tooltip')).ok('tooltip was removed')
  await t.expect(await Selector(`#${tooltipId}`).exists).notOk()
  await t.click(`#${id}`);
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('show tooltip on click');
  await t.expect(await callTooltipById(id, {})).ok(); // gives it a new id
});



test('should hide tooltip when their containing modal is closed', async t => {
  const id = 'tooltip-inside-a-modal';
  await t.expect(await Selector('#example-modal-button').visible).ok()
  await t.click('#example-modal-button')
  await t.expect(await waitForEventOnElementById('exampleModal', 'shown.bs.modal')).ok()
  await t.expect(await Selector(`#${id}`).visible).ok()
  await t.expect(await callTooltipById(id, { trigger: 'manual' })).ok(); // gives it a new id
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t.expect(tooltipId.length).gt(0)
  .expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'show.bs.tooltip')).ok()
  // await t.expect(await waitForEventOnElementById(id, 'shown.bs.tooltip')).ok()
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('tooltip in dom');
  await t.expect(await Selector('#close-modal-button').visible).ok()
  await t.click('#close-modal-button')
  await t.expect(await waitForEventOnElementById('exampleModal', 'hidden.bs.modal')).ok()
  await t.expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip hidden')
  await t.expect(await callTooltipById(id, {})).ok(); // gives it a new id
});


// uh, there are no tip classes when hidden event is triggered?  They're removed from dom tree entirely.
// https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tooltip.js#L865


test('should convert number in title to string', async t => {
  const id = 'num-to-string-tooltip';
  await t.expect(await Selector(`#${id}`).visible).ok()
  .expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'show.bs.tooltip')).ok();
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t.expect(tooltipId.length).gt(0)
  .expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('7', 'string of "7"')
  .expect(await callTooltipById(id, {})).ok(); // gives it a new id
});


test('tooltip should be shown right away after the call of disable/enable', async t => {
  const id = 'top-tooltip-button';
  await t.expect(await Selector(`#${id}`).visible).ok()
  await t.expect(await callTooltipById(id, {})).ok() // gives it a new id
  await t.expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'shown.bs.tooltip')).ok()
  await t.expect(await callTooltipById(id, 'disable')).ok()
  await t.expect(await callTooltipById(id, 'enable')).ok();
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t.expect(tooltipId.length).gt(0)
  await t.click(`#${id}`);
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('tooltip in dom')
  .expect(await callTooltipById(id, {})).ok(); // just leaving it as we found it
});


test('change event names using event name attributes', async t => {
  const prependTooltip = ClientFunction(() => {
    const template = document.createElement('div');
    template.innerHTML = '<p id="custom-tooltip-wrapper">' +
    'change event names' +
    '<bs-tooltip id="custom-events-tooltip" class="btn btn-primary" title="has custom events" ' +
    'show-event-name="customShow" ' +
    'shown-event-name="customShown" ' +
    'hide-event-name="customHide" ' +
    'hidden-event-name="customHidden" ' +
    'inserted-event-name="customInserted" ' +
    '>' +
    'custom Tooltip' +
    '</bs-tooltip>' +
    '</p>';
    const tooltipEl = template.firstChild;
    const parent = document.getElementById('page-container');
    if (parent.insertBefore(tooltipEl, parent.firstChild)) {
      return true;
    } else {
      return false;
    }
  });
  const removeTooltip = ClientFunction(() => {
    const tooltipWrapperEl = document.getElementById('custom-tooltip-wrapper');
    if (tooltipWrapperEl.parentNode.removeChild(tooltipWrapperEl)) {
      return true;
    } else {
      return false;
    }
  });
  await t
  .expect(await prependTooltip()).ok()
  .expect(await Selector('#custom-events-tooltip').visible).ok()
  const tooltipId = await Selector('#custom-events-tooltip').getAttribute('data-bs-id');
  // console.log('tooltipId: ', tooltipId);
  await t.expect(tooltipId.length).gt(0)
  await t.expect(await runTooltipMethodAndWaitForEventById('custom-events-tooltip', 'show', 'customInserted')).ok('changed inserted event name')
  await t.expect(await Selector(`#${tooltipId}`).exists).ok('tooltip in dom');
  await t.expect(await runTooltipMethodAndWaitForEventById('custom-events-tooltip', 'hide', 'customHide')).ok('changed hide event name')
  await t.expect(await runTooltipMethodAndWaitForEventById('custom-events-tooltip', 'show', 'customShow')).ok('changed show event name')
  await t.expect(await runTooltipMethodAndWaitForEventById('custom-events-tooltip', 'hide', 'customHidden')).ok('changed hidden event name')
  .wait(200)
  await t.expect(await Selector(`#${tooltipId}.show`).exists).notOk('tooltip is hidden');
  await t.expect(await runTooltipMethodAndWaitForEventById('custom-events-tooltip', 'show', 'customShown')).ok('changed shown event name')
  await t.expect(await Selector(`#${tooltipId}.show`).exists).ok('tooltip is shown');
  await t.expect(await removeTooltip()).ok();
  await t.expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip not in dom ("componentDidUnload" ran correctly)');
});


test('should prefer bs-title attribute dynamically over title attribute', async t => {
  const prependTooltip = ClientFunction((id) => {
    const template = document.createElement('div');
    template.innerHTML = '<p id="custom-tooltip-wrapper">' +
    'should prefer bs-title attribute over title attribute' +
    '<bs-tooltip id="' + id + '" class="btn btn-primary" title="default to title" ' +
    'bs-title="set using bs-title" ' +
    '>' +
    'bs-title test' +
    '</bs-tooltip>' +
    '</p>';
    const tooltipEl = template.firstChild;
    const parent = document.getElementById('page-container');
    if (parent.insertBefore(tooltipEl, parent.firstChild)) {
      return true;
    } else {
      return false;
    }
  });
  const removeTooltip = ClientFunction(() => {
    const tooltipWrapperEl = document.getElementById('custom-tooltip-wrapper');
    if (tooltipWrapperEl.parentNode.removeChild(tooltipWrapperEl)) {
      return true;
    } else {
      return false;
    }
  });
  const id = 'bs-title-tooltip'
  await t.expect(await prependTooltip(id)).ok()
  await t.expect(await Selector(`#${id}`).visible).ok()
  const tooltipId = await Selector(`#${id}`).getAttribute('data-bs-id');
  await t.expect(tooltipId.length).gt(0)
  await t.expect(await runTooltipMethodAndWaitForEventById(id, 'show', 'shown.bs.tooltip')).ok()
  await t.expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('set using bs-title', 'bs-title attribute is set')
  await t.expect(await setAttributeById(id, 'bs-title', 'abc123')).ok()
  await t.expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('abc123', 'tooltip self updated')
  await t.expect(await removeAttributeById(id, 'bs-title')).ok()
  await t.expect(await Selector(`#${tooltipId} .tooltip-inner`).nth(0).innerText).eql('default to title', 'back to using title now that attribute is gone')
  await t.expect(await removeTooltip()).ok();
  await t.expect(await Selector(`#${tooltipId}`).exists).notOk('tooltip not in dom ("componentDidUnload" ran correctly)');
});
