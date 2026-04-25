import { resolve } from 'node:path';
import { existsSync, watch } from 'node:fs';

const VIRTUAL_ID = 'virtual:optional-pages';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

/**
 * @typedef {{ id: string, title: string, component: string }} OptionalPageConfig
 */

/**
 * Exposes optional pages list as a virtual module `virtual:optional-pages`.
 *
 * @param {{ hostRoot: string, optionalPages?: OptionalPageConfig[] }} options
 */
export function optionalPagesVirtualPlugin({ hostRoot, optionalPages = [] }) {
  /** @type {import('vite').ViteDevServer | null} */
  let server = null;

  return {
    name: 'ui-stories:optional-pages',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    async load(id) {
      if (id !== RESOLVED_ID) return;
      return await buildVirtualModule(hostRoot, optionalPages);
    },

    configureServer(viteServer) {
      server = viteServer;
      const files = collectWatchedFiles(hostRoot, optionalPages);
      for (const abs of files) {
        try {
          watch(abs, () => {
            const mod = server?.moduleGraph.getModuleById(RESOLVED_ID);
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

function collectWatchedFiles(hostRoot, pages) {
  /** @type {string[]} */
  const out = [];
  for (const p of pages) {
    const rel = p?.component;
    if (!rel || typeof rel !== 'string') continue;
    const abs = resolve(hostRoot, rel);
    if (existsSync(abs)) out.push(abs);
  }
  return out;
}

async function buildVirtualModule(hostRoot, pages) {
  const imports = [];
  const entries = [];

  let i = 0;
  for (const page of pages) {
    if (!page?.id || !page?.title) {
      console.warn('[ui-stories] optional page skipped: missing id or title');
      continue;
    }
    const rel = page?.component;
    if (!rel || typeof rel !== 'string') {
      console.warn(`[ui-stories] optional page "${page.id}": missing "component" (path to a .vue file relative to project root)`);
      continue;
    }
    const abs = resolve(hostRoot, rel);
    if (!existsSync(abs)) {
      console.warn(`[ui-stories] optional page "${page.id}": component not found: ${rel}`);
      continue;
    }

    const absPath = abs.replace(/\\/g, '/');
    const varName = `OptionalPage${i}`;
    imports.push(`import ${varName} from ${JSON.stringify(absPath)};`);
    entries.push(`  { id: ${JSON.stringify(String(page.id))}, title: ${JSON.stringify(String(page.title))}, component: ${varName} }`);
    i++;
  }

  return [...imports, '', 'export default [', entries.join(',\n'), '];', ''].join('\n');
}

