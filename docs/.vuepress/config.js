
// https://router.vuejs.org/
// https://github.com/vuejs/vue-router/blob/dev/docs/.vuepress/config.js


module.exports = {
  title: 'BS-Components',
  description: 'Bootstrap StencilJs Web Components',

  // https://github.com/vuejs/vuepress/issues/790
  head: [
    // inject bs-components
    ['script', {}, `
      (function() {
        var myScript = document.createElement("script");
        myScript.src = "/assets/js/bscomponents.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(myScript, s);
      })();`
    ],
    // inject bootstrap css
    ['script', {}, `
      (function() {
        var myLink = document.createElement("link");
        myLink.rel  = 'stylesheet';
        myLink.type = 'text/css';
        myLink.href = '/assets/css/bootstrap.min.css';
        myLink.media = 'all';
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(myLink, s);
      })();`
    ],
  ],
  themeConfig: {
    repo: 'bs-components/bs-components',
    docsDir: 'docs',
    serviceWorker: true,
    sidebar: [
      '/installation.md',
      '/',
      {
        title: 'Components',
        collapsable: false,
        children: [
          'getting-started.md',
          '/bs-alert/',
          '/bs-button/',
          '/bs-carousel/',
          '/bs-collapse/',
          '/bs-dropdown/',
          '/bs-modal/',
          '/bs-popover/',
          '/bs-scrollspy/',
          '/bs-tab/',
          '/bs-tooltip/',
        ]
      },
      '/example-projects.md',
    ],
  }
}