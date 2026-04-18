import { defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'node:path';
import { loadUiStoriesConfig } from '../server/userConfig.js';

export default defineNuxtModule({
  meta: {
    name: 'ui-stories',
    configKey: 'uiStories',
  },

  async setup(moduleOptions, nuxt) {
    // Important: this module must not affect production builds.
    // UI Stories is intended to be built/served separately in production.

    const hostRoot = nuxt.options.rootDir;
    const config = await loadUiStoriesConfig(hostRoot);

    const nuxtAlias = {
      '~': resolve(hostRoot, 'app'),
      '@': resolve(hostRoot, 'app'),
    };

    const mergedAlias = { ...nuxtAlias, ...config.alias };

    const scssAdditionalData = config.scssAdditionalData
      || nuxt.options.vite?.css?.preprocessorOptions?.scss?.additionalData
      || '';
    const scssLoadPaths = config.scssLoadPaths.length
      ? config.scssLoadPaths
      : nuxt.options.vite?.css?.preprocessorOptions?.scss?.loadPaths || [];

    // Dev: run standalone UI Stories server alongside Nuxt dev server.
    if (nuxt.options.dev) {
      nuxt.hook('listen', async () => {
        const { startStoriesServer } = await import('../server/createViteServer.js');

        await startStoriesServer({
          hostRoot,
          scanDirs: config.scanDirs,
          styles: config.styles,
          port: config.port,
          alias: mergedAlias,
          scssAdditionalData,
          scssLoadPaths,
          svgSpritePath: config.svgSpritePathDev ?? config.svgSpritePath,
          autoImports: config.autoImports,
          strings: config.strings,
        });

        console.log(`\n  \x1b[36m[ui-stories]\x1b[0m ➜ http://localhost:${config.port}\n`);
      });

      return;
    }
  },
});
