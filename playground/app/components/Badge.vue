<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'success' | 'warning' | 'info'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <span class="badge" :class="`badge--${props.variant}`">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 600;
  line-height: 1.4;
  border: 1px solid transparent;
}

.badge--default {
  background: #f1f5f9;
  color: #475569;
  border-color: #e2e8f0;
}

.badge--success {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

.badge--warning {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.badge--info {
  background: #dbeafe;
  color: #1e40af;
  border-color: #bfdbfe;
}
</style>
