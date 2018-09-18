/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components tab tests').page('./bs.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tab.js

// https://github.com/DevExpress/testcafe/tree/master/examples
// https://marketplace.visualstudio.com/items?itemName=hdorgeval.testcafe-snippets#user-content-tc-selector-with-options

const setHtml = ClientFunction((innerHtml: string) => {
  const parentEl = document.getElementById('page-container');
  parentEl.innerHTML = innerHtml;
  return true;
});


const callTabBySelector = ClientFunction((selector, passedOption) => {
  const el:any = document.querySelector(selector);
  try {
    if (el.tab(passedOption)) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
});

const callTabMethodBySelectorAndWaitForEventBySelector = ClientFunction((methodSelector, methodOption, eventSelector, eventName) => new Promise((resolve) => {
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
  function delayedMethodBySelector(myMethodSelector, myMethodOption, delay) {
    return new Promise((resolveMethod) => {
      setTimeout(() => {
        const el:any = document.querySelector(myMethodSelector);
        el.tab(myMethodOption);
        resolveMethod(true);
      }, delay);
    });
  }
  Promise.all([
    waitForEventBySelector(eventSelector, eventName),
    delayedMethodBySelector(methodSelector, methodOption, 150),
  ]).then((resultArr) => {
    resolve(resultArr.every(result => result === true));
  });
}));

const clickBySelectorAndWaitForEventBySelector = ClientFunction((clickSelector, eventSelector, eventName) => new Promise((resolve) => {
  const myTimeout = setTimeout(() => {
    // 6 seconds should be more than long enough for any reasonable real world transition
    // eslint-disable-next-line no-use-before-define
    document.querySelector(eventSelector).removeEventListener(eventName, handleEventHappened);
    resolve(false);
  }, 6000);
  const handleEventHappened = () => {
    clearTimeout(myTimeout);
    resolve(true);
  };
  document.querySelector(eventSelector).addEventListener(eventName, handleEventHappened, { once: true });
  const el:any = document.querySelector(clickSelector);
  el.click();
}));

test('tab method is defined', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
          </bs-button>
      </li>
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
          </bs-button>
      </li>
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
          </bs-button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <bs-tab class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">tab1</bs-tab>
      <bs-tab class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">tab2</bs-tab>
      <bs-tab class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">tab3</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  const hasTabMethodBySelector = ClientFunction((selector) => {
    const el:any = document.querySelector(selector);
    return typeof el.tab;
  });
  await t.expect(await hasTabMethodBySelector('#home')).eql('function');
});

test('should throw explicit error on undefined method', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
          </bs-button>
      </li>
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
          </bs-button>
      </li>
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
          </bs-button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <bs-tab class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">tab1</bs-tab>
      <bs-tab class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">tab2</bs-tab>
      <bs-tab class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">tab3</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect((await callTabBySelector('#home', 'noMethod')).message).eql('No method named "noMethod"');
});


test('should return the element', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
          </bs-button>
      </li>
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
          </bs-button>
      </li>
      <li class="nav-link">
          <bs-button tabindex="-1">
            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
          </bs-button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <bs-tab class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">tab1</bs-tab>
      <bs-tab class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">tab2</bs-tab>
      <bs-tab class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">tab3</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  const returnsItself = ClientFunction((selector) => {
    const el:any = document.querySelector(selector);
    return el === el.tab();
  });
  await t.expect(await returnsItself('#home')).ok();
});


test('should activate element by tab id', async (t) => {
  const tabHtml = `
    <ul class="nav">
      <li>
        <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
      </li>
      <li>
        <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
});

test('should activate pills element by tab id', async (t) => {
  const tabHtml = `
    <ul class="nav nav-pills">
      <li>
        <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
      </li>
      <li>
        <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
});

test('should activate element by tab id in ordered list', async (t) => {
  const tabHtml = `
    <ol class="nav nav-pills">
      <li>
        <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
      </li>
      <li>
        <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
      </li>
    </ol>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
});


test('should activate element by tab id in nav list', async (t) => {
  const tabHtml = `
    <nav class="nav">
      <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
      <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
    </nav>
    <nav class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </nav>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
});


