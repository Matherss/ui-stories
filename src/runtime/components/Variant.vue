<template>
  <div class="uis-variant">
    <div class="uis-variant-header">
      <h3 v-if="$slots.title || title" class="uis-variant-title">
        <slot name="title">{{ title }}</slot>
      </h3>
      
      <div class="uis-variant-tools">
        <div class="uis-variant-align" role="group" aria-label="Preview content alignment">
          <div class="uis-variant-align-group" role="group" aria-label="Horizontal align">
            <button
              type="button"
              class="uis-variant-mini"
              :class="{ 'uis-variant-mini--active': previewJustify === 'flex-start' }"
              :aria-pressed="previewJustify === 'flex-start'"
              title="Align left"
              @click="previewJustify = 'flex-start'"
            >
              L
            </button>
            <button
              type="button"
              class="uis-variant-mini"
              :class="{ 'uis-variant-mini--active': previewJustify === 'center' }"
              :aria-pressed="previewJustify === 'center'"
              title="Align center"
              @click="previewJustify = 'center'"
            >
              C
            </button>
            <button
              type="button"
              class="uis-variant-mini"
              :class="{ 'uis-variant-mini--active': previewJustify === 'flex-end' }"
              :aria-pressed="previewJustify === 'flex-end'"
              title="Align right"
              @click="previewJustify = 'flex-end'"
            >
              R
            </button>
          </div>
          <div class="uis-variant-align-group" role="group" aria-label="Vertical align">
            <button
              type="button"
              class="uis-variant-mini"
              :class="{ 'uis-variant-mini--active': previewAlign === 'flex-start' }"
              :aria-pressed="previewAlign === 'flex-start'"
              title="Align top"
              @click="previewAlign = 'flex-start'"
            >
              T
            </button>
            <button
              type="button"
              class="uis-variant-mini"
              :class="{ 'uis-variant-mini--active': previewAlign === 'center' }"
              :aria-pressed="previewAlign === 'center'"
              title="Align middle"
              @click="previewAlign = 'center'"
            >
              M
            </button>
            <button
              type="button"
              class="uis-variant-mini"
              :class="{ 'uis-variant-mini--active': previewAlign === 'flex-end' }"
              :aria-pressed="previewAlign === 'flex-end'"
              title="Align bottom"
              @click="previewAlign = 'flex-end'"
            >
              B
            </button>
          </div>
        </div>
        <label class="uis-variant-pad" aria-label="Preview padding">
          <span class="uis-variant-pad-label">P</span>
          <input
            v-model.number="previewPadding"
            class="uis-variant-pad-input"
            type="number"
            inputmode="numeric"
            min="0"
            max="120"
            step="1"
          >
        </label>
      </div>
      <div class="uis-variant-size-controls">
        <div class="uis-variant-presets" role="group" aria-label="Preview width presets">
          <button
            v-for="w in PRESET_WIDTHS"
            :key="w"
            type="button"
            class="uis-variant-preset"
            :class="[{ 'uis-variant-preset--active': previewWidth === w }]"
            :aria-pressed="previewWidth === w"
            @click="setPresetWidth(w)"
          >
            {{ w }}
          </button>
  
          <button class="uis-variant-preset" @click="setPresetWidth(999999)">Max</button>
        </div>
        <span v-if="previewSizeLabel" class="uis-variant-size">
          {{ previewSizeLabel }}
        </span>
      </div>
    </div>

    <div
      ref="previewEl"
      class="uis-variant-preview"
      aria-label="Resizable preview area"
      :style="previewStyle"
    >
      <div class="uis-variant-preview-inner" :style="previewInnerStyle">
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
const previewPadding = ref(0)
const previewJustify = ref<'flex-start' | 'center' | 'flex-end'>('center')
const previewAlign = ref<'flex-start' | 'center' | 'flex-end'>('center')

const PRESET_WIDTHS = computed(() => {
  return [320, 768, 1024].filter(w => w <= previewMeasuredWidth.value)
})

