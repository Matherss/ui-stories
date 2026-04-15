import { defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'node:path';
import { loadUiStoriesConfig } from '../server/userConfig.js';

export default defineNuxtModule({
  meta: {
    name: 'ui-stories',
    configKey: 'uiStories',
  },

  async setup(_options, nuxt) {
    if (!nuxt.options.dev) return;

    const hostRoot = nuxt.options.rootDir;
    const config = await loadUiStoriesConfig(hostRoot);

    const nuxtAlias = {
      '~': resolve(hostRoot, 'app'),
      '@': resolve(hostRoot, 'app'),
    };

    const mergedAlias = { ...nuxtAlias, ...config.alias };

    nuxt.hook('listen', async () => {
      const { startStoriesServer } = await import('../server/createViteServer.js');

      await startStoriesServer({
        hostRoot,
        scanDirs: config.scanDirs,
        styles: config.styles,
        port: config.port,
        alias: mergedAlias,
        scssAdditionalData: config.scssAdditionalData
          || nuxt.options.vite?.css?.preprocessorOptions?.scss?.additionalData
          || '',
        scssLoadPaths: config.scssLoadPaths.length
          ? config.scssLoadPaths
          : nuxt.options.vite?.css?.preprocessorOptions?.scss?.loadPaths || [],
        svgSpritePath: config.svgSpritePath,
        autoImports: config.autoImports,
      });

      console.log(`\n  \x1b[36m[ui-stories]\x1b[0m ➜ http://localhost:${config.port}\n`);
    });
  },
});
