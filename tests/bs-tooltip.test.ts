/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components tooltip tests').page('./bs.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tooltip.js


// https://github.com/DevExpress/testcafe/tree/master/examples
// https://marketplace.visualstudio.com/items?itemName=hdorgeval.testcafe-snippets
// https://github.com/hdorgeval/testcafe-snippets/blob/master/say-goodbye-to-flakyness.md


const setHtml = ClientFunction((innerHtml: string) => {
  const parentEl = document.getElementById('page-container');
  parentEl.innerHTML = innerHtml;
  return true;
});


const callTooltipBySelector = ClientFunction((selector, passedOption) => {
  const tooltipEl:any = document.querySelector(selector);
  try {
    if (tooltipEl.tooltip(passedOption)) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
});


const runTooltipMethodAndWaitForEventBySelector = ClientFunction((selector, passedOption, eventName) => new Promise((resolve) => {
  const myTimeout = setTimeout(() => {
    // 6 seconds should be more than long enough for any reasonable real world transition
    // eslint-disable-next-line no-use-before-define
    document.querySelector(selector).removeEventListener(eventName, handleEventHappened);
    resolve(false);
  }, 6000);
  const handleEventHappened = () => {
    clearTimeout(myTimeout);
    resolve(true);
  };
  document.querySelector(selector).addEventListener(eventName, handleEventHappened, { once: true });
  const tooltipEl:any = document.querySelector(selector);
  tooltipEl.tooltip(passedOption);
}));


const focusBySelector = ClientFunction((selector) => {
  document.querySelector(selector).focus();
  return true;
});

const blurBySelector = ClientFunction((selector) => {
  document.querySelector(selector).blur();
  return true;
});

const setAttributeBySelector = ClientFunction((selector, attribute, value) => {
  document.querySelector(selector).setAttribute(attribute, value);
  return true;
});


test('tooltip method is defined', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const hasTooltipMethodBySelector = ClientFunction((selector) => {
    const el:any = document.querySelector(selector);
    return typeof el.tooltip;
  });
  await t.expect(await hasTooltipMethodBySelector('[data-toggle="tooltip"]')).eql('function');
});


test('should throw explicit error on undefined method', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect((await callTooltipBySelector('[data-toggle="tooltip"]', 'noMethod')).message).eql('No method named "noMethod"');
});

test('should return the element', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const returnsItself = ClientFunction((selector) => {
    const tooltipEl:any = document.querySelector(selector);
    return tooltipEl === tooltipEl.tooltip();
  });
  await t.expect(await returnsItself('[data-toggle="tooltip"]')).ok();
});

test('should expose default settings', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const getDefaults = ClientFunction((selector) => {
    const topTooltip:any = document.querySelector(selector);
    return topTooltip.defaults;
  });
  await t.expect(await getDefaults('[data-toggle="tooltip"]')).ok();
  await t.expect(typeof await getDefaults('[data-toggle="tooltip"]')).eql('object');
});

test('should empty title attribute', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await tooltipToggle.nth(0).getAttribute('title')).eql('');
});


test('should add data attribute for referencing original title', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await tooltipToggle.nth(0).getAttribute('data-original-title')).eql('Another tooltip');
});


test('should add aria-describedby to the trigger on show', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  const tooltipId = await tooltipToggle.getAttribute('data-bs-id');
  const tooltip = Selector(`#${tooltipId}`);
  await t.expect(await tooltip.exists).ok({ timeout: 5000 });
  await t.expect(await tooltipToggle.getAttribute('aria-describedby')).eql(tooltipId);
});


test('should remove aria-describedby from trigger on hide', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  const tooltipId = await tooltipToggle.getAttribute('data-bs-id');
  const tooltip = Selector(`#${tooltipId}`);
  await t.expect(await tooltip.exists).ok({ timeout: 5000 });
  await t.expect(await tooltipToggle.hasAttribute('aria-describedby')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.exists).notOk({ timeout: 5000 });
  await t.expect(await tooltipToggle.hasAttribute('aria-describedby')).notOk();
});