test('should activate element by tab id in list group', async (t) => {
  const tabHtml = `
    <div class="list-group">
      <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
      <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
    </div>
    <nav class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </nav>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
  await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
});


test('should not fire shown when show is prevented', async (t) => {
  const tabHtml = `
    <ul class="nav">
      <li>
        <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
      </li>
      <li>
        <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  const shouldNotFireShownWhenShowIsPrevented = ClientFunction((methodSelector, methodOption, eventSelector, eventName) => new Promise((resolve) => {
    function preventShowEventBySelector(myEventSelector) {
      return new Promise((resolveWait) => {
        const myTimeout = setTimeout(() => {
          // 6 seconds should be more than long enough for any reasonable real world transition
          // eslint-disable-next-line no-use-before-define
          document.querySelector(eventSelector).removeEventListener('show.bs.tab', handleEventHappened);
          resolveWait(false);
        }, 6000);
        const handleEventHappened = (event) => {
          event.preventDefault();
          clearTimeout(myTimeout);
          resolveWait(true);
        };
        document.querySelector(myEventSelector).addEventListener('show.bs.tab', handleEventHappened, { once: true });
      });
    }
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
    function delayedMethodBySelector(myMethodSelector, myMethodOption, delay) {
      return new Promise((resolveMethod) => {
        setTimeout(() => {
          const el:any = document.querySelector(myMethodSelector);
          el.tab(myMethodOption);
          resolveMethod(true);
        }, delay);
      });
    }
    Promise.all([
      preventShowEventBySelector(eventSelector),
      waitForEventBySelector(eventSelector, eventName),
      delayedMethodBySelector(methodSelector, methodOption, 150),
    ]).then((resultArr) => {
      resolve(resultArr.every(result => result === true));
    });
  }));
  console.log('\t...waiting for timeout on shown event (show was prevented)...');
  await t.expect(await shouldNotFireShownWhenShowIsPrevented('#home-toggle', 'show', '#home-toggle', 'shown.bs.tab')).notOk('show event prevented shown event');
  await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
});


test('should not fire shown when tab is already active', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs" role="tablist">
      <li>
        <bs-button id="home-toggle" role="tab" class="nav-link active" data-toggle="tab" data-target="#home">Home</bs-button>
      </li>
      <li>
        <bs-button id="profile-toggle" role="tab" class="nav-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane active" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  console.log('\t...waiting for timeout on shown event (tab already active)...');
  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#home-toggle', 'show', '#home-toggle', 'shown.bs.tab')).notOk();
});

test('should not fire shown when tab is disabled', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs" role="tablist">
      <li>
        <bs-button id="home-toggle" role="tab" class="nav-link active" data-toggle="tab" data-target="#home">Home</bs-button>
      </li>
      <li>
        <bs-button id="profile-toggle" role="tab" class="nav-link disabled" data-toggle="tab" data-target="#profile">Profile</bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane active" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  console.log('\t...waiting for timeout on shown event (tab toggle is disabled)...');
  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#profile-toggle', 'show', '#profile-toggle', 'shown.bs.tab')).notOk();
});

