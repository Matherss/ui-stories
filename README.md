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

Create `ui-stories.config.js` in your project root and start writing `.stories.ts` files.

---

## Configuration (`ui-stories.config.js`)

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

  // Auto-import presets (e.g. '@vueuse/core', 'pinia')
  // 'vue' is always included automatically
  autoImports: ['@vueuse/core'],

  // Dev server port
  port: 6006,
};
```

All options are optional — sensible defaults are used when omitted.

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

### Production (`pnpm build` / `pnpm start`)

By default, during `nuxt build` the module will also build a static UI Stories bundle and serve it from `/ui-stories/` after start.

To disable this behavior:

```ts
export default defineNuxtConfig({
  modules: ['ui-stories'],
  uiStories: {
    static: false,
  },
});
```

Optional: change the base URL (default is `'/ui-stories/'`):

```ts
export default defineNuxtConfig({
  modules: ['ui-stories'],
  uiStories: {
    baseURL: '/some-path/',
  },
});
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

---

## Control Types (`propsChanger`)

| Type          | Fields                        | Description                          |
|---------------|-------------------------------|--------------------------------------|
| `input`       | `default: string`             | Text input                           |
| `select`      | `options: string[]`, `default: string` | Dropdown select              |
| `switch`      | `default: boolean`            | Toggle switch (true/false)           |
| `multiselect` | `options: string[]`, `default: string[]` | Multiple selection with chips |

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