const { width: previewMeasuredWidth, height: previewMeasuredHeight } = useElementSize(previewEl)

const previewStyle = computed(() => {
  return {
    width: previewWidth.value ? `${previewWidth.value}px` : '100%',
    height: previewHeight.value ? `${previewHeight.value}px` : '200px',
  }
})

const previewInnerStyle = computed(() => {
  const p = Number.isFinite(previewPadding.value) ? previewPadding.value : 10
  return {
    padding: `${Math.max(0, Math.round(p))}px`,
    justifyContent: previewJustify.value,
    alignItems: previewAlign.value,
  }
})

const previewSizeLabel = computed(() => {
  const w = Math.round(previewMeasuredWidth.value)
  const h = Math.round(previewMeasuredHeight.value)
  if (w === undefined || h === undefined || isNaN(w) || isNaN(h))
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
      const nextW = Math.max(20, startW + dx)
      previewWidth.value = Math.min(Math.round(nextW), maxW)
    }
    if (axis === 'y') {
      const nextH = Math.max(20, startH + dy)
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
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.uis-variant-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
  row-gap: 24px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
.uis-variant-size-controls {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}
.uis-variant-presets {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.uis-variant-tools {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.uis-variant-align {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.uis-variant-align-group {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.uis-variant-mini {
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  line-height: normal;

  transition: background 0.15s ease-in-out, color 0.15s ease-in-out;
}

.uis-variant-mini:hover {
  background: #EFF0F2;
  color: #334155;
}

.uis-variant-mini--active, .uis-variant-mini--active:hover {
  background: #e0f2fe;
  color: #0369a1;
}

.uis-variant-pad {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.uis-variant-pad-label {
  display: flex;
  font-size: 11px;
  line-height: 1;
  padding: 4px;
  font-weight: 700;
  color: #64748b;
  user-select: none;
}

.uis-variant-pad-input {
  width: 30px;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  color: #334155;
}

.uis-variant-preset {
  max-width: fit-content;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
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

.uis-variant-size {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 4px 8px;
  border-radius: 8px;
  line-height: normal;
}

.uis-variant-preview {
  overflow: auto;
  max-height: min(70dvh, 720px);
  width: 100%;
  height: 200px;
  box-sizing: border-box;
  border-radius: 12px;
  position: relative;
  padding: 12px;
}

.uis-variant-preview-inner {
  position: absolute;
  inset: 12px;
  width: auto;
  height: auto;
  padding: 0;
  min-height: 0;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  overflow: hidden;
}

.uis-variant-resize-handle {
  position: absolute;
  padding: 0;
  border: none;
  background: transparent;
}

.uis-variant-resize-handle--right {
  top: 10px;
  right: 2px;
  bottom: 2px;
  width: 10px;
  border-radius: 8px 8px 16px 0px;
  cursor: ew-resize;
  background: rgb(148 163 184 / 18%);
  --uis-resize-cut: 10px;
  /* Cut bottom-left corner (45deg) to meet bottom handle */
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    var(--uis-resize-cut) 100%,
    0 calc(100% - var(--uis-resize-cut))
  );
}

.uis-variant-resize-handle--right:hover {
  background: rgb(148 163 184 / 30%);
}

.uis-variant-resize-handle--bottom {
  left: 10px;
  right: 2px;
  bottom: 2px;
  height: 10px;
  border-radius: 8px 0px 16px 8px;
  cursor: ns-resize;
  background: rgb(148 163 184 / 18%);
  --uis-resize-cut: 10px;
  /* Cut top-right corner (45deg) to meet right handle */
  clip-path: polygon(
    0 0,
    calc(100% - var(--uis-resize-cut)) 0,
    100% var(--uis-resize-cut),
    100% 100%,
    0 100%
  );
}

.uis-variant-resize-handle--bottom:hover {
  background: rgb(148 163 184 / 30%);
}

.uis-variant-controls {
  padding: 16px;
}
</style>
