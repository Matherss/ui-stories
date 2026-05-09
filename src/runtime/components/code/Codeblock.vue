<script setup lang="ts">
defineProps<{
  highlightedHtml: string
  highlightError: boolean
  hasSnippet: boolean
}>()

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
  overflow: auto;
}

.uis-codeblock-shiki-wrap {
  min-height: 120px;
  min-width: 0;
}

.uis-codeblock-shiki {
  min-width: 0;
  max-width: 100%;
}

.uis-codeblock-shiki :deep(pre.shiki) {
  margin: 0;
  padding: 14px 16px;
  font-size: 12px;
  line-height: 1.55;
  border-radius: 16px;
  /* Shiki inserts newlines between `<span class="line">` nodes; `pre` defaults to
     `white-space: pre`, which renders those as extra blank lines. Normalize
     whitespace and keep one visual row per `.line` via `display: block`. */
  white-space: normal;
  overflow-x: hidden;
  max-width: 100%;
  border: 1px solid rgb(15 23 42 / 6%);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-feature-settings: 'liga' 1, 'calt' 1;
}

.uis-codeblock-shiki :deep(pre.shiki code) {
  font-family: inherit;
  white-space: normal;
}

.uis-codeblock-shiki :deep(.line) {
  display: block;
  min-height: 1.55em;
  /* `white-space: normal` on `pre` collapses leading spaces to nothing; per-line
     `pre-wrap` keeps indentation and wraps long lines without a horizontal scrollbar. */
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
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
  overflow-x: hidden;
  max-width: 100%;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
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
