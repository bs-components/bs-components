<template>
  <div>
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a class="nav-link" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
        </bs-button>
      </li>
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a class="nav-link" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
        </bs-button>
      </li>
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a class="nav-link" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
        </bs-button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <bs-tab class="tab-pane fade" id="home" role="tabpanel" aria-labelledby="home-tab"
        v-bind:show-tab="this.toggleActiveState.homeTab"
        dispatch-events-on-tab
        shown-event-name="tab-shown" v-on:tab-shown="(event) => this.$set(this.toggleActiveState, 'homeTab', true)"
        hide-event-name="tab-hide" v-on:tab-hide="(event) => this.$set(this.toggleActiveState, 'homeTab', false)"
      >
        Lorem ipsum dolor sit amet
      </bs-tab>
      <bs-tab class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab"
        v-bind:show-tab="this.toggleActiveState.profileTab"
        dispatch-events-on-tab
        shown-event-name="tab-shown" v-on:tab-shown="(event) => this.$set(this.toggleActiveState, 'profileTab', true)"
        hide-event-name="tab-hide" v-on:tab-hide="(event) => this.$set(this.toggleActiveState, 'profileTab', false)"
      >
        Sed ut perspiciatis unde omnis
      </bs-tab>
      <bs-tab class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab"
        v-bind:show-tab="this.toggleActiveState.contactTab"
        dispatch-events-on-tab
        shown-event-name="tab-shown" v-on:tab-shown="(event) => this.$set(this.toggleActiveState, 'contactTab', true)"
        hide-event-name="tab-hide" v-on:tab-hide="(event) => this.$set(this.toggleActiveState, 'contactTab', false)"
      >
        At vero eos et accusamus et iusto odio
      </bs-tab>
    </div>
    <hr>
    <p>
      <a class="btn btn-link" v-bind:class="{ disabled: this.toggleActiveState.homeTab }" href="#" role="button" v-on:click.stop.prevent="toggleActiveState.homeTab = true">
        Toggle Home Tab Open using show-tab attribute
      </a>
    </p>
    <p>
      <a class="btn btn-link" v-bind:class="{ disabled: this.toggleActiveState.profileTab }" href="#" role="button" v-on:click.stop.prevent="toggleActiveState.profileTab = true">
        Toggle Profile Tab Open using show-tab attribute
      </a>
    </p>
    <p>
      <a class="btn btn-link" v-bind:class="{ disabled: this.toggleActiveState.contactTab }" href="#" role="button" v-on:click.stop.prevent="toggleActiveState.contactTab = true">
        Toggle Contact Tab Open using show-tab attribute
      </a>
    </p>
    <hr>
    <p>Home Tab is <span v-if="this.toggleActiveState.homeTab">shown</span><span v-else>hidden</span></p>
    <p>Profile Tab is <span v-if="this.toggleActiveState.profileTab">shown</span><span v-else>hidden</span></p>
    <p>Contact Tab is <span v-if="this.toggleActiveState.contactTab">shown</span><span v-else>hidden</span></p>
  </div>
</template>

<script>
export default {
  name: 'toggle-tab',
  data() {
    return {
      toggleActiveState: {
        homeTab: true,
        profileTab: false,
        contactTab: false,
      },
    };
  },
}
</script>
