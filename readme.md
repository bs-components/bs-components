Aren't we all tired of binding listeners on component ready for the bootstrap jQuery components and making sure you destroy the jQuery stuff when your component is destroyed?

---

Status:

- [ ] Documentation w/examples - todo - When tests are complete this should be easier
- [x] tooltip - run tests using: `yarn test-bs-tooltip`
- [x] popover - run tests using: `yarn test-bs-popover`
- [x] button - run tests using: `yarn test-bs-button`
- [x] modal - run tests using: `yarn test-bs-modal`
- [x] dropdown - run tests using: `yarn test-bs-dropdown`
- [ ] collapse done with NO tests. needs tests before marking complete.
- [ ] alert todo low priority - not a show stopper for anyone
- [ ] tab - aka navs and list group- todo low priority
  - many frameworks already have tab solutions in the form of spa routers
- [ ] scrollspy todo - low priority
- [ ] carousel not planned currently but maybe later.
  - there are a lot of carousel solutions already available

For everything else including forms there is no web component needed to implement because they are a css only solution. Just use html as usual.

Note: bootstrap forms do tend to use some javascript validation to show or hide tooltip helpers. These do not have methods that are provided by bootstrap.js so this project will not have web component counterparts.

---

Note: This project does not support browsers older than IE11.

Built Using:

- [bootstrap css from v4.1.3](https://github.com/twbs/bootstrap/releases/tag/v4.1.3)
- [stencil-component-starter](https://github.com/ionic-team/stencil-component-starter)

Tests Using:

- [testcafe](https://github.com/DevExpress/testcafe)

---

Put a script tag similar to this `<script src='https://unpkg.com/bs-components@0.0.1/dist/bscomponents.js'></script>` in the head of your index.html
