import fg from 'fast-glob';
import { resolve, relative, basename } from 'node:path';
import { watch } from 'node:fs';

const VIRTUAL_ID = 'virtual:stories';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

/**
 * Collects all `.stories.ts` / `.stories.js` files and exposes them as
 * a virtual module `virtual:stories`.
 *
 * @param {{ hostRoot: string, scanDirs: string[] }} options
 */
export function storiesVirtualPlugin({ hostRoot, scanDirs }) {
  /** @type {import('vite').ViteDevServer | null} */
  let server = null;

  return {
    name: 'ui-stories:stories',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    async load(id) {
      if (id !== RESOLVED_ID) return;
      return await buildVirtualModule(hostRoot, scanDirs);
    },

    configureServer(viteServer) {
      server = viteServer;

      const dirsToWatch = scanDirs.map((d) => resolve(hostRoot, d));
      for (const dir of dirsToWatch) {
        try {
          watch(dir, { recursive: true }, (_, filename) => {
            if (!filename) return;
            if (!filename.endsWith('.stories.ts') && !filename.endsWith('.stories.js')) return;
            const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
            if (mod) {
              server.moduleGraph.invalidateModule(mod);
              server.ws.send({ type: 'full-reload' });
            }
          });
        } catch {
          // ignore
        }
      }
    },
  };
}

async function buildVirtualModule(hostRoot, scanDirs) {
  const patterns = scanDirs.map(
    (dir) => resolve(hostRoot, dir).replace(/\\/g, '/') + '/**/*.stories.{ts,js}'
  );

  const files = await fg(patterns, { absolute: true });
  files.sort();

  const imports = [];
  const entries = [];

  for (let i = 0; i < files.length; i++) {
    const absPath = files[i].replace(/\\/g, '/');
    const relPath = relative(hostRoot, absPath).replace(/\\/g, '/');
    const fileName = basename(absPath).replace(/\.stories\.(ts|js)$/, '');
    const varName = `m${i}`;
    imports.push(`import * as ${varName} from '${absPath}';`);
    entries.push(`  '${fileName}': { filePath: '${relPath}', exports: ${varName} }`);
  }

  return [
    ...imports,
    '',
    'const stories = {',
    entries.join(',\n'),
    '};',
    '',
    'export default stories;',
  ].join('\n');
}

