export default {
  scanDirs: ['app/components'],
  styles: ['app/assets/scss/main.scss'],

  optionalPages: [
    {
      id: 'optional-page-example',
      title: 'Optional page example',
      component: 'stories-optional-pages/OptionalPageExample.vue',
    },
  ],

  alias: {
    '~': 'app',
    '@': 'app',
  },

  svgSpritePath: '/assets/sprite/',
  svgSpritePathDev: '/assets/sprite/',
  svgSpritePathBuild: '/public/assets/sprite/',

  port: 6006,

  strings: {
    themeLight: 'Light',
    themeDark: 'Dark',
    themeChecker: 'Chess ^_^',
  },
};