test('should assign a unique id tooltip element', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  const tooltipId = await tooltipToggle.getAttribute('data-bs-id');
  const tooltip = Selector(`#${tooltipId}`);
  await t.expect(await tooltip.exists).ok({ timeout: 5000 });
  await t.expect(_.startsWith(tooltipId, 'tooltip')).ok('tooltip id has prefix');
  await t.expect(await tooltip.count).eql(1, 'tooltip has a unique id');
});

test('should place tooltips relative to placement option', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { placement: 'bottom' })).ok(); // gives it a new id
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  const tooltipId = await tooltipToggle.getAttribute('data-bs-id');
  const tooltip = Selector(`#${tooltipId}`);
  await t.expect(await tooltip.exists).ok({ timeout: 5000 });
  await t.expect(await tooltip.hasClass('fade')).ok();
  await t.expect(await tooltip.hasClass('bs-tooltip-bottom')).ok();
  await t.expect(await tooltip.hasClass('show')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.exists).notOk({ timeout: 5000 });
});


test('should allow html entities', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="&lt;b&gt;Ace&lt;/b&gt;">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { html: true })).ok(); // gives it a new id
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  const tooltipId = await tooltipToggle.getAttribute('data-bs-id');
  const tooltip = Selector(`#${tooltipId}`);
  await t.expect(await tooltip.exists).ok({ timeout: 5000 });
  await t.expect(await tooltip.find('b').count).eql(1, 'b tag was inserted');
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.exists).notOk({ timeout: 5000 });
});

test('should allow DOMElement title (html: false)', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const setTextNode = ClientFunction((selector, text) => {
    const tooltipEl:any = document.querySelector(selector);
    try {
      tooltipEl.tooltip({ title: document.createTextNode(text) });
      return true;
    } catch (err) {
      return err;
    }
  });
  await t.expect(await setTextNode('[data-toggle="tooltip"]', '<3 writing tests')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('<3 writing tests', 'title inserted');
});

test('should allow DOMElement title (html: true)', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const setTextNode = ClientFunction((selector, text) => {
    const tooltipEl:any = document.querySelector(selector);
    try {
      tooltipEl.tooltip({ html: true, title: document.createTextNode(text) });
      return true;
    } catch (err) {
      return err;
    }
  });
  await t.expect(await setTextNode('[data-toggle="tooltip"]', '<3 writing tests')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('<3 writing tests', 'title inserted');
});


test('should respect custom classes', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const addTemplate = ClientFunction((selector) => {
    const tooltipEl:any = document.querySelector(selector);
    try {
      return tooltipEl.tooltip({
        template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>',
      });
    } catch (err) {
      return err;
    }
  });
  await t.expect(await addTemplate('[data-toggle="tooltip"]')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).hasClass('some-class')).ok('custom class is present');
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk('tooltip removed', { timeout: 5000 });
});


test('should fire show event', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'show.bs.tooltip')).ok();
});


test('should throw an error when show is called on hidden elements', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" style="display: none" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect((await callTooltipBySelector('[data-toggle="tooltip"]', 'show')).message).eql('Please use show on visible elements');
});


test('should fire inserted event', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'inserted.bs.tooltip')).ok();
});


test('should fire shown event', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
});


test('should not fire shown event when show was prevented', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const shouldNotFireShownEventWhenShowWasPrevented = ClientFunction(selector => new Promise((resolve) => {
    const handleShowEvent = (event) => {
      event.preventDefault();
    };
    const handleShownEvent = () => {
      // eslint-disable-next-line no-use-before-define
      clearTimeout(myTimeout);
      document.querySelector(selector).removeEventListener('show.bs.tooltip', handleShowEvent);
      document.querySelector(selector).removeEventListener('shown.bs.tooltip', handleShownEvent);
      resolve(false);
    };
    document.querySelector(selector).addEventListener('show.bs.tooltip', handleShowEvent);
    document.querySelector(selector).addEventListener('shown.bs.tooltip', handleShownEvent);
    const tooltipEl:any = document.querySelector(selector);
    tooltipEl.tooltip('show');
    const myTimeout = setTimeout(() => {
      // 6 seconds should be long enough for any transition
      document.querySelector(selector).removeEventListener('show.bs.tooltip', handleShowEvent);
      document.querySelector(selector).removeEventListener('shown.bs.tooltip', handleShownEvent);
      resolve(true);
    }, 6000);
  }));
  console.log('\t...waiting for timeout on show event...');
  await t.expect(await shouldNotFireShownEventWhenShowWasPrevented('[data-toggle="tooltip"]')).ok();
});


