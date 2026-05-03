<script setup>
const props = defineProps({
  stretch: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="uis-block" :class="{ 'uis-block--stretch': props.stretch }">
    <slot />
  </div>
</template>

<style scoped>
.uis-block {
  padding: 24px;
  border-radius: 32px;
  background: var(--uis-surface);
}

.uis-block--stretch {
  flex: 1;
}
</style>