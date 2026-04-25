/**
 * Virtual module `virtual:ui-stories-config` for runtime UI values.
 *
 * Exposes:
 * - `svgSpritePath: string`
 * - `strings: Record<string, string>`
 */
export function uiStoriesConfigPlugin({ svgSpritePath, strings }) {
  const VIRTUAL_ID = 'virtual:ui-stories-config';
  const RESOLVED_ID = '\0' + VIRTUAL_ID;

  return {
    name: 'ui-stories:config',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      return `export const svgSpritePath = ${JSON.stringify(svgSpritePath)};
export const strings = ${JSON.stringify(strings)};`;
    },
  };
}

