import { defineNuxtModule, createResolver, extendPages } from '@nuxt/kit';
import { storiesVirtualPlugin } from './vite/storiesVirtualPlugin.js';
import { optionalPagesVirtualPlugin } from './vite/optionalPagesVirtualPlugin.js';
import { hostStylesVirtualPlugin, scopeFixPlugin } from './vite/hostStylesVirtualPlugin.js';
import { uiStoriesConfigPlugin } from './vite/uiStoriesConfigPlugin.js';

export default defineNuxtModule({
  meta: {
    name: 'ui-stories',
    configKey: 'uiStories',
  },

  defaults: {
    enabled: true,
    route: '/__ui-stories',
    scanDirs: ['app/components'],
    styles: [],
    svgSpritePath: '/assets/sprite/',
    optionalPages: [],
    strings: {},
  },

  async setup(options, nuxt) {
    const enabled = Boolean(options.enabled);
    if (!enabled) return;

    const resolver = createResolver(import.meta.url);
    const hostRoot = nuxt.options.rootDir;

    // Add a Nuxt page for the UI Stories shell.
    extendPages((pages) => {
      pages.push({
        name: 'ui-stories',
        path: options.route || '/__ui-stories',
        file: resolver.resolve('../runtime/pages/ui-stories.vue'),
        // Do not rely on `definePageMeta` macro inside node_modules.
        // Mark the page as client-only at the route level.
        meta: { ssr: false, layout: false },
      });
    });

    // Inject Vite plugins to provide virtual modules in Nuxt context.
    nuxt.hook('vite:extendConfig', (config) => {
      // Stories in `.stories.ts` use `template: '...'` strings, which require
      // Vue runtime compiler.
      // config.resolve ||= {};
      // config.resolve.alias ||= {};
      // config.resolve.alias.vue = 'vue/dist/vue.esm-bundler.js';
      // config.resolve.dedupe = ['vue','vue/compiler-sfc','vue/compiler-dom','vue/runtime-dom','vue/runtime-core', '@vue/runtime-dom', '@vue/runtime-core'];

      config.plugins ||= [];
      config.plugins.push(
        uiStoriesConfigPlugin({
          svgSpritePath: options.svgSpritePath || '/assets/sprite/',
          strings: options.strings || {},
        }),
        storiesVirtualPlugin({ hostRoot, scanDirs: options.scanDirs || ['app/components'] }),
        optionalPagesVirtualPlugin({ hostRoot, optionalPages: options.optionalPages || [] }),
        hostStylesVirtualPlugin({ hostRoot, styles: options.styles || [] }),
      );

      config.css ||= {};
      config.css.postcss ||= {};
      config.css.postcss.plugins ||= [];
      config.css.postcss.plugins.push(scopeFixPlugin());
    });
  },
});
