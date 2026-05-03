<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

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
    <div class="uis-control-field-value">
      <label class="uis-control-switch" :for="id">
        <input
          :id="id"
          v-model="model"
          type="checkbox"
          class="uis-control-switch-input"
        >
        <span class="uis-control-switch-ui" aria-hidden="true">
          <span class="uis-control-switch-ui-inner" />
        </span>
      </label>
    </div>
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

.uis-control-field-value {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  height: 20px;
}

.uis-control-switch {
  position: relative;
  width: 32px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
}

.uis-control-switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.uis-control-switch-ui {
  position: absolute;
  inset: 0;
  background: rgba(2, 8, 17, 0.08);
  border-radius: 999px;
  transition: background 0.15s ease;
}

.uis-control-switch-ui-inner {
  position: absolute;
  inset: 3px;
  display: block;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 256px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.14);
  transition: inset-inline-start 0.15s linear;
}
.uis-control-switch-input:checked + .uis-control-switch-ui {
  background: var(--uis-primary, #3b82f6);
}

.uis-control-switch-input:checked + .uis-control-switch-ui .uis-control-switch-ui-inner {
  inset-inline-start: calc(100% - 17px);
}

.uis-control-switch-input:focus-visible + .uis-control-switch-ui {
  box-shadow: 0 0 0 2px var(--uis-accent-border, #7dd3fc);
}
</style>
