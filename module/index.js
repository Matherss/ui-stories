import { defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'node:path';
import { loadUiStoriesConfig } from '../server/userConfig.js';

export default defineNuxtModule({
  meta: {
    name: 'ui-stories',
    configKey: 'uiStories',
  },

  async setup(moduleOptions, nuxt) {
    const prodStaticEnabled = (moduleOptions?.static ?? true) !== false;
    const prodBaseURL = moduleOptions?.baseURL ?? '/ui-stories/';

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
          svgSpritePath: config.svgSpritePath,
          autoImports: config.autoImports,
        });

        console.log(`\n  \x1b[36m[ui-stories]\x1b[0m ➜ http://localhost:${config.port}\n`);
      });

      return;
    }

    if (!prodStaticEnabled) return;

    // Prod build: generate a static UI Stories bundle and serve it from `baseURL`.
    // Nitro will copy/serve this directory as a public asset.
    const outDir = resolve(nuxt.options.buildDir, 'ui-stories');

    /** @type {boolean} */
    let built = false;
    async function buildOnce() {
      if (built) return;
      built = true;

      const { buildStoriesStatic } = await import('../server/createViteServer.js');

      await buildStoriesStatic({
        hostRoot,
        scanDirs: config.scanDirs,
        styles: config.styles,
        alias: mergedAlias,
        scssAdditionalData,
        scssLoadPaths,
        svgSpritePath: config.svgSpritePath,
        autoImports: config.autoImports,
        outDir,
        base: prodBaseURL,
      });
    }

    // Prefer Nuxt build hook; keep Nitro hook as a fallback.
    nuxt.hook('build:before', buildOnce);
    nuxt.hook('nitro:build:before', buildOnce);

    nuxt.options.nitro = nuxt.options.nitro || {};
    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
    nuxt.options.nitro.publicAssets.push({
      dir: outDir,
      baseURL: prodBaseURL,
      // @ts-ignore - Nitro supports this option (Nuxt types may lag behind).
      maxAge: 60 * 60 * 24 * 30,
    });
  },
});
