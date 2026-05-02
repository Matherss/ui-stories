<script setup lang="ts">
import { computed, inject } from 'vue'

interface ControlItem {
  name: string
  value: unknown
  type: string
  options?: string[]
}

const controlsRaw = inject<Record<string, ControlItem>>('uis-controls')

const controlsList = computed(() => Object.values(controlsRaw ?? {}))

function setControlValue(control: ControlItem, value: unknown) {
  ;(control as { value: unknown }).value = value
}
</script>

<template>
  <UIStoriesControlObject v-if="controlsList.length" title="Controls">
    <div class="uis-controls-grid">
      <template v-for="control in controlsList" :key="control.name">
        <UIStoriesControlSelect
          v-if="control.type === 'select'"
          :id="`uis-ctl-${control.name}`"
          :label="control.name"
          :options="control.options ?? []"
          :model-value="control.value as string"
          @update:model-value="setControlValue(control, $event)"
        />

        <UIStoriesControlSwitch
          v-else-if="control.type === 'boolean'"
          :id="`uis-ctl-${control.name}`"
          :label="control.name"
          :model-value="Boolean(control.value)"
          @update:model-value="setControlValue(control, $event)"
        />

        <UIStoriesControlText
          v-else
          :id="`uis-ctl-${control.name}`"
          :label="control.name"
          :model-value="String(control.value ?? '')"
          @update:model-value="setControlValue(control, $event)"
        />
      </template>
    </div>
  </UIStoriesControlObject>
</template>

<style scoped>
.uis-controls-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 24px;
}

@media (max-width: 900px) {
  .uis-controls-grid {
    grid-template-columns: 1fr;
  }
}
</style>
