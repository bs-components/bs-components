<template>
  <div>
    <div class="btn-group btn-group-toggle" data-toggle="buttons">
      <bs-button role="button" class="btn btn-secondary"
        id="radio1"
        v-bind:active="this.toggleActiveState['radio1']"
        active-event-name="active" v-on:active="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
        inactive-event-name="inactive" v-on:inactive="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
      >
        <input type="radio" name="options" id="option1" autocomplete="off">
        Radio 1
      </bs-button>
      <bs-button role="button" class="btn btn-secondary"
        id="radio2"
        v-bind:active="this.toggleActiveState['radio2']"
        active-event-name="active" v-on:active="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
        inactive-event-name="inactive" v-on:inactive="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
      >
        <input type="radio" name="options" id="option2" autocomplete="off">
        Radio 2
      </bs-button>
      <bs-button role="button" class="btn btn-secondary"
        id="radio3"
        v-bind:active="this.toggleActiveState['radio3']"
        active-event-name="active" v-on:active="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
        inactive-event-name="inactive" v-on:inactive="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
      >
        <input type="radio" name="options" id="option3" autocomplete="off">
        Radio 3
      </bs-button>
    </div>
    <p v-if="this.toggleActiveState.radio1">Radio Button 1 is active</p>
    <p v-if="this.toggleActiveState.radio2">Radio Button 2 is active</p>
    <p v-if="this.toggleActiveState.radio3">Radio Button 3 is active</p>
  </div>
</template>

<script>
export default {
  name: 'toggle-button-radio',
  data() {
    return {
      toggleActiveState: {},
    };
  },
}
</script>
