# installation

## plain HTML, CSS, and JavaScript with no framework

Make sure to include the bootstrap.css and bs-components javascript resources in the head of every page.

```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<script src='https://unpkg.com/bs-components@0.0.3/dist/bscomponents.js'></script>
```

For the javascript frameworks add bs-components to your package.json using yarn (npm should work too).
```sh
yarn add bs-components
```

Then check the [Stenciljs Framework Integration](https://stenciljs.com/docs/framework-integration) documentation for more specifics.

TODO: provide detailed instructions for the big 3