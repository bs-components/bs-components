# Collapse

## bs-collapse Example

<vue-html-wrapper>
  <template slot="example">
    <p>
      <bs-button v-pre tabindex="-1">
        <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
            Link with href
        </a>
      </bs-button>
      <bs-button v-pre tabindex="-1">
        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
          Button with data-target
        </button>
      </bs-button>
      <bs-button v-pre role="button" class="btn btn-primary" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
        bs-button with data-target
      </bs-button>
    </p>
    <bs-collapse v-pre class="collapse" id="collapseExample">
      <div class="card card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
      </div>
    </bs-collapse>
  </template>
</vue-html-wrapper>

```html
<p>
  <bs-button tabindex="-1">
    <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
        Link with href
    </a>
  </bs-button>
  <bs-button tabindex="-1">
    <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
      Button with data-target
    </button>
  </bs-button>
  <bs-button role="button" class="btn btn-primary" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    bs-button with data-target
  </bs-button>
</p>

<bs-collapse class="collapse" id="collapseExample">
  <div class="card card-body">
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
  </div>
</bs-collapse>
```

## Multiple Targets

<vue-html-wrapper>
  <template slot="example">
    <p>
      <bs-button v-pre tabindex="-1">
        <a class="btn btn-primary" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">
            Toggle first element
        </a>
      </bs-button>
      <bs-button v-pre tabindex="-1">
        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2">
          Toggle second element
        </button>
      </bs-button>
      <bs-button v-pre role="button" class="btn btn-primary" data-toggle="collapse" data-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseExample1 multiCollapseExample2">
        Toggle both elements
      </bs-button>
    </p>
    <div class="row">
      <div class="col">
        <bs-collapse v-pre class="collapse multi-collapse" id="multiCollapseExample1">
          <div class="card card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </bs-collapse>
      </div>
      <div class="col">
        <bs-collapse v-pre class="collapse multi-collapse" id="multiCollapseExample2">
          <div class="card card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </bs-collapse>
      </div>
    </div>
  </template>
</vue-html-wrapper>

```html
    <p>
      <bs-button tabindex="-1">
        <a class="btn btn-primary" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">
            Toggle first element
        </a>
      </bs-button>
      <bs-button tabindex="-1">
        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2">
          Toggle second element
        </button>
      </bs-button>
      <bs-button role="button" class="btn btn-primary" data-toggle="collapse" data-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseExample1 multiCollapseExample2">
        Toggle both elements
      </bs-button>
    </p>

    <div class="row">
      <div class="col">
        <bs-collapse class="collapse multi-collapse" id="multiCollapseExample1">
          <div class="card card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </bs-collapse>
      </div>
      <div class="col">
        <bs-collapse class="collapse multi-collapse" id="multiCollapseExample2">
          <div class="card card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </bs-collapse>
      </div>
    </div>
```

## Accordion Example

<vue-html-wrapper>
  <template slot="example">
    <div class="accordion" id="accordionExample">
      <div class="card">
        <div class="card-header" id="headingOne">
          <h5 class="mb-0">
            <bs-button v-pre class="btn btn-link" role="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Collapsible Group Item #1
            </bs-button>
          </h5>
        </div>
        <bs-collapse v-pre id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
          <div class="card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
          </div>
        </bs-collapse>
      </div>
      <div class="card">
        <div class="card-header" id="headingTwo">
          <h5 class="mb-0">
            <bs-button v-pre class="btn btn-link collapsed" role="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              Collapsible Group Item #2
            </bs-button>
          </h5>
        </div>
        <bs-collapse v-pre id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
          <div class="card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
          </div>
        </bs-collapse>
      </div>
      <div class="card">
        <div class="card-header" id="headingThree">
          <h5 class="mb-0">
            <bs-button v-pre class="btn btn-link collapsed" role="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              Collapsible Group Item #3
            </bs-button>
          </h5>
        </div>
        <bs-collapse v-pre id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
          <div class="card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
          </div>
        </bs-collapse>
      </div>
    </div>
  </template>
</vue-html-wrapper>