test('should fire hide event', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hide.bs.tooltip')).ok();
});


test('should fire hidden event', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
});


test('should not fire hidden event when hide was prevented', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  const shouldNotFireHiddenEventWhenHideWasPrevented = ClientFunction(selector => new Promise((resolve) => {
    const handleHideEvent = (event) => {
      event.preventDefault();
    };
    const handleHiddenEvent = () => {
      // eslint-disable-next-line no-use-before-define
      clearTimeout(myTimeout);
      document.querySelector(selector).removeEventListener('hide.bs.tooltip', handleHideEvent);
      document.querySelector(selector).removeEventListener('hidden.bs.tooltip', handleHiddenEvent);
      resolve(false);
    };
    document.querySelector(selector).addEventListener('hide.bs.tooltip', handleHideEvent);
    document.querySelector(selector).addEventListener('hidden.bs.tooltip', handleHiddenEvent);
    const tooltipEl:any = document.querySelector(selector);
    tooltipEl.tooltip('hide');
    const myTimeout = setTimeout(() => {
      // 6 seconds should be long enough for any transition
      document.querySelector(selector).removeEventListener('hide.bs.tooltip', handleHideEvent);
      document.querySelector(selector).removeEventListener('hidden.bs.tooltip', handleHiddenEvent);
      resolve(true);
    }, 6000);
  }));
  console.log('\t...waiting for timeout on hide event...');
  await t.expect(await shouldNotFireHiddenEventWhenHideWasPrevented('[data-toggle="tooltip"]')).ok();
});


test('should destroy tooltip', async (t) => {
  // NOTE: to truly destroy a web component just remove it from the DOM
  // and componentDidUnload inside the stencil component will run the clean up methods
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'disable', 'disabled.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk({ timeout: 5000 });
  await t.hover(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).notOk('No tooltip was shown', { timeout: 5000 });
  await t.click(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).notOk('No tooltip was shown', { timeout: 5000 });
});


test('should show tooltip when toggle is called', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'toggle', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await tooltip.nth(0).hasClass('fade')).ok('tooltip is faded active');
  await t.expect(await tooltip.nth(0).hasClass('show')).ok('tooltip is faded active');
});


test('should hide previously shown tooltip when toggle is called on tooltip', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'toggle', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk('tooltip is not in dom tree', { timeout: 5000 });
});


test('should place tooltips inside body when container is body', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltipDirectDescendantOfBody = Selector('body > .tooltip');
  const tooltipDirectDescendantOfPageContainer = Selector('#page-container > .tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { container: 'body' })).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltipDirectDescendantOfBody.nth(0).exists).ok('tooltip is direct descendant of body', { timeout: 5000 });
  await t.expect(await tooltipDirectDescendantOfPageContainer.nth(0).exists).notOk('tooltip is not in parent', { timeout: 5000 });
});


