<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  id: string
  label: string
}>()
</script>

<template>
  <div class="uis-control-field uis-control-field--control-row">
    <div class="uis-control-field-label-wrap">
      <label class="uis-control-field-label" :for="id">{{ label }}</label>
    </div>
    <input
      :id="id"
      v-model="model"
      type="text"
      class="uis-control-text-input"
    >
  </div>
</template>

<style scoped>
.uis-control-field {
  min-width: 0;
}

.uis-control-field--control-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  width: 100%;
  min-width: 0;
}

.uis-control-field-label-wrap {
  box-sizing: border-box;
  width: 128px;
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.uis-control-field-label {
  margin: 0;
  font-family: var(--uis-font-sans, 'Commissioner', sans-serif);
  font-size: 14px;
  font-weight: 400;
  color: #3a3b3e;
}

.uis-control-text-input {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: var(--uis-bg, #f7f7f7);
  font-family: var(--uis-font-sans, 'Commissioner', sans-serif);
  font-size: 14px;
  font-weight: 400;
  color: #3a3b3e;
}

.uis-control-text-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--uis-accent-border, #7dd3fc);
}

.uis-control-text-input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--uis-accent-border, #7dd3fc);
}
</style>
