# UI Stories

Lightweight Storybook alternative for Vue / Nuxt projects. Runs as a standalone Vite SPA on port `6006`.

## Installation

```bash
pnpm add -D ui-stories
```

## Quick Start

```bash
# Standalone CLI (without Nuxt)
npx ui-stories

# Or add a script to package.json and run
pnpm stories
```

Create `ui-stories.config.mjs` (recommended) in your project root and start writing `.stories.ts` files.

---

## Configuration (`ui-stories.config.mjs`)

If your project does **not** have `"type": "module"` in `package.json`, using `.mjs` avoids Node warnings.
Alternatively you can use `ui-stories.config.cjs` for CommonJS.

```javascript
export default {
  // Directories to scan for .stories.ts/.js files
  scanDirs: ['app/components'],

  // Host project CSS/SCSS to include (scoped to story preview)
  styles: ['app/assets/scss/main.scss'],

  // SCSS additionalData (mixins/variables prepended to every SCSS file)
  scssAdditionalData: '',

  // SCSS loadPaths for @use / @import resolution
  scssLoadPaths: ['app/assets/scss'],

  // Path aliases (resolved relative to project root)
  alias: {
    '~': 'app',
    '@': 'app',
  },

  // Base path for SVG sprite <use href="...">
  svgSpritePath: '/assets/sprite/',

  // Optional per-mode overrides:
  // - dev server (Vite serves `<hostRoot>/public` at `/`)
  svgSpritePathDev: '/assets/sprite/',
  // - static build/preview (host `public` is copied to `<outDir>/public`)
  svgSpritePathBuild: '/public/assets/sprite/',

  // Auto-import presets (e.g. '@vueuse/core', 'pinia')
  // 'vue' is always included automatically
  autoImports: ['@vueuse/core'],

  // Dev server port
  port: 6006,

  // Optional: extra sidebar links that open static “token” views (parsed from SCSS on the server).
  // See "Optional pages (design tokens)" below.
  optionalPages: [],

  // Optional: UI labels (English by default). Example: strings: { searchPlaceholder: '…' }
  // See "UI strings" below for all keys.
};
```

All options are optional — sensible defaults are used when omitted.

### UI strings (`strings`)

The shell UI (search field, empty states, theme preview tooltips) uses English text by default. Set `strings` to customize labels; you can pass only the keys you need — the rest stay at their defaults.

| Key | Default |
|-----|---------|
| `searchPlaceholder` | `Search components…` |
| `emptySelection` | `Select a component from the sidebar` |
| `emptySearchResults` | `No matches` |
| `themeLight` | `Light` |
| `themeDark` | `Dark` |
| `themeChecker` | `Checkerboard` |
| `optionalPagesSection` | `Pages` |

---

## Optional pages (design tokens)

**Experimental.** The shell can show extra sidebar items that render **read-only** views built from your SCSS: color swatches for `$variables`, typography rows for Sass `$` tokens, and **class-based** blocks (e.g. `.title-h1 { font-size: … }`) with a fixed “Lorem ipsum…” preview.

- **Config:** each page has `id`, `title`, and `scssFiles` (paths **relative to the project root**, same idea as `scanDirs` / `styles`). List every file you need; `@use` / `@import` are **not** followed automatically.
- **Navigation:** sidebar section **Pages** (label: `strings.optionalPagesSection`), URL hash `#__page__/<id>` (e.g. `#__page__/design-tokens`).
- **CSS variables:** previews that use `var(--token)` must get those variables from styles you pass in **`styles`** (they are scoped to `.uis-story__preview`, same as story previews).

### Minimal working example

`ui-stories.config.mjs`:

```javascript
export default {
  scanDirs: ['app/components'],
  styles: ['app/assets/scss/main.scss'], // must define :root / tokens your SCSS references via var()
  optionalPages: [
    {
      id: 'tokens',
      title: 'Design tokens',
      scssFiles: ['app/assets/scss/variables.scss'],
    },
  ],
};
```

`app/assets/scss/variables.scss` (fragment):

```scss
$brand: #3366cc;

:root {
  --font-size-xl: 1.25rem;
}
```

You get a **Pages → Design tokens** entry; the UI parses `$brand` and any other matching `$` entries, and shows colors (and other token types per built-in heuristics). For class-based typography previews, add a file with rules like `.heading { font-size: var(--font-size-xl); }` and include it in `scssFiles`, and ensure `--font-size-xl` exists in `styles`.

