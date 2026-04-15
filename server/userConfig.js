import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

export const UI_STORIES_DEFAULTS = {
  scanDirs: ['app/components'],
  styles: [],
  port: 6006,
  alias: {},
  scssLoadPaths: [],
  svgSpritePath: '/assets/sprite/',
  autoImports: [],
};

/**
 * @param {string} hostRoot
 */
export async function loadUiStoriesConfig(hostRoot) {
  const configPath =
    resolve(hostRoot, 'ui-stories.config.mjs');
  const configPathJs =
    resolve(hostRoot, 'ui-stories.config.js');
  const configPathCjs =
    resolve(hostRoot, 'ui-stories.config.cjs');

  let resolvedPath = null;
  if (existsSync(configPath)) resolvedPath = configPath;
  else if (existsSync(configPathCjs)) resolvedPath = configPathCjs;
  else if (existsSync(configPathJs)) resolvedPath = configPathJs;

  if (!resolvedPath) return { ...UI_STORIES_DEFAULTS };

  const userConfig = await loadConfigModule(resolvedPath);

  return {
    scanDirs: userConfig.scanDirs || UI_STORIES_DEFAULTS.scanDirs,
    styles: userConfig.styles || UI_STORIES_DEFAULTS.styles,
    port: userConfig.port || UI_STORIES_DEFAULTS.port,
    alias: userConfig.alias || UI_STORIES_DEFAULTS.alias,
    scssAdditionalData: userConfig.scssAdditionalData || '',
    scssLoadPaths: userConfig.scssLoadPaths || UI_STORIES_DEFAULTS.scssLoadPaths,
    svgSpritePath: userConfig.svgSpritePath || UI_STORIES_DEFAULTS.svgSpritePath,
    autoImports: userConfig.autoImports || UI_STORIES_DEFAULTS.autoImports,
  };
}

/**
 * Loads a config file supporting:
 * - `ui-stories.config.mjs` (ESM) — recommended for projects without `"type":"module"`.
 * - `ui-stories.config.cjs` (CJS) — supported without ESM warnings.
 * - `ui-stories.config.js` (ESM/CJS depending on host project) — may warn in typeless packages.
 *
 * @param {string} absPath
 * @returns {Promise<any>}
 */
async function loadConfigModule(absPath) {
  if (absPath.endsWith('.cjs')) {
    const req = createRequire(import.meta.url);
    const mod = req(absPath);
    return mod?.default || mod;
  }

  const mod = await import(pathToFileURL(absPath).href);
  return mod?.default || mod;
}
