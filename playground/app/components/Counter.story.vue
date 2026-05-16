<script lang="ts">
import type { StoryMeta } from '../../../src/types/story-meta'

export const storyMeta: StoryMeta = {
  name: 'Counter',
  directory: ['Components', 'test'],
  description: ['A counter component with increment and decrement buttons.'],
}
</script>

<script setup lang="ts">
import Counter from './Counter.vue'
import { useControls } from '../../../src/runtime/utils'

const controls = useControls({
  count: { type: 'number', default: 0 },
})
</script>

<template>
  <UIStoriesStory>
    <UIStoriesVariant title="Default">
      <Counter v-model="controls.count.value" />
    </UIStoriesVariant>
  </UIStoriesStory>
</template>