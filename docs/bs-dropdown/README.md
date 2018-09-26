# Dropdown

## bs-dropdown Example

<vue-html-wrapper>
  <template slot="example">
    <bs-dropdown v-pre class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown button
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </bs-dropdown>
  </template>
</vue-html-wrapper>

```html
<bs-dropdown class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown button
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</bs-dropdown>
```

With anchor element:

<vue-html-wrapper>
  <template slot="example">
    <bs-dropdown v-pre class="dropdown">
      <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown link
      </a>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </bs-dropdown>
  </template>
</vue-html-wrapper>

```html
<bs-dropdown class="dropdown">
  <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown link
  </a>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</bs-dropdown>
```

## Directions

<vue-html-wrapper>
  <template slot="example">
    <bs-dropdown v-pre class="btn-group dropright">
      <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">dropright</button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </bs-dropdown>
    <bs-dropdown v-pre class="btn-group dropup">
      <button type="button" class="btn btn-secondary">
        Split dropup
      </button>
      <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </bs-dropdown>
    <bs-dropdown v-pre class="btn-group dropleft">
      <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">dropleft</button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </bs-dropdown>
  </template>
</vue-html-wrapper>

```html
<bs-dropdown class="btn-group dropright">
  <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">dropright</button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</bs-dropdown>

<bs-dropdown class="btn-group dropup">
  <button type="button" class="btn btn-secondary">
    Split dropup
  </button>
  <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</bs-dropdown>

<bs-dropdown class="btn-group dropleft">
  <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">dropleft</button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</bs-dropdown>
```

## Dropdown options

Use `data-offset` or `data-reference` to change the location of the dropdown.

<vue-html-wrapper>
  <template slot="example">
    <div class="d-flex">
      <bs-dropdown v-pre class="dropdown mr-1">
        <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuOffset" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20">
          Offset
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuOffset">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </bs-dropdown>
      <bs-dropdown v-pre class="btn-group">
        <button type="button" class="btn btn-secondary">Reference</button>
        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" id="dropdownMenuReference" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuReference">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Separated link</a>
        </div>
      </bs-dropdown>
    </div>
  </template>
</vue-html-wrapper>

```html
<div class="d-flex">
  <bs-dropdown class="dropdown mr-1">
    <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuOffset" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20">
      Offset
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuOffset">
      <a class="dropdown-item" href="#">Action</a>
      <a class="dropdown-item" href="#">Another action</a>
      <a class="dropdown-item" href="#">Something else here</a>
    </div>
  </bs-dropdown>
  <bs-dropdown class="btn-group">
    <button type="button" class="btn btn-secondary">Reference</button>
    <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" id="dropdownMenuReference" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent">
      <span class="sr-only">Toggle Dropdown</span>
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuReference">
      <a class="dropdown-item" href="#">Action</a>
      <a class="dropdown-item" href="#">Another action</a>
      <a class="dropdown-item" href="#">Something else here</a>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item" href="#">Separated link</a>
    </div>
  </bs-dropdown>
</div>
```

## Without bs-components

Without the bs-dropdown tag a dropdown will not open or close by itself.

## Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-offset=""`.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| offset | number \| string \| function | 0 | Offset of the dropdown relative to its target. For more information refer to Popper.js's [offset docs](https://popper.js.org/popper-documentation.html#modifiers..offset.offset).|
| flip | boolean | true | Allow Dropdown to flip in case of an overlapping on the reference element. For more information refer to Popper.js's [flip docs](https://popper.js.org/popper-documentation.html#modifiers..flip.enabled). |
| boundary | string\| element | 'scrollParent' | Overflow constraint boundary of the dropdown menu. Accepts the values of 'viewport', 'window', 'scrollParent', or an HTMLElement reference (JavaScript only). For more information refer to Popper.js's [preventOverflow docs](https://popper.js.org/popper-documentation.html#modifiers..preventOverflow.boundariesElement). |
| reference | string \| element | 'toggle' | 	Reference element of the dropdown menu. Accepts the values of 'toggle', 'parent', or an HTMLElement reference. For more information refer to Popper.js's [referenceObject docs](https://popper.js.org/popper-documentation.html#referenceObject). |
| display | string | 'dynamic' | 	By default, we use Popper.js for dynamic positioning. Disable this with `static`. |


