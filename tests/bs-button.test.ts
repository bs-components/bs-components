/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components button tests').page('./bs.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/button.js
// NOTE: Ideally, every test should leave the page state the same way it was before the test started.
// NOTE: times were increased to make up for testcafe platform compared tp jsdom based unit tests

// https://github.com/DevExpress/testcafe/tree/master/examples
// https://marketplace.visualstudio.com/items?itemName=hdorgeval.testcafe-snippets

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


const callButtonById = ClientFunction((id, passedOption) => {
  const buttonEl:any = document.getElementById(id);
  try {
    if (buttonEl.button(passedOption)) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
});

const setAttributeById = ClientFunction((id, attribute, value) => {
  document.getElementById(id).setAttribute(attribute, value);
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


test('button method is defined', async (t) => {
  const hasButtonMethodById = ClientFunction((selector) => {
    const topButton:any = document.getElementById(selector);
    return typeof topButton.button;
  });
  const buttonHtml = `
  <bs-button id="single-toggle-button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
    Single toggle
  </bs-button>`;
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(await Selector('#single-toggle-button')().exists).ok();
  await t.expect(await Selector('#single-toggle-button').visible).ok();
  await t.expect(await hasButtonMethodById('single-toggle-button')).eql('function');
});

test('should return the element', async (t) => {
  const buttonHtml = `
  <bs-button id="single-toggle-button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
    Single toggle
  </bs-button>`;
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(await Selector('#single-toggle-button')().exists).ok();
  await t.expect(await Selector('#single-toggle-button').visible).ok();
  const returnsItself = ClientFunction(() => {
    const button:any = document.getElementById('single-toggle-button');
    return button === button.button();
  });
  await t.expect(await returnsItself()).ok();
});


test('should toggle active', async (t) => {
  const buttonHtml = `
  <bs-button id="single-toggle-button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
    Single toggle
  </bs-button>`;
  const singleToggleButton = Selector('#single-toggle-button');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(singleToggleButton.exists).ok();
  await t.expect(singleToggleButton.visible).ok();
  await t.expect(singleToggleButton.hasClass('active')).notOk();
  await t.expect(await callButtonById('single-toggle-button', 'toggle')).ok();
  await t.expect(singleToggleButton.hasClass('active')).ok();
});


test('should toggle active when btn children are clicked', async (t) => {
  const buttonHtml = `
  <bs-button id="single-toggle-button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
    <i id="inner-italic">Single toggle</i>
  </bs-button>`;
  const singleToggleButton = Selector('#single-toggle-button');
  const innerItalicSelector = Selector('#inner-italic');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(singleToggleButton.exists).ok();
  await t.expect(singleToggleButton.visible).ok();
  await t.expect(singleToggleButton.hasClass('active')).notOk();
  await t.click(innerItalicSelector);
  await t.expect(singleToggleButton.hasClass('active')).ok();
});


test('should toggle aria-pressed', async (t) => {
  const btnHTML = '<bs-button class="btn" id="btn-one" data-toggle="button" aria-pressed="false">redux</bs-button>';
  const buttonOne = Selector('#btn-one');
  await t.expect(await appendHtml(_.trim(btnHTML))).ok();
  await t.expect(buttonOne.exists).ok();
  await t.expect(buttonOne.visible).ok();
  await t.expect(buttonOne.getAttribute('aria-pressed')).eql('false');
  await t.expect(await callButtonById('btn-one', 'toggle')).ok();
  await t.expect(buttonOne.getAttribute('aria-pressed')).eql('true');
});


test('should toggle aria-pressed on buttons with container', async (t) => {
  const groupHTML = `
  <div class="btn-group" data-toggle="buttons">
    <bs-button id="btn1" class="btn btn-secondary">One</bs-button>
    <bs-button class="btn btn-secondary">Two</bs-button>
  </div>`;
  const buttonOne = Selector('#btn1');
  await t.expect(await appendHtml(_.trim(groupHTML))).ok();
  await t.expect(buttonOne.exists).ok();
  await t.expect(buttonOne.visible).ok();
  await t.expect(await callButtonById('btn1', 'toggle')).ok();
  await t.expect(buttonOne.getAttribute('aria-pressed')).eql('true');
});


test('should toggle aria-pressed when btn children are clicked', async (t) => {
  const buttonHtml = `
  <bs-button id="single-toggle-button" class="btn" data-toggle="button" aria-pressed="false">
    <i id="inner-italic">redux</i>
  </bs-button>`;
  const singleToggleButton = Selector('#single-toggle-button');
  const innerItalicSelector = Selector('#inner-italic');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(singleToggleButton.exists).ok();
  await t.expect(singleToggleButton.visible).ok();
  await t.expect(singleToggleButton.getAttribute('aria-pressed')).eql('false');
  await t.click(innerItalicSelector);
  await t.expect(singleToggleButton.getAttribute('aria-pressed')).eql('true');
});


test('should trigger input change event when toggled button has input field', async (t) => {
  const shouldTriggerInputChangeEventWhenToggledButtonHasInputField = ClientFunction(() => new Promise((resolve) => {
    const myTimeout = setTimeout(() => {
      // 6 seconds should be more than long enough for any reasonable real world transition
      // eslint-disable-next-line no-use-before-define
      document.getElementById('radio').removeEventListener('change', handleEventHappened);
      resolve(false);
    }, 6000);
    const handleEventHappened = () => {
      clearTimeout(myTimeout);
      resolve(true);
    };
    document.getElementById('radio').addEventListener('change', handleEventHappened, { once: true });
    const myButtonEl:any = document.getElementById('my-button');
    myButtonEl.button('toggle');
  }));
  const groupHTML = `
  <div class="btn-group" data-toggle="buttons">
    <bs-button id="my-button" class="btn btn-primary">
      <input type="radio" id="radio" autocomplete="off">Radio
    </bs-button>
  </div>`;
  const myButton = Selector('#my-button');
  await t.expect(await appendHtml(_.trim(groupHTML))).ok();
  await t.expect(myButton.exists).ok();
  await t.expect(myButton.visible).ok();
  await t.expect(await shouldTriggerInputChangeEventWhenToggledButtonHasInputField()).ok();
});


test('should check for closest matching toggle', async (t) => {
  const groupHTML = `
  <div class="btn-group" data-toggle="buttons">
    <bs-button class="btn btn-primary active" active>
      <input type="radio" name="options" id="option1" checked="true"> Option 1
    </bs-button>
    <bs-button class="btn btn-primary">
      <input type="radio" name="options" id="option2"> Option 2
    </bs-button>
    <bs-button class="btn btn-primary">
      <input type="radio" name="options" id="option3"> Option 3
    </bs-button>
  </div>`;
  const btn1 = Selector('.btn').nth(0);
  const btn1Input = Selector('#option1');
  const btn2 = Selector('.btn').nth(1);
  const btn2Input = Selector('#option2');
  await t.expect(await appendHtml(_.trim(groupHTML))).ok();
  await t.expect(btn1.exists).ok();
  await t.expect(btn1.visible).ok();
  await t.expect(btn1.hasClass('active')).ok('btn1 is active');
  await t.expect(btn1Input.checked).ok('btn1 is checked');
  await t.expect(btn2.hasClass('active')).notOk('btn2 is not active');
  await t.expect(btn2Input.checked).notOk('btn2 is not checked');
  await t.click(btn2Input);
  await t.expect(btn1.hasClass('active')).notOk('btn1 is not active');
  await t.expect(btn1Input.checked).notOk('btn1 is not checked');
  await t.expect(btn2.hasClass('active')).ok('btn2 is active');
  await t.expect(btn2Input.checked).ok('btn2 is checked');
  await t.click(btn2Input); // Clicking an already checked radio should not un-check it
  await t.expect(btn1.hasClass('active')).notOk('btn1 is not active');
  await t.expect(btn1Input.checked).notOk('btn1 is not checked');
  await t.expect(btn2.hasClass('active')).ok('btn2 is active');
  await t.expect(btn2Input.checked).ok('btn2 is checked');
});


test('should not add aria-pressed on labels for radio/checkbox inputs in a data-toggle="buttons" group', async (t) => {
  const groupHTML = `
    <div class="btn-group" data-toggle="buttons">
      <bs-button id="btn1" class="btn btn-primary"><input id="btn1input" type="checkbox" autocomplete="off"> Checkbox</bs-button>
      <bs-button id="btn2" class="btn btn-primary"><input id="btn2input" type="radio" name="options" autocomplete="off"> Radio</bs-button>
    </div>`;

  const btn1 = Selector('#btn1');
  const btn1Input = Selector('#btn1input');
  const btn2 = Selector('#btn2');
  const btn2Input = Selector('#btn2input');
  await t.expect(await appendHtml(_.trim(groupHTML))).ok();
  await t.expect(btn1.exists).ok();
  await t.expect(btn1.visible).ok();
  await t.click(btn1Input);
  await t.expect(btn1.hasAttribute('aria-pressed')).notOk('label for nested checkbox input has not been given an aria-pressed attribute');
  await t.click(btn2Input);
  await t.expect(btn2.hasAttribute('aria-pressed')).notOk('label for nested radio input has not been given an aria-pressed attribute');
});

test('should handle disabled attribute on non-button elements', async (t) => {
  const triggerRealClickById = ClientFunction((id) => {
    const el = document.getElementById(id);
    el.click();
    return true;
  });
  const groupHTML = `
    <div class="btn-group disabled" data-toggle="buttons" aria-disabled="true" disabled>
      <bs-button id="my-button" class="btn btn-danger disabled" aria-disabled="true" disabled>
        <input id="my-button-input" type="checkbox" aria-disabled="true" autocomplete="off" disabled class="disabled"></input>
      </bs-button>
    </div>`;
  const btn1 = Selector('#my-button');
  const btn1Input = Selector('#my-button-input');
  await t.expect(await appendHtml(_.trim(groupHTML))).ok();
  await t.expect(btn1.exists).ok();
  await t.expect(btn1.visible).ok();
  // await t.debug();
  // for whatever reason testcafe ignores disabled elements when it clicks
  // triggerRealClickById creates a real click on the page that will obey
  // disabled states the same way that the real dom does
  await t.expect(triggerRealClickById('my-button')).ok();
  await t.expect(btn1.hasClass('active')).notOk('button did not become active');
  await t.expect(btn1Input.checked).notOk('checkbox did not get checked');
  await t.expect(await callButtonById('my-button', 'toggle')).ok();
  await t.expect(btn1.hasClass('active')).notOk('button did not become active');
  await t.expect(btn1Input.checked).notOk('checkbox did not get checked');
});


// ---------- testing props ----------

test('Button toggle self removes active class to match active prop', async (t) => {
  const buttonHtml = `
    <bs-button class="btn btn-primary active" id="my-button" data-toggle="button" role="button">
      My Button
    </bs-button>`;
  const myButton = Selector('#my-button');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(myButton.exists).ok();
  await t.expect(myButton.visible).ok();
  await t.expect(myButton.hasClass('active')).notOk({ timeout: 5000 });
});


test('Wrapped button toggle self removes active class to match active prop', async (t) => {
  const buttonHtml = `
    <bs-button tabindex="-1">
      <a class="btn btn-primary active" id="link-button" data-toggle="button" href="#" role="button">Link</a>
    </bs-button>`;
  const linkButton = Selector('#link-button');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(linkButton.exists).ok();
  await t.expect(linkButton.visible).ok();
  await t.expect(linkButton.hasClass('active')).notOk({ timeout: 5000 });
});

test('Button toggle self adds active class to match active prop', async (t) => {
  const buttonHtml = `
    <bs-button class="btn btn-primary" active id="my-button" data-toggle="button" role="button">
      My Button
    </bs-button>`;
  const myButton = Selector('#my-button');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(myButton.exists).ok();
  await t.expect(myButton.visible).ok();
  await t.expect(myButton.hasClass('active')).ok({ timeout: 5000 });
});


test('Wrapped button toggle self adds active class to match active prop', async (t) => {
  const buttonHtml = `
    <bs-button tabindex="-1" active>
      <a class="btn btn-primary" id="link-button" data-toggle="button" href="#" role="button">Link</a>
    </bs-button>`;
  const linkButton = Selector('#link-button');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(linkButton.exists).ok();
  await t.expect(linkButton.visible).ok();
  await t.expect(linkButton.hasClass('active')).ok({ timeout: 5000 });
});

test('Button toggle using active prop', async (t) => {
  const buttonHtml = `
    <bs-button class="btn btn-primary" id="my-button" data-toggle="button" role="button">
      My Button
    </bs-button>`;
  const myButton = Selector('#my-button');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(myButton.exists).ok();
  await t.expect(myButton.visible).ok();
  await t.expect(myButton.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(setAttributeById('my-button', 'active', true)).ok();
  await t.expect(myButton.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(setAttributeById('my-button', 'active', false)).ok();
  await t.expect(myButton.hasClass('active')).notOk({ timeout: 5000 });
});


test('Wrapped button toggle using active prop', async (t) => {
  const buttonHtml = `
    <bs-button tabindex="-1" id="link-button-wrapper">
      <a class="btn btn-primary" id="link-button" data-toggle="button" href="#" role="button">Link</a>
    </bs-button>`;
  const linkButton = Selector('#link-button');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(linkButton.exists).ok();
  await t.expect(linkButton.visible).ok();
  await t.expect(linkButton.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(setAttributeById('link-button-wrapper', 'active', true)).ok();
  await t.expect(linkButton.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(setAttributeById('link-button-wrapper', 'active', false)).ok();
  await t.expect(linkButton.hasClass('active')).notOk({ timeout: 5000 });
});


test('test active prop with button radio group', async (t) => {
  const buttonHtml = `
    <div id="bs-button-radio-buttons" class="btn-group btn-group-toggle" data-toggle="buttons">
      <bs-button class="btn btn-secondary" active id="wrap1">
        <input type="radio" name="optionsv" id="option1" autocomplete="off"> Active
      </bs-button>
      <bs-button class="btn btn-secondary" id="wrap2">
        <input type="radio" name="optionsv" id="option2" autocomplete="off"> Radio
      </bs-button>
      <bs-button class="btn btn-secondary" id="wrap3">
        <input type="radio" name="optionsv" id="option3" autocomplete="off"> Radio
      </bs-button>
    </div>`;
  const wrap1 = Selector('#wrap1');
  const wrap2 = Selector('#wrap2');
  const wrap3 = Selector('#wrap3');
  const option1 = Selector('#option1');
  const option2 = Selector('#option2');
  const option3 = Selector('#option3');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(wrap1.exists).ok();
  await t.expect(wrap1.visible).ok();

  await t.expect(wrap1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(option1.checked).ok();
  await t.expect(wrap2.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option2.checked).notOk();
  await t.expect(wrap3.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option3.checked).notOk();

  await t.expect(setAttributeById('wrap2', 'active', true)).ok();
  await t.expect(wrap2.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(option2.checked).ok();
  await t.expect(wrap1.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option1.checked).notOk();
  await t.expect(wrap3.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option3.checked).notOk();

  await t.expect(setAttributeById('wrap3', 'active', true)).ok();
  await t.expect(wrap3.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(option3.checked).ok();
  await t.expect(wrap2.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option2.checked).notOk();
  await t.expect(wrap1.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option1.checked).notOk();

  await t.expect(setAttributeById('wrap1', 'active', true)).ok();
  await t.expect(wrap1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(option1.checked).ok();
  await t.expect(wrap2.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option2.checked).notOk();
  await t.expect(wrap3.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option3.checked).notOk();

  await t.expect(setAttributeById('wrap1', 'active', false)).ok();
  await t.expect(wrap1.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option1.checked).notOk();
  await t.expect(wrap2.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option2.checked).notOk();
  await t.expect(wrap3.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option3.checked).notOk();
});

test('test active prop with button checkbox group', async (t) => {
  const buttonHtml = `
    <div class="btn-group-toggle" data-toggle="buttons">
      <bs-button role="button" class="btn btn-secondary" active id="wrap1">
        <input type="checkbox" id="option1" autocomplete="off"> Checked
      </bs-button>
    </div>`;
  const wrap1 = Selector('#wrap1');
  const option1 = Selector('#option1');

  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(wrap1.exists).ok();
  await t.expect(wrap1.visible).ok();

  await t.expect(wrap1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(option1.checked).ok();

  await t.expect(setAttributeById('wrap1', 'active', false)).ok();
  await t.expect(wrap1.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option1.checked).notOk();

  await t.expect(setAttributeById('wrap1', 'active', true)).ok();
  await t.expect(wrap1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(option1.checked).ok();

  await t.expect(setAttributeById('wrap1', 'active', false)).ok();
  await t.expect(wrap1.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(option1.checked).notOk();
});


test('should send active and inactive events', async (t) => {
  const buttonHtml = `
  <bs-button class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
    Single toggle
  </bs-button>`;
  const singleToggleButton = Selector('[data-toggle="button"]');
  await t.expect(await appendHtml(_.trim(buttonHtml))).ok();
  await t.expect(singleToggleButton.exists).ok();
  await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="button"]', '[data-toggle="button"]', 'active.bs.button')).ok();
  await t.expect(singleToggleButton.hasClass('active')).ok();
  await t.expect(await clickBySelectorAndWaitForEventBySelector('[data-toggle="button"]', '[data-toggle="button"]', 'inactive.bs.button')).ok();
  await t.expect(singleToggleButton.hasClass('active')).notOk();
});