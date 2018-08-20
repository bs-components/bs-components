import { Selector, ClientFunction } from 'testcafe';
fixture `bs-components tooltip tests`.page `./test-bs-tooltip.html`;

  // similar to: https://github.com/twbs/bootstrap/blob/master/js/tests/unit/tooltip.js
  // There will be a few differences due to the tooltipContent Prop

test('tooltip method is defined', async t => {
  await Selector('#top-tooltip-button').visible;
  // http://devexpress.github.io/testcafe/documentation/test-api/obtaining-data-from-the-client/examples-of-using-client-functions.html
  const hasTooltipMethod = ClientFunction(() => {
    const topTooltip:any = document.getElementById('top-tooltip-button'); // .parentElement.innerHTML;
    return typeof topTooltip.tooltip;
  });
  console.log('hasTooltipMethod(): ', await hasTooltipMethod());
  await t
  .expect(await hasTooltipMethod()).eql('function');
});

test('should return the element', async t => {
  await Selector('#top-tooltip-button').visible;
  const returnsItself = ClientFunction(() => {
    const topTooltip:any = document.getElementById('top-tooltip-button'); // .parentElement.innerHTML;
    return topTooltip === topTooltip.tooltip();
  });
  console.log('returnsItself(): ', await returnsItself());

  await t
  .expect(await returnsItself()).ok();
});


test('should expose default settings', async t => {
  await Selector('#top-tooltip-button').visible;
  const getDefaults = ClientFunction(() => {
    const topTooltip:any = document.getElementById('top-tooltip-button'); // .parentElement.innerHTML;
    return topTooltip.defaults;
  });
  const defaults = await getDefaults();
  // console.log('defaults: ', defaults);

  await t
  .expect(defaults).ok()
  .expect(typeof defaults).eql('object');
});

test('should empty title attribute', async t => {
  await Selector('#top-tooltip-button').visible;
  await t
  .expect(await Selector('#top-tooltip-button').getAttribute('title')).eql('');
});


test('should add data attribute for referencing original title', async t => {
  await Selector('#another-tooltip').visible;
  await t
  .expect(await Selector('#another-tooltip').getAttribute('data-original-title')).eql('Another tooltip');
});


test('should add aria-describedby to the trigger on show', async t => {
  await Selector('#top-tooltip-button').visible;
  const showMethod = ClientFunction(() => {
    const topTooltipEl:any = document.getElementById('top-tooltip-button');
    topTooltipEl.tooltip('show');
  });

  await showMethod();
  console.log('aria-describedby: ', await Selector('#top-tooltip-button').getAttribute('aria-describedby'));
  await t
  .expect((await Selector('#top-tooltip-button').getAttribute('aria-describedby')).length > 0).ok()
  .expect((await Selector('.tooltip').getAttribute('id')).length > 0).ok()
  .expect(await Selector('#top-tooltip-button').getAttribute('aria-describedby')).eql(await Selector('.tooltip').getAttribute('id'))
});


test('should remove aria-describedby from trigger on hide', async t => {
  await Selector('#right-tooltip-button').visible;
  const showMethod = ClientFunction(() => {
    const topTooltipEl:any = document.getElementById('right-tooltip-button');
    topTooltipEl.tooltip('show');
    return true;
  });
  const hideMethod = ClientFunction(() => {
    const topTooltipEl:any = document.getElementById('right-tooltip-button');
    topTooltipEl.tooltip('hide');
    return true;
  });
  await t
  .expect(await showMethod()).ok()
  .expect(await Selector('#right-tooltip-button').getAttribute('aria-describedby')).ok()
  .expect(await hideMethod()).ok()
  .expect(await Selector('#right-tooltip-button').getAttribute('aria-describedby')).notOk()
});