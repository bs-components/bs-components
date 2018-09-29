# Vue

[Click here to see an example vue project with bs-components](https://github.com/bs-components/vue-bs-components-example)

Prerequisite: add bootstrap css to your project before starting these steps.  Make sure the css is being applied.  You can do this several ways.  Such as using webpack to import it.

Add bs-components to your project:
```bash
yarn add bs-components
```
You should see bs-components in your package.json file now.

Go to your main javascript file where you initialize Vue to add and configure `defineCustomElements` similar to this:
```js
import Vue from 'vue'
import App from './App.vue'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { defineCustomElements } from 'bs-components';

Vue.config.productionTip = false
Vue.config.ignoredElements = [
  'bs-alert',
  'bs-button',
  'bs-carousel',
  'bs-collapse',
  'bs-dropdown',
  'bs-modal',
  'bs-scrollspy',
  'bs-tab',
  'bs-tooltip',
];

defineCustomElements(window);

new Vue({
  render: h => h(App)
}).$mount('#app')
```

BS-Components was written using stencil.  for more details you can check the stenciljs vue documentation:  [stenciljs vue framework integration](https://stenciljs.com/docs/vue)





