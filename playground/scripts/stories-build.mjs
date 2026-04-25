import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { resolve } from 'node:path';

function readArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const outDirArg = readArg('--outDir') || '../dist/ui-stories';
const baseArg = readArg('--base') || '/ui-stories/';

process.env.UI_STORIES_ENABLE = '1';
process.env.UI_STORIES_BASE = baseArg;

const cmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

// Build a static output. (Nitro preset is what actually makes it "static".)
const r = spawnSync(cmd, ['exec', 'nuxt', 'build', '--preset', 'static'], {
  stdio: 'inherit',
  env: process.env,
});

if (r.status && r.status !== 0) process.exit(r.status);

const srcPublic = resolve(process.cwd(), '.output/public');
const outDir = resolve(process.cwd(), outDirArg);
mkdirSync(outDir, { recursive: true });
await cp(srcPublic, outDir, { recursive: true, force: true });

console.log(`UI Stories exported to ${outDir} (base: ${baseArg})`);

