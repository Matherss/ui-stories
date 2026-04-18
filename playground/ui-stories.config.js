export default {
  scanDirs: ['app/components'],
  styles: ['app/assets/scss/main.scss'],
  scssLoadPaths: ['app/assets/scss'],
  optionalPages: [
    {
      id: 'design-tokens',
      title: 'Design tokens',
      scssFiles: ['app/assets/scss/variables.scss'],
    },
    {
      id: 'typography',
      title: 'Typography',
      // Class-based presets (typography.scss) + Sass $ tokens (typography-sass-tokens.scss) side by side.
      scssFiles: [
        'app/assets/scss/typography-sass-tokens.scss',
        'app/assets/scss/typography.scss',
      ],
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
