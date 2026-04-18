import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { watch } from 'node:fs';
import {
  extractScssVariableMap,
  mergeVariableMaps,
  buildTokenLists,
  extractTypographyClassBlocks,
} from './parseScssVariables.js';

const VIRTUAL_ID = 'virtual:optional-pages';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

/**
 * @typedef {{ id: string, title: string, scssFiles: string[] }} OptionalPageConfig
 */

/**
 * @param {{ hostRoot: string, optionalPages?: OptionalPageConfig[] }} options
 */
export function optionalPagesPlugin({ hostRoot, optionalPages = [] }) {
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

/**
 * @param {string} hostRoot
 * @param {OptionalPageConfig[]} pages
 */
function collectWatchedFiles(hostRoot, pages) {
  /** @type {string[]} */
  const out = [];
  for (const p of pages) {
    for (const rel of p.scssFiles || []) {
      const abs = resolve(hostRoot, rel);
      if (existsSync(abs)) out.push(abs);
    }
  }
  return out;
}

/**
 * @param {string} hostRoot
 * @param {OptionalPageConfig[]} pages
 */
async function buildVirtualModule(hostRoot, pages) {
  /** @type {Array<{ id: string, title: string, colorTokens: unknown[], typographyTokens: unknown[], typographyPresets: unknown[] }>} */
  const payload = [];

  for (const page of pages) {
    if (!page?.id || !page.title) continue;
    const relFiles = Array.isArray(page.scssFiles) ? page.scssFiles : [];
    /** @type {Map<string, string>[]} */
    const perFileMaps = [];
    /** @type {Map<string, Record<string, string>>} */
    const presetMap = new Map();
    /** @type {string[]} */
    const presetOrder = [];

    for (const rel of relFiles) {
      const abs = resolve(hostRoot, rel);
      if (!existsSync(abs)) {
        console.warn(`[ui-stories] optional page "${page.id}": file not found: ${rel}`);
        continue;
      }
      try {
        const src = await readFile(abs, 'utf8');
        perFileMaps.push(extractScssVariableMap(src));

        const blocks = extractTypographyClassBlocks(src);
        for (const b of blocks) {
          if (!presetMap.has(b.selector)) presetOrder.push(b.selector);
          presetMap.set(b.selector, b.properties);
        }
      } catch (e) {
        console.warn(`[ui-stories] optional page "${page.id}": failed to read ${rel}`, e);
      }
    }

    const merged = mergeVariableMaps(perFileMaps);
    const { colorTokens, typographyTokens } = buildTokenLists(merged);

    const typographyPresets = presetOrder.map((selector) => ({
      selector,
      properties: presetMap.get(selector),
    }));

    payload.push({
      id: String(page.id),
      title: String(page.title),
      colorTokens,
      typographyTokens,
      typographyPresets,
    });
  }

  return `export default ${JSON.stringify(payload)};`;
}
