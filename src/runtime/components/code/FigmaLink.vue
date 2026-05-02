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
    <span class="uis-figma-link-icon" aria-hidden="true">↗</span>
  </a>
</template>

<style scoped>
.uis-figma-link {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--uis-border, #e2e8f0);
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
}

.uis-figma-link:hover {
  background: #f8fafc;
}

.uis-figma-link-icon {
  font-size: 12px;
  color: #94a3b8;
}
</style>
