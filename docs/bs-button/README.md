# Buttons

## Toggle a buttons active class

Add `data-toggle="button"` to toggle a button’s active state. If you’re pre-toggling a button, you must manually add the `.active` class and `aria-pressed="true"` to the `<bs-button>`.

<vue-html-wrapper>
  <template slot="example">
    <bs-button v-pre role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
      Single toggle
    </bs-button>
  </template>
</vue-html-wrapper>

```html
<bs-button role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
  Single toggle
</bs-button>
```

## Checkbox and radio buttons

<vue-html-wrapper><template slot="example">
  <div class="btn-group-toggle" data-toggle="buttons">
    <bs-button v-pre class="btn btn-secondary active">
      <input type="checkbox" checked autocomplete="off"> Checked
    </bs-button>
  </div>
</template></vue-html-wrapper>

```html
<div class="btn-group-toggle" data-toggle="buttons">
  <bs-button v-pre class="btn btn-secondary active">
    <input type="checkbox" checked autocomplete="off"> Checked
  </bs-button>
</div>
```

<vue-html-wrapper><template slot="example">
  <div class="btn-group btn-group-toggle" data-toggle="buttons">
    <bs-button v-pre class="btn btn-secondary active">
      <input type="radio" name="options" id="option1" autocomplete="off" checked> Active
    </bs-button>
    <bs-button v-pre class="btn btn-secondary">
      <input type="radio" name="options" id="option2" autocomplete="off"> Radio
    </bs-button>
    <bs-button v-pre class="btn btn-secondary">
      <input type="radio" name="options" id="option3" autocomplete="off"> Radio
    </bs-button>
  </div>
</template></vue-html-wrapper>

```html
<div class="btn-group btn-group-toggle" data-toggle="buttons">
  <bs-button class="btn btn-secondary active">
    <input type="radio" name="options" id="option1" autocomplete="off" checked> Active
  </bs-button>
  <bs-button class="btn btn-secondary">
    <input type="radio" name="options" id="option2" autocomplete="off"> Radio
  </bs-button>
  <bs-button class="btn btn-secondary">
    <input type="radio" name="options" id="option3" autocomplete="off"> Radio
  </bs-button>
</div>
```

## Wrapped Buttons
You may want to use an anchor tag as a bs-button.  This can be done using a wrapped button.  Note: Make sure you set `tabindex="-1"` on the bs-button wrapper or else tabbing and focus will not work correctly.

<vue-html-wrapper>
  <template slot="example">
    <bs-button v-pre tabindex="-1">
      <a href="#" role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
        toggle anchor
      </a>
    </bs-button>
  </template>
</vue-html-wrapper>

```html
<bs-button tabindex="-1">
  <a href="#" role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
    toggle anchor
  </a>
</bs-button>
```

## Without bs-components
Without the bs-button component the bootstrap buttons and anchor tags will work as normal html elements.  Note that an anchor tag will not be prevented from submitting unless it is wrapped in a bs-button tag.

```html
<a class="btn btn-primary" href="#" role="button">Link</a>
<button class="btn btn-primary" type="submit">Button</button>
<input class="btn btn-primary" type="button" value="Input">
<input class="btn btn-primary" type="submit" value="Submit">
<input class="btn btn-primary" type="reset" value="Reset">
```

## Triggers
The other components such as collapses and modals use bs-button components to trigger them.  See those scetions for details on that.


## Attributes
| Attribute | Type |Default | Description |
| --- | --- | --- | --- |
| active | boolean | false | when set to true the button will set its state to true. |

Example js how to set an attribute true:
```js
document.querySelector('#my-button').setAttribute('active', true);
```
Example HTML with an attribute set to true
```html
<bs-button active role="button" class="btn btn-primary" data-toggle="button">
  <i id="inner-italc">Single toggle</i>
</bs-button>
```


## Methods
bs-button only has one method.

| Method  | Description  |
| ------------- | ------------- |
| .button('toggle'); | Toggles push state. Gives the button the appearance that it has been activated. |

```js
document.querySelector('#my-button').button('toggle');
```


## Events

| Event | Description |
| ------------- | ------------- |
| active.bs.button | Sent only for toggle buttons when the active state changes to active. |
| inactive.bs.button | Sent only for toggle buttons when the active state changes to not active. |


```js
document.querySelector("#my-toggle-button").addEventListener('active.bs.button', function(event) {
  console.log('button is active');
});
```

## Event Renaming Attributes

NOTE: you should not rename the event to simple `change` because `change` is already being used.  Bootstrap already sends a `change` event on input fields within buttons when they change.

| Attribute | Default |
| ------------- | ------------- |
| active-event-name | active.bs.button |
| inactive-event-name | inactive.bs.button |


