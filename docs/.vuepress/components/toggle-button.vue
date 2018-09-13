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
