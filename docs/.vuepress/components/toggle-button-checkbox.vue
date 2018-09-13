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