test('show and shown events should reference correct relatedTarget', async (t) => {
  const tabHtml = `
    <ul class="drop nav">
      <li class="dropdown"><a data-toggle="dropdown" href="#">1</a>
        <ul class="dropdown-menu nav">
          <li>
            <bs-button tabindex="-1" id="first-tab-toggle">
              <a href="#a1-1" data-toggle="tab">1-1</a>
            </bs-button>
          </li>
          <li>
            <bs-button tabindex="-1" id="last-tab-toggle">
              <a href="#a1-2" data-toggle="tab">1-2</a>
            </bs-button>
          </li>
        </ul>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="a1-1">a1-1</bs-tab>
      <bs-tab class="tab-pane" id="a1-2">a1-2</bs-tab>
    </div>`;
  const firstTabToggle = Selector('#first-tab-toggle');
  const lastTabToggle = Selector('#last-tab-toggle');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await firstTabToggle.exists).ok({ timeout: 5000 });
  await t.expect(await lastTabToggle.exists).ok({ timeout: 5000 });
  const showAndShownEventsShouldReferenceCorrectRelatedTarget = ClientFunction((methodSelector, methodOption, eventSelector) => new Promise((resolve) => {
    function showEventBySelector(myEventSelector) {
      return new Promise((resolveWait) => {
        const myTimeout = setTimeout(() => {
          // 6 seconds should be more than long enough for any reasonable real world transition
          // eslint-disable-next-line no-use-before-define
          document.querySelector(myEventSelector).removeEventListener('show.bs.tab', handleEventHappened);
          resolveWait({ show: false });
        }, 6000);
        const handleEventHappened = (event) => {
          clearTimeout(myTimeout);
          resolveWait({ show: event.relatedTarget.getAttribute('href') });
        };
        document.querySelector(myEventSelector).addEventListener('show.bs.tab', handleEventHappened, { once: true });
      });
    }
    function shownEventBySelector(myEventSelector) {
      return new Promise((resolveWait) => {
        const myTimeout = setTimeout(() => {
          // 6 seconds should be more than long enough for any reasonable real world transition
          // eslint-disable-next-line no-use-before-define
          document.querySelector(myEventSelector).removeEventListener('shown.bs.tab', handleEventHappened);
          resolveWait({ shown: false });
        }, 6000);
        const handleEventHappened = (event) => {
          resolveWait({ shown: event.relatedTarget.getAttribute('href') });
          clearTimeout(myTimeout);
          resolveWait(true);
        };
        document.querySelector(myEventSelector).addEventListener('shown.bs.tab', handleEventHappened, { once: true });
      });
    }
    function delayedMethodBySelector(myMethodSelector, myMethodOption, delay) {
      return new Promise((resolveMethod) => {
        setTimeout(() => {
          const el:any = document.querySelector(myMethodSelector);
          el.tab(myMethodOption);
          resolveMethod(true);
        }, delay);
      });
    }
    Promise.all([
      showEventBySelector(eventSelector),
      shownEventBySelector(eventSelector),
      delayedMethodBySelector(methodSelector, methodOption, 150),
    ]).then((resultArr) => {
      if (resultArr[2] !== true) {
        resolve(false);
      } else {
        resolve({
          show: (resultArr[0] as any).show,
          shown: (resultArr[1] as any).shown,
        });
      }
    });
  }));
  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#first-tab-toggle', 'show', '#first-tab-toggle', 'shown.bs.tab')).ok();
  const results = await showAndShownEventsShouldReferenceCorrectRelatedTarget('#last-tab-toggle', 'show', '#last-tab-toggle');
  await t.expect(results.show).eql('#a1-1', 'references correct element as relatedTarget');
  await t.expect(results.shown).eql('#a1-1', 'references correct element as relatedTarget');
});


test('should fire hide and hidden events', async (t) => {
  const tabHtml = `
    <ul class="nav">
      <li>
        <bs-button tabindex="-1" id="home-toggle">
          <a class="nav-link" data-toggle="tab" href="#home" role="tab">Home</a>
        </bs-button>
      </li>
      <li>
        <bs-button tabindex="-1" id="profile-toggle">
          <a class="nav-link" data-toggle="tab" href="#profile" role="tab">Profile</a>
        </bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  const shouldFireHideAndHiddenEvents = ClientFunction((methodSelector, methodOption, eventSelector) => new Promise((resolve) => {
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
    function delayedMethodBySelector(myMethodSelector, myMethodOption, delay) {
      return new Promise((resolveMethod) => {
        setTimeout(() => {
          const el:any = document.querySelector(myMethodSelector);
          el.tab(myMethodOption);
          resolveMethod(true);
        }, delay);
      });
    }
    Promise.all([
      waitForEventBySelector(eventSelector, 'hide.bs.tab'),
      waitForEventBySelector(eventSelector, 'hidden.bs.tab'),
      delayedMethodBySelector(methodSelector, methodOption, 150),
    ]).then((resultArr) => {
      if (resultArr[2] !== true) {
        resolve(false);
      } else {
        resolve({
          hide: resultArr[0],
          hidden: resultArr[1],
        });
      }
    });
  }));
  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#home-toggle', 'show', '#home-toggle', 'shown.bs.tab')).ok();
  const results = await shouldFireHideAndHiddenEvents('#profile-toggle', 'show', '#home-toggle');
  await t.expect(results.hide).ok();
  await t.expect(results.hidden).ok();
});


test('should not fire hidden when hide is prevented', async (t) => {
  const tabHtml = `
    <ul class="nav">
    <li>
      <bs-button tabindex="-1" id="home-toggle">
        <a class="nav-link" data-toggle="tab" href="#home" role="tab">Home</a>
      </bs-button>
    </li>
    <li>
      <bs-button tabindex="-1" id="profile-toggle">
        <a class="nav-link" data-toggle="tab" href="#profile" role="tab">Profile</a>
      </bs-button>
    </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  const shouldNotFireHiddenWhenHideIsPrevented = ClientFunction((methodSelector, methodOption, eventSelector, eventName) => new Promise((resolve) => {
    function preventHideEventBySelector(myEventSelector) {
      return new Promise((resolveWait) => {
        const myTimeout = setTimeout(() => {
          // 6 seconds should be more than long enough for any reasonable real world transition
          // eslint-disable-next-line no-use-before-define
          document.querySelector(eventSelector).removeEventListener('hide.bs.tab', handleEventHappened);
          resolveWait(false);
        }, 6000);
        const handleEventHappened = (event) => {
          event.preventDefault();
          clearTimeout(myTimeout);
          resolveWait(true);
        };
        document.querySelector(myEventSelector).addEventListener('hide.bs.tab', handleEventHappened, { once: true });
      });
    }
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
    function delayedMethodBySelector(myMethodSelector, myMethodOption, delay) {
      return new Promise((resolveMethod) => {
        setTimeout(() => {
          const el:any = document.querySelector(myMethodSelector);
          el.tab(myMethodOption);
          resolveMethod(true);
        }, delay);
      });
    }
    Promise.all([
      preventHideEventBySelector(eventSelector),
      waitForEventBySelector(eventSelector, eventName),
      delayedMethodBySelector(methodSelector, methodOption, 150),
    ]).then((resultArr) => {
      resolve(resultArr.every(result => result === true));
    });
  }));

  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#home-toggle', 'show', '#home-toggle', 'shown.bs.tab')).ok();
  await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
  console.log('\t...waiting for timeout on hidden event (hide was prevented)...');
  await t.expect(await shouldNotFireHiddenWhenHideIsPrevented('#profile-toggle', 'show', '#home-toggle', 'hidden.bs.tab')).notOk('show event prevented shown event');
  await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
});


