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
    return el.scrollspy(passedOption);
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
    // added 150ms delay here to make firefox happy
    setTimeout(() => {
      resolve(resultArr.every(result => result === true));
    }, 150);
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
    // added 150ms delay here to make firefox happy
    setTimeout(() => {
      resolve(resultArr.every(result => result === true));
    }, 150);
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
  await t.expect(await callScrollspyBySelector('#scrollspy-example', { target: '#ss-target' })).ok({ timeout: 5000 });
  // await t.expect(await scrollIntoViewBySelector('#scrollspy-example', '#detail', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await scrollBySelector('#scrollspy-example', { top: 350, left: 0, behavior: 'smooth' })).ok({ timeout: 5000 });
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

  // 550px offset + 200px scroll = 750px from the top
  // "#one" is 500px, "#two" is 300px therefore 750px should put the scrollTop 50px away from "#three"
  // "#two" should be active
  await t.expect(await callScrollspyBySelector('#content', { target: '#navigation', offset: 550 })).ok();
  await t.expect(await scrollBySelector('#content', { top: 200, left: 0, behavior: 'smooth' })).ok();
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
    <bs-scrollspy class="content" style="overflow: auto; height: 50px">
      <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>
      <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>
    </bs-scrollspy>`;
  const a1 = Selector('#a-1');
  const a2 = Selector('#a-2');
  const scrollspy = Selector('.content');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('.content', { offset: 0, target: '.navbar' })).ok();
  await t.expect(await scrollIntoViewBySelector('.content', '#div-2', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await scrollIntoViewBySelector('.content', '#div-1', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
});


test('should add the active class to the correct element (nav markup)', async (t) => {
  const scrollspyHtml = `
    <nav class="navbar">
      <nav class="nav nav-pills">
        <a class="nav-link" id="a-1" href="#div-1">div 1</a>
        <a class="nav-link" id="a-2" href="#div-2">div 2</a>
      </nav>
    </nav>
    <bs-scrollspy class="content" style="overflow: auto; height: 50px">
      <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>
      <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>
    </bs-scrollspy>`;
  const a1 = Selector('#a-1');
  const a2 = Selector('#a-2');
  const scrollspy = Selector('.content');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('.content', { offset: 0, target: '.navbar' })).ok();
  await t.expect(await scrollIntoViewBySelector('.content', '#div-2', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await scrollIntoViewBySelector('.content', '#div-1', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
});


test('should add the active class to the correct element (list-group markup)', async (t) => {
  const scrollspyHtml = `
    <nav class="navbar">
      <div class="list-group">
        <a class="list-group-item" id="a-1" href="#div-1">div 1</a>
        <a class="list-group-item" id="a-2" href="#div-2">div 2</a>
      </div>
    </nav>
    <bs-scrollspy class="content" style="overflow: auto; height: 50px">
      <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>
      <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>
    </bs-scrollspy>`;
  const a1 = Selector('#a-1');
  const a2 = Selector('#a-2');
  const scrollspy = Selector('.content');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('.content', { offset: 0, target: '.navbar' })).ok();
  await t.expect(await scrollIntoViewBySelector('.content', '#div-2', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await scrollIntoViewBySelector('.content', '#div-1', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
});


test('should add the active class correctly when there are nested elements at 0 scroll offset', async (t) => {
  const scrollspyHtml = `
    <nav id="navigation" class="navbar">
      <ul class="nav">
        <li class="nav-item"><a id="a-1" class="nav-link" href="#div-1">div 1</a>
          <ul class="nav">
            <li class="nav-item"><a id="a-2" class="nav-link" href="#div-2">div 2</a></li>
          </ul>
        </li>
      </ul>
    </nav>
    <bs-scrollspy class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">
      <div id="div-1" style="padding: 0; margin: 0">
        <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>
      </div>
    </bs-scrollspy>`;
  const a1 = Selector('#a-1');
  const a2 = Selector('#a-2');
  const scrollspy = Selector('.content');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('.content', { offset: 0, target: '#navigation' })).ok();

  await t.expect(await scrollBySelector('.content', { top: 10, left: 0, behavior: 'smooth' })).ok();
  await t.wait(333); // makes FF happy
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 20, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 30, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 40, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });
});


test('should add the active class correctly when there are nested elements (nav markup)', async (t) => {
  const scrollspyHtml = `
    <nav id="navigation" class="navbar">
      <nav class="nav">
        <a id="a-1" class="nav-link" href="#div-1">div 1</a>
        <nav class="nav">
          <a id="a-2" class="nav-link" href="#div-2">div 2</a>
        </nav>
      </nav>
    </nav>
    <bs-scrollspy class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">
      <div id="div-1" style="padding: 0; margin: 0">
        <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>
      </div>
    </bs-scrollspy>`;
  const a1 = Selector('#a-1');
  const a2 = Selector('#a-2');
  const scrollspy = Selector('.content');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('.content', { offset: 0, target: '#navigation' })).ok();

  await t.expect(await scrollBySelector('.content', { top: 10, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 20, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 30, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 40, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });
});


test('should add the active class correctly when there are nested elements (nav nav-item markup)', async (t) => {
  const scrollspyHtml = `
    <nav id="navigation" class="navbar">
      <ul class="nav">
        <li class="nav-item"><a id="a-1" class="nav-link" href="#div-1">div 1</a></li>
        <ul class="nav">
          <li class="nav-item"><a id="a-2" class="nav-link" href="#div-2">div 2</a></li>
        </ul>
      </ul>
    </nav>
    <bs-scrollspy class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">
      <div id="div-1" style="padding: 0; margin: 0">
        <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>
      </div>
    </bs-scrollspy>`;
  const a1 = Selector('#a-1');
  const a2 = Selector('#a-2');
  const scrollspy = Selector('.content');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('.content', { offset: 0, target: '#navigation' })).ok();

  await t.expect(await scrollBySelector('.content', { top: 10, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 20, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 30, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 40, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });
});


test('should add the active class correctly when there are nested elements (list-group markup)', async (t) => {
  const scrollspyHtml = `
    <nav id="navigation" class="navbar">
      <div class="list-group">
        <a id="a-1" class="list-group-item" href="#div-1">div 1</a>
        <div class="list-group">
          <a id="a-2" class="list-group-item" href="#div-2">div 2</a>
        </div>
      </div>
    </nav>
    <bs-scrollspy class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">
      <div id="div-1" style="padding: 0; margin: 0">
        <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>
      </div>
    </bs-scrollspy>`;
  const a1 = Selector('#a-1');
  const a2 = Selector('#a-2');
  const scrollspy = Selector('.content');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.nth(0).exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('.content', { offset: 0, target: '#navigation' })).ok();

  await t.expect(await scrollBySelector('.content', { top: 10, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 20, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 30, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });

  await t.expect(await scrollBySelector('.content', { top: 40, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await a1.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await a2.hasClass('active')).ok({ timeout: 5000 });
});


test('should clear selection if above the first section', async (t) => {
  const scrollspyHtml = `
    <div id="header" style="height: 500px;"></div>
    <nav id="navigation" class="navbar">
      <ul class="navbar-nav nav-pills">
        <li class="nav-item"><a id="one-link" class="nav-link active" href="#one">One</a></li>
        <li class="nav-item"><a id="two-link" class="nav-link" href="#two">Two</a></li>
        <li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>
      </ul>
    </nav>
    <bs-scrollspy id="content" style="height: 200px; overflow-y: auto;">
      <div id="spacer" style="height: 100px;">#spacer</div>
      <div id="one" style="height: 100px;">#one</div>
      <div id="two" style="height: 100px;">#two</div>
      <div id="three" style="height: 100px;">#three</div>
      <div id="spacer" style="height: 100px;">#spacer</div>
    </bs-scrollspy>`;
  const scrollspy = Selector('#content');
  const active = Selector('.active');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('#content', { offset: 0, target: '#navigation' })).ok();
  await t.expect(await scrollBySelector('#content', { top: 201, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await active.count).eql(1, '"active" class on only one element present', { timeout: 5000 });
  await t.expect(await active.nth(0).id).eql('two-link', '"active" class on second section', { timeout: 5000 });
  await t.expect(await scrollBySelector('#content', { top: 0, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await active.count).eql(0, 'selection cleared', { timeout: 5000 });
});

test('should NOT clear selection if above the first section and first section is at the top', async (t) => {
  const scrollspyHtml = `
    <div id="header" style="height: 500px;"></div>
    <nav id="navigation" class="navbar">
      <ul class="navbar-nav nav-pills">
        <li class="nav-item"><a id="one-link" class="nav-link active" href="#one">One</a></li>
        <li class="nav-item"><a id="two-link" class="nav-link" href="#two">Two</a></li>
        <li class="nav-item"><a id="three-link" class="nav-link" href="#three">Three</a></li>
      </ul>
    </nav>
    <bs-scrollspy id="content" style="height: 200px; overflow-y: auto;">
      <div id="one" style="height: 100px;">#one</div>
      <div id="two" style="height: 100px;">#two</div>
      <div id="three" style="height: 100px;">#three</div>
      <div id="spacer" style="height: 100px;">#spacer</div>
    </bs-scrollspy>`;
  const scrollspy = Selector('#content');
  const active = Selector('.active');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('#content', { offset: 0, target: '#navigation' })).ok();
  await t.expect(await scrollBySelector('#content', { top: 101, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await active.count).eql(1, '"active" class on only one element present', { timeout: 5000 });
  await t.expect(await active.nth(0).id).eql('two-link', '"active" class on second section', { timeout: 5000 });
  await t.expect(await scrollBySelector('#content', { top: -10, left: 0, behavior: 'smooth' })).ok();
  await t.expect(await active.count).eql(1, '"active" class on only one element present', { timeout: 5000 });
  await t.expect(await active.nth(0).id).eql('one-link', '"active" class on first section', { timeout: 5000 });
});


test('should correctly select navigation element on backward scrolling when each target section height is 100%', async (t) => {
  const scrollspyHtml = `
    <nav class="navbar">
      <ul class="nav nav-pills">
        <li class="nav-item"><a id="li-100-1" class="nav-link" href="#div-100-1">div 1</a></li>
        <li class="nav-item"><a id="li-100-2" class="nav-link" href="#div-100-2">div 2</a></li>
        <li class="nav-item"><a id="li-100-3" class="nav-link" href="#div-100-3">div 3</a></li>
        <li class="nav-item"><a id="li-100-4" class="nav-link" href="#div-100-4">div 4</a></li>
        <li class="nav-item"><a id="li-100-5" class="nav-link" href="#div-100-5">div 5</a></li>
      </ul>
    </nav>
    <bs-scrollspy class="content" style="position: relative; overflow: auto; height: 100px">
      <div id="div-100-1" style="position: relative; height: 100%; padding: 0; margin: 0">div 1</div>
      <div id="div-100-2" style="position: relative; height: 100%; padding: 0; margin: 0">div 2</div>
      <div id="div-100-3" style="position: relative; height: 100%; padding: 0; margin: 0">div 3</div>
      <div id="div-100-4" style="position: relative; height: 100%; padding: 0; margin: 0">div 4</div>
      <div id="div-100-5" style="position: relative; height: 100%; padding: 0; margin: 0">div 5</div>
    </bs-scrollspy>`;
  const scrollspy = Selector('.content');
  const li1005 = Selector('#li-100-5');
  const li1004 = Selector('#li-100-4');
  const li1003 = Selector('#li-100-3');
  const li1002 = Selector('#li-100-2');
  const li1001 = Selector('#li-100-1');
  await t.expect(await setHtml(_.trim(scrollspyHtml))).ok();
  await t.expect(await scrollspy.exists).ok({ timeout: 5000 });
  await t.expect(await callScrollspyBySelector('.content', { offset: 0, target: '.navbar' })).ok();
  await t.expect(await scrollIntoViewBySelector('.content', '#div-100-5', { behavior: 'smooth', block: 'start' })).ok();
  await t.wait(333); // makes FF happy
  await t.expect(await li1005.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await scrollIntoViewBySelector('.content', '#div-100-4', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await li1004.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await scrollIntoViewBySelector('.content', '#div-100-3', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await li1003.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await scrollIntoViewBySelector('.content', '#div-100-2', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await li1002.hasClass('active')).ok({ timeout: 5000 });
  await t.expect(await scrollIntoViewBySelector('.content', '#div-100-1', { behavior: 'smooth', block: 'start' })).ok();
  await t.expect(await li1001.hasClass('active')).ok({ timeout: 5000 });
});
