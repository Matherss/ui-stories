#!/usr/bin/env node

import { resolve } from 'node:path';
import { buildStoriesStatic } from '../server/createViteServer.js';
import { loadUiStoriesConfig } from '../server/userConfig.js';

const hostRoot = process.cwd();

function parseArgs(argv) {
  /** @type {{ outDir?: string, base?: string }} */
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--outDir' && argv[i + 1]) {
      out.outDir = resolve(hostRoot, argv[++i]);
    } else if (a === '--base' && argv[i + 1]) {
      out.base = argv[++i];
    }
  }
  return out;
}

async function main() {
  const config = await loadUiStoriesConfig(hostRoot);
  const cli = parseArgs(process.argv);
  const outDir = cli.outDir ?? resolve(hostRoot, 'dist/ui-stories');
  const base = cli.base ?? process.env.UI_STORIES_BASE ?? './';

  await buildStoriesStatic({
    hostRoot,
    scanDirs: config.scanDirs,
    styles: config.styles,
    alias: config.alias,
    scssAdditionalData: config.scssAdditionalData,
    scssLoadPaths: config.scssLoadPaths,
    svgSpritePath: config.svgSpritePath,
    autoImports: config.autoImports,
    outDir,
    base,
  });

  console.log(`\n  \x1b[36m[ui-stories]\x1b[0m build → ${outDir}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