test('hide and hidden events contain correct relatedTarget', async (t) => {
  const tabHtml = `
    <ul class="nav">
    <li>
      <bs-button tabindex="-1" id="home-toggle">
        <a class="nav-link" data-toggle="tab" href="#home" role="tab">Home</a>
      </bs-button>
    </li>
    <li>
      <bs-button tabindex="-1" id="profile-toggle">
        <a class="nav-link" data-toggle="tab" href="#profile" role="tab">Profile</a>
      </bs-button>
    </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const tabHome = Selector('#home');
  const tabProfile = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabHome.exists).ok({ timeout: 5000 });
  await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
  const hideAndHiddenEventsContainCorrectRelatedTarget = ClientFunction((methodSelector, methodOption, eventSelector) => new Promise((resolve) => {
    function hideEventBySelector(myEventSelector) {
      return new Promise((resolveWait) => {
        const myTimeout = setTimeout(() => {
          // 6 seconds should be more than long enough for any reasonable real world transition
          // eslint-disable-next-line no-use-before-define
          document.querySelector(myEventSelector).removeEventListener('hide.bs.tab', handleEventHappened);
          resolveWait({ hide: false });
        }, 6000);
        const handleEventHappened = (event) => {
          clearTimeout(myTimeout);
          resolveWait({ hide: event.relatedTarget.getAttribute('href') });
        };
        document.querySelector(myEventSelector).addEventListener('hide.bs.tab', handleEventHappened, { once: true });
      });
    }
    function hiddenEventBySelector(myEventSelector) {
      return new Promise((resolveWait) => {
        const myTimeout = setTimeout(() => {
          // 6 seconds should be more than long enough for any reasonable real world transition
          // eslint-disable-next-line no-use-before-define
          document.querySelector(myEventSelector).removeEventListener('hidden.bs.tab', handleEventHappened);
          resolveWait({ hidden: false });
        }, 6000);
        const handleEventHappened = (event) => {
          resolveWait({ hidden: event.relatedTarget.getAttribute('href') });
          clearTimeout(myTimeout);
          resolveWait(true);
        };
        document.querySelector(myEventSelector).addEventListener('hidden.bs.tab', handleEventHappened, { once: true });
      });
    }
    function delayedMethodBySelector(myMethodSelector, myMethodOption, delay) {
      return new Promise((resolveMethod) => {
        setTimeout(() => {
          const el:any = document.querySelector(myMethodSelector);
          el.tab(myMethodOption);
          resolveMethod(true);
        }, delay);
      });
    }
    Promise.all([
      hideEventBySelector(eventSelector),
      hiddenEventBySelector(eventSelector),
      delayedMethodBySelector(methodSelector, methodOption, 150),
    ]).then((resultArr) => {
      if (resultArr[2] !== true) {
        resolve(false);
      } else {
        resolve({
          hide: (resultArr[0] as any).hide,
          hidden: (resultArr[1] as any).hidden,
        });
      }
    });
  }));
  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#home-toggle', 'show', '#home-toggle', 'shown.bs.tab')).ok();
  await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
  const results = await hideAndHiddenEventsContainCorrectRelatedTarget('#profile-toggle', 'show', '#home-toggle');
  await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(results.hide).eql('#profile', 'references correct element as relatedTarget');
  await t.expect(results.hidden).eql('#profile', 'references correct element as relatedTarget');
});


test('selected tab should have aria-selected', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs">
      <li>
        <bs-button tabindex="-1" id="home-toggle">
          <a class="nav-link active" href="#home" data-toggle="tab" aria-selected="true" role="tab">Home</a>
        </bs-button>
      </li>
      <li>
        <bs-button tabindex="-1" id="profile-toggle">
          <a class="nav-link" href="#profile" data-toggle="tab" aria-selected="false" role="tab">Profile</a>
        </bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const homeToggle = Selector('#home-toggle');
  const profileToggle = Selector('#profile-toggle');
  const tabButtons = Selector('[data-toggle="tab"]');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await homeToggle.exists).ok({ timeout: 5000 });
  await t.expect(await profileToggle.exists).ok({ timeout: 5000 });

  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#home-toggle', 'show', '#home-toggle', 'shown.bs.tab')).ok();
  await t.expect(await tabButtons.nth(0).getAttribute('aria-selected')).eql('true', 'shown tab has aria-selected = true');
  await t.expect(await tabButtons.nth(1).getAttribute('aria-selected')).eql('false', 'shown tab has aria-selected = false');

  await t.click(tabButtons.nth(1));
  await t.expect(await tabButtons.nth(0).getAttribute('aria-selected')).eql('false', 'shown tab has aria-selected = false');
  await t.expect(await tabButtons.nth(1).getAttribute('aria-selected')).eql('true', 'shown tab has aria-selected = true');

  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#home-toggle', 'show', '#home-toggle', 'shown.bs.tab')).ok();
  await t.expect(await tabButtons.nth(0).getAttribute('aria-selected')).eql('true', 'shown tab has aria-selected = true');
  await t.expect(await tabButtons.nth(1).getAttribute('aria-selected')).eql('false', 'shown tab has aria-selected = false');

  await t.click(tabButtons.nth(0));
  await t.expect(await tabButtons.nth(0).getAttribute('aria-selected')).eql('true', 'after second show event, shown tab still has aria-selected = true');
  await t.expect(await tabButtons.nth(1).getAttribute('aria-selected')).eql('false', 'after second show event, hidden tab has aria-selected = false');
});


test('selected tab should deactivate previous selected tab', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs">
      <li>
        <bs-button tabindex="-1" id="home-toggle">
          <a class="nav-link active" href="#home" data-toggle="tab" aria-selected="true" role="tab">Home</a>
        </bs-button>
      </li>
      <li>
        <bs-button tabindex="-1" id="profile-toggle">
          <a class="nav-link" href="#profile" data-toggle="tab" aria-selected="false" role="tab">Profile</a>
        </bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
    </div>`;
  const homeToggle = Selector('#home-toggle');
  const profileToggle = Selector('#profile-toggle');
  const tabButtons = Selector('[data-toggle="tab"]');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await homeToggle.exists).ok({ timeout: 5000 });
  await t.expect(await profileToggle.exists).ok({ timeout: 5000 });
  await t.click(tabButtons.nth(1));
  await t.expect(await tabButtons.nth(0).hasClass('active')).notOk();
  await t.expect(await tabButtons.nth(1).hasClass('active')).ok();
});


