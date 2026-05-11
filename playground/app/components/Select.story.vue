<script lang="ts">
import type { StoryMeta } from '../../../src/types/story-meta'

export const storyMeta: StoryMeta = {
  name: 'Select',
  directory: ['Components'],
  description: ['Select with options driven by the object control (JSON).'],
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Select from './Select.vue'
import type { SelectOption } from './Select.vue'
import { useControls } from '../../../src/runtime/utils'

const controls = useControls({
  options: {
    type: 'object',
    default: {
      options: [
        { value: 'ny', label: 'New York' },
        { value: 'la', label: 'Los Angeles' },
      ],
    } as Record<string, unknown>,
  },
})

const selected = ref('')

const selectOptions = computed((): SelectOption[] => {
  const doc = controls.options.value as Record<string, unknown>
  const list = doc.options
  if (!Array.isArray(list))
    return []
  return list
    .filter(
      (x): x is Record<string, unknown> =>
        typeof x === 'object' && x !== null && 'value' in x && 'label' in x,
    )
    .map((x) => ({
      value: String(x.value),
      label: String(x.label),
      disabled: Boolean(x.disabled),
    }))
})
</script>

<template>
  <UIStoriesStory>
    <UIStoriesVariant title="Default">
      <Select v-model="selected" :options="selectOptions" />
      <p class="meta">
        value: {{ selected || '—' }}
      </p>
    </UIStoriesVariant>
  </UIStoriesStory>
</template>

<style scoped>
.meta {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: rgb(0 0 0 / 55%);
}
</style>