test('should add position class before positioning so that position-specific styles are taken into account', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="very very very very very very very very long tooltip in one line">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });

  const addStylesToHead = ClientFunction((stylesInnerHTML) => {
    const template = document.createElement('div');
    template.innerHTML = stylesInnerHTML;
    const styles = template.firstChild;
    if (document.head.appendChild(styles)) {
      return true;
    }
    return false;
  });
  const stylesInnerHTML = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="very very very very very very very very long tooltip in one line">
      Tooltip
    </bs-tooltip>`;
  await t.expect(await addStylesToHead(_.trim(stylesInnerHTML))).ok();
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { placement: 'right', trigger: 'manual' })).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'inserted.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).hasClass('bs-tooltip-right')).ok();
});


test('should use title attribute for tooltip text', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Simple tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('Simple tooltip', 'title from title attribute is set');
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk({ timeout: 5000 });
});


test('should prefer title attribute over title option', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Simple tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { title: 'This is a tooltip with some content' })).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('Simple tooltip', 'title is set from title attribute while preferred over title option');
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk({ timeout: 5000 });
});


test('should use title option', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { title: 'This is a tooltip with some content' })).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('This is a tooltip with some content', 'title from title option is set');
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk({ timeout: 5000 });
});

// // 'should not error when trying to show a top-placed tooltip that has been removed from the dom'
// // The code for a web component lives inside the element.  so if the element is removed
// // from the dom then there is nothing to throw an error.  Skipping this test.


test('should show tooltip if leave event has not occurred before delay expires', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { delay: 700 })).ok();
  const startTime = new Date().getTime();
  await t.hover(tooltipToggle.nth(0));
  await t.wait(400);
  await t.expect(await tooltip.nth(0).exists).notOk(`${new Date().getTime() - startTime}ms: tooltip is not present`);
  await t.wait(400);
  await t.expect(await tooltip.nth(0).exists).ok(`${new Date().getTime() - startTime}ms: tooltip is present`);
});


test('should not show tooltip if leave event occurs before delay expires', async (t) => {
  const tooltipHtml = `
    <span id="not-a-tooltip">not a tooltip</span>
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  const notTooltip = Selector('#not-a-tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { delay: 700 })).ok();
  const startTime = new Date().getTime();
  await t.hover(tooltipToggle.nth(0));
  await t.wait(400);
  await t.expect(await tooltip.nth(0).exists).notOk(`${new Date().getTime() - startTime}ms: tooltip is not present`);
  await t.hover(notTooltip);
  await t.wait(400);
  await t.expect(await tooltip.nth(0).exists).notOk(`${new Date().getTime() - startTime}ms: tooltip is not present`);
});


