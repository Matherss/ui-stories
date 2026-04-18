<template>
  <span class="ui-badge" :class="`ui-badge--${color}`" :style="badgeStyles">
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: 'gray' | 'green' | 'red' | 'blue' | 'yellow';
    badgeStyles?: Record<string, string>;
  }>(),
  { color: 'gray' },
);
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
}

.ui-badge--gray   { background: #f3f4f6; color: #374151; }
.ui-badge--green  { background: #dcfce7; color: #166534; }
.ui-badge--red    { background: #fee2e2; color: #991b1b; }
.ui-badge--blue   { background: #dbeafe; color: #1e40af; }
.ui-badge--yellow { background: #fef9c3; color: #854d0e; }
</style>
