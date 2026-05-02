<script setup lang="ts">
import { computed, inject, ref, type ComputedRef } from 'vue'
import type { StoryMeta } from '../../../types/story-meta'

const metaRef = inject<ComputedRef<StoryMeta | null>>('uis-story-meta')
const meta = computed(() => metaRef?.value ?? null)

const isDark = ref(false)
const showGrid = ref(false)

const descriptionItems = computed(() => {
  const d = meta.value?.description
  if (d == null || d === '')
    return []
  return Array.isArray(d) ? d : [d]
})

const tags = computed(() => meta.value?.tags ?? [])
</script>

<template>
  <div class="uis-content">
    <header v-if="meta" class="uis-content-head">
      <h1 class="uis-content-title">{{ meta.name }}</h1>
      <span v-for="tag in tags" :key="tag" class="uis-content-badge">
        {{ tag }}
      </span>
    </header>

    <div
      class="uis-canvas"
      :class="{
        'uis-canvas--dark': isDark,
        'uis-canvas--grid': showGrid,
      }"
    >
      <UIStoriesContentThemes v-model:is-dark="isDark" v-model:show-grid="showGrid" />

      <div class="uis-canvas-body">
        <slot />
      </div>

      <button type="button" class="uis-canvas-fs" title="Fullscreen">
        ⛶
      </button>
    </div>

    <UIStoriesContentDescription
      v-if="descriptionItems.length"
      :items="descriptionItems"
    />
  </div>
</template>

<style scoped>
.uis-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.uis-content-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.uis-content-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
}

.uis-content-badge {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 999px;
}

.uis-canvas {
  position: relative;
  background: #fff;
  border-radius: 20px;
  border: 1px solid var(--uis-border, #e2e8f0);
  min-height: 280px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 4%);
}

.uis-canvas--dark {
  background: #0f172a;
  border-color: #1e293b;
}

.uis-canvas--grid .uis-canvas-body {
  background-image:
    linear-gradient(rgb(148 163 184 / 25%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(148 163 184 / 25%) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Slot children (UIStoriesVariant); without :deep() scoped styles do not reach their root */
.uis-canvas--dark :deep(.uis-variant) {
  background: #1e293b;
  border-color: #334155;
}

.uis-canvas--dark :deep(.uis-variant-header) {
  background: #0f172a;
  border-bottom-color: #334155;
}

.uis-canvas--dark :deep(.uis-variant-title) {
  color: #f1f5f9;
}

.uis-canvas--dark :deep(.uis-variant-code-btn) {
  border-color: #475569;
  background: #1e293b;
  color: #94a3b8;
}

.uis-canvas--dark :deep(.uis-variant-code-btn:hover) {
  border-color: #64748b;
  color: #cbd5e1;
}

.uis-canvas--dark :deep(.uis-variant-code-btn--active) {
  border-color: #0369a1;
  background: #0c4a6e;
  color: #7dd3fc;
}

.uis-canvas--dark :deep(.uis-variant-preview) {
  background: #1e293b;
}

.uis-canvas--dark :deep(.uis-variant-controls) {
  background: #0f172a;
  border-top-color: #334155;
}

.uis-canvas--grid :deep(.uis-variant-preview) {
  background: transparent;
}

.uis-canvas--dark :deep(.uis-content-themes .uis-icon-btn) {
  background: rgb(30 41 59 / 90%);
  color: #94a3b8;
}

.uis-canvas--dark :deep(.uis-content-themes .uis-icon-btn--on) {
  background: #1e3a5f;
  color: #7dd3fc;
}

.uis-canvas-body {
  padding: 56px 24px 48px;
  border-radius: 20px;
  min-height: 220px;
}

.uis-canvas-fs {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: rgb(248 250 252 / 90%);
  color: #64748b;
  cursor: pointer;
}

.uis-canvas--dark .uis-canvas-fs {
  background: rgb(30 41 59 / 90%);
  color: #94a3b8;
}
</style>
