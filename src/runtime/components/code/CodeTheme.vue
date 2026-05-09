<script setup lang="ts">
import {
  UISHIKI_THEME_OPTIONS,
  type UIShikiTheme,
} from '../../utils/shiki-highlight'

const shikiTheme = defineModel<UIShikiTheme>('shikiTheme', { required: true })
</script>
<template>
  <div class="uis-codeblock-theme-btns">
    <button
      v-for="opt in UISHIKI_THEME_OPTIONS"
      :key="opt.id"
      type="button"
      class="uis-codeblock-theme-btn"
      :class="{ 'uis-codeblock-theme-btn--active': shikiTheme === opt.id }"
      :aria-pressed="shikiTheme === opt.id"
      @click="shikiTheme = opt.id"
    >
      {{ opt.label }}
    </button>
  </div>
  </template>

<style scoped>
.uis-codeblock-theme-btns {
  display: flex;
}

.uis-codeblock-theme-btn {
  color: var(--uis-text);
  font-family: var(--uis-font-sans);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  width: fit-content;
  padding: 8px 18px;
  
  border-radius: 8px;
  border: none;
  
  cursor: pointer;

  transition: background 0.2s ease-in-out;
}

.uis-codeblock-theme-btn:hover {
  color: #334155;
}

.uis-codeblock-theme-btn--active {
  background: #fff;
}
</style>