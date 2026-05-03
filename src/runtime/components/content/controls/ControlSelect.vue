<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  id: string
  label: string
  options: string[]
}>()
</script>

<template>
  <div class="uis-control-field uis-control-field--control-row">
    <div class="uis-control-field-label-wrap">
      <label class="uis-control-field-label" :for="id">{{ label }}</label>
    </div>
    <select :id="id" v-model="model" class="uis-control-select-input">
      <option
        v-for="option in options"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.uis-control-field {
  min-width: 0;
}

/* Inline-flex row: label column + control */
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

.uis-control-select-input {
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  padding: 8px 32px 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: var(--uis-bg, #f7f7f7);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M10 4.5 13.5 8h-7L10 4.5z' fill='%233A3B3E'/%3E%3Cpath d='M10 15.5 6.5 12h7l-3.5 3.5z' fill='%233A3B3E'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px 20px;
  font-family: var(--uis-font-sans, 'Commissioner', sans-serif);
  font-size: 14px;
  font-weight: 400;
  color: #3a3b3e;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.uis-control-select-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--uis-accent-border, #7dd3fc);
}

.uis-control-select-input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--uis-accent-border, #7dd3fc);
}
</style>
