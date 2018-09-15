# Popovers

The bs-component popovers use the bs-tooltip web component.  Make sure to set `data-toggle="popover"` or else you will see some behavior that is more like a tooltip.

## Example

<vue-html-wrapper>
  <template slot="example">
    <bs-tooltip v-pre role="button" class="btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</bs-tooltip>
  </template>
</vue-html-wrapper>


```html
<vs-tooltip role="button" class="btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">
  Click to toggle popover
</vs-tooltip>
```

## Four Directions

<vue-html-wrapper>
  <template slot="example">
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
      Popover on top
    </bs-tooltip>
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="right" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
      Popover on right
    </bs-tooltip>
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus
    sagittis lacus vel augue laoreet rutrum faucibus.">
      Popover on bottom
    </bs-tooltip>
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
      Popover on left
    </bs-tooltip>
  </template>
</vue-html-wrapper>

```html
<bs-tooltip role="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on top
</bs-tooltip>

<bs-tooltip role="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on right
</bs-tooltip>

<bs-tooltip role="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus
sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on bottom
</bs-tooltip>

<bs-tooltip role="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on left
</bs-tooltip>
```

## Without bs-tooltip
Without the bs-tooltip tag a popover will not appear

## Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-animation=""`.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| animation | boolean | true | Apply a CSS fade transition to the popover |
| container | string \| element \| false | false | Appends the popover to a specific element. Example: `container: 'body'`. This option is particularly useful in that it allows you to position the popover in the flow of the document near the triggering element - which will prevent the popover from floating away from the triggering element during a window resize. |
| content | string \| element \| function | '' | Default content value if `data-content` attribute isn't present.  If a function is given, it will be called with its this reference set to the element that the popover is attached to. |
| delay | number \| object | 0 | Delay showing and hiding the popover (ms) - does not apply to manual trigger type.  If a number is supplied, delay is applied to both hide/show.  Object structure is: delay: { "show": 500, "hide": 100 } |
| html | boolean | false | Allow HTML in the popover.  If true, HTML tags in the popovers title will be rendered in the popover. If false, .innerText method will be used to insert content into the DOM.  Use text if you're worried about XSS attacks. |
| placement | string \| function | 'right' | How to position the popover - auto \| top \| bottom \| left \| right.  When auto is specified, it will dynamically reorient the popover. When a function is used to determine the placement, it is called with the popover DOM node as its first argument and the triggering element DOM node as its second. The this context is set to the popover instance. |
| selector | string \| false | not really needed for web components as web components can be created and destroyed dynamically |
| template | string | `'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'` |
| title | string \| element \| function | '' | Default title value if `title` attribute isn't present.  If a function is given, it will be called with its this reference set to the element that the popover is attached to. |
| trigger | string | 'click' | How popover is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.  `'manual'` indicates that the popover will be triggered programmatically via the `.popover('show')`, `.popover('hide')` and `.popover('toggle')` methods; this value cannot be combined with any other trigger.  `'hover'` on its own will result in popovers that cannot be triggered via the keyboard, and should only be used if alternative methods for conveying the same information for keyboard users is present. |
| offset | number \| string | 0 | Offset of the popover relative to its target. For more information refer to Popper.js's [offset docs](https://popper.js.org/popper-documentation.html#modifiers..offset.offset). |
| fallbackPlacement | string \| array | 'flip' | Allow to specify which position Popper will use on fallback. For more information refer to Popper.js's [behavior docs](https://popper.js.org/popper-documentation.html#modifiers..flip.behavior) |
| boundary | string \| element | 'scrollParent' | Overflow constraint boundary of the popover. Accepts the values of `'viewport'`, `'window'`, `'scrollParent'`, or an HTMLElement reference (JavaScript only). For more information refer to Popper.js's [preventOverflow docs](https://popper.js.org/popper-documentation.html#modifiers..preventOverflow.boundariesElement). |



## Attributes
| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| show-popover | boolean | false | when set to true the popover will toggle open |
| disabled | boolean | false | when set to true the popover will be disabled.  if `disabled` is set to true initially then the popover will not start enabled. |
| bs-title | string | '' | will override any other title settings and use this for the popover title.  The value is watched so that it will update dynamically. |
| bs-content | string | '' | will override any other content settings and use this for the popover content.  The value is watched so that it will update dynamically. |

Example js how to set an attribute true:
```js
document.querySelector('#my-popover').setAttribute('show-popover', true);
```
Example HTML with an attribute set to true
```html
<bs-tooltip role="button" class="btn btn-secondary" data-toggle="popover" bs-title="this will change if updated dynamically" bs-content="this auto updates too">
  My popover
</bs-tooltip>
```