test('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', async (t) => {
  const tooltipHtml = `
    <span id="not-a-tooltip">not a tooltip</span>
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  const notTooltip = Selector('#not-a-tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { delay: { show: 0, hide: 700 } })).ok();
  const startTime = new Date().getTime();
  await t.hover(tooltipToggle);
  await t.expect(await tooltip.exists).ok(`${new Date().getTime() - startTime}ms: tooltip is present`);
  await t.hover(notTooltip);
  await t.wait(400 - (new Date().getTime() - startTime) > 0 ? 400 - (new Date().getTime() - startTime) : 0);
  await t.expect(new Date().getTime() - startTime).lt(600, `${new Date().getTime() - startTime}ms waited`);
  await t.expect(await tooltip.exists).ok(`${new Date().getTime() - startTime}ms: tooltip is still present`);
  await t.hover(tooltipToggle);
  await t.wait(800 - (new Date().getTime() - startTime) > 0 ? 800 - (new Date().getTime() - startTime) : 0);
  await t.expect(await tooltip.exists).ok(`${new Date().getTime() - startTime}ms: tooltip is still present`);
  await t.expect(new Date().getTime() - startTime).gte(800, 'waited past the 700m hide delay');
});

test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', async (t) => {
  const tooltipHtml = `
    <span id="not-a-tooltip">not a tooltip</span>
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  const notTooltip = Selector('#not-a-tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { delay: { show: 700, hide: 0 } })).ok();
  const startTime = new Date().getTime();
  await t.hover(tooltipToggle);
  await t.expect(await tooltip.exists).notOk(`${new Date().getTime() - startTime}ms: tooltip not faded active`);
  await t.wait(400 - (new Date().getTime() - startTime) > 0 ? 400 - (new Date().getTime() - startTime) : 0);
  await t.expect(new Date().getTime() - startTime).lt(600, `${new Date().getTime() - startTime}ms waited`);
  await t.expect(await tooltip.exists).notOk(`${new Date().getTime() - startTime}ms: tooltip not faded active`);
  await t.hover(notTooltip);
  await t.wait(800 - (new Date().getTime() - startTime) > 0 ? 800 - (new Date().getTime() - startTime) : 0);
  await t.expect(await tooltip.exists).notOk(`${new Date().getTime() - startTime}ms: tooltip not faded active`);
  await t.expect(new Date().getTime() - startTime).gte(800, `${new Date().getTime() - startTime}ms waited`);
});

test('should wait 900ms before hiding the tooltip', async (t) => {
  const tooltipHtml = `
    <span id="not-a-tooltip">not a tooltip</span>
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  const notTooltip = Selector('#not-a-tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { delay: { show: 0, hide: 700 } })).ok();
  await t.hover(tooltipToggle);
  await t.expect(await tooltip.exists).ok('tooltip faded active');
  await t.hover(notTooltip);
  const startTime = new Date().getTime();
  await t.wait(400 - (new Date().getTime() - startTime) > 0 ? 400 - (new Date().getTime() - startTime) : 0);
  await t.expect(new Date().getTime() - startTime).lt(650, `${new Date().getTime() - startTime}ms waited`);
  await t.expect(await tooltip.exists).ok(`${new Date().getTime() - startTime}ms: tooltip faded active`);
  await t.wait(900 - (new Date().getTime() - startTime) > 0 ? 900 - (new Date().getTime() - startTime) : 0);
  await t.expect(await tooltip.exists).notOk(`${new Date().getTime() - startTime}ms: tooltip not faded active`);
  await t.expect(new Date().getTime() - startTime).gte(900, `${new Date().getTime() - startTime}ms waited`);
});

test('should not reload the tooltip on subsequent mouseenter events', async (t) => {
  const tooltipHtml = `
    <bs-tooltip id="tt-outer" role="button" class="btn btn-secondary" data-toggle="tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('#tt-outer');
  const tooltip = Selector('.tooltip');
  const tooltipInnerContent = Selector('#tt-content');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const setupTooltip = ClientFunction((selector) => {
    const titleHtml = () => {
      const uid = btoa(Math.random().toString()).substring(5, 20);
      return `<p id="tt-content">${uid}</p><p>${uid}</p><p>${uid}</p>`;
    };
    const tooltipEl:any = document.querySelector(selector);
    if (tooltipEl.tooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500,
      },
      // container: $tooltip,
      title: titleHtml,
    })) {
      return true;
    }
    return false;
  });
  await t.expect(await setupTooltip('#tt-outer')).ok();
  const startTime = new Date().getTime();
  await t.hover(tooltipToggle);
  await t.expect(await tooltip.exists).ok(`${new Date().getTime() - startTime}ms: tooltip is present`);
  const startingUid = await tooltipInnerContent.innerText;
  await t.expect(startingUid.length).gt(0);
  await t.hover(tooltipInnerContent);
  await t.wait(100);
  await t.expect(new Date().getTime() - startTime).gt(100, `${new Date().getTime() - startTime}ms waited`);
  await t.expect(await tooltipInnerContent.innerText).eql(startingUid);
  await t.hover(tooltipToggle);
  await t.wait(100);
  await t.expect(new Date().getTime() - startTime).gt(200, `${new Date().getTime() - startTime}ms waited`);
  await t.expect(await tooltipInnerContent.innerText).eql(startingUid);
});


