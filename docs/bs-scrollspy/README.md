# Scrollspy

## Examples

### nested navs

<vue-html-wrapper class="mt-3">
  <template slot="example">
    <div class="row">
      <div class="col-4">
        <div id="bs-navbar-example">
          <div class="nav nav-pills flex-column">
            <a class="nav-link" href="#item-1">Item 1</a>
            <div class="nav nav-pills flex-column">
              <a class="nav-link ml-3 my-1" href="#item-1-1">Item 1-1</a>
              <a class="nav-link ml-3 my-1" href="#item-1-2">Item 1-2</a>
            </div>
            <a class="nav-link" href="#item-2">Item 2</a>
            <a class="nav-link" href="#item-3">Item 3</a>
            <div class="nav nav-pills flex-column">
              <a class="nav-link ml-3 my-1" href="#item-3-1">Item 3-1</a>
              <a class="nav-link ml-3 my-1" href="#item-3-2">Item 3-2</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-8">
        <bs-scrollspy v-pre data-spy="scroll" data-target="#bs-navbar-example" data-offset="0" style="position: relative; height: 325px; overflow: auto;">
            <h4 id="item-1">Item 1</h4>
            <p>
              Ex consequat commodo adipisicing exercitation aute excepteur occaecat ullamco duis aliqua id magna ullamco eu. Do aute ipsum ipsum ullamco cillum consectetur ut et aute consectetur labore. Fugiat laborum incididunt tempor eu consequat enim dolore proident. Qui laborum do non excepteur nulla magna eiusmod consectetur in. Aliqua et aliqua officia quis et incididunt voluptate non anim reprehenderit adipisicing dolore ut consequat deserunt mollit dolore. Aliquip nulla enim veniam non fugiat id cupidatat nulla elit cupidatat commodo velit ut eiusmod cupidatat elit dolore.
            </p>
            <h5 id="item-1-1">Item 1-1</h5>
            <p>
              Amet tempor mollit aliquip pariatur excepteur commodo do ea cillum commodo Lorem et occaecat elit qui et. Aliquip labore ex ex esse voluptate occaecat Lorem ullamco deserunt. Aliqua cillum excepteur irure consequat id quis ea. Sit proident ullamco aute magna pariatur nostrud labore. Reprehenderit aliqua commodo eiusmod aliquip est do duis amet proident magna consectetur consequat eu commodo fugiat non quis. Enim aliquip exercitation ullamco adipisicing voluptate excepteur minim exercitation minim minim commodo adipisicing exercitation officia nisi adipisicing. Anim id duis qui consequat labore adipisicing sint dolor elit cillum anim et fugiat.
            </p>
            <h5 id="item-1-2">Item 2-2</h5>
            <p>
              Cillum nisi deserunt magna eiusmod qui eiusmod velit voluptate pariatur laborum sunt enim. Irure laboris mollit consequat incididunt sint et culpa culpa incididunt adipisicing magna magna occaecat. Nulla ipsum cillum eiusmod sint elit excepteur ea labore enim consectetur in labore anim. Proident ullamco ipsum esse elit ut Lorem eiusmod dolor et eiusmod. Anim occaecat nulla in non consequat eiusmod velit incididunt.
            </p>
            <h4 id="item-2">Item 2</h4>
            <p>
              Quis magna Lorem anim amet ipsum do mollit sit cillum voluptate ex nulla tempor. Laborum consequat non elit enim exercitation cillum aliqua consequat id aliqua. Esse ex consectetur mollit voluptate est in duis laboris ad sit ipsum anim Lorem. Incididunt veniam velit elit elit veniam Lorem aliqua quis ullamco deserunt sit enim elit aliqua esse irure. Laborum nisi sit est tempor laborum mollit labore officia laborum excepteur commodo non commodo dolor excepteur commodo. Ipsum fugiat ex est consectetur ipsum commodo tempor sunt in proident.
            </p>
            <h4 id="item-3">Item 3</h4>
            <p>
              Quis anim sit do amet fugiat dolor velit sit ea ea do reprehenderit culpa duis. Nostrud aliqua ipsum fugiat minim proident occaecat excepteur aliquip culpa aute tempor reprehenderit. Deserunt tempor mollit elit ex pariatur dolore velit fugiat mollit culpa irure ullamco est ex ullamco excepteur.
            </p>
            <h5 id="item-3-1">Item 3-1</h5>
            <p>
              Deserunt quis elit Lorem eiusmod amet enim enim amet minim Lorem proident nostrud. Ea id dolore anim exercitation aute fugiat labore voluptate cillum do laboris labore. Ex velit exercitation nisi enim labore reprehenderit labore nostrud ut ut. Esse officia sunt duis aliquip ullamco tempor eiusmod deserunt irure nostrud irure. Ullamco proident veniam laboris ea consectetur magna sunt ex exercitation aliquip minim enim culpa occaecat exercitation. Est tempor excepteur aliquip laborum consequat do deserunt laborum esse eiusmod irure proident ipsum esse qui.
            </p>
            <h5 id="item-3-2">Item 3-2</h5>
            <p>
              Labore sit culpa commodo elit adipisicing sit aliquip elit proident voluptate minim mollit nostrud aute reprehenderit do. Mollit excepteur eu Lorem ipsum anim commodo sint labore Lorem in exercitation velit incididunt. Occaecat consectetur nisi in occaecat proident minim enim sunt reprehenderit exercitation cupidatat et do officia. Aliquip consequat ad labore labore mollit ut amet. Sit pariatur tempor proident in veniam culpa aliqua excepteur elit magna fugiat eiusmod amet officia.
            </p>
          </bs-scrollspy>
      </div>
    </div>
  </template>
