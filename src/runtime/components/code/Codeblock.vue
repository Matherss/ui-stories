<script setup lang="ts">
import {
  UISHIKI_THEME_OPTIONS,
  type UIShikiTheme,
} from '../../utils/shiki-highlight'

defineProps<{
  highlightedHtml: string
  highlightError: boolean
  hasSnippet: boolean
}>()

const shikiTheme = defineModel<UIShikiTheme>('shikiTheme', { required: true })
</script>

<template>
  <div class="uis-codeblock">
    <template v-if="hasSnippet">
      <div class="uis-codeblock-shiki-wrap">
        <div
          class="uis-codeblock-shiki"
          :class="{ 'uis-codeblock-shiki--error': highlightError }"
          v-html="highlightedHtml"
        />
      </div>
      <div class="uis-codeblock-theme-bar" role="group" aria-label="Code highlight theme">
        <span class="uis-codeblock-theme-label">Theme</span>
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
      </div>
    </template>
    <p v-else class="uis-codeblock-empty">
      Add variants to the story: Vue code <strong>inside</strong> each <code>&lt;UIStoriesVariant&gt;</code> (without the wrapper tags) appears here, in order.
    </p>
  </div>
</template>

<style scoped>
.uis-codeblock {
  position: relative;
  flex: 1;
  min-height: 0;
  background: #fff;
  border-radius: 20px;
  border: 1px solid var(--uis-border, #e2e8f0);
  overflow: auto;
}

.uis-codeblock-shiki-wrap {
  padding: 12px 8px 12px 12px;
  min-height: 120px;
}

.uis-codeblock-theme-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px 14px;
  border-top: 1px solid var(--uis-border, #e2e8f0);
  margin-top: 0;
}

.uis-codeblock-theme-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
}

.uis-codeblock-theme-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.uis-codeblock-theme-btn {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
}

.uis-codeblock-theme-btn:hover {
  border-color: #cbd5e1;
  color: #334155;
}

.uis-codeblock-theme-btn--active {
  border-color: #7dd3fc;
  background: #e0f2fe;
  color: #0369a1;
}

.uis-codeblock-shiki :deep(pre.shiki) {
  margin: 0;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 12px;
  line-height: 1.55;
  overflow-x: auto;
  border: 1px solid rgb(15 23 42 / 6%);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-feature-settings: 'liga' 1, 'calt' 1;
}

.uis-codeblock-shiki :deep(pre.shiki code) {
  font-family: inherit;
}

.uis-codeblock-shiki :deep(.line) {
  display: block;
  min-height: 1.55em;
}

.uis-codeblock-shiki--error :deep(pre.shiki) {
  border-color: rgb(248 113 113 / 35%);
}

.uis-codeblock-shiki :deep(pre.uis-code-fallback) {
  margin: 0;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  font-size: 12px;
  line-height: 1.55;
  overflow-x: auto;
  white-space: pre;
  border: 1px solid var(--uis-border, #e2e8f0);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-feature-settings: 'liga' 1, 'calt' 1;
}

.uis-codeblock-empty {
  margin: 0;
  padding: 24px 20px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.uis-codeblock-empty code {
  font-size: 12px;
  color: #0f172a;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
</style>