test('should not reload the tooltip if the mouse leaves and re-enters before hiding', async (t) => {
  const tooltipHtml = `
    <span id="not-a-tooltip">not a tooltip</span>
    <bs-tooltip id="tt-outer" role="button" class="btn btn-secondary" data-toggle="tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('#tt-outer');
  const tooltip = Selector('.tooltip');
  const tooltipInnerContent = Selector('#tt-content');
  const notTooltip = Selector('#not-a-tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  const setupTooltip = ClientFunction((selector) => {
    const titleHtml = () => {
      const uid = btoa(Math.random().toString()).substring(5, 20);
      return `<p id="tt-content">${uid}</p><p>${uid}</p><p>${uid}</p>`;
    };
    const tooltipEl:any = document.querySelector(selector);
    if (tooltipEl.tooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500,
      },
      // container: $tooltip,
      title: titleHtml,
    })) {
      return true;
    }
    return false;
  });
  await t.expect(await setupTooltip('#tt-outer')).ok();
  const startTime = new Date().getTime();
  await t.hover(tooltipToggle);
  await t.expect(await tooltip.exists).ok('tooltip is present');
  const startingUid = await tooltipInnerContent.innerText;
  await t.expect(startingUid.length).gt(0);
  await t.hover(notTooltip);
  await t.wait(100);
  await t.expect(new Date().getTime() - startTime).gt(100, `${new Date().getTime() - startTime}ms waited`);
  await t.hover(tooltipToggle);
  await t.expect(await tooltipInnerContent.innerText).eql(startingUid);
});


test('should do nothing when an attempt is made to hide an uninitialized tooltip', async (t) => {
  // in bs-components there is no uninitialized state only disabled
  const tooltipHtml = `
    <bs-tooltip disabled role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  console.log('\t...waiting for timeout on show on disabled toggle...');
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).notOk();
  await t.expect(await tooltip.exists).notOk('tooltip is not present');
  console.log('\t...waiting for timeout on hide on disabled toggle...');
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).notOk();
});