## Methods

### .popover(options);
Attaches a popover handler to an element collection.
```js
document.querySelector('#my-popover').popover({ content: 'This is a popover with some content' });
```

### .popover('show');
Reveals an element’s popover.
```js
document.querySelector('#my-popover').popover('show');
```

### .popover('hide');
hides an element’s popover.
```js
document.querySelector('#my-popover').popover('hide');
```

### .popover('toggle');
toggles an element’s popover.
```js
document.querySelector('#my-popover').popover('toggle');
```

### .popover('enable');
Gives an element’s popover the ability to be shown.
```js
document.querySelector('#my-popover').popover('enable');
```

### .popover('disable');
Removes the ability for an element’s popover to be shown. The popover will only be able to be shown if it is re-enabled.
```js
document.querySelector('#my-popover').popover('disable');
```

### .popover('toggleEnabled');
Toggles the ability for an element’s popover to be shown or hidden.
```js
document.querySelector('#my-popover').popover('toggleEnabled');
```

### .popover('update');
Updates the position of an element’s popover.
```js
document.querySelector('#my-popover').popover('update');
```


## Events

| Event Type | Description |
| --- | --- |
| show.bs.popover | This event fires immediately when the show instance method is called. |
| shown.bs.popover | This event is fired when the popover has been made visible to the user (will wait for CSS transitions, to complete). |
| hide.bs.popover | This event is fired immediately when the hide instance method has been called. |
| hidden.bs.popover | This event is fired when the popover has finished being hidden from the user (will wait for CSS transitions, to complete). |
| inserted.bs.popover | This event is fired after the `show.bs.popover` event when the popover template has been added to the DOM. |
| enable.bs.popover | triggered when a popover is first enabled.  If `.defaultPrevented()` is used on the event then the popover will not be enabled. |
| enabled.bs.popover | triggered when a popover has finished being enabled. |
| disable.bs.popover | triggered when a popover is first disabled.  If `.defaultPrevented()` is used on the event then the popover will not be disabled. |
| disabled.bs.popover | triggered when a popover has finished being disabled. |


## Event Renaming Attributes

| Attribute | Default |
| ------------- | ------------- |
| show-event-name | show.bs.popover |
| shown-event-name | shown.bs.popover |
| hide-event-name | hide.bs.popover |
| hidden-event-name | hidden.bs.popover |
| inserted-event-name | inserted.bs.popover |
| enable-event-name | enable.bs.popover |
| enabled-event-name | enabled.bs.popover |
| disable-event-name | disable.bs.popover |
| disabled-event-name | disabled.bs.popover |


```html
<bs-tooltip id="my-popover" inserted-event-name="popover-is-in" role="button" class="btn btn-secondary" data-toggle="popover" title="this is a what ya call a popover">
  Tooltip
</bs-tooltip>
```
```js
document.getElementById('my-popover').addEventListener('popover-is-in', function(event) {
  console.log('my popover was inserted into the DOM');
});
```

## Virtual DOM example

Note: This example uses Vue but the same thing is possible in React, Angular, and plain JavaScript.

<popover-example></popover-example>
```html
<template>
  <div>
    <div class="row">
      <div class="col-sm-3">
        <bs-tooltip role="button" class="btn btn-secondary" data-toggle="popover"
          v-bind:show-popover="showPopover"
          v-bind:bs-title="bsTitle"
          v-bind:bs-content="bsContent"
          shown-event-name="popover-shown" v-on:popover-shown="() => showPopover = true"
          hidden-event-name="popover-hidden" v-on:popover-hidden="() => showPopover = false"
        >
          popover
        </bs-tooltip>
      </div>
      <div class="col-sm-3">
        <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="() => showPopover = !showPopover">
          Click here to manually toggle popover <span v-if="!this.showPopover">Open</span><span v-else>Closed</span>
        </a>
      </div>
    </div>
    <div class="form-group row">
      <label for="popover-title" class="col-sm-3 col-form-label">Popover Title</label>
      <div class="col-sm-9">
        <input v-model="bsTitle" type="text" class="form-control" id="popover-title" aria-describedby="popoverTitle" placeholder="Popover Title">
      </div>
    </div>
    <div class="form-group row">
      <label for="popover-content" class="col-sm-3 col-form-label">Popover Content</label>
      <div class="col-sm-9">
        <input v-model="bsContent" type="text" class="form-control" id="popover-content" aria-describedby="popoverContent" placeholder="Popover Content">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popover-example',
  data() {
    return {
      showPopover: false,
      bsTitle: 'dynamic title',
      bsContent: 'dynamic content',
    };
  },
}
</script>
```