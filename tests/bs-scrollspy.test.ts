/* eslint-disable newline-per-chained-call */
import { Selector, ClientFunction } from 'testcafe';

const _ = require('lodash');

fixture('bs-components scrollspy tests').page('./bs.test.html');

// similar to: https://github.com/twbs/bootstrap/blob/v4-dev/js/tests/unit/scrollspy.js

// https://github.com/DevExpress/testcafe/tree/master/examples
// https://marketplace.visualstudio.com/items?itemName=hdorgeval.testcafe-snippets#user-content-tc-selector-with-options

const setHtml = ClientFunction((innerHtml: string) => {
  const parentEl = document.getElementById('page-container');
  parentEl.innerHTML = innerHtml;
  return true;
});


const callScrollspyBySelector = ClientFunction((selector, passedOption) => {
  const el:any = document.querySelector(selector);
  try {
    if (el.scrollspy(passedOption)) {
      return true;
    }
    return false;
  } catch (err) {
    return err;
  }
});


const scrollIntoViewBySelector = ClientFunction((containerSelector, targetSelector, passedOption) => new Promise((resolve) => {
  function waitForScrollStop(selector) {
    return new Promise((resolveWait) => {
      let isScrolling;
      const myTimeout = setTimeout(() => {
        clearTimeout(isScrolling);
        resolveWait(false);
      }, 6000);
      document.querySelector(selector).addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          clearTimeout(myTimeout);
          resolveWait(true);
        }, 333);
      }, { once: true });
    });
  }
  function delayedScrollToBySelector(mySelector, myPassedOption, delay) {
    return new Promise((resolveMethod) => {
      setTimeout(() => {
        document.querySelector(mySelector).scrollIntoView(myPassedOption);
        resolveMethod(true);
      }, delay);
    });
  }
  Promise.all([
    waitForScrollStop(containerSelector),
    delayedScrollToBySelector(targetSelector, passedOption, 150),
  ]).then((resultArr) => {
    resolve(resultArr.every(result => result === true));
  });
}));


const scrollBySelector = ClientFunction((containerSelector, passedOption) => new Promise((resolve) => {
  function waitForScrollStop(selector) {
    let isScrolling;
    return new Promise((resolveWait) => {
      const myTimeout = setTimeout(() => {
        clearTimeout(isScrolling);
        resolveWait(false);
      }, 6000);
      document.querySelector(selector).addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          clearTimeout(myTimeout);
          resolveWait(true);
        }, 333);
      }, { once: true });
    });
  }
  function delayedScrollToBySelector(mySelector, myPassedOption, delay) {
    return new Promise((resolveMethod) => {
      setTimeout(() => {
        document.querySelector(mySelector).scroll(myPassedOption);
        resolveMethod(true);
      }, delay);
    });
  }
  Promise.all([
    waitForScrollStop(containerSelector),
    delayedScrollToBySelector(containerSelector, passedOption, 150),
  ]).then((resultArr) => {
    resolve(resultArr.every(result => result === true));
  });
}));


const scrollToBySelector = ClientFunction((containerSelector, passedOption) => new Promise((resolve) => {
  function waitForScrollStop(selector) {
    let isScrolling;
    return new Promise((resolveWait) => {
      const myTimeout = setTimeout(() => {
        clearTimeout(isScrolling);
        resolveWait(false);
      }, 6000);
      document.querySelector(selector).addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          clearTimeout(myTimeout);
          resolveWait(true);
        }, 333);
      }, { once: true });
    });
  }
  function delayedScrollToBySelector(mySelector, myPassedOption, delay) {
    return new Promise((resolveMethod) => {
      setTimeout(() => {
        document.querySelector(mySelector).scrollTo(myPassedOption);
        resolveMethod(true);
      }, delay);
    });
  }
  Promise.all([
    waitForScrollStop(containerSelector),
    delayedScrollToBySelector(containerSelector, passedOption, 150),
  ]).then((resultArr) => {
    resolve(resultArr.every(result => result === true));
  });
}));


const scrollByWindow = ClientFunction((containerSelector, passedOption) => new Promise((resolve) => {
  function waitForScrollStop(selector) {
    let isScrolling;
    return new Promise((resolveWait) => {
      const myTimeout = setTimeout(() => {
        clearTimeout(isScrolling);
        resolveWait(false);
      }, 6000);
      document.querySelector(selector).addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          clearTimeout(myTimeout);
          resolveWait(true);
        }, 333);
      }, { once: true });
    });
  }
  function delayedScrollToByWindow(myPassedOption, delay) {
    return new Promise((resolveMethod) => {
      setTimeout(() => {
        window.scroll(myPassedOption);
        resolveMethod(true);
      }, delay);
    });
  }
  Promise.all([
    waitForScrollStop(containerSelector),
    delayedScrollToByWindow(passedOption, 150),
  ]).then((resultArr) => {
    resolve(resultArr.every(result => result === true));
  });
}));


