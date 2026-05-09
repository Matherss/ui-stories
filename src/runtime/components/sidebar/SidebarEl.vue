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
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #475569;
  text-decoration: none;
  background: transparent;

  transition: background .2s ease-in-out;
}

.uis-sidebar-el--active {
  background: #F7F7F7;
}
</style>
