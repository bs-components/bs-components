import { TestWindow } from '@stencil/core/testing';
import { BsTooltip } from './bs-tooltip';

  // similar to: https://github.com/twbs/bootstrap/blob/master/js/tests/unit/tooltip.js
  // There will be a few differences due to the tooltipContent Prop

describe('my-component', () => {
  it('should build', () => {
    expect(new BsTooltip()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLBsTooltipElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
    });

    it('should empty title attribute', async () => {
      element = await testWindow.load({
        components: [BsTooltip],
        html: '<bs-tooltip class="btn btn-secondary" data-placement="top" title="Tooltip on top">Tooltip on top</bs-tooltip>'
      });
      // console.log('element: ', element.parentElement.innerHTML);
      // console.log("element.getAttribute('title'): ", element.getAttribute('title'));
      // console.log('element: ', element.parentElement.parentElement.innerHTML);
      await testWindow.flush();
      expect(element.getAttribute('title')).toBeNull();
    });




    // it('should work without parameters', () => {
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m');
    // });

    // it('should work with a first name', async () => {
    //   element.first = 'Peter';
    //   await testWindow.flush();
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter');
    // });


    // it('has name in it', async () => {
    //   element.first = 'Jason';
    //   await testWindow.flush();
    //   // console.log('element: ', element.parentElement.innerHTML);
    //   // console.log('element: ', element.parentElement.parentElement.innerHTML);
    //   // console.log('document.body: ', document.body.innerHTML);
    //   console.log('TestWindow: ', testWindow.)

    //   expect(element.textContent.trim()).toContain('Jason');
    // });

    // it('should work with a last name', async () => {
    //   element.last = 'Parker';
    //   await testWindow.flush();
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m  Parker');
    // });

    // it('should work with both a first and a last name', async () => {
    //   element.first = 'Peter';
    //   element.last = 'Parker';
    //   await testWindow.flush();
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter Parker');
    // });
  });
});
