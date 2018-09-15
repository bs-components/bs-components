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
