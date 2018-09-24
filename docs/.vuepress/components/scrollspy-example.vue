<template>
  <div>
    <nav class="_navbar">
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