```html
<bs-button id="my-button" role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off"
  inactive-event-name="custom-button-inactive-event"
>
  toggle button
</bs-button>
```
```js
document.getElementById("my-button").addEventListener('custom-button-inactive-event', function(event) {
  console.log('my alert is closing');
});
```

## Virtual DOM examples

Note: These examples use Vue but the same thing is possible in React, Angular, and even plain JavaScript.

### Virtual DOM toggle button example
<toggle-button></toggle-button>
```html
<template>
  <div>
    <bs-button role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off"
      v-bind:active="this.buttonActive"
      active-event-name="button-active" v-on:button-active="this.handleButtonActive"
      inactive-event-name="button-inactive" v-on:button-inactive="this.handleButtonInactive"
    >
      toggle button
    </bs-button>
    <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="handleToggleButton">
      Click here to manually toggle button <span v-if="!this.buttonActive">Active</span><span v-else>Inactive</span>
    </a>
  </div>
</template>

<script>
function handleToggleButton() {
  this.buttonActive = !this.buttonActive;
}

function handleButtonActive() {
  this.buttonActive = true;
}

function handleButtonInactive() {
  this.buttonActive = false;
}

export default {
  name: 'toggle-button',
  data() {
    return {
      buttonActive: false,
    };
  },
  methods: {
    handleButtonActive,
    handleButtonInactive,
    handleToggleButton,
  }
}
</script>
```


### Virtual DOM checkbox button example
<toggle-button-checkbox></toggle-button-checkbox>
```html
<template>
  <div>
    <div class="btn-group-toggle" data-toggle="buttons">
      <bs-button role="button" class="btn btn-secondary active"
        v-bind:active="this.buttonActive"
        active-event-name="button-active" v-on:button-active="handleButtonActive"
        inactive-event-name="button-inactive" v-on:button-inactive="handleButtonInactive"
      >
        <input id="chkbtn" type="checkbox" checked autocomplete="off" v-model="buttonCheckboxChecked"> Check box button
      </bs-button>
    </div>
    <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="handleToggleButton">
      Click here to manually toggle checkbox button <span v-if="!this.buttonActive">Active</span><span v-else>Inactive</span>
    </a>
    <p>input checkbox is: <span v-if="this.buttonCheckboxChecked">Checked</span><span v-else>Not Checked</span></p>
  </div>
</template>

<script>
function handleToggleButton() {
  this.buttonActive = !this.buttonActive;
}

function handleButtonActive() {
  this.buttonActive = true;
  this.buttonCheckboxChecked = true;
}

function handleButtonInactive() {
  this.buttonActive = false;
  this.buttonCheckboxChecked = false;
}

export default {
  name: 'toggle-button-checkbox',
  data() {
    return {
      buttonActive: true,
      buttonCheckboxChecked: true,
    };
  },
  methods: {
    handleButtonActive,
    handleButtonInactive,
    handleToggleButton,
  }
}
</script>
```

### Virtual DOM radio button example
<toggle-button-radio></toggle-button-radio>
```html
<template>
  <div>
    <div class="btn-group btn-group-toggle" data-toggle="buttons">
      <bs-button role="button" class="btn btn-secondary"
        id="radio1"
        v-bind:active="this.toggleActiveState['radio1']"
        active-event-name="active" v-on:active="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
        inactive-event-name="inactive" v-on:inactive="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
      >
        <input type="radio" name="options" id="option1" autocomplete="off">
        Radio 1
      </bs-button>
      <bs-button role="button" class="btn btn-secondary"
        id="radio2"
        v-bind:active="this.toggleActiveState['radio2']"
        active-event-name="active" v-on:active="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
        inactive-event-name="inactive" v-on:inactive="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
      >
        <input type="radio" name="options" id="option2" autocomplete="off">
        Radio 2
      </bs-button>
      <bs-button role="button" class="btn btn-secondary"
        id="radio3"
        v-bind:active="this.toggleActiveState['radio3']"
        active-event-name="active" v-on:active="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
        inactive-event-name="inactive" v-on:inactive="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
      >
        <input type="radio" name="options" id="option3" autocomplete="off">
        Radio 3
      </bs-button>
    </div>
    <p v-if="this.toggleActiveState.radio1">Radio Button 1 is active</p>
    <p v-if="this.toggleActiveState.radio2">Radio Button 2 is active</p>
    <p v-if="this.toggleActiveState.radio3">Radio Button 3 is active</p>
  </div>
</template>

<script>
export default {
  name: 'toggle-button-radio',
  data() {
    return {
      toggleActiveState: {},
    };
  },
}
</script>
```
