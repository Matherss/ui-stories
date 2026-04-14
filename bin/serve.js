#!/usr/bin/env node

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { startStoriesServer } from '../server/createViteServer.js';

const hostRoot = process.cwd();

const DEFAULTS = {
  scanDirs: ['app/components'],
  styles: [],
  port: 6006,
  alias: {},
  scssLoadPaths: [],
  svgSpritePath: '/assets/sprite/',
  autoImports: [],
};

async function main() {
  const config = await loadConfig(hostRoot);

  await startStoriesServer({
    hostRoot,
    scanDirs: config.scanDirs,
    styles: config.styles,
    port: config.port,
    alias: config.alias,
    scssAdditionalData: config.scssAdditionalData,
    scssLoadPaths: config.scssLoadPaths,
    svgSpritePath: config.svgSpritePath,
    autoImports: config.autoImports,
    open: true,
  });

  console.log(`\n  \x1b[36m[ui-stories]\x1b[0m ➜ http://localhost:${config.port}\n`);
}

async function loadConfig(root) {
  const configPath = resolve(root, 'ui-stories.config.js');
  if (!existsSync(configPath)) return { ...DEFAULTS };

  const mod = await import(pathToFileURL(configPath).href);
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