const scrollTopBySelector = ClientFunction((selector, intValue) => new Promise((resolve) => {
  function waitForScrollStop(mySelector) {
    let isScrolling;
    return new Promise((resolveWait) => {
      const myTimeout = setTimeout(() => {
        clearTimeout(isScrolling);
        resolveWait(false);
      }, 6000);
      document.querySelector(mySelector).addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          clearTimeout(myTimeout);
          resolveWait(true);
        }, 333);
      }, { once: true });
    });
  }
  function delayedScrollTopBySelector(mySelector, toVal, delay) {
    return new Promise((resolveMethod) => {
      setTimeout(() => {
        document.querySelector(mySelector).scrollTop = toVal;
        // window.scroll(myPassedOption);
        resolveMethod(true);
      }, delay);
    });
  }
  Promise.all([
    waitForScrollStop(selector),
    delayedScrollTopBySelector(selector, intValue, 150),
  ]).then((resultArr) => {
    resolve(resultArr.every(result => result === true));
  });
}));


test('scrollspy method is defined', async (t) => {
  const scrollspyHtml = `
    <nav id="test-navbar" class="navbar navbar-light bg-light"></nav>
    <bs-scrollspy data-spy="scroll" data-target="#test-navbar"></bs-scrollspy>`;
  const scrollspy = Selector('[data-spy="scroll"]');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  const hasScrollspyMethodBySelector = ClientFunction((selector) => {
    const el:any = document.querySelector(selector);
    return typeof el.scrollspy;
  });
  await t.expect(await hasScrollspyMethodBySelector('[data-spy="scroll"]')).eql('function');
});

test('should throw explicit error on undefined method', async (t) => {
  const scrollspyHtml = `
    <nav id="test-navbar" class="navbar navbar-light bg-light"></nav>
    <bs-scrollspy data-spy="scroll" data-target="#test-navbar"></bs-scrollspy>`;
  const scrollspy = Selector('[data-spy="scroll"]');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  await t.expect((await callScrollspyBySelector('[data-spy="scroll"]', 'noMethod')).message).eql('No method named "noMethod"');
});


test('should return the element', async (t) => {
  const scrollspyHtml = `
    <nav id="test-navbar" class="navbar navbar-light bg-light"></nav>
    <bs-scrollspy data-spy="scroll" data-target="#test-navbar"></bs-scrollspy>`;
  const scrollspy = Selector('[data-spy="scroll"]');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  const returnsItself = ClientFunction((selector) => {
    const el:any = document.querySelector(selector);
    return el === el.scrollspy();
  });
  await t.expect(await returnsItself('[data-spy="scroll"]')).ok();
});


test('should only switch "active" class on current target', async (t) => {
  const scrollspyHtml = `
    <div id="root" class="active">
      <div class="topbar">
        <div class="topbar-inner">
          <div class="container" id="ss-target">
            <ul class="nav nav-pills">
              <li class="nav-item"><a class="nav-link" href="#masthead">Overview</a></li>
              <li class="nav-item"><a class="nav-link" href="#detail">Detail</a></li>
            </ul>
          </div>
        </div>
      </div>
      <bs-scrollspy id="scrollspy-example" style="height: 100px; overflow: auto;">
        <div style="height: 200px;">
          <h4 id="masthead">Overview</h4>
          <p style="height: 200px">
            Ad leggings keytar, brunch id art party dolor labore.
          </p>
        </div>
        <div style="height: 200px;">
          <h4 id="detail">Detail</h4>
          <p style="height: 200px">
            Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.
          </p>
        </div>
      </bs-scrollspy>
    </div>`;
  const root = Selector('#root');
  const scrollspy = Selector('#scrollspy-example');
  const detailSpy = Selector('#detail');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.exists).ok({ timeout: 5000 });
  await t.expect(await detailSpy.exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('#scrollspy-example', { target: '#ss-target' })).ok();
  // await t.expect(await scrollIntoViewBySelector('#scrollspy-example', '#detail', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await scrollBySelector('#scrollspy-example', { top: 350, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await root.hasClass('active')).ok({ timeout: 5000 });
});