</vue-html-wrapper>

```html
<nav id="bs-navbar-example" class="navbar navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <nav class="nav nav-pills flex-column">
    <a class="nav-link" href="#item-1">Item 1</a>
    <nav class="nav nav-pills flex-column">
      <a class="nav-link ml-3 my-1" href="#item-1-1">Item 1-1</a>
      <a class="nav-link ml-3 my-1" href="#item-1-2">Item 1-2</a>
    </nav>
    <a class="nav-link" href="#item-2">Item 2</a>
    <a class="nav-link" href="#item-3">Item 3</a>
    <nav class="nav nav-pills flex-column">
      <a class="nav-link ml-3 my-1" href="#item-3-1">Item 3-1</a>
      <a class="nav-link ml-3 my-1" href="#item-3-2">Item 3-2</a>
    </nav>
  </nav>
</nav>

<bs-scrollspy data-spy="scroll" data-target="#bs-navbar-example" data-offset="0">
  <h4 id="item-1">Item 1</h4>
  <p>...</p>
  <h5 id="item-1-1">Item 1-1</h5>
  <p>...</p>
  <h5 id="item-1-2">Item 2-2</h5>
  <p>...</p>
  <h4 id="item-2">Item 2</h4>
  <p>...</p>
  <h4 id="item-3">Item 3</h4>
  <p>...</p>
  <h5 id="item-3-1">Item 3-1</h5>
  <p>...</p>
  <h5 id="item-3-2">Item 3-2</h5>
  <p>...</p>
</bs-scrollspy>
```

### list-group

