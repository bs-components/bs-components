<template>
  <div>
    <bs-dropdown class="dropdown"
      v-bind:show-dropdown="this.showDropdown"
      shown-event-name="dropdown-shown" v-on:dropdown-shown="() => showDropdown = true"
      hidden-event-name="dropdown-hidden" v-on:dropdown-hidden="() => showDropdown = false"
    >
      <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
