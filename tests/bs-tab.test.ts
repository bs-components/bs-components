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

// const clickBySelectorAndWaitForEventBySelector = ClientFunction((clickSelector, eventSelector, eventName) => new Promise((resolve) => {
//   function waitForEventBySelector(myEventSelector, myEventName) {
//     return new Promise((resolveWait) => {
//       const myTimeout = setTimeout(() => {
//         // 6 seconds should be more than long enough for any reasonable real world transition
//         // eslint-disable-next-line no-use-before-define
//         document.querySelector(eventSelector).removeEventListener(myEventName, handleEventHappened);
//         resolveWait(false);
//       }, 6000);
//       const handleEventHappened = () => {
//         clearTimeout(myTimeout);
//         resolveWait(true);
//       };
//       document.querySelector(myEventSelector).addEventListener(myEventName, handleEventHappened, { once: true });
//     });
//   }
//   function delayedClickBySelector(myClickSelector, delay) {
//     return new Promise((resolveClick) => {
//       setTimeout(() => {
//         const el:any = document.querySelector(myClickSelector);
//         el.click();
//         resolveClick(true);
//       }, delay);
//     });
//   }
//   Promise.all([
//     waitForEventBySelector(eventSelector, eventName),
//     delayedClickBySelector(clickSelector, 150),
//   ]).then((resultArr) => {
//     resolve(resultArr.every(result => result === true));
//   });
// }));

// const setAttributeBySelector = ClientFunction((selector, attribute, value) => {
//   document.querySelector(selector).setAttribute(attribute, value);
//   return true;
// });

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

// test('tab method is defined', async (t) => {
//   const tabHtml = `
//     <ul class="nav nav-tabs" id="myTab" role="tablist">
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
//           </bs-button>
//       </li>
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
//           </bs-button>
//       </li>
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
//           </bs-button>
//       </li>
//     </ul>
//     <div class="tab-content" id="myTabContent">
//       <bs-tab class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">tab1</bs-tab>
//       <bs-tab class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">tab2</bs-tab>
//       <bs-tab class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">tab3</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   const hasTabMethodBySelector = ClientFunction((selector) => {
//     const el:any = document.querySelector(selector);
//     return typeof el.tab;
//   });
//   await t.expect(await hasTabMethodBySelector('#home')).eql('function');
// });

// test('should throw explicit error on undefined method', async (t) => {
//   const tabHtml = `
//     <ul class="nav nav-tabs" id="myTab" role="tablist">
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
//           </bs-button>
//       </li>
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
//           </bs-button>
//       </li>
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
//           </bs-button>
//       </li>
//     </ul>
//     <div class="tab-content" id="myTabContent">
//       <bs-tab class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">tab1</bs-tab>
//       <bs-tab class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">tab2</bs-tab>
//       <bs-tab class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">tab3</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect((await callTabBySelector('#home', 'noMethod')).message).eql('No method named "noMethod"');
// });


// test('should return the element', async (t) => {
//   const tabHtml = `
//     <ul class="nav nav-tabs" id="myTab" role="tablist">
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
//           </bs-button>
//       </li>
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
//           </bs-button>
//       </li>
//       <li class="nav-item">
//           <bs-button tabindex="-1">
//             <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
//           </bs-button>
//       </li>
//     </ul>
//     <div class="tab-content" id="myTabContent">
//       <bs-tab class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">tab1</bs-tab>
//       <bs-tab class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">tab2</bs-tab>
//       <bs-tab class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">tab3</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   const returnsItself = ClientFunction((selector) => {
//     const el:any = document.querySelector(selector);
//     return el === el.tab();
//   });
//   await t.expect(await returnsItself('#home')).ok();
// });


// test('should activate element by tab id', async (t) => {
//   const tabHtml = `
//     <ul class="nav">
//       <li>
//         <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
//       </li>
//       <li>
//         <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
//       </li>
//     </ul>
//     <div class="tab-content">
//       <bs-tab class="tab-pane" id="home">home tab</bs-tab>
//       <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   const tabProfile = Selector('#profile');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
// });

// test('should activate pills element by tab id', async (t) => {
//   const tabHtml = `
//     <ul class="nav nav-pills">
//       <li>
//         <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
//       </li>
//       <li>
//         <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
//       </li>
//     </ul>
//     <div class="tab-content">
//       <bs-tab class="tab-pane" id="home">home tab</bs-tab>
//       <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   const tabProfile = Selector('#profile');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
// });

// test('should activate element by tab id in ordered list', async (t) => {
//   const tabHtml = `
//     <ol class="nav nav-pills">
//       <li>
//         <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
//       </li>
//       <li>
//         <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
//       </li>
//     </ol>
//     <div class="tab-content">
//       <bs-tab class="tab-pane" id="home">home tab</bs-tab>
//       <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   const tabProfile = Selector('#profile');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
// });


// test('should activate element by tab id in nav list', async (t) => {
//   const tabHtml = `
//     <nav class="nav">
//       <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
//       <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
//     </nav>
//     <nav class="tab-content">
//       <bs-tab class="tab-pane" id="home">home tab</bs-tab>
//       <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
//     </nav>`;
//   const tabHome = Selector('#home');
//   const tabProfile = Selector('#profile');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
// });


// test('should activate element by tab id in list group', async (t) => {
//   const tabHtml = `
//     <div class="list-group">
//       <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
//       <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
//     </div>
//     <nav class="tab-content">
//       <bs-tab class="tab-pane" id="home">home tab</bs-tab>
//       <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
//     </nav>`;
//   const tabHome = Selector('#home');
//   const tabProfile = Selector('#profile');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#profile-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await callTabBySelector('#home-toggle', 'show')).ok();
//   await t.expect(await tabHome.hasClass('active')).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.hasClass('active')).notOk({ timeout: 5000 });
// });


