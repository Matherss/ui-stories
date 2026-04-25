<template>
  <input
    class="uis-control uis-control--input"
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
});
defineEmits(['update:modelValue']);
</script>

