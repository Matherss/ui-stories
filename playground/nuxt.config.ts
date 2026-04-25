export default defineNuxtConfig({
  modules: ['ui-stories'],

  uiStories: {
    enabled: true,
    route: '/__ui-stories',
    scanDirs: ['app/components'],
    styles: ['app/assets/scss/main.scss'],
    svgSpritePath: '/assets/sprite/',
    optionalPages: [
      {
        id: 'optional-page-example',
        title: 'Optional page example',
        component: 'stories-optional-pages/OptionalPageExample.vue',
      },
    ],
    strings: {
      themeLight: 'Light',
      themeDark: 'Dark',
      themeChecker: 'Chess ^_^',
    },
  },

  compatibilityDate: '2025-01-01',
});