---

## Nuxt Module

Register in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['ui-stories'],
});
```

When running `nuxt dev`, UI Stories starts automatically alongside the Nuxt dev server.
The module reads `~/app` and `@/app` aliases from Nuxt conventions and can pick up
`scssAdditionalData` and `scssLoadPaths` from `nuxt.options.vite.css.preprocessorOptions.scss` as fallback.

### Production

UI Stories **does not participate in `nuxt build`** and must be built/served separately.

Build a static bundle:

```bash
# from your project root
npx ui-stories-build --outDir dist/ui-stories --base /ui-stories/
```

Preview it locally (or run as a standalone Node process behind Nginx):

```bash
npx ui-stories-preview dist/ui-stories
```

---

## `.stories.ts` File Format

Each `.stories.ts` (or `.stories.js`) file is an ES module with **named exports**.

### Meta Exports

| Export      | Type     | Description                                              |
|-------------|----------|----------------------------------------------------------|
| `directory` | `string` | Group in the sidebar. E.g. `'/ui/'`, `'/common/form/'`. Default: `'/'` |

### Story Export

Every other named export is a **story** — an object with `propsChanger` and `renderer`.

```typescript
interface Story {
  propsChanger?: Record<string, ControlDef>;
  renderer: () => {
    components: Record<string, Component>;
    template: string;
  };
}
```

### The `propsChanger` object

`propsChanger` is an optional **map of control names to definitions** (`Record<string, ControlDef>`). It drives the **Controls** panel under the story preview.

- **Keys** — labels in the Controls UI and the names of reactive refs injected into the story scope. Use valid identifiers so they work in the template (e.g. `title`, `badgeStyles`).
- **Values** — control definitions: a `type` (`input`, `select`, `switch`, `multiselect`, or `object`), a `default` when applicable, and extra fields such as `options` for select-like controls.
- **State** — each key is stored as reactive state; the preview component merges them into `setup()` (as refs), so you bind them like normal props: `{{ title }}`, `:disabled="disabled"`, `:badgeStyles="badgeStyles"`.
- If `propsChanger` is omitted or `{}`, no Controls panel is shown (static stories only need `renderer`).

---

## Control Types (`propsChanger` values / `ControlDef`)

| Type          | Fields                        | Description                          |
|---------------|-------------------------------|--------------------------------------|
| `input`       | `default: string`             | Text input                           |
| `select`      | `options: string[]`, `default: string` | Dropdown select              |
| `switch`      | `default: boolean`            | Toggle switch (true/false)           |
| `multiselect` | `options: string[]`, `default: string[]` | Multiple selection with chips |
| `object`      | `default: object`             | JSON-style editor for plain objects (initial value is deep-cloned) |

Property names in `propsChanger` become reactive variables available in `template`
via `{{ propName }}` and `:prop-name="propName"`.

---

## Full Example

```typescript
import MyComponent from './MyComponent.vue';

export const directory = '/ui/';

export const Default = {
  propsChanger: {
    title: {
      type: 'input',
      default: 'Hello',
    },
    size: {
      type: 'select',
      options: ['s', 'm', 'lg'],
      default: 'm',
    },
    disabled: {
      type: 'switch',
      default: false,
    },
    tags: {
      type: 'multiselect',
      options: ['new', 'sale', 'hot'],
      default: ['new'],
    },
  },

  renderer: () => ({
    components: { MyComponent },
    template: `
      <MyComponent
        :title="title"
        :size="size"
        :disabled="disabled"
        :tags="tags"
      />
    `,
  }),
};

export const WithSlot = {
  propsChanger: {
    text: { type: 'input', default: 'Click me' },
  },

  renderer: () => ({
    components: { MyComponent },
    template: '<MyComponent>{{ text }}</MyComponent>',
  }),
};
```

---

## Sidebar Structure

Stories are grouped by `directory` export, then by component (file name):

```
▼ /ui/
    ▼ UiButton
        CustomTemplate
▼ /common/form/
    ▼ Button
        Default
▼ /
    ▼ SomeOther
        Default
```

---

## Development (Playground)

```bash
# Install all workspace dependencies
pnpm install

# Run playground Nuxt app + stories together
cd playground && pnpm dev

# Or run stories standalone from playground
cd playground && pnpm stories
```
