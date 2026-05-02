<script setup lang="ts">
defineProps<{
  to: string
  active?: boolean
  paddingLeft?: string
}>()
</script>

<template>
  <NuxtLink
    class="uis-sidebar-el"
    :class="{ 'uis-sidebar-el--active': active }"
    :style="paddingLeft ? { paddingLeft } : undefined"
    :to="to"
  >
    <slot />
  </NuxtLink>
</template>

<style scoped>
.uis-sidebar-el {
  display: block;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 14px;
  color: #475569;
  text-decoration: none;
}

.uis-sidebar-el:hover {
  background: #f8fafc;
}

.uis-sidebar-el--active {
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 500;
}
</style>
