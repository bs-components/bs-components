/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components alert tests').page('./bs.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/alert.js

// https://github.com/DevExpress/testcafe/tree/master/examples
// https://marketplace.visualstudio.com/items?itemName=hdorgeval.testcafe-snippets#user-content-tc-selector-with-options

const setHtml = ClientFunction((innerHtml: string) => {
  const parentEl = document.getElementById('page-container');
  parentEl.innerHTML = innerHtml;
  return true;
});

const clickBySelectorAndWaitForEventBySelector = ClientFunction((clickSelector, eventSelector, eventName) => new Promise((resolve) => {
  function waitForEventBySelector(myEventSelector, myEventName) {
    return new Promise((resolveWait) => {
      const myTimeout = setTimeout(() => {
        // 6 seconds should be more than long enough for any reasonable real world transition
        // eslint-disable-next-line no-use-before-define
        document.querySelector(eventSelector).removeEventListener(myEventName, handleEventHappened);
        resolveWait(false);
      }, 6000);
      const handleEventHappened = () => {
        clearTimeout(myTimeout);
        resolveWait(true);
      };
      document.querySelector(myEventSelector).addEventListener(myEventName, handleEventHappened, { once: true });
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

test('alert method is defined', async (t) => {
  const alertHtml = `
    <bs-alert class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Holy guacamole!</strong> You should check in on some of those fields below.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </bs-alert>`;
  const myAlert = Selector('.alert');
  await t.expect(await setHtml(_.trim(alertHtml))).ok();
  await t.expect(await myAlert.nth(0).exists).ok({ timeout: 5000 });
  const hasAlertMethodBySelector = ClientFunction((selector) => {
    const el:any = document.querySelector(selector);
    return typeof el.alert;
  });
  await t.expect(await hasAlertMethodBySelector('.alert')).eql('function');
});


test('should return the element', async (t) => {
  const alertHtml = `
    <bs-alert class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Holy guacamole!</strong> You should check in on some of those fields below.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </bs-alert>`;
  const myAlert = Selector('.alert');
  await t.expect(await setHtml(_.trim(alertHtml))).ok();
  await t.expect(await myAlert.nth(0).exists).ok({ timeout: 5000 });
  const returnsItself = ClientFunction((selector) => {
    const el:any = document.querySelector(selector);
    return el === el.alert();
  });
  await t.expect(await returnsItself('.alert')).ok();
});


test('should fade element out on clicking .close', async (t) => {
  const alertHtml = `
    <bs-alert class="alert alert-danger fade show">
      <a class="close" href="#" data-dismiss="alert">×</a>
      <p><strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.</p>
    </bs-alert>`;
  const myAlert = Selector('.alert');
  await t.expect(await setHtml(_.trim(alertHtml))).ok();
  await t.expect(await myAlert.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await clickBySelectorAndWaitForEventBySelector('.close', '.alert', 'close.bs.alert')).ok();
  await t.expect(await myAlert.nth(0).hasClass('show')).notOk('remove .show class on .close click');
});


test('should remove element when clicking .close', async (t) => {
  const alertHtml = `
    <bs-alert class="alert alert-danger fade show">
      <a class="close" href="#" data-dismiss="alert">×</a>
      <p><strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.</p>
    </bs-alert>`;
  const myAlert = Selector('.alert');
  await t.expect(await setHtml(_.trim(alertHtml))).ok();
  await t.expect(await myAlert.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await clickBySelectorAndWaitForEventBySelector('.close', '.alert', 'closed.bs.alert')).ok();
  await t.expect(await myAlert.nth(0).exists).notOk('element removed from dom', { timeout: 5000 });
});


test('should not fire closed when close is prevented', async (t) => {
  const alertHtml = '<bs-alert class="alert"></bs-alert>';
  const myAlert = Selector('.alert');
  await t.expect(await setHtml(_.trim(alertHtml))).ok();
  await t.expect(await myAlert.nth(0).exists).ok({ timeout: 5000 });
  const shouldNotFireClosedWhenCloseIsPrevented = ClientFunction(selector => new Promise((resolve) => {
    const handleCloseEvent = (event) => {
      event.preventDefault();
    };
    const handleClosedEvent = () => {
      // eslint-disable-next-line no-use-before-define
      clearTimeout(myTimeout);
      document.querySelector(selector).removeEventListener('close.bs.alert', handleCloseEvent);
      document.querySelector(selector).removeEventListener('closed.bs.alert', handleClosedEvent);
      resolve(false);
    };
    document.querySelector(selector).addEventListener('close.bs.alert', handleCloseEvent);
    document.querySelector(selector).addEventListener('closed.bs.alert', handleClosedEvent);
    const el:any = document.querySelector(selector);
    el.alert('close');
    const myTimeout = setTimeout(() => {
      // 6 seconds should be long enough for any transition
      document.querySelector(selector).removeEventListener('close.bs.alert', handleCloseEvent);
      document.querySelector(selector).removeEventListener('closed.bs.alert', handleClosedEvent);
      resolve(true);
    }, 6000);
  }));
  console.log('\t...waiting for timeout on closed event (close was prevented)...');
  await t.expect(await shouldNotFireClosedWhenCloseIsPrevented('.alert')).ok('close event prevented closed event');
  await t.expect(await myAlert.nth(0).exists).ok({ timeout: 5000 });
});


test('close should use internal element if no element provided', async (t) => {
  const alertHtml = '<bs-alert class="alert"></bs-alert>';
  const myAlert = Selector('.alert');
  await t.expect(await setHtml(_.trim(alertHtml))).ok();
  await t.expect(await myAlert.nth(0).exists).ok({ timeout: 5000 });

  const runAlertClosedMethodAndWaitForEventBySelector = ClientFunction((selector, eventName) => new Promise((resolve) => {
    function waitForEventBySelector(eventSelector, myEventName) {
      return new Promise((resolveWait) => {
        const myTimeout = setTimeout(() => {
          // 6 seconds should be more than long enough for any reasonable real world transition
          // eslint-disable-next-line no-use-before-define
          document.querySelector(eventSelector).removeEventListener(myEventName, handleEventHappened);
          resolveWait(false);
        }, 6000);
        const handleEventHappened = () => {
          clearTimeout(myTimeout);
          resolveWait(true);
        };
        document.querySelector(eventSelector).addEventListener(myEventName, handleEventHappened, { once: true });
      });
    }
    function delayedRunAlertMethodBySelector(alertSelector, delay) {
      return new Promise((resolveRun) => {
        setTimeout(() => {
          const el:any = document.querySelector(alertSelector);
          el.close();
          resolveRun(true);
        }, delay);
      });
    }
    Promise.all([
      waitForEventBySelector(selector, eventName),
      delayedRunAlertMethodBySelector(selector, 150),
    ]).then((resultArr) => {
      resolve(resultArr.every(result => result === true));
    });
  }));
  await t.expect(await runAlertClosedMethodAndWaitForEventBySelector('.alert', 'closed.bs.alert')).ok('close method closed alert');
  await t.expect(await myAlert.nth(0).exists).notOk('alert was removed', { timeout: 5000 });
});
