<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  id: string
  label: string
  options: string[]
}>()
</script>

<template>
  <div class="uis-control-field">
    <label class="uis-control-field-label" :for="id">{{ label }}</label>
    <select :id="id" v-model="model" class="uis-control-field-input">
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.uis-control-field-label {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.uis-control-field-input {
  width: 100%;
  border: none;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  color: #0f172a;
}
</style>
