<template>
  <div>
    <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="() => showModal = !showModal">
      Click here to manually toggle modal <span v-if="!this.showModal">Open</span><span v-else>Closed</span>
    </a>
    <bs-modal class="modal fade" tabindex="-1" role="dialog" aria-labelledby="basicModalLabel" aria-hidden="true"
      v-bind:show-modal="showModal"
      shown-event-name="modal-shown" v-on:modal-shown="() => showModal = true"
      hidden-event-name="modal-hidden" v-on:modal-hidden="() => showModal = false"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="basicModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="() => showModal = !showModal">
              Click here to manually toggle modal <span v-if="!this.showModal">Open</span><span v-else>Closed</span>
            </a>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </bs-modal>
  </div>
</template>

<script>
export default {
  name: 'toggle-modal',
  data() {
    return {
      showModal: false,
    };
  },
}
</script>
