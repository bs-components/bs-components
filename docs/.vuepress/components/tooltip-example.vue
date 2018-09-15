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