<vue-html-wrapper class="mt-3">
  <template slot="example">
    <div class="row bd-example">
      <div class="col-4">
        <div id="bs-list-example" class="list-group">
          <a class="list-group-item list-group-item-action" href="#list-item-1">Item 1</a>
          <a class="list-group-item list-group-item-action" href="#list-item-2">Item 2</a>
          <a class="list-group-item list-group-item-action" href="#list-item-3">Item 3</a>
          <a class="list-group-item list-group-item-action" href="#list-item-4">Item 4</a>
        </div>
      </div>
      <div class="col-8">
        <bs-scrollspy v-pre data-spy="scroll" data-target="#bs-list-example" data-offset="0" style="position: relative; height: 200px; overflow: auto;">
          <h4 id="list-item-1">Item 1</h4>
          <p>
            Ex consequat commodo adipisicing exercitation aute excepteur occaecat ullamco duis aliqua id magna ullamco eu. Do aute ipsum ipsum ullamco cillum consectetur ut et aute consectetur labore. Fugiat laborum incididunt tempor eu consequat enim dolore proident. Qui laborum do non excepteur nulla magna eiusmod consectetur in. Aliqua et aliqua officia quis et incididunt voluptate non anim reprehenderit adipisicing dolore ut consequat deserunt mollit dolore. Aliquip nulla enim veniam non fugiat id cupidatat nulla elit cupidatat commodo velit ut eiusmod cupidatat elit dolore.
          </p>
          <h4 id="list-item-2">Item 2</h4>
          <p>
            Quis magna Lorem anim amet ipsum do mollit sit cillum voluptate ex nulla tempor. Laborum consequat non elit enim exercitation cillum aliqua consequat id aliqua. Esse ex consectetur mollit voluptate est in duis laboris ad sit ipsum anim Lorem. Incididunt veniam velit elit elit veniam Lorem aliqua quis ullamco deserunt sit enim elit aliqua esse irure. Laborum nisi sit est tempor laborum mollit labore officia laborum excepteur commodo non commodo dolor excepteur commodo. Ipsum fugiat ex est consectetur ipsum commodo tempor sunt in proident.
          </p>
          <h4 id="list-item-3">Item 3</h4>
          <p>
            Quis anim sit do amet fugiat dolor velit sit ea ea do reprehenderit culpa duis. Nostrud aliqua ipsum fugiat minim proident occaecat excepteur aliquip culpa aute tempor reprehenderit. Deserunt tempor mollit elit ex pariatur dolore velit fugiat mollit culpa irure ullamco est ex ullamco excepteur.
          </p>
          <h4 id="list-item-4">Item 4</h4>
          <p>
            Quis anim sit do amet fugiat dolor velit sit ea ea do reprehenderit culpa duis. Nostrud aliqua ipsum fugiat minim proident occaecat excepteur aliquip culpa aute tempor reprehenderit. Deserunt tempor mollit elit ex pariatur dolore velit fugiat mollit culpa irure ullamco est ex ullamco excepteur.
          </p>
        </bs-scrollspy>
      </div>
    </div>
  </template>
</vue-html-wrapper>

```html
<div id="bs-list-example" class="list-group">
  <a class="list-group-item list-group-item-action" href="#list-item-1">Item 1</a>
  <a class="list-group-item list-group-item-action" href="#list-item-2">Item 2</a>
  <a class="list-group-item list-group-item-action" href="#list-item-3">Item 3</a>
  <a class="list-group-item list-group-item-action" href="#list-item-4">Item 4</a>
</div>
<bs-scrollspy v-pre data-spy="scroll" data-target="#bs-list-example" data-offset="0" style="position: relative; height: 200px; overflow: auto;">
  <h4 id="list-item-1">Item 1</h4>
  <p>...</p>
  <h4 id="list-item-2">Item 2</h4>
  <p>...</p>
  <h4 id="list-item-3">Item 3</h4>
  <p>...</p>
  <h4 id="list-item-4">Item 4</h4>
  <p>...</p>
</bs-scrollspy>
```

## Without bs-tooltip
Without the bs-scrollspy tag the active class will not be added and removed depending on where the user scrolls.  Also no events will be fired.

## Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-animation=""`.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| offset | number | 10 | Pixels to offset from top when calculating position of scroll. |


## Methods

### .scrollspy('refresh');
When using scrollspy in conjunction with adding or removing of elements from the DOM, you’ll need to call the refresh method like so:
```js
document.querySelector('#my-scrollspy').scrollspy('refresh');
```

### .scrollspy('getActiveTarget');
returns the target that is currently active
```js
var currentlyActiveTarget = document.querySelector('#my-scrollspy').scrollspy('getActiveTarget');
```

## Events

| Event Type | Description |
| --- | --- |
| activate.bs.scrollspy | This event fires on the scroll element whenever a new item becomes activated by the scrollspy. |

```js
document.querySelector('[data-spy="scroll"]').addEventListener('activate.bs.scrollspy', function(event) {
  console.log('Element that was just scrolled to: ', event.relatedTarget );
});
```

## Event Renaming Attributes

| Attribute | Default |
| ------------- | ------------- |
| activate-event-name | activate.bs.scrollspy |

