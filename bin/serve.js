#!/usr/bin/env node

import { startStoriesServer } from '../server/createViteServer.js';
import { loadUiStoriesConfig } from '../server/userConfig.js';

const hostRoot = process.cwd();

async function main() {
  const config = await loadUiStoriesConfig(hostRoot);

  await startStoriesServer({
    hostRoot,
    scanDirs: config.scanDirs,
    styles: config.styles,
    port: config.port,
    alias: config.alias,
    scssAdditionalData: config.scssAdditionalData,
    scssLoadPaths: config.scssLoadPaths,
    svgSpritePath: config.svgSpritePathDev ?? config.svgSpritePath,
    autoImports: config.autoImports,
    strings: config.strings,
    open: true,
  });

  console.log(`\n  \x1b[36m[ui-stories]\x1b[0m ➜ http://localhost:${config.port}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
