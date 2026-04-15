import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

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
  const configPath = resolve(hostRoot, 'ui-stories.config.js');
  if (!existsSync(configPath)) return { ...UI_STORIES_DEFAULTS };

  const mod = await import(pathToFileURL(configPath).href);
  const userConfig = mod.default || mod;

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
