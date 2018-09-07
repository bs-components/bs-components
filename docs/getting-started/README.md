# Getting Started

The bs-component documentation is intended to get you working with the bs-components.  These docs are not intended to cover all aspects of the bootstrap components.  You should review the bootstrap documentation for more details about how the bootstrap framework itself works.

## Enabling

All bs-components start enabled by default.

## Disposing

You do not need to do anything extra to prevent memory leaks other than remove the component from the DOM.  All bs-components clean up any listeners they are using internally when they are removed from the DOM.

## Methods

bs-components uses plain JavaScript instead of jQuery.  This creates a differences in how the bs-component methods are called.  You need to use the plain javascript DOM selectors.
```js
document.querySelector('#my-bs-component').modal('show');
```

While [You might not need jQuery](http://youmightnotneedjquery.com/), you can still use jQuery if you wish.  You will need to make one change to use the DOM element rather than the jQuery DOM object.
```js
$('#my-bs-component')[0].modal('show');
```


## Events

### How To Listen For Events
bs-components does not use jQuery events it uses DOM customEvents.  You can listen for them using addEventListener.
```js
document.getElementById("example-modal").addEventListener('shown.bs.modal', function(event) {
  console.log('example modal was shown');
});
```

### Prevent Default
you can still prevent default
```js
document.getElementById("example-modal").addEventListener('show.bs.modal', function(event) {
  event.preventDefault();
  console.log('example modal was prevented from being shown');
});
```

## Event Renaming

Occasionally you will want to change the event name used by a component.  For example if you wanted an event name without periods in it you can configure this in bs-components using attributes.  See the documentation for each component for more details.  The names must be set when the bs-component is created.  If the attribute changes after the component is created the new event name will be ignored.