test('should only switch "active" class on current target specified w element', async (t) => {
  const scrollspyHtml = `
    <div id="root" class="active">
      <div class="topbar">
        <div class="topbar-inner">
          <div class="container" id="ss-target">
            <ul class="nav nav-pills">
              <li class="nav-item"><a class="nav-link" href="#masthead">Overview</a></li>
              <li class="nav-item"><a class="nav-link" href="#detail">Detail</a></li>
            </ul>
          </div>
        </div>
      </div>
      <bs-scrollspy id="scrollspy-example" style="height: 100px; overflow: auto;">
        <div style="height: 200px;">
          <h4 id="masthead">Overview</h4>
          <p style="height: 200px">
            Ad leggings keytar, brunch id art party dolor labore.
          </p>
        </div>
        <div style="height: 200px;">
          <h4 id="detail">Detail</h4>
          <p style="height: 200px">
            Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.
          </p>
        </div>
      </bs-scrollspy>
    </div>`;
  const root = Selector('#root');
  const scrollspy = Selector('#scrollspy-example');
  const detailSpy = Selector('#detail');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.exists).ok({ timeout: 5000 });
  await t.expect(await detailSpy.exists).ok({ timeout: 5000 });
  const initScrollspyTargetWithElement = ClientFunction((selector) => {
    const el:any = document.querySelector(selector);
    return el.scrollspy({ target: document.getElementById('ss-target') });
  });
  await t.expect(await initScrollspyTargetWithElement('#scrollspy-example')).ok();
  // await t.expect(await scrollIntoViewBySelector('#scrollspy-example', '#detail', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await scrollBySelector('#scrollspy-example', { top: 350, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await root.hasClass('active')).ok({ timeout: 5000 });
});


test('should correctly select middle navigation option when large offset is used', async (t) => {
  const scrollspyHtml = `
    <div id="header" style="height: 500px;"></div>
    <nav id="navigation" class="navbar">
      <ul class="navbar-nav nav-pills">
        <li class="nav-item active"><a class="nav-link" id="one-link" href="#one">One</a></li>
        <li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>
        <li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>
      </ul>
    </nav>
    <bs-scrollspy id="content" style="height: 200px; overflow-y: auto;">
      <div id="one" style="height: 500px;"></div>
      <div id="two" style="height: 300px;"></div>
      <div id="three" style="height: 10px;"></div>
    </bs-scrollspy>`;
  const oneLink = Selector('#one-link');
  const twoLink = Selector('#two-link');
  const threeLink = Selector('#three-link');
  const scrollspy = Selector('#content');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.exists).ok({ timeout: 5000 });
  // const initScrollspyWithQueryOffset = ClientFunction((selector) => {
  //   const el:any = document.querySelector(selector);
  //   return el.scrollspy({ target: '#navigation', offset: el.offsetTop });
  // });
  // await t.expect(await initScrollspyWithQueryOffset('#content')).ok();

  await t.expect(await callScrollspyBySelector('##content', { target: '#navigation', offset: 300 })).ok();


  // await t.expect(await scrollIntoViewBySelector('#scrollspy-example', '#detail', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await scrollBySelector('#content', { top: 550, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await oneLink.hasClass('active')).notOk('"active" class removed from first section', { timeout: 5000 });
  await t.expect(await twoLink.hasClass('active')).ok('"active" class on middle section', { timeout: 5000 });
  await t.expect(await threeLink.hasClass('active')).notOk('"active" class not on last section', { timeout: 5000 });
});


test('should add the active class to the correct element', async (t) => {
  const scrollspyHtml = `
    <nav class="navbar">
      <ul class="nav nav-pills">
        <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">div 1</a></li>
        <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">div 2</a></li>
      </ul>
    </nav>
    <bs-scrollspy id="test-scrollspy" class="content" style="overflow: auto; height: 50px">
      <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>
      <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>
    </bs-scrollspy>`;
  const div1 = Selector('#div-1');
  const div2 = Selector('#div-2');
  const scrollspy = Selector('#test-scrollspy');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });

  await t.expect(await callScrollspyBySelector('#test-scrollspy', { offset: 0, target: '.navbar' })).ok();

  // await t.debug();

  await t.expect(await scrollIntoViewBySelector('#test-scrollspy', '#div-2', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await div2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollIntoViewBySelector('#test-scrollspy', '#div-1', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await div1.hasClass('active')).ok({ timeout: 5000 });


  // await t.expect(await scrollBySelector('#test-scrollspy', { top: 50, left: 0, behavior: 'smooth' })).ok();

  // await t.expect(await oneLink.hasClass('active')).notOk('"active" class removed from first section', { timeout: 5000 });

  // await t.expect(await threeLink.hasClass('active')).notOk('"active" class not on last section', { timeout: 5000 });
});