## Attributes
| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| show-dropdown | boolean | false | when set to true the dropdown will toggle open |
| ignore-focus-out | boolean | false | when set to true the dropdown will not close when it loses focus |

Example js how to set an attribute true:
```js
document.querySelector('#my-dropdown').setAttribute('show-dropdown', true);
```
Example HTML with an attribute set to true
```html
<bs-dropdown show-dropdown class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown button
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</bs-dropdown>
```


## Methods

### .dropdown('toggle');
Toggles the dropdown menu of a given navbar or tabbed navigation.
```js
document.querySelector('#my-dropdown').dropdown('toggle');
```

### .dropdown('update');
Updates the position of an element’s dropdown by running `scheduleUpdate` on the popper instance.
```js
document.querySelector('#my-dropdown').dropdown('update');
```

## Events

| Event Type | Description |
| --- | --- |
| show.bs.dropdown | This event fires immediately when the show instance method is called. |
| shown.bs.dropdown | This event is fired when the dropdown has been made visible to the user (will wait for CSS transitions, to complete). |
| hide.bs.dropdown | This event is fired immediately when the hide instance method has been called. |
| hidden.bs.dropdown | This event is fired when the dropdown has finished being hidden from the user (will wait for CSS transitions, to complete). |
| focusout.bs.dropdown | This event is fired with the dropdown loses focus.  If you want to keep the dropdown open when focus is lost you can use .preventDefault() on this event to keep the dropdown open |

## Event Renaming Attributes

| Attribute | Default |
| ------------- | ------------- |
| show-event-name | show.bs.dropdown |
| shown-event-name | shown.bs.dropdown |
| hide-event-name | hide.bs.dropdown |
| hidden-event-name | hidden.bs.dropdown |
| focusout-event-name | focusout.bs.dropdown |

Note: do not rename `focusout-event-name` to `focusout` because this will collide with the normal focusout event name.

```html
<bs-dropdown class="dropdown" id="my-dropdown" hidden-event-name="bye-bye-dropdown">
  <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    my dropdown
  </a>
  <div class="dropdown-menu dropdown-menu-right">
    <button class="dropdown-item" type="button">Action</button>
    <button class="dropdown-item" type="button">Another action</button>
    <button class="dropdown-item" type="button">Something else here</button>
  </div>
</bs-dropdown>
```
```js
document.getElementById('my-dropdown').addEventListener('bye-bye-dropdown', function(event) {
  console.log('my dropdown is hidden');
});
```

## Virtual DOM example

Note: This example uses Vue but the same thing is possible in React, Angular, and plain JavaScript.

<toggle-dropdown></toggle-dropdown>
```html
<template>
  <div>
    <bs-dropdown class="dropdown"
      v-bind:show-dropdown="this.showDropdown"
      show-event-name="dropdown-show" v-on:dropdown-show="() => showDropdown = true"
      hide-event-name="dropdown-hide" v-on:dropdown-hide="() => showDropdown = false"
    >
      <button tabindex="-1" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown button
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </bs-dropdown>
    <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="() => showDropdown = !showDropdown">
      Click here to manually toggle dropdown <span v-if="!showDropdown">Open</span><span v-else>Close</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'toggle-button',
  data() {
    return {
      showDropdown: false,
    };
  },
}
</script>
```

Note: If you click on the dropdown button to open it and then click on the manual close link you will see the dropdown closes then opens really fast.  What is happening is that by clicking on the dropdown you are giving the dropdown `focus`.  when clicking away from the dropdown it loses focus and this closes the dropdown.  This happens before the click is processed.  If you prefer this not to happen you can listen for the `focusout.bs.dropdown` event and use `event.preventDefault()` on it.  This will let the focus leave the dropdown without closing it.