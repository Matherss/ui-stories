<script setup lang="ts">
const search = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
  }>(),
  { placeholder: 'Search' },
)
</script>

<template>
  <div class="uis-search">
    <span class="uis-search-icon" aria-hidden="true">⌕</span>
    <input
      v-model="search"
      class="uis-search-input"
      type="search"
      :placeholder="placeholder"
      autocomplete="off"
    >
  </div>
</template>

<style scoped>
.uis-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.uis-search-icon {
  color: #94a3b8;
  font-size: 18px;
  line-height: 1;
}

.uis-search-input {
  flex: 1;
  border: none;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: #0f172a;
}

.uis-search-input::placeholder {
  color: #94a3b8;
}
</style>
