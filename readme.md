Aren't we all tired of binding listeners on component ready for the bootstrap jQuery components and making sure you destroy the jQuery stuff when your component is destroyed?

---

Status:

- [ ] Documentation w/examples - todo - When tests are complete this should be easier
- [x] tooltip - run tests using: `yarn test-bs-tooltip` (needs docs for vdom)
- [x] popover - run tests using: `yarn test-bs-popover` (needs docs for vdom)
- [x] button - run tests using: `yarn test-bs-button`
- [x] modal - run tests using: `yarn test-bs-modal` (needs docs for vdom)
- [x] dropdown - run tests using: `yarn test-bs-dropdown` (needs docs for vdom)
- [x] collapse - run tests using: `yarn test-bs-collapse`
- [x] alert - run tests using: `yarn test-bs-alert`
- [ ] tab todo - (aka navs and list group) - many frameworks have spa router solutions for this
- [ ] scrollspy todo
- [ ] carousel not planned currently but maybe later

For all of the other bootstrap components a web component solution is not needed because they can be done with just css. Use the bootstrap webpage component documents.

Note: bootstrap forms do tend to use some javascript validation to show or hide tooltip helpers. These do not have methods that are provided by bootstrap.js so this project will not have web component counterparts.

---

Note: This project does not support browsers older than IE11.

Built Using:

- [bootstrap css from v4.1.3](https://github.com/twbs/bootstrap/releases/tag/v4.1.3)
- [stencil-component-starter](https://github.com/ionic-team/stencil-component-starter)

Tests Using:

- [testcafe](https://github.com/DevExpress/testcafe)

---

First make sure to include the bootstrap.css resource

Then:
- for plain html and js:
  - Put a script tag similar to this `<script src='https://unpkg.com/bs-components@0.0.3/dist/bscomponents.js'></script>` in the head of your index.html
  - you do **not** need to include jQuery, Popper.js or the bootstrap.js resource
- for one of the other frameworks: [Stenciljs Framework Integration](https://stenciljs.com/docs/framework-integration)

