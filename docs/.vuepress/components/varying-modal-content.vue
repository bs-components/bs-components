<template>
  <div>

    <bs-button v-pre tabindex="-1">
      <button role="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@dev1">
        Open modal for @dev1
      </button>
    </bs-button>

    <bs-button v-pre tabindex="-1">
      <a href="#exampleModal" role="button" class="btn btn-primary" data-toggle="modal" data-whatever="@dev2">
        Open modal for @dev2
      </a>
    </bs-button>

    <bs-button v-pre role="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap">Open modal for @getbootstrap</bs-button>

    <bs-modal v-pre class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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

  </div>
</template>

<script>

function handleModalShow(event) {
  const buttonElement = event.relatedTarget; // Button that triggered the modal
  const recipient = buttonElement.dataset.whatever; // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content.
  const modalElement = event.target;
  modalElement.querySelector('.modal-title').innerText = 'New message to ' + recipient;
  modalElement.querySelector('.modal-body input').value = recipient;
}

function handleMounted() {
  document.getElementById("exampleModal").addEventListener('show.bs.modal', handleModalShow);
}

export default {
  name: 'varying-modal-content',
  mounted: handleMounted,
}
</script>
