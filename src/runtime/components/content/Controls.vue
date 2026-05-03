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

const fieldControls = computed(() =>
  controlsList.value.filter(c => c.type === 'select' || c.type === 'text'),
)

const switchControls = computed(() =>
  controlsList.value.filter(c => c.type === 'boolean'),
)

const hasAnyControls = computed(
  () => fieldControls.value.length > 0 || switchControls.value.length > 0,
)

function setControlValue(control: ControlItem, value: unknown) {
  ;(control as { value: unknown }).value = value
}
</script>

<template>
  <div v-if="hasAnyControls" class="uis-controls">
    <div class="uis-controls-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5.00001 10C4.55798 10 4.13406 9.82441 3.8215 9.51185C3.50894 9.19929 3.33334 8.77537 3.33334 8.33334C3.33334 7.89132 3.50894 7.46739 3.8215 7.15483C4.13406 6.84227 4.55798 6.66668 5.00001 6.66668M5.00001 10C5.44204 10 5.86596 9.82441 6.17852 9.51185C6.49108 9.19929 6.66668 8.77537 6.66668 8.33334C6.66668 7.89132 6.49108 7.46739 6.17852 7.15483C5.86596 6.84227 5.44204 6.66668 5.00001 6.66668M5.00001 10V16.6667M5.00001 6.66668V3.33334M10 15C9.55798 15 9.13406 14.8244 8.8215 14.5119C8.50894 14.1993 8.33334 13.7754 8.33334 13.3333C8.33334 12.8913 8.50894 12.4674 8.8215 12.1548C9.13406 11.8423 9.55798 11.6667 10 11.6667M10 15C10.442 15 10.866 14.8244 11.1785 14.5119C11.4911 14.1993 11.6667 13.7754 11.6667 13.3333C11.6667 12.8913 11.4911 12.4674 11.1785 12.1548C10.866 11.8423 10.442 11.6667 10 11.6667M10 15V16.6667M10 11.6667V3.33334M15 7.50001C14.558 7.50001 14.1341 7.32442 13.8215 7.01185C13.5089 6.69929 13.3333 6.27537 13.3333 5.83334C13.3333 5.39132 13.5089 4.96739 13.8215 4.65483C14.1341 4.34227 14.558 4.16668 15 4.16668M15 7.50001C15.442 7.50001 15.866 7.32442 16.1785 7.01185C16.4911 6.69929 16.6667 6.27537 16.6667 5.83334C16.6667 5.39132 16.4911 4.96739 16.1785 4.65483C15.866 4.34227 15.442 4.16668 15 4.16668M15 7.50001V16.6667M15 4.16668V3.33334" stroke="#3A3B3E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h2 class="uis-controls-title">Controls</h2>
    </div>
    <div class="uis-controls-grid">
      <div class="uis-controls-col uis-controls-col--fields">
        <template v-for="control in fieldControls" :key="control.name">
          <UIStoriesControlSelect
            v-if="control.type === 'select'"
            :id="`uis-ctl-${control.name}`"
            :label="control.name"
            :options="control.options ?? []"
            :model-value="control.value as string"
            @update:model-value="setControlValue(control, $event)"
          />

          <UIStoriesControlText
            v-else-if="control.type === 'text'"
            :id="`uis-ctl-${control.name}`"
            :label="control.name"
            :model-value="String(control.value ?? '')"
            @update:model-value="setControlValue(control, $event)"
          />
        </template>
      </div>

      <div class="uis-controls-col uis-controls-col--switches">
        <template v-for="control in switchControls" :key="control.name">
          <UIStoriesControlSwitch
            :id="`uis-ctl-${control.name}`"
            :label="control.name"
            :model-value="Boolean(control.value)"
            @update:model-value="setControlValue(control, $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.uis-controls-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px 32px;
  align-items: start;
}

.uis-controls-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.uis-controls-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.uis-controls-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  font-family: var(--uis-font-sans, 'Commissioner', sans-serif);
}
</style>