```html
<bs-scrollspy data-spy="scroll" data-target="#bs-navbar-example" data-offset="0" activate-event-name="item-scrolled-to">
  <h4 id="item-1">Item 1</h4>
  <p>...</p>
  <h5 id="item-1-1">Item 1-1</h5>
  <p>...</p>
  <h5 id="item-1-2">Item 2-2</h5>
  <p>...</p>
  <h4 id="item-2">Item 2</h4>
  <p>...</p>
  <h4 id="item-3">Item 3</h4>
  <p>...</p>
  <h5 id="item-3-1">Item 3-1</h5>
  <p>...</p>
  <h5 id="item-3-2">Item 3-2</h5>
  <p>...</p>
</bs-scrollspy>
```
```js
document.getElementById('[data-spy="scroll"]').addEventListener('item-scrolled-to', function(event) {
  console.log('an item was scrolled to');
});
```

## Virtual DOM example

Note: This example uses Vue but the same thing is possible in React, Angular, and plain JavaScript.

<scrollspy-example></scrollspy-example>

```html
<template>
  <div>
    <nav class="navbar">
      <ul id="bs-vdom-navigation" class="nav nav-pills">
        <li class="nav-item"><a class="nav-link" href="#div-1">div 1</a></li>
        <li class="nav-item"><a class="nav-link" href="#div-2">div 2</a></li>
        <li class="nav-item"><a class="nav-link" href="#div-3">div 3</a></li>
        <li class="nav-item"><a class="nav-link" href="#div-4">div 4</a></li>
        <li class="nav-item"><a class="nav-link" href="#div-5">div 5</a></li>
        <li class="nav-item"><a class="nav-link" href="#div-6">div 6</a></li>
      </ul>
    </nav>
    <bs-scrollspy data-spy="scroll" data-target="#bs-vdom-navigation" data-offset="0" style="position: relative; overflow: auto; height: 200px;"
      activate-event-name="scrolled-to" v-on:scrolled-to="(event) => navActive = event.detail.target"
    >
      <div id="div-1">
        <h3>div 1</h3>
        <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
      </div>
      <div id="div-2">
        <h3>div 2</h3>
        <p>Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard. Freegan beard aliqua cupidatat mcsweeney's vero. Cupidatat four loko nisi, ea helvetica nulla carles. Tattooed cosby sweater food truck, mcsweeney's quis non freegan vinyl. Lo-fi wes anderson +1 sartorial. Carles non aesthetic exercitation quis gentrify. Brooklyn adipisicing craft beer vice keytar deserunt.</p>
      </div>
      <div id="div-3">
        <h3>div 3</h3>
        <p>Occaecat commodo aliqua delectus. Fap craft beer deserunt skateboard ea. Lomo bicycle rights adipisicing banh mi, velit ea sunt next level locavore single-origin coffee in magna veniam. High life id vinyl, echo park consequat quis aliquip banh mi pitchfork. Vero VHS est adipisicing. Consectetur nisi DIY minim messenger bag. Cred ex in, sustainable delectus consectetur fanny pack iphone.</p>
      </div>
      <div id="div-4">
        <h3>div 4</h3>
        <p>In incididunt echo park, officia deserunt mcsweeney's proident master cleanse thundercats sapiente veniam. Excepteur VHS elit, proident shoreditch +1 biodiesel laborum craft beer. Single-origin coffee wayfarers irure four loko, cupidatat terry richardson master cleanse. Assumenda you probably haven't heard of them art party fanny pack, tattooed nulla cardigan tempor ad. Proident wolf nesciunt sartorial keffiyeh eu banh mi sustainable. Elit wolf voluptate, lo-fi ea portland before they sold out four loko. Locavore enim nostrud mlkshk brooklyn nesciunt.</p>
      </div>
      <div id="div-5">
        <h3>div 5</h3>
        <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
      </div>
      <div id="div-6">
        <h3>div 6</h3>
        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
      </div>
    </bs-scrollspy>
    <hr>
    <p>Currently Active Selector: {{navActive}}</p>
  </div>
</template>

<script>
export default {
  name: 'scrollspy-example',
  data() {
    return {
      navActive: '',
    };
  },
}
</script>
```