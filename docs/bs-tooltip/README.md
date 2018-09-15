# Tooltips

## bs-tooltip examples
<vue-html-wrapper>
  <template slot="example">
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">
      Tooltip on top
    </bs-tooltip>
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">
      Tooltip on right
    </bs-tooltip>
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">
      Tooltip on bottom
    </bs-tooltip>
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">
      Tooltip on left
    </bs-tooltip>
    <bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-html="true" title="<em>Tooltip</em> <u>with</u> <b>HTML</b>">
      Tooltip with HTML
    </bs-tooltip>
  </template>
</vue-html-wrapper>


```html
<bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">
  Tooltip on top
</bs-tooltip>

<bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">
  Tooltip on right
</bs-tooltip>

<bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">
  Tooltip on bottom
</bs-tooltip>

<bs-tooltip v-pre role="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">
  Tooltip on left
</bs-tooltip>

<bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" data-html="true" title="<em>Tooltip</em> <u>with</u> <b>HTML</b>">
  Tooltip with HTML
</bs-tooltip>
```

## Without bs-tooltip
Without the bs-tooltip tag a tooltip will not appear

## Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-animation=""`.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| animation | boolean | true | Apply a CSS fade transition to the tooltip |
| container | string \| element \| false | false | Appends the tooltip to a specific element. Example: `container: 'body'`. This option is particularly useful in that it allows you to position the tooltip in the flow of the document near the triggering element - which will prevent the tooltip from floating away from the triggering element during a window resize. |
| delay | number \| object | 0 | Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type.  If a number is supplied, delay is applied to both hide/show.  Object structure is: delay: { "show": 500, "hide": 100 } |
| html | boolean | false | Allow HTML in the tooltip.  If true, HTML tags in the tooltips title will be rendered in the tooltip. If false, .innerText method will be used to insert content into the DOM.  Use text if you're worried about XSS attacks. |
| placement | string \| function | 'top' | How to position the tooltip - auto \| top \| bottom \| left \| right.  When auto is specified, it will dynamically reorient the tooltip. When a function is used to determine the placement, it is called with the tooltip DOM node as its first argument and the triggering element DOM node as its second. The this context is set to the tooltip instance. |
| selector | string \| false | not really needed for web components as web components can be created and destroyed dynamically |
| template | string | `'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'` | Base HTML to use when creating the tooltip.  The tooltip's `title` will be injected into the `.tooltip-inner.` `.arrow` will become the tooltips arrow.  The outermost wrapper element should have the `.tooltip` class and `role="tooltip"`.
| title | string \| element \| function | '' | Default title value if `title` attribute isn't present.  If a function is given, it will be called with its this reference set to the element that the tooltip is attached to. |
| trigger | string | 'hover focus' | How tooltip is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.  `'manual'` indicates that the tooltip will be triggered programmatically via the `.tooltip('show')`, `.tooltip('hide')` and `.tooltip('toggle')` methods; this value cannot be combined with any other trigger.  `'hover'` on its own will result in tooltips that cannot be triggered via the keyboard, and should only be used if alternative methods for conveying the same information for keyboard users is present. |
| offset | number \| string | 0 | Offset of the tooltip relative to its target. For more information refer to Popper.js's [offset docs](https://popper.js.org/popper-documentation.html#modifiers..offset.offset). |
| fallbackPlacement | string \| array | 'flip' | Allow to specify which position Popper will use on fallback. For more information refer to Popper.js's [behavior docs](https://popper.js.org/popper-documentation.html#modifiers..flip.behavior) |
| boundary | string \| element | 'scrollParent' | Overflow constraint boundary of the tooltip. Accepts the values of `'viewport'`, `'window'`, `'scrollParent'`, or an HTMLElement reference (JavaScript only). For more information refer to Popper.js's [preventOverflow docs](https://popper.js.org/popper-documentation.html#modifiers..preventOverflow.boundariesElement). |



## Attributes
| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| show-tooltip | boolean | false | when set to true the tooltip will toggle open |
| disabled | boolean | false | when set to true the tooltip will be disabled.  if `disabled` is set to true initially then the tooltip will not start enabled. |
| bs-title | string | '' | will override any other title settings and use this for the tooltip title.  The value is watched so that it will update dynamically. |


Example js how to set an attribute true:
```js
document.querySelector('#my-tooltip').setAttribute('show-tooltip', true);
```
Example HTML with an attribute set to true
```html
<bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip" bs-title="this will change if updated dynamically">
  Tooltip
</bs-tooltip>
```


## Methods

