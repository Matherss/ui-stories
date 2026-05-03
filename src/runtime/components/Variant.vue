<template>
  <div class="uis-variant">
    <div class="uis-variant-header">
      <h3 v-if="$slots.title || title" class="uis-variant-title">
        <slot name="title">{{ title }}</slot>
      </h3>
      <span v-else class="uis-variant-title-spacer" />
      <div class="uis-variant-presets" role="group" aria-label="Preview width presets">
        <button
          v-for="w in PRESET_WIDTHS"
          :key="w"
          type="button"
          class="uis-variant-preset"
          :class="{ 'uis-variant-preset--active': previewWidth === w }"
          :aria-pressed="previewWidth === w"
          @click="setPresetWidth(w)"
        >
          {{ w }}
        </button>
      </div>
      <span v-if="previewSizeLabel" class="uis-variant-size">
        {{ previewSizeLabel }}
      </span>
    </div>

    <div
      ref="previewEl"
      class="uis-variant-preview"
      aria-label="Resizable preview area"
      :style="previewStyle"
    >
      <div class="uis-variant-preview-inner">
        <slot />
      </div>
      <button
        type="button"
        class="uis-variant-resize-handle uis-variant-resize-handle--right"
        aria-label="Resize preview width"
        @pointerdown.prevent="(e) => onResizeDown(e, 'x')"
      />
      <button
        type="button"
        class="uis-variant-resize-handle uis-variant-resize-handle--bottom"
        aria-label="Resize preview height"
        @pointerdown.prevent="(e) => onResizeDown(e, 'y')"
      />
    </div>

    <div v-if="$slots.controls" class="uis-variant-controls">
      <slot name="controls" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementSize, useEventListener } from '@vueuse/core'

const props = defineProps<{
  title?: string
}>()

const previewEl = ref<HTMLElement | null>(null)
const previewWidth = ref<number | null>(null)
const previewHeight = ref<number | null>(null)

const PRESET_WIDTHS = [320, 768, 1024, 1400] as const

const { width: previewMeasuredWidth, height: previewMeasuredHeight } = useElementSize(previewEl)

const previewStyle = computed(() => {
  return {
    width: previewWidth.value ? `${previewWidth.value}px` : undefined,
    height: previewHeight.value ? `${previewHeight.value}px` : undefined,
  }
})

const previewSizeLabel = computed(() => {
  const w = Math.round(previewMeasuredWidth.value)
  const h = Math.round(previewMeasuredHeight.value)
  if (!w || !h)
    return ''
  return `${w}×${h}`
})

function setPresetWidth(w: number) {
  const el = previewEl.value
  const parent = el?.parentElement
  const maxW = parent ? parent.clientWidth : Number.POSITIVE_INFINITY
  previewWidth.value = Math.min(w, maxW)
}

type ResizeAxis = 'x' | 'y'

function onResizeDown(e: PointerEvent, axis: ResizeAxis) {
  if (typeof window === 'undefined')
    return
  const el = previewEl.value
  if (!el)
    return

  const handle = e.currentTarget as HTMLElement | null
  handle?.setPointerCapture?.(e.pointerId)

  const startX = e.clientX
  const startY = e.clientY
  const startW = previewWidth.value ?? Math.round(previewMeasuredWidth.value) ?? 0
  const startH = previewHeight.value ?? Math.round(previewMeasuredHeight.value) ?? 0

  const parent = el.parentElement
  const maxW = parent ? parent.clientWidth : Number.POSITIVE_INFINITY

  const stopMove = useEventListener(window, 'pointermove', (ev: PointerEvent) => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY

    if (axis === 'x') {
      const nextW = Math.max(160, startW + dx)
      previewWidth.value = Math.min(Math.round(nextW), maxW)
    }
    if (axis === 'y') {
      const nextH = Math.max(96, startH + dy)
      previewHeight.value = Math.round(nextH)
    }
  })

  const stopUp = useEventListener(
    window,
    'pointerup',
    () => {
      stopMove()
      stopUp()
    },
    { once: true },
  )
}
</script>

<style scoped>
.uis-variant {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
}

.uis-variant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.uis-variant-presets {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.uis-variant-preset {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
}

.uis-variant-preset:hover {
  border-color: #cbd5e1;
  color: #334155;
}

.uis-variant-preset--active {
  border-color: #7dd3fc;
  background: #e0f2fe;
  color: #0369a1;
}

.uis-variant-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  min-width: 0;
}

.uis-variant-title-spacer {
  flex: 1;
}

.uis-variant-size {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 999px;
}

.uis-variant-preview {
  overflow: auto;
  max-height: min(70dvh, 720px);
  min-width: 160px;
  min-height: 96px;
  box-sizing: border-box;

  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  position: relative;
}

.uis-variant-preview-inner {
  padding: 24px;
  min-height: 100%;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.uis-variant-resize-handle {
  position: absolute;
  padding: 0;
  border: none;
  background: transparent;
}

.uis-variant-resize-handle--right {
  top: 10px;
  right: 4px;
  bottom: 28px;
  width: 10px;
  border-radius: 8px;
  cursor: ew-resize;
  background: rgb(148 163 184 / 18%);
}

.uis-variant-resize-handle--right:hover {
  background: rgb(148 163 184 / 30%);
}

.uis-variant-resize-handle--bottom {
  left: 10px;
  right: 28px;
  bottom: 4px;
  height: 10px;
  border-radius: 8px;
  cursor: ns-resize;
  background: rgb(148 163 184 / 18%);
}

.uis-variant-resize-handle--bottom:hover {
  background: rgb(148 163 184 / 30%);
}

.uis-variant-controls {
  padding: 16px;
}
</style>
