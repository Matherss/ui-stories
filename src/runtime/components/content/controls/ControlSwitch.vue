<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

defineProps<{
  id: string
  label: string
}>()
</script>

<template>
  <div class="uis-control-field uis-control-field--switch-row">
    <label class="uis-control-field-label" :for="id">{{ label }}</label>
    <label class="uis-control-switch" :for="id">
      <input
        :id="id"
        v-model="model"
        type="checkbox"
        class="uis-control-switch-input"
      >
      <span class="uis-control-switch-ui" aria-hidden="true" />
    </label>
  </div>
</template>

<style scoped>
.uis-control-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.uis-control-field--switch-row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.uis-control-field-label {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.uis-control-switch {
  position: relative;
  width: 44px;
  height: 26px;
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
  background: #e2e8f0;
  border-radius: 999px;
  transition: background 0.15s ease;
}

.uis-control-switch-ui::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgb(15 23 42 / 15%);
  transition: transform 0.15s ease;
}

.uis-control-switch-input:checked + .uis-control-switch-ui {
  background: #38bdf8;
}

.uis-control-switch-input:checked + .uis-control-switch-ui::after {
  transform: translateX(18px);
}
</style>