test('should not remove tooltip if multiple triggers are set and one is still active', async (t) => {
  const tooltipHtml = `
    <span id="not-a-tooltip">not a tooltip</span>
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  const notTooltip = Selector('#not-a-tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { trigger: 'click hover focus', animation: false })).ok(); // gives it a new id

  // just hover
  await t.hover(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip on hover');
  await t.hover(notTooltip);
  await t.expect(await tooltip.nth(0).exists).notOk('no active triggers');

  // just focus
  await t.expect(await focusBySelector('[data-toggle="tooltip"]')).ok();
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip on focus');
  await t.expect(await blurBySelector('[data-toggle="tooltip"]')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk('no active triggers');

  // click (hover and focus kind of go along with this one)
  await t.click(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip on click');
  await t.click(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip because it still has focus');
  await t.click('#not-a-tooltip');
  await t.expect(await tooltip.nth(0).exists).notOk('no active triggers');

  // hover and focus
  await t.hover(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip on hover');
  await t.expect(await focusBySelector('[data-toggle="tooltip"]')).ok();
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip with hover and focus');
  await t.hover('#not-a-tooltip');
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip with focus');
  await t.expect(await blurBySelector('[data-toggle="tooltip"]')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk('no active triggers');
});


test('should show on first trigger after hide', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { trigger: 'click hover focus', animation: false })).ok(); // gives it a new id
  await t.click(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip on click');
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'hidden.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk();
  await t.click(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).ok('show tooltip on click');
});


test('should hide tooltip when their containing modal is closed', async (t) => {
  const tooltipHtml = `
    <bs-button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
      Launch demo modal
    </bs-button>
    <bs-modal class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ...
          <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Tooltip inside a modal">
            modal tooltip button
          </bs-tooltip>
        </div>
        <div class="modal-footer">
          <button id="close-modal-button" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
    </bs-modal>`;
  // const modalToggle = Selector('[data-toggle="modal"]');
  const modal = Selector('#exampleModal');
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });

  await t.expect(await callTooltipBySelector('[data-toggle="tooltip"]', { trigger: 'manual' })).ok(); // gives it a new id

  const callModalMethodAndWaitForEventBySelector = ClientFunction((selector, passedOption, eventName) => new Promise((resolve) => {
    const myTimeout = setTimeout(() => {
      // 6 seconds should be more than long enough for any reasonable real world transition
      // eslint-disable-next-line no-use-before-define
      document.querySelector(selector).removeEventListener(eventName, handleEventHappened);
      resolve(false);
    }, 6000);
    const handleEventHappened = () => {
      clearTimeout(myTimeout);
      resolve(true);
    };
    document.querySelector(selector).addEventListener(eventName, handleEventHappened, { once: true });
    const modalEl:any = document.querySelector(selector);
    modalEl.modal(passedOption);
  }));

  // show modal
  await t.expect(await callModalMethodAndWaitForEventBySelector('#exampleModal', 'show', 'shown.bs.modal')).ok();
  await t.expect(await modal.hasClass('show')).ok('modal is shown');

  // present tooltip
  await t.expect(setAttributeBySelector('[data-toggle="tooltip"]', 'present', true)).ok();
  await t.expect(await tooltip.nth(0).exists).ok({ timeout: 5000 });

  // hide modal
  await t.expect(await callModalMethodAndWaitForEventBySelector('#exampleModal', 'hide', 'hidden.bs.modal')).ok();
  await t.expect(await tooltip.nth(0).exists).notOk();
});

// // "should reset tip classes when hidden event triggered"
// // uh, there are no tip classes when hidden event is triggered?  They're removed from dom tree entirely.
// // https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tooltip.js#L865


test('should convert number in title to string', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="7">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'shown.bs.tooltip')).ok();
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('7', 'string of "7"');
});


test('tooltip should be shown right away after the call of disable/enable', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-trigger="click" data-toggle="tooltip" title="Another tooltip">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'disable', 'disabled.bs.tooltip')).ok();
  await t.click(tooltipToggle);
  await t.wait(200);
  await t.expect(await tooltip.nth(0).exists).notOk({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'enable', 'enabled.bs.tooltip')).ok();
  await t.click(tooltipToggle);
  await t.expect(await tooltip.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await tooltip.nth(0).hasClass('show')).ok({ timeout: 5000 });
});

// ---------- testing props ----------

test('change event names using event name attributes', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="Another tooltip"
      show-event-name="customShow"
      shown-event-name="customShown"
      hide-event-name="customHide"
      hidden-event-name="customHidden"
      inserted-event-name="customInserted"
      enable-event-name="customEnable"
      enabled-event-name="customEnabled"
      disable-event-name="customDisable"
      disabled-event-name="customDisabled"
    >
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'customShow')).ok();
  await t.wait(100);
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'customHide')).ok();
  await t.wait(100);
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'disable', 'customDisable')).ok();
  await t.wait(100);
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'enable', 'customEnable')).ok();
  await t.wait(100);
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'customShown')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'hide', 'customHidden')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'disable', 'customDisabled')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'enable', 'customEnabled')).ok();
  await t.expect(await runTooltipMethodAndWaitForEventBySelector('[data-toggle="tooltip"]', 'show', 'customInserted')).ok();
});


test('should prefer bs-title attribute dynamically over title attribute', async (t) => {
  const tooltipHtml = `
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" title="default to title" bs-title="set using bs-title">
      Tooltip
    </bs-tooltip>`;
  const tooltipToggle = Selector('[data-toggle="tooltip"]');
  const tooltip = Selector('.tooltip');
  await t.expect(await setHtml(_.trim(tooltipHtml))).ok();
  await t.expect(await tooltipToggle.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await setAttributeBySelector('[data-toggle="tooltip"]', 'present', true));
  await t.expect(await tooltip.nth(0).exists).ok('showed tooltip using present attribute', { timeout: 5000 });
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('set using bs-title', 'bs-title has overridden title');
  await t.expect(await setAttributeBySelector('[data-toggle="tooltip"]', 'bs-title', 'abc123'));
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('abc123', 'bs-title self updated');
  await t.expect(await setAttributeBySelector('[data-toggle="tooltip"]', 'bs-title', ''));
  await t.expect(await tooltip.nth(0).find('.tooltip-inner').nth(0).innerText).eql('default to title', 'back to using title now that attribute is gone');
  await t.expect(await setAttributeBySelector('[data-toggle="tooltip"]', 'present', false));
  await t.wait(300); // waiting for transition to fade out
  await t.expect(await tooltip.nth(0).exists).notOk('hid tooltip using present attribute', { timeout: 5000 });
});
