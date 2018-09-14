<template>
  <div>
    <div class="accordion" id="vdom-accordion-example">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h5 class="mb-0">
              <bs-button class="btn btn-link" data-toggle="collapse" data-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                  Collapsible Group Item #1
              </bs-button>
            </h5>
          </div>
          <bs-collapse id="collapse1" class="collapse" aria-labelledby="headingOne" data-parent="#vdom-accordion-example"
            v-bind:show-collapse="this.toggleActiveState.collapse1"
            shown-event-name="collapse-shown" v-on:collapse-shown="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
            hide-event-name="collapse-hide" v-on:collapse-hide="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
          >
            <div class="card-body">
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
          </bs-collapse>
        </div>
        <div class="card">
          <div class="card-header" id="headingTwo">
            <h5 class="mb-0">
              <bs-button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                Collapsible Group Item #2
              </bs-button>
            </h5>
          </div>
          <bs-collapse id="collapse2" class="collapse" aria-labelledby="headingTwo" data-parent="#vdom-accordion-example"
            v-bind:show-collapse="this.toggleActiveState.collapse2"
            shown-event-name="collapse-shown" v-on:collapse-shown="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
            hide-event-name="collapse-hide" v-on:collapse-hide="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
          >
            <div class="card-body">
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
          </bs-collapse>
        </div>
        <div class="card">
          <div class="card-header" id="headingThree">
            <h5 class="mb-0">
              <bs-button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                Collapsible Group Item #3
              </bs-button>
            </h5>
          </div>
          <bs-collapse id="collapse3" class="collapse" aria-labelledby="headingThree" data-parent="#vdom-accordion-example"
            v-bind:show-collapse="this.toggleActiveState.collapse3"
            shown-event-name="collapse-shown" v-on:collapse-shown="(event) => this.$set(this.toggleActiveState, event.target.id, true)"
            hide-event-name="collapse-hide" v-on:collapse-hide="(event) => this.$set(this.toggleActiveState, event.target.id, false)"
          >
            <div class="card-body">
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
          </bs-collapse>
        </div>
      </div>
      <p v-if="this.toggleActiveState.collapse1">Collapse One is shown</p>
      <p v-if="this.toggleActiveState.collapse2">Collapse Two is shown</p>
      <p v-if="this.toggleActiveState.collapse3">Collapse Three is shown</p>
      <p>
        <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="toggleActiveState.collapse1 = !toggleActiveState.collapse1">
          Manually toggle Collapse One <span v-if="!this.toggleActiveState.collapse1">open</span><span v-else>closed</span>
        </a>
      </p>
      <p>
        <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="toggleActiveState.collapse2 = !toggleActiveState.collapse2">
          Manually toggle Collapse Two <span v-if="!this.toggleActiveState.collapse2">open</span><span v-else>closed</span>
        </a>
      </p>
      <p>
        <a class="btn btn-link" href="#" role="button" v-on:click.stop.prevent="toggleActiveState.collapse3 = !toggleActiveState.collapse3">
          Manually toggle Collapse Three <span v-if="!this.toggleActiveState.collapse3">open</span><span v-else>closed</span>
        </a>
      </p>
  </div>
</template>

<script>
export default {
  name: 'collapse-example',
  data() {
    return {
      toggleActiveState: {
        collapse1: true,
        collapse2: false,
        collapse3: false,
      },
    };
  },
}
</script>
