<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    items: string[]
  }>(),
  { title: 'Description' },
)
</script>

<template>
  <section v-if="items.length" class="uis-content-description">
    <h2 class="uis-content-description-title">{{ title }}</h2>
    <ul class="uis-content-description-list">
      <li v-for="(line, i) in items" :key="i">
        {{ line }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.uis-content-description-title {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

.uis-content-description-list {
  margin: 0;
  padding-left: 20px;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}
</style>
