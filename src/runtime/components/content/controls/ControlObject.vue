<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
  }>(),
  { title: '' },
)
</script>

<template>
  <section class="uis-control-object">
    <h2 v-if="title" class="uis-control-object-title">{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.uis-control-object {
  background: #fff;
  border: 1px solid var(--uis-border, #e2e8f0);
  border-radius: 20px;
  padding: 20px 22px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 4%);
}

.uis-control-object-title {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}
</style>
