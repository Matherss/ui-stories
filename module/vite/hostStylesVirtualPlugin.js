import { resolve } from 'node:path';

const VIRTUAL_ID = 'virtual:host-styles';
const RESOLVED_ID = '\0virtual-host-styles.scss';

/**
 * Generates a virtual SCSS module wrapping all host styles
 * inside `.uis-story__preview` so they don't leak into the UI shell.
 *
 * @param {{ hostRoot: string, styles: string[] }} options
 */
export function hostStylesVirtualPlugin({ hostRoot, styles }) {
  return {
    name: 'ui-stories:host-styles',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return;
      if (!styles.length) return '/* no host styles configured */';

      const loads = styles.map((stylePath) => {
        const abs = resolve(hostRoot, stylePath).replace(/\\/g, '/');
        return `  @include meta.load-css("${abs}");`;
      });

      return `@use "sass:meta";\n\n.uis-story__preview {\n${loads.join('\n')}\n}`;
    },
  };
}

/**
 * PostCSS plugin that fixes selectors after SCSS nesting:
 *   `.uis-story__preview :root` → `.uis-story__preview`
 *   `.uis-story__preview html`  → `.uis-story__preview`
 *   `.uis-story__preview body`  → `.uis-story__preview`
 */
export function scopeFixPlugin() {
  return {
    postcssPlugin: 'ui-stories-scope-fix',
    Rule(rule) {
      let changed = false;

      const fixed = rule.selectors.map((sel) => {
        const original = sel;
        sel = sel
          .replace(/\.uis-story__preview\s+:root/g, '.uis-story__preview')
          .replace(/\.uis-story__preview\s+html/g, '.uis-story__preview')
          .replace(/\.uis-story__preview\s+body/g, '.uis-story__preview');
        if (sel !== original) changed = true;
        return sel;
      });

      if (changed) {
        rule.selectors = [...new Set(fixed)];
      }
    },
  };
}

scopeFixPlugin.postcss = true;