### .tooltip(options);
Attaches a tooltip handler to an element collection.
```js
document.querySelector('#my-tooltip').tooltip({ title: 'This is a tooltip with some content' });
```

### .tooltip('show');
Reveals an element’s tooltip.
```js
document.querySelector('#my-tooltip').tooltip('show');
```

### .tooltip('hide');
hides an element’s tooltip.
```js
document.querySelector('#my-tooltip').tooltip('hide');
```

### .tooltip('toggle');
toggles an element’s tooltip.
```js
document.querySelector('#my-tooltip').tooltip('toggle');
```

### .tooltip('enable');
Gives an element’s tooltip the ability to be shown.
```js
document.querySelector('#my-tooltip').tooltip('enable');
```

### .tooltip('disable');
Removes the ability for an element’s tooltip to be shown. The tooltip will only be able to be shown if it is re-enabled.
```js
document.querySelector('#my-tooltip').tooltip('disable');
```

### .tooltip('toggleEnabled');
Toggles the ability for an element’s tooltip to be shown or hidden.
```js
document.querySelector('#my-tooltip').tooltip('toggleEnabled');
```

### .tooltip('update');
Updates the position of an element’s tooltip.
```js
document.querySelector('#my-tooltip').tooltip('update');
```



## Events

| Event Type | Description |
| --- | --- |
| show.bs.tooltip | This event fires immediately when the show instance method is called. |
| shown.bs.tooltip | This event is fired when the tooltip has been made visible to the user (will wait for CSS transitions, to complete). |
| hide.bs.tooltip | This event is fired immediately when the hide instance method has been called. |
| hidden.bs.tooltip | This event is fired when the tooltip has finished being hidden from the user (will wait for CSS transitions, to complete). |
| inserted.bs.tooltip | This event is fired after the `show.bs.tooltip` event when the tooltip template has been added to the DOM. |
| enable.bs.tooltip | triggered when a tooltip is first enabled.  If `.defaultPrevented()` is used on the event then the tooltip will not be enabled. |
| enabled.bs.tooltip | triggered when a tooltip has finished being enabled. |
| disable.bs.tooltip | triggered when a tooltip is first disabled.  If `.defaultPrevented()` is used on the event then the tooltip will not be disabled. |
| disabled.bs.tooltip | triggered when a tooltip has finished being disabled. |


## Event Renaming Attributes

| Attribute | Default |
| ------------- | ------------- |
| show-event-name | show.bs.tooltip |
| shown-event-name | shown.bs.tooltip |
| hide-event-name | hide.bs.tooltip |
| hidden-event-name | hidden.bs.tooltip |
| inserted-event-name | inserted.bs.tooltip |
| enable-event-name | enable.bs.tooltip |
| enabled-event-name | enabled.bs.tooltip |
| disable-event-name | disable.bs.tooltip |
| disabled-event-name | disabled.bs.tooltip |

```html
<bs-tooltip id="my-tooltip" hidden-event-name="tooltip-is-in" role="button" class="btn btn-secondary" data-toggle="tooltip" title="this is a what ya call a tooltip">
  Tooltip
</bs-tooltip>
```
```js
document.getElementById('my-tooltip').addEventListener('tooltip-is-in', function(event) {
  console.log('my tooltip was inserted into the DOM');
});
```

## Virtual DOM example

Note: This example uses Vue but the same thing is possible in React, Angular, and plain JavaScript.

<tooltip-example></tooltip-example>
```html
<template>
  <div>
    <bs-tooltip role="button" class="btn btn-secondary" data-toggle="tooltip"
      v-bind:show-tooltip="showTooltip"
      v-bind:bs-title="bsTitle"
      shown-event-name="tooltip-shown" v-on:tooltip-shown="() => showTooltip = true"
      hidden-event-name="tooltip-hidden" v-on:tooltip-hidden="() => showTooltip = false"
    >
      tooltip
    </bs-tooltip>
    <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="() => showTooltip = !showTooltip">
      Click here to manually toggle tooltip <span v-if="!this.showTooltip">Open</span><span v-else>Closed</span>
    </a>
    <p>&nbsp;</p>
    <div class="form-group">
      <label for="tooltip-title" class="col-form-label">Tooltip Title</label>
        <input v-model="bsTitle" type="text" class="form-control" id="tooltip-title" aria-describedby="tooltipTitle" placeholder="tooltip Title">
    </div>
  </div>
</template>

<script>
export default {
  name: 'tooltip-example',
  data() {
    return {
      showTooltip: false,
      bsTitle: 'dynamic title',
    };
  },
}
</script>
```