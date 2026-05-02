# UIStories

A **Nuxt 4** module that turns `*.story.vue` files into a local component workshop: sidebar navigation, live previews, optional controls, code snippets (Shiki), and story metadata.

## Install

```bash
pnpm add ui-stories
```

## Setup

Add the module to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['ui-stories'],
})
```

Place story files under your app `srcDir` (usually `app/` or project root, depending on your Nuxt layout). The module discovers **`**/*.story.vue`** automatically.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Turn the workshop UI off without removing the module. |
| `route` | `string` | `'/stories'` | Base path for the stories page (`/stories/:id?`). |

Example:

```ts
export default defineNuxtConfig({
  modules: ['ui-stories'],
  uiStories: {
    route: '/docs/components',
  },
})
```

Runtime config exposes `public.uiStories.route` for link generation inside the UI.

## Writing a story

1. Create a file named like `MyWidget.story.vue` next to your component (any depth under `srcDir`).
2. Export **`storyMeta`** from a `<script lang="ts">` block (build-time metadata).
3. Use **`UIStoriesStory`** as the root and **`UIStoriesVariant`** for each example block.

Minimal example:

```vue
<script lang="ts">
export const storyMeta = {
  name: 'My widget',
  directory: ['Components'],
  description: 'Short description for the panel.',
  tags: ['Widget'],
}
</script>

<script setup lang="ts">
import MyWidget from './MyWidget.vue'
</script>

<template>
  <UIStoriesStory>
    <UIStoriesVariant title="Default">
      <MyWidget />
    </UIStoriesVariant>
  </UIStoriesStory>
</template>
```

### Story metadata (`storyMeta`)

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Title in the sidebar. |
| `directory` | yes | Folder segments for grouping (e.g. `['Components', 'Forms']`). |
| `description` | no | String or array of paragraphs in the content panel. |
| `figma` | no | URL shown as a Figma link. |
| `tags` | no | Labels for search/filtering. |

### Interactive controls

Use **`useControls`** in `<script setup>` to drive props from the controls panel (`text`, `boolean`, `select`):

```ts
import { useControls } from 'ui-stories/runtime/utils'

const controls = useControls({
  label: { type: 'text', default: 'Hello' },
  disabled: { type: 'boolean', default: false },
  size: {
    type: 'select',
    options: ['sm', 'md', 'lg'],
    default: 'md',
  },
})
```

Bind `controls.label.value`, `controls.size.value`, etc. in your template.

### Story URL

Each file gets an id from its path: slashes become `--`, and the `.story.vue` suffix is removed.

Example: `app/components/Badge.story.vue` → id `components--Badge` →  
**`/stories/components--Badge`** (with default `route`).

## Module behavior

- Registers runtime components with the **`UIStories`** prefix (e.g. `UIStoriesStory`, `UIStoriesVariant`, `UIStoriesSidebar`).
- Ignores `*.story.vue` in Nuxt’s component auto-import scan so they are only used as stories.
- Injects shared UI styles (`uis.css`) and theme CSS variables (`--uis-*`).

## Development (this repo)

```bash
pnpm install
pnpm run prepack    # build the module into dist/
pnpm run play-dev   # playground dev server
```