```html
<div class="accordion" id="accordionExample">
  <div class="card">
    <div class="card-header" id="headingOne">
      <h5 class="mb-0">
        <bs-button class="btn btn-link" role="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          Collapsible Group Item #1
        </bs-button>
      </h5>
    </div>
    <bs-collapse id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div class="card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </bs-collapse>
  </div>
  <div class="card">
    <div class="card-header" id="headingTwo">
      <h5 class="mb-0">
        <bs-button class="btn btn-link collapsed" role="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
          Collapsible Group Item #2
        </bs-button>
      </h5>
    </div>
    <bs-collapse id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
      <div class="card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </bs-collapse>
  </div>
  <div class="card">
    <div class="card-header" id="headingThree">
      <h5 class="mb-0">
        <bs-button class="btn btn-link collapsed" role="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          Collapsible Group Item #3
        </bs-button>
      </h5>
    </div>
    <bs-collapse id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
      <div class="card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </bs-collapse>
  </div>
</div>
```

## Without bs-components

Without the bs-collapse tag a collapse/accordion will not open or close by itself.



## Options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| Parent | selector \| DOM Element | false | If parent is provided, then all collapsible elements under the specified parent will be closed when this collapsible item is shown. (similar to traditional accordion behavior - this is dependent on the card class). The attribute has to be set on the target collapsible area. |
| toggle | boolean \| string | true | Toggles the collapsible element on invocation |



## Attributes
| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| show-collapse | boolean | false | when set to true the collapse will toggle open |
| ignore-accordion | boolean | false | if set to true the collapse will act as if it is not part of an accordion and not look for or obey parent settings |
| ignore-data-toggles | boolean | false | if set to true the collapse will not look for `data-toggle="collapse"` on the page and update them to the correct state to reflect the collapse open or closed state |

Example js how to set an attribute true:
```js
document.querySelector('#my-collapse').setAttribute('show-collapse', true);
```
Example HTML with an attribute set to true
```html
<bs-button tabindex="-1">
  <a role="button" data-toggle="collapse" class="btn btn-primary collapsed" aria-expanded="false" href="#collapse-that-ignores-toggles">collapse toggle</a>
</bs-button>
<bs-collapse ignore-data-toggles class="collapse" id="#collapse-that-ignores-toggles">collapse content</bs-collapse>
```


## Methods

### .collapse(options);
if toggle is set to true on the options object you can use this to toggle the collapse using custom option settings.
```js
document.querySelector('#my-collapse').collapse({ toggle: 'show' });
```
Note: the toggle option can have these options:
* `'show'`: will show the collapse if it is not already shown
* `'hide'`: will hide the collapse if it is not already hidden
* `'toggle'`: will toggle the collapse
* `true`: will toggle the collapse
* `false`: will not toggle the collapse

### .collapse('toggle');
will toggle the collapse
```js
document.querySelector('#my-collapse').collapse('toggle');
```

### .collapse('show');
will show the collapse if it is not already shown
```js
document.querySelector('#my-collapse').collapse('show');
```

### .collapse('hide');
will hide the collapse if it is not already hidden
```js
document.querySelector('#my-collapse').collapse('hide');
```

## Events

| Event Type | Description |
| --- | --- |
| show.bs.collapse | This event fires immediately when the show instance method is called. |
| shown.bs.collapse | This event is fired when a collapse element has been made visible to the user (will wait for CSS transitions to complete). |
| hide.bs.collapse | This event is fired immediately when the hide method has been called. |
| hidden.bs.collapse | 	This event is fired when a collapse element has been hidden from the user (will wait for CSS transitions to complete). |

## Event Renaming Attributes

| Attribute | Default |
| ------------- | ------------- |
| show-event-name | show.bs.collapse |
| shown-event-name | shown.bs.collapse |
| hide-event-name | hide.bs.collapse |
| hidden-event-name | hidden.bs.collapse |


```html
<p>
  <bs-button role="button" class="btn btn-primary" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    bs-button with data-target
  </bs-button>
</p>

<bs-collapse shown-event-name="hiya-collapse" id="my-collapse" class="collapse" id="collapseExample">
  <div class="card card-body">
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
  </div>
</bs-collapse>
```
```js
document.getElementById("my-collapse").addEventListener('hiya-collapse', function(event) {
  console.log('my collapse is shown');
});
```

## Virtual DOM examples

Note: These examples use Vue but the same thing is possible in React, Angular, and plain JavaScript.

<collapse-example></collapse-example>

You could choose to not use bs-buttons and instead use a solution like the manual toggle buttons in this example.  you could further manage state and opt to use the `ignore-data-toggles` and/or `ignore-accordion` to manage that state yourself.

```html
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
```