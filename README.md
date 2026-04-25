# UI Stories

Lightweight Storybook alternative for **Nuxt** projects. Runs **inside your Nuxt app** as a dev/prod route.

## Installation

```bash
pnpm add -D ui-stories
```

## Quick Start

```bash
# Install
pnpm add -D ui-stories
```

Register the module and enable UI Stories:

```ts
export default defineNuxtConfig({
  modules: ['ui-stories'],
  uiStories: {
    enabled: process.env.UI_STORIES_ENABLE === '1',
  },
})
```

Open `http://localhost:<port>/__ui-stories` (default route).
You can preselect a story via query param:

- `__ui-stories?uis=UiButton/Default`

---

## Configuration (in `nuxt.config.ts`)

```ts
export default defineNuxtConfig({
  modules: ['ui-stories'],
  uiStories: {
    // Enable/disable module features (route + virtual modules).
    enabled: process.env.UI_STORIES_ENABLE === '1',

    // Route where the UI Stories UI is mounted.
    route: '/__ui-stories',

    // Directories (relative to project root) to scan for `.stories.ts` / `.stories.js` files.
    scanDirs: ['app/components'],

    // Host project CSS/SCSS to include (scoped to story preview).
    styles: ['app/assets/scss/main.scss'],

    // Base path for SVG sprite <use href="...">
    svgSpritePath: '/assets/sprite/',

    // Optional: extra sidebar links that render your own Vue pages.
    optionalPages: [],

    // Optional: UI labels (English by default). Example: strings: { searchPlaceholder: '…' }
    // See "UI strings" below for all keys.
    strings: {},
  },
})
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

## Optional pages

You can add extra sidebar entries under **Pages** (`strings.optionalPagesSection`) that open **your own Vue SFCs** in the main area — same shell (header, sidebar) as stories, but the content is entirely up to you.

- **Config:** each entry has `id`, `title`, and `component`: a path to a `.vue` file **relative to the project root** (same style as `scanDirs` / `styles`).
- **Navigation:** URL hash `#__page__/<id>` (e.g. `#__page__/design-tokens`).
- **Styles:** global styles from **`styles`** in the config are still applied to the app shell; use normal Vue `<style>` / imports inside your page component for page-specific layout.

### Minimal working example

`app/pages/MyTokensPage.vue`:

```vue
<template>
  <div class="my-page">
    <h1>Design tokens</h1>
    <p>Define any markup, components, or documentation here.</p>
  </div>
</template>

<style scoped>
.my-page {
  padding: 1rem;
}
</style>
```

`ui-stories.config.mjs`:

```javascript
export default {
  scanDirs: ['app/components'],
  styles: ['app/assets/scss/main.scss'],
  optionalPages: [
    {
      id: 'tokens',
      title: 'Design tokens',
      component: 'app/pages/MyTokensPage.vue',
    },
  ],
};
```

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

If `uiStories.enabled` is `true` during `nuxt build`, the UI Stories route is built and served
as part of your Nuxt output. Make sure to protect the route appropriately (e.g. behind auth)
before enabling it in production.

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
