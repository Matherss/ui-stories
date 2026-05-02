<script lang="ts">
import type { StoryMeta } from '../../../src/types/story-meta'

export const storyMeta: StoryMeta = {
  name: 'Badges',
  directory: ['Components'],
  figma: 'https://www.figma.com',
  description: [
    'Compact label for status or category.',
    'Several visual variants for different meanings.',
  ],
  tags: ['Badge', 'Status'],
}
</script>

<script setup lang="ts">
import Badge from './Badge.vue'
import { useControls } from '../../../src/runtime/utils'

const controls = useControls({
  variant: {
    type: 'select',
    options: ['default', 'success', 'warning', 'info'],
    default: 'default',
  },
})
</script>

<template>
  <UIStoriesStory>
    <UIStoriesVariant title="Default">
      <Badge variant="default">
        Draft
      </Badge>
    </UIStoriesVariant>

    <UIStoriesVariant title="Success">
      <Badge variant="success">
        Active
      </Badge>
    </UIStoriesVariant>

    <UIStoriesVariant title="Warning">
      <Badge variant="warning">
        Pending
      </Badge>
    </UIStoriesVariant>

    <UIStoriesVariant title="Info">
      <Badge variant="info">
        Beta
      </Badge>
    </UIStoriesVariant>

    <UIStoriesVariant title="Editable">
      <Badge :variant="controls.variant.value as 'default' | 'success' | 'warning' | 'info'">
        {{ controls.variant.value }}
      </Badge>
    </UIStoriesVariant>
  </UIStoriesStory>
</template>
