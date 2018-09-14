# Alerts

## bs-alert Example

<vue-html-wrapper>
  <template slot="example">
  <bs-alert v-pre class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </bs-alert>
  </template>
</vue-html-wrapper>


```html
<bs-alert class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</bs-alert>
```

## Dismissing
* You must use the bs-alert tag to create your modal.
* If you add an item with `data-dismiss="alert"` (like above) when it is clicked the alert will be dismissed.


## Without bs-components
The only feature the bs-alert component provides is the [data-dismiss="alert"] listener.  A traditional alert will still work as normal.

<vue-html-wrapper>
  <template slot="example">
    <div class="alert alert-primary" role="alert">
      A simple primary alert—check it out!
    </div>
  </template>
</vue-html-wrapper>

```html
<div class="alert alert-success" role="alert">
  A simple success alert—check it out!
</div>
```

## Triggers
You will need to add a data attribute within the alert as as demonstrated above.  It does not need to be a bs-button component.

```html
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
```

## Attributes
| Attribute | Type |Default | Description |
| --- | --- | --- | --- |
| dismiss | boolean | false | when set to true the alert will close |
| no-self-remove-from-dom | boolean | false | when set to true the alert will fade out but not remove itself from the DOM |

Example js how to set an attribute true:
```js
document.querySelector('#my-alert').setAttribute('dismiss', true);
```
Example HTMl with an attribute set to true
```html
<bs-alert no-self-remove-from-dom class="alert alert-success" role="alert">
  A success alert that can be closed but stays in the DOM
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</bs-alert>
```


## Methods
bs-alert only has one method.

| Method  | Description  |
| ------------- | ------------- |
| .alert('close'); | Closes an alert by removing it from the DOM. If the .fade and .show classes are present on the element, the alert will fade out before it is removed. |

```js
document.querySelector('#my-alert').alert('close');
```

## Events

| Event | Description |
| ------------- | ------------- |
| open.bs.alert | Not used by default unless the attribute `no-self-remove-from-dom` is set and then the alert attribute `dismiss` is set from true to false.  Then this is fired when the open starts.  you can use preventDefault on this event. |
| opened.bs.alert | Not used by default unless the attribute `no-self-remove-from-dom` is set and then the alert attribute `dismiss` is set from true to false.  Then this is fired when the open is finished. |
| close.bs.alert | This event fires immediately when the close instance method is called. |
| closed.bs.alert | This event is fired when the alert has been closed (will wait for CSS transitions to complete). |


```js
document.querySelector("#my-alert").addEventListener('closed.bs.alert', function(event) {
  console.log('my alert was closed');
});
```

## Event Renaming Attributes

| Attribute | Default |
| ------------- | ------------- |
| open-event-name | open.bs.alert |
| opened-event-name | opened.bs.alert |
| close-event-name | close.bs.alert |
| closed-event-name | closed.bs.alert |

```html
<bs-alert id="my-alert" close-event-name="close-event-custom-name" class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</bs-alert>
```
```js
document.getElementById("my-alert").addEventListener('close-event-custom-name', function(event) {
  console.log('my alert is closing');
});
```

## Virtual DOM example

Note: This example uses Vue but the same thing is possible in React, Angular, and plain JavaScript.

<toggling-alert></toggling-alert>


```html
<template>
  <div>
    <bs-alert class="alert alert-warning alert-dismissible fade show" role="alert"
      no-self-remove-from-dom
      v-bind:dismiss="this.alertDismissed"
      opened-event-name="alert-opened" v-on:alert-opened="handleAlertOpened"
      closed-event-name="alert-closed" v-on:alert-closed="handleAlertClosed"
    >
      <strong>Holy guacamole!</strong> This alerts dismiss state stays in sync with my code.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </bs-alert>
    <a class="btn btn-primary" href="#" role="button" v-on:click.stop.prevent="handleToggleAlert">
      Toggle Alert <span v-if="this.alertDismissed">Open</span><span v-else>Closed</span>
    </a>
  </div>
</template>

<script>
function handleToggleAlert() {
  this.alertDismissed = !this.alertDismissed;
}

function handleAlertOpened() {
  this.alertDismissed = false;
}

function handleAlertClosed() {
  this.alertDismissed = true;
}

export default {
  name: 'toggling-alert',
  data() {
    return {
      alertDismissed: false,
    };
  },
  methods: {
    handleAlertOpened,
    handleAlertClosed,
    handleToggleAlert,
  }
}
</script>
```
