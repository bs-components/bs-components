<template>
  <div>
    <bs-alert v-pre class="alert alert-warning alert-dismissible fade show" role="alert"
      no-self-remove-from-dom
      v-bind:dismiss="this.alertDismissed"
      opened-event-name="alert-opened" v-on:alert-opened="handleAlertOpened"
      closed-event-name="alert-closed" v-on:alert-closed="handleAlertClosed"
    >
      <strong>Holy guacamole!</strong> This alerts dismiss state stays in sync with my code.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </bs-alert>
    <a class="btn btn-primary" href="#" role="button" v-on:click.stop.prevent="handleToggleAlert">
      Toggle Alert <span v-if="this.alertDismissed">Open</span><span v-else>Closed</span>
    </a>
  </div>
</template>

<script>

function handleToggleAlert() {
  this.alertDismissed = !this.alertDismissed;
}

function handleAlertOpened() {
  this.alertDismissed = false;
}

function handleAlertClosed() {
  this.alertDismissed = true;
}

export default {
  name: 'toggling-alert',
  data() {
    return {
      alertDismissed: false,
    };
  },
  methods: {
    handleAlertOpened,
    handleAlertClosed,
    handleToggleAlert,
  }
}
</script>