// test('should not fire shown when show is prevented', async (t) => {
//   const tabHtml = `
//     <ul class="nav">
//       <li>
//         <bs-button id="home-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#home">Home</bs-button>
//       </li>
//       <li>
//         <bs-button id="profile-toggle" role="button" class="btn btn-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
//       </li>
//     </ul>
//     <div class="tab-content">
//       <bs-tab class="tab-pane" id="home">home tab</bs-tab>
//       <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   const tabProfile = Selector('#profile');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
//   const shouldNotFireShownWhenShowIsPrevented = ClientFunction((methodSelector, methodOption, eventSelector, eventName) => new Promise((resolve) => {
//     function preventShowEventBySelector(myEventSelector) {
//       return new Promise((resolveWait) => {
//         const myTimeout = setTimeout(() => {
//           // 6 seconds should be more than long enough for any reasonable real world transition
//           // eslint-disable-next-line no-use-before-define
//           document.querySelector(eventSelector).removeEventListener('show.bs.tab', handleEventHappened);
//           resolveWait(false);
//         }, 6000);
//         const handleEventHappened = (event) => {
//           event.preventDefault();
//           clearTimeout(myTimeout);
//           resolveWait(true);
//         };
//         document.querySelector(myEventSelector).addEventListener('show.bs.tab', handleEventHappened, { once: true });
//       });
//     }
//     function waitForEventBySelector(myEventSelector, myEventName) {
//       return new Promise((resolveWait) => {
//         const myTimeout = setTimeout(() => {
//           // 6 seconds should be more than long enough for any reasonable real world transition
//           // eslint-disable-next-line no-use-before-define
//           document.querySelector(eventSelector).removeEventListener(myEventName, handleEventHappened);
//           resolveWait(false);
//         }, 6000);
//         const handleEventHappened = () => {
//           clearTimeout(myTimeout);
//           resolveWait(true);
//         };
//         document.querySelector(myEventSelector).addEventListener(myEventName, handleEventHappened, { once: true });
//       });
//     }
//     function delayedMethodBySelector(myMethodSelector, myMethodOption, delay) {
//       return new Promise((resolveMethod) => {
//         setTimeout(() => {
//           const el:any = document.querySelector(myMethodSelector);
//           el.tab(myMethodOption);
//           resolveMethod(true);
//         }, delay);
//       });
//     }
//     Promise.all([
//       preventShowEventBySelector(eventSelector),
//       waitForEventBySelector(eventSelector, eventName),
//       delayedMethodBySelector(methodSelector, methodOption, 150),
//     ]).then((resultArr) => {
//       resolve(resultArr.every(result => result === true));
//     });
//   }));
//   console.log('\t...waiting for timeout on shown event (show was prevented)...');
//   await t.expect(await shouldNotFireShownWhenShowIsPrevented('#home-toggle', 'show', '#home', 'shown.bs.tab')).notOk('show event prevented shown event');
//   await t.expect(await tabHome.hasClass('active')).notOk({ timeout: 5000 });
// });

// test('should not fire shown when tab is already active', async (t) => {
//   const tabHtml = `
//     <ul class="nav nav-tabs" role="tablist">
//       <li>
//         <bs-button id="home-toggle" role="tab" class="nav-link active" data-toggle="tab" data-target="#home">Home</bs-button>
//       </li>
//       <li>
//         <bs-button id="profile-toggle" role="tab" class="nav-link" data-toggle="tab" data-target="#profile">Profile</bs-button>
//       </li>
//     </ul>
//     <div class="tab-content">
//       <bs-tab class="tab-pane active" id="home">home tab</bs-tab>
//       <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   const tabProfile = Selector('#profile');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
//   console.log('\t...waiting for timeout on shown event (tab already active)...');
//   await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#home-toggle', 'show', '#home', 'shown.bs.tab')).notOk();
// });

// test('should not fire shown when tab is disabled', async (t) => {
//   const tabHtml = `
//     <ul class="nav nav-tabs" role="tablist">
//       <li>
//         <bs-button id="home-toggle" role="tab" class="nav-link active" data-toggle="tab" data-target="#home">Home</bs-button>
//       </li>
//       <li>
//         <bs-button id="profile-toggle" role="tab" class="nav-link disabled" data-toggle="tab" data-target="#profile">Profile</bs-button>
//       </li>
//     </ul>
//     <div class="tab-content">
//       <bs-tab class="tab-pane active" id="home">home tab</bs-tab>
//       <bs-tab class="tab-pane" id="profile">profile tab</bs-tab>
//     </div>`;
//   const tabHome = Selector('#home');
//   const tabProfile = Selector('#profile');
//   await t.expect(await setHtml(_.trim(tabHtml))).ok();
//   await t.expect(await tabHome.exists).ok({ timeout: 5000 });
//   await t.expect(await tabProfile.exists).ok({ timeout: 5000 });
//   console.log('\t...waiting for timeout on shown event (tab toggle is disabled)...');
//   await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#profile-toggle', 'show', '#profile', 'shown.bs.tab')).notOk();
// });

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
          resolveWait({ show: event.relatedTarget.id });
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
          resolveWait({ shown: event.relatedTarget.id });
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
  await t.expect(await callTabMethodBySelectorAndWaitForEventBySelector('#first-tab-toggle', 'show', '#a1-1', 'shown.bs.tab')).ok();
  const results = await showAndShownEventsShouldReferenceCorrectRelatedTarget('#last-tab-toggle', 'show', '#a1-2');
  await t.expect(results.show).eql('a1-1', 'references correct element as relatedTarget');
  await t.expect(results.shown).eql('a1-1', 'references correct element as relatedTarget');
});

// https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/tab.js#L210
