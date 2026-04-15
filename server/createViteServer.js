import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { storiesGlobPlugin } from './storiesGlobPlugin.js';
import { hostStylesPlugin, scopeFixPlugin } from './hostStylesPlugin.js';
import { nuxtComponentResolver } from './nuxtComponentResolver.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, '..', 'app');

/**
 * @param {{
 *   hostRoot: string,
 *   scanDirs: string[],
 *   styles: string[],
 *   port: number,
 *   alias: Record<string, string>,
 *   scssAdditionalData?: string,
 *   scssLoadPaths?: string[],
 *   svgSpritePath?: string,
 *   autoImports?: string[],
 *   open?: boolean,
 * }} options
 */
export async function startStoriesServer({
  hostRoot,
  scanDirs,
  styles,
  port,
  alias,
  scssAdditionalData = '',
  scssLoadPaths = [],
  svgSpritePath = '/assets/sprite/',
  autoImports = [],
  open = false,
}) {
  const resolvedAlias = {};
  for (const [key, val] of Object.entries(alias)) {
    resolvedAlias[key] = resolve(hostRoot, val);
  }

  const scssData = normalizeScssAdditionalData(scssAdditionalData, hostRoot, resolvedAlias);
  const resolvedScanDirs = scanDirs.map((d) => resolve(hostRoot, d));

  const pkgRoot = resolve(__dirname, '..');

  // Runtime compiler needed for dynamic template strings in stories
  resolvedAlias.vue = 'vue/dist/vue.esm-bundler.js';

  const server = await createServer({
    configFile: false,
    root: appRoot,

    publicDir: resolve(hostRoot, 'public'),

    server: {
      port,
      strictPort: true,
      open,
    },

    plugins: [
      vue(),
      uiStoriesConfigPlugin({ svgSpritePath }),
      AutoImport({
        imports: ['vue', ...autoImports],
        dts: false,
      }),
      Components({
        dts: false,
        resolvers: [nuxtComponentResolver(resolvedScanDirs)],
      }),
      storiesGlobPlugin({ hostRoot, scanDirs }),
      hostStylesPlugin({ hostRoot, styles }),
    ],

    resolve: {
      alias: resolvedAlias,
      dedupe: ['vue'],
    },

    css: {
      postcss: {
        plugins: [scopeFixPlugin()],
      },
      preprocessorOptions: {
        scss: {
          additionalData: scssData,
          loadPaths: scssLoadPaths.map((p) => resolve(hostRoot, p)),
        },
      },
    },

    optimizeDeps: {
      include: ['vue'],
      entries: [resolve(appRoot, 'index.html')],
    },
  });

  await server.listen();
}

function uiStoriesConfigPlugin({ svgSpritePath }) {
  const VIRTUAL_ID = 'virtual:ui-stories-config';
  const RESOLVED_ID = '\0' + VIRTUAL_ID;

  return {
    name: 'ui-stories:config',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      return `export const svgSpritePath = ${JSON.stringify(svgSpritePath)};`;
    },
  };
}

/**
 * Replace `~/` and `@/` alias prefixes in additionalData SCSS paths
 * to absolute paths. Sorts keys longest-first to avoid partial matches.
 */
function normalizeScssAdditionalData(data, hostRoot, alias) {
  if (!data || typeof data !== 'string') return '';

  let result = data;

  const sorted = Object.entries(alias).sort((a, b) => b[0].length - a[0].length);
  for (const [key, val] of sorted) {
    const prefix = key + '/';
    result = result.replaceAll(prefix, val.replace(/\\/g, '/') + '/');
  }
  return result;
}
