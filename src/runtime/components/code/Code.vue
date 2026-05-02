<script setup lang="ts">
import { computed, inject, ref, watch, type ComputedRef } from 'vue'
import type { StoryMeta } from '../../../types/story-meta'
import { uisVariantSourcesKey } from '../../inject-keys'
import {
  UISHIKI_THEME_OPTIONS,
  highlightUiStoriesSnippet,
  type UIShikiTheme,
} from '../../utils/shiki-highlight'

const SHIKI_THEME_STORAGE_KEY = 'uis:shiki-theme'

function readStoredShikiTheme(): UIShikiTheme {
  if (typeof window === 'undefined')
    return 'vitesse-light'
  try {
    const raw = localStorage.getItem(SHIKI_THEME_STORAGE_KEY)
    if (raw && UISHIKI_THEME_OPTIONS.some(o => o.id === raw))
      return raw as UIShikiTheme
  }
  catch {
    /* ignore */
  }
  return 'vitesse-light'
}

function persistShikiTheme(theme: UIShikiTheme) {
  if (typeof window === 'undefined')
    return
  try {
    localStorage.setItem(SHIKI_THEME_STORAGE_KEY, theme)
  }
  catch {
    /* ignore */
  }
}

const metaRef = inject<ComputedRef<StoryMeta | null>>('uis-story-meta')
const meta = computed(() => metaRef?.value ?? null)

const variantSources = inject<ComputedRef<string[]>>(uisVariantSourcesKey)

const snippet = computed(() => {
  const list = variantSources?.value ?? []
  return list.filter(Boolean).join('\n\n')
})

const hasSnippet = computed(() => !!snippet.value.trim())

const highlightedHtml = ref('')
const highlightError = ref(false)
const shikiTheme = ref<UIShikiTheme>(readStoredShikiTheme())

watch(shikiTheme, persistShikiTheme)

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

watch(
  [snippet, shikiTheme],
  async ([s, theme]) => {
    highlightError.value = false
    const t = s.trim()
    if (!t) {
      highlightedHtml.value = ''
      return
    }
    if (typeof window === 'undefined') {
      highlightedHtml.value = `<pre class="uis-code-fallback"><code>${escapeHtml(t)}</code></pre>`
      return
    }
    try {
      highlightedHtml.value = await highlightUiStoriesSnippet(t, theme)
    }
    catch (e) {
      console.error('[ui-stories] Shiki highlight failed', e)
      highlightError.value = true
      highlightedHtml.value = `<pre class="uis-code-fallback"><code>${escapeHtml(t)}</code></pre>`
    }
  },
  { immediate: true },
)
</script>

<template>
  <aside class="uis-code">
    <div class="uis-code-head">
      <p class="uis-code-lead">
        <span v-if="hasSnippet" class="uis-code-variant">Code</span>
        <span v-else class="uis-code-hint">No code in story</span>
      </p>
      <UIStoriesFigmaLink v-if="meta?.figma" :href="meta.figma" />
    </div>

    <UIStoriesCodeblock
      v-model:shiki-theme="shikiTheme"
      :highlighted-html="highlightedHtml"
      :highlight-error="highlightError"
      :has-snippet="hasSnippet"
    />
  </aside>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap');
</style>

<style scoped>
.uis-code {
  width: 30dvw;
  flex-shrink: 0;
  height: 100dvh;
  padding: 20px 16px 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  border-left: 1px solid var(--uis-border, #e2e8f0);
}

.uis-code-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.uis-code-lead {
  margin: 0;
  min-width: 0;
  flex: 1;
}

.uis-code-variant {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.uis-code-hint {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
}
</style>
