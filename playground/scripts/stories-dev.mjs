import { spawn } from 'node:child_process';

// Cross-platform way to enable UI Stories in dev.
process.env.UI_STORIES_ENABLE ||= '1';

const cmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const child = spawn(cmd, ['exec', 'nuxt', 'dev'], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));

