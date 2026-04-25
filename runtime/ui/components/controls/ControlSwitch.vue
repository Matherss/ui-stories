<template>
  <label class="uis-control uis-control--switch">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="uis-switch__track">
      <span class="uis-switch__thumb" />
    </span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
});
defineEmits(['update:modelValue']);
</script>

