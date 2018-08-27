Aren't we all tired of binding listeners on component ready for the bootstrap components and making sure you destroy them when the component is destroyed?

---

Put a script tag similar to this `<script src='https://unpkg.com/bs-components@0.0.1/dist/bscomponents.js'></script>` in the head of your index.html

---

Status:

- [x] tooltip done with tests
- [ ] popover done by extending tooltips. needs tests before marking complete.
- [x] button done with tests
- [ ] modal done with NO tests. needs tests before marking complete.
- [ ] collapse done with NO tests. needs tests before marking complete.
  - note: planning to entirely reevaluate how collapse was done for a more bootstrap consistent experience
- [ ] dropdown done with NO tests. needs tests before marking complete.
- [ ] scrollspy todo - low priority
- [ ] alert todo low priority - not a show stopper for anyone
- [ ] tab - aka navs and list group- todo low priority because
  - many frameworks already have tab solutions in the form of spa routers
- [ ] carousel not planned currently but maybe later.
  - there are a lot of carousel solutions already available

For everything else including forms there is no web component needed to implement because they are a css only solution. Just use html as usual.

Note: bootstrap forms can use some javascript validation to show or hide tooltip helpers. These do not have jquery methods so will not have web component counterparts.

---

Note: Stenciljs (The S in BS-Components) does not support browsers older than IE11.

Built Using:

- bootstrap css from v4.1.3
- [stencil-component-starter](https://github.com/ionic-team/stencil-component-starter)
