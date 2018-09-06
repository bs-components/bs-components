# Modal

## bs-modal example

<vue-html-wrapper>
  <template slot="example">
  <bs-button v-pre role="button" class="btn btn-primary" data-toggle="modal" data-target="#basicModal">
      Launch demo modal
  </bs-button>
  <bs-modal v-pre class="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="basicModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ...
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </bs-modal>
  </template>
</vue-html-wrapper>


```html
  <!-- bs-button trigger modal -->
  <bs-button role="button" class="btn btn-primary" data-toggle="modal" data-target="#basicModal">
      Launch demo modal
  </bs-button>

  <!-- Modal -->
  <bs-modal class="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="basicModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ...
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </bs-modal>
```

## Tooltips and popovers

When modals are closed, any tooltips and popovers within are also automatically dismissed.

<vue-html-wrapper>
  <template slot="example">
    <bs-button v-pre role="button" class="btn btn-primary" data-toggle="modal" data-target="#example-popover-modal">
        Launch modal with popover
    </bs-button>
    <bs-modal v-pre class="modal fade" id="example-popover-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title (with popover within)</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <bs-tooltip v-pre class="btn btn-secondary" data-container="body" data-toggle="popover" title="popover" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
              Popover
            </bs-tooltip>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </bs-modal>
  </template>
</vue-html-wrapper>


```html
  <!-- bs-button trigger modal -->
  <bs-button role="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
      Launch modal with popover
  </bs-button>

  <!-- Modal -->
  <bs-modal class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title (with popover within)</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <bs-tooltip class="btn btn-secondary" data-container="body" data-toggle="popover" title="popover" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
            Popover
          </bs-tooltip>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </bs-modal>
```

## Varying modal content


<varying-modal-content></varying-modal-content>

```html
<bs-button tabindex="-1">
  <button role="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@dev1">
    Open modal for @dev1
  </button>
</bs-button>

<bs-button tabindex="-1">
  <a href="#exampleModal" role="button" class="btn btn-primary" data-toggle="modal" data-whatever="@dev2">
    Open modal for @dev2
  </a>
</bs-button>

<bs-button role="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap">Open modal for @getbootstrap</bs-button>

<bs-modal class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">New message</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="col-form-label">Recipient:</label>
            <input type="text" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="message-text" class="col-form-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Send message</button>
      </div>
    </div>
  </div>
</bs-modal>
```

```js
function handleModalShow(event) {
  const buttonElement = event.relatedTarget; // Button that triggered the modal
  const recipient = buttonElement.dataset.whatever; // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content.
  const modalElement = event.target;
  modalElement.querySelector('.modal-title').innerHtml = 'New message to ' + recipient;
  modalElement.querySelector('.modal-body input').value = recipient;
}

document.getElementById("exampleModal").addEventListener('show.bs.modal', handleModalShow);
```

## Without bs-modal

Without the bs-modal tag a modal will not open or close.

## Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-backdrop=""`.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| backdrop | boolean or the string `'static'` | true | Includes a modal-backdrop element. Alternatively, specify `static` for a backdrop which doesn't close the modal on click. |
| keyboard | boolean | true | Closes the modal when escape key is pressed |
| focus | boolean | true | Puts the focus on the modal when initialized. |
| show | boolean | true | Shows the modal. |

## Methods

### .modal({ keyboard: false });
Accepts options object for the modal.
```js
document.querySelector('#my-modal').modal({ keyboard: false });
```

### .modal('toggle');
Manually toggles a modal. Returns to the caller before the modal has actually been shown or hidden.
```js
document.querySelector('#my-modal').modal('toggle');
```

### .modal('show');
Manually opens a modal. Returns to the caller before the modal has actually been shown.
```js
document.querySelector('#my-modal').modal('show');
```

### .modal('hide');
Manually hides a modal. Returns to the caller before the modal has actually been hidden.
```js
document.querySelector('#my-modal').modal('hide');
```

### .modal('handleUpdate');
Manually readjust the modal’s position if the height of a modal changes while it is open (i.e. in case a scrollbar appears).
```js
document.querySelector('#my-modal').modal('handleUpdate');
```


## Events

| Event Type | Description |
| --- | --- |
| show.bs.modal | This event fires immediately when the `show` instance method is called. If caused by a click, the clicked element is available as the `relatedTarget` property of the event. |
| shown.bs.modal | 	This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the `relatedTarget` property of the event.
| hide.bs.modal | This event is fired immediately when the `hide` instance method has been called.
| hidden.bs.modal | This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete). |

```js
document.querySelector('#my-modal').addEventListener('hidden.bs.modal', function(event) {
  // do something
});
```


## Event Renaming Attributes

| Attribute | Default |
| ------------- | ------------- |
| show-event-name | show.bs.modal |
| shown-event-name | shown.bs.modal |
| hide-event-name | hide.bs.modal |
| hidden-event-name | hidden.bs.modal |

```html
<bs-button role="button" class="btn btn-primary" data-toggle="modal" data-target="#basicModal">
    Launch demo modal
</bs-button>
<bs-modal hidden-event-name="modalFinishedClosing" class="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="basicModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</bs-modal>
```
```js
document.getElementById('my-modal').addEventListener('modalFinishedClosing', function(event) {
  console.log('my modal is hidden');
});
```