test('selected tab should deactivate previous selected link in dropdown', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a id="first-tab" class="nav-link" href="#home" data-toggle="tab">Home</a>
        </bs-button>
      </li>
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a class="nav-link" href="#profile" data-toggle="tab">Profile</a>
        </bs-button>
      </li>
      <li class="nav-item dropdown">
        <bs-button tabindex="-1">
          <a id="last-tab" class="nav-link dropdown-toggle active" data-toggle="dropdown" href="#">Dropdown</a>
        </bs-button>
        <div class="dropdown-menu">
          <bs-button tabindex="-1">
            <a id="first-dropdown-tab" class="dropdown-item active" href="#dropdown1" id="dropdown1-tab" data-toggle="tab">ace</a>
          </bs-button>
          <bs-button tabindex="-1">
            <a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-toggle="tab">backer</a>
          </bs-button>
        </div>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="home">home tab</bs-tab>
      <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
      <bs-tab class="tab-pane" id="dropdown1-tab">dropdown1-tab</bs-tab>
      <bs-tab class="tab-pane" id="dropdown2-tab">dropdown2-tab</bs-tab>
    </div>`;
  const firstTab = Selector('#first-tab');
  const lastTab = Selector('#last-tab');
  const firstDropdownTab = Selector('#first-dropdown-tab');
  const tabButtons = Selector('[data-toggle="tab"]');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tabButtons.nth(0).exists).ok({ timeout: 5000 });
  await t.click(tabButtons.nth(0));
  await t.expect(await firstTab.hasClass('active')).ok();
  await t.expect(await lastTab.hasClass('active')).notOk();
  await t.expect(await firstDropdownTab.hasClass('active')).notOk();
});


test('Nested tabs', async (t) => {
  const tabHtml = `
    <nav class="nav nav-tabs" role="tablist">
      <bs-button tabindex="-1">
        <a id="tab1" href="#x-tab1" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</a>
      </bs-button>
      <bs-button tabindex="-1">
        <a href="#x-tab2" class="nav-item nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</a>
      </bs-button>
      <bs-button tabindex="-1">
        <a href="#x-tab3" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</a>
      </bs-button>
    </nav>
    <div class="tab-content">
      <bs-tab class="tab-pane" id="x-tab1" role="tabpanel">
        <nav class="nav nav-tabs" role="tablist">
          <bs-button tabindex="-1">
            <a href="#nested-tab1" class="nav-item nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</a>
          </bs-button>
          <bs-button tabindex="-1">
            <a id="tabNested2" href="#nested-tab2" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</a>
          </bs-button>
        </nav>
        <div class="tab-content">
          <bs-tab class="tab-pane active" id="nested-tab1" role="tabpanel">Nested Tab1 Content</bs-tab>
          <bs-tab class="tab-pane" id="nested-tab2" role="tabpanel">Nested Tab2 Content</bs-tab>
        </div>
      </bs-tab>
      <bs-tab class="tab-pane active" id="x-tab2" role="tabpanel">Tab2 Content</bs-tab>
      <bs-tab class="tab-pane" id="x-tab3" role="tabpanel">Tab3 Content</bs-tab>
    </div>`;
  const tab1 = Selector('#tab1');
  const tabNested2 = Selector('#tabNested2');
  const xTab1 = Selector('#x-tab1');
  const nestedTab2 = Selector('#nested-tab2');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await tab1.exists).ok({ timeout: 5000 });
  await t.expect(await tabNested2.exists).ok({ timeout: 5000 });
  await t.click(tab1);
  await t.expect(await xTab1.hasClass('active')).ok();
  await t.click(tabNested2);
  await t.expect(await xTab1.hasClass('active')).ok();
  await t.expect(await nestedTab2.hasClass('active')).ok();
});


test('should not remove fade class if no active pane is present', async (t) => {
  const tabHtml = `
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a id="tab-home" href="#home" class="nav-link" data-toggle="tab" role="tab">Home</a>
        </bs-button>
      </li>
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a id="tab-profile" href="#profile" class="nav-link" data-toggle="tab" role="tab">Profile</a>
        </bs-button>
      </li>
    </ul>
    <div class="tab-content">
      <bs-tab class="tab-pane fade" id="home" role="tabpanel">home content</bs-tab>
      <bs-tab class="tab-pane fade" id="profile" role="tabpanel">profile content</bs-tab>
    </div>`;
  const homeToggle = Selector('#tab-home');
  const profileToggle = Selector('#tab-profile');
  const homeTab = Selector('#home');
  const profileTab = Selector('#profile');
  await t.expect(await setHtml(_.trim(tabHtml))).ok();
  await t.expect(await homeToggle.exists).ok({ timeout: 5000 });
  await t.expect(await profileToggle.exists).ok({ timeout: 5000 });
  await t.expect(await clickBySelectorAndWaitForEventBySelector('#tab-profile', '#tab-profile', 'shown.bs.tab')).ok();
  await t.expect(await profileTab.hasClass('fade')).ok();
  await t.expect(await profileTab.hasClass('show')).ok();
  await t.expect(await clickBySelectorAndWaitForEventBySelector('#tab-home', '#tab-home', 'shown.bs.tab')).ok();
  await t.expect(await profileTab.hasClass('fade')).ok();
  await t.expect(await profileTab.hasClass('show')).notOk();
  await t.expect(await homeTab.hasClass('fade')).ok();
  await t.expect(await homeTab.hasClass('show')).ok();
});
