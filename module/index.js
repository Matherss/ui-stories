import { defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const DEFAULTS = {
  scanDirs: ['app/components'],
  styles: [],
  port: 6006,
  alias: {},
  scssLoadPaths: [],
  svgSpritePath: '/assets/sprite/',
  autoImports: [],
};

export default defineNuxtModule({
  meta: {
    name: 'ui-stories',
    configKey: 'uiStories',
  },

  async setup(_options, nuxt) {
    if (!nuxt.options.dev) return;

    const hostRoot = nuxt.options.rootDir;
    const config = await loadConfig(hostRoot);

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

async function loadConfig(hostRoot) {
  const configPath = resolve(hostRoot, 'ui-stories.config.js');

  if (!existsSync(configPath)) {
    return { ...DEFAULTS };
  }

  const configUrl = pathToFileURL(configPath).href;
  const mod = await import(configUrl);
  const userConfig = mod.default || mod;

  return {
    scanDirs: userConfig.scanDirs || DEFAULTS.scanDirs,
    styles: userConfig.styles || DEFAULTS.styles,
    port: userConfig.port || DEFAULTS.port,
    alias: userConfig.alias || DEFAULTS.alias,
    scssAdditionalData: userConfig.scssAdditionalData || '',
    scssLoadPaths: userConfig.scssLoadPaths || DEFAULTS.scssLoadPaths,
    svgSpritePath: userConfig.svgSpritePath || DEFAULTS.svgSpritePath,
    autoImports: userConfig.autoImports || DEFAULTS.autoImports,
  };
}
