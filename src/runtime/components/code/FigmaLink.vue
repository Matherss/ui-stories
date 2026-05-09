<script setup lang="ts">
withDefaults(
  defineProps<{
    href: string
    label?: string
  }>(),
  { label: 'Figma' },
)
</script>

<template>
  <a
    class="uis-figma-link"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ label }}
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.16667 7.5L11.6667 10L9.16667 12.5M10 2.5C16 2.5 17.5 4 17.5 10C17.5 16 16 17.5 10 17.5C4 17.5 2.5 16 2.5 10C2.5 4 4 2.5 10 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
</template>

<style scoped>
.uis-figma-link {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  font-weight: 400;
  color: var(--uis-text);
  text-decoration: none;
}

.uis-figma-link:hover {
  color: var(--uis-accent-text);
}
</style>
