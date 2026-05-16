<script lang="ts">
import type { StoryMeta } from '../../../src/types/story-meta'

export const storyMeta: StoryMeta = {
  name: 'Buttons',
  directory: ['Components', 'ui'],
  figma: 'https://www.figma.com',
  description: [
    'Primary actions in the interface.',
    'Sizes and variants from the design system are supported.',
  ],
}
</script>

<script setup lang="ts">
import Button from './Button.vue'
import { useControls } from '../../../src/runtime/utils'

const controls = useControls({
  variant: { type: 'select', options: ['primary', 'secondary'], default: 'primary' },
  isDisabled: { type: 'boolean', default: false },
  label: { type: 'text', default: 'Button' },
  number: { type: 'number', default: 10 },
  object: { type: 'object', default: { name: 'John Doe', age: 30 } },
})
</script>

<template>
  <UIStoriesStory>
    <UIStoriesVariant title="Primary">
      <Button variant="primary">
        Primary Button
      </Button>
    </UIStoriesVariant>

    <UIStoriesVariant title="Secondary">
      <Button variant="secondary">
        Secondary Button
      </Button>
    </UIStoriesVariant>

    <UIStoriesVariant title="Editable">
      <Button :variant="controls.variant.value" :is-disabled="controls.isDisabled.value">
        {{ controls.label.value }}
      </Button>
    </UIStoriesVariant>
  </UIStoriesStory>
</template>
