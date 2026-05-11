<script setup lang="ts">
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    options: SelectOption[]
    disabled?: boolean
    placeholder?: string
  }>(),
  { placeholder: 'Select…' },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <select v-model="model" class="select" :disabled="disabled">
    <option value="" disabled class="select__ph">
      {{ placeholder }}
    </option>
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :disabled="opt.disabled"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<style scoped>
.select {
  box-sizing: border-box;
  min-width: 160px;
  min-height: 36px;
  padding: 6px 28px 6px 10px;
  border: 1px solid rgb(0 0 0 / 23%);
  border-radius: 4px;
  background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='rgb(0 0 0 / 54%)' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
    right 6px center no-repeat;
  font-size: 0.875rem;
  color: rgb(0 0 0 / 87%);
  cursor: pointer;
  appearance: none;
}

.select:focus-visible {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 1px #1976d2;
}

.select:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.select__ph {
  color: rgb(0 0 0 / 45%);
}
</style>
