# Home

Normally when working with bootstrap you have to avoid touching the DOM anywhere except the lifecycle mounted and unmounted hooks for the framework you are using.  The goal of the BS-Component project is to make using bootstrap easy to use universally.

Usually solutions that bring bootstrap to js frameworks suffer the same problem.  They give you components that separate you from the underlying html.  This is a problem because most developers already know Bootstrap and do not want to learn another library that does the bootstrap for them.  BS-Components was made with the goal to give you as must control as possible and let you work with the html that you are already familiar with.  When looking at the bs-component html you should be able to see the similarities to the original bootstrap html.

## how does bs-components work?

bs-components mutates the DOM directly.  bs-components does not use Jquery it uses plain JavaScript that is inside the web component tags to do this.  Primarily the DOM mutations that are done are limited to class toggling.  For tooltips and popover elements are created, inserted, and removed from the dom.  If you are using a framework with a virtual DOM be aware that bs-components does not work in the virtual dom environment.

The events that bs-components uses are [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).  You should be able to attach listeners to the CustomEvents using all of the frameworks (no jQuery needed).

bs-components uses the dependencies lodash and popper.js internally.


## Reliability
bs-components has recreated the Bootstrap unit tests in an end-to-end testing platform named testcafe so that we can test across multiple browsers.  While bs-components should behave the same way that the Bootstrap jQuery components behave if you notice issues please [let us know](https://github.com/JasonCubic/bs-components/issues).
