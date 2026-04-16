import fg from 'fast-glob';
import { relative } from 'node:path';

/**
 * Resolver for unplugin-vue-components that mimics Nuxt auto-import naming.
 *
 * For `components/common/form/Checkbox.vue` it registers:
 *   CommonFormCheckbox, FormCheckbox, Checkbox
 *
 * If a short name collides between different files it is dropped —
 * only the longer, unambiguous variants survive.
 */
export function nuxtComponentResolver(dirs) {
  let nameToPath = null;

  function buildMap() {
    if (nameToPath) return nameToPath;

    /** @type {{ name: string, file: string, depth: number }[]} */
    const entries = [];

    for (const dir of dirs) {
      const files = fg.sync('**/*.vue', { cwd: dir, absolute: true });

      for (const file of files) {
        const rel = relative(dir, file).replace(/\\/g, '/');
        const segments = rel.replace(/\.vue$/, '').split('/');

        for (let i = 0; i < segments.length; i++) {
          const name = segments
            .slice(i)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join('');
          entries.push({ name, file, depth: segments.length - i });
        }
      }
    }

    entries.sort((a, b) => b.depth - a.depth);

    nameToPath = new Map();
    const collisions = new Set();

    for (const { name, file } of entries) {
      if (nameToPath.has(name)) {
        if (nameToPath.get(name) !== file) collisions.add(name);
      } else {
        nameToPath.set(name, file);
      }
    }

    for (const name of collisions) nameToPath.delete(name);

    return nameToPath;
  }

  return {
    type: 'component',
    resolve(name) {
      const map = buildMap();
      const file = map.get(name);
      if (file) return { from: file };
    },
  };
}
