# React

[Click here to see an example React project with bs-components](https://github.com/bs-components/react-bs-components-example)

Prerequisite: add bootstrap css to your project before starting these steps.

Add bs-components to your project:
```bash
yarn add bs-components
```
You should see bs-components in your package.json file now.

Go to your main javascript file where you initialize React to add and configure `defineCustomElements` similar to this:
```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { defineCustomElements } from 'bs-components';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
defineCustomElements(window);
```

BS-Components was written using stencil.  for more details you can check the stenciljs react documentation:  [stenciljs react framework integration](https://stenciljs.com/docs/react)

---

## React class vs className

To add a class to a HTML element in react you usually use `className`  such as this:

```html
<p className="lead">This paragraph stands out</p>
```
This is still true for HTML tags but for bs-components tags you have to use `class`.  like this:
```html
<bs-alert class="alert alert-primary alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  <button type="button" className="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</bs-alert>
```

Notice that the bs-alert uses `class` but the button uses `className`.

For more examples you can review the react example project.





