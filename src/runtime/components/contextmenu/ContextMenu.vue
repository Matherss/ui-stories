<template>
  <div class="uis-contextmenu-trigger" @contextmenu="onContextMenu">
    <slot name="trigger" />
  </div>

  <Teleport to="body">
    <div
      class="uis-contextmenu-layer"
      :data-open="open ? 'true' : 'false'"
      @contextmenu.prevent
    >
      <Transition name="uis-contextmenu-pop" appear>
        <div
          v-if="open"
          ref="menuEl"
          class="uis-contextmenu"
          role="menu"
          tabindex="-1"
          :style="menuStyle"
          @keydown.esc.prevent.stop="close()"
        >
          <slot />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'

const props = withDefaults(defineProps<{
  disabled?: boolean
  offset?: number
  viewportPadding?: number
}>(), {
  disabled: false,
  offset: 6,
  viewportPadding: 8,
})

const open = ref(false)
const menuEl = useTemplateRef('menuEl')

const pos = ref({ x: 0, y: 0 })

const menuStyle = computed(() => ({
  left: `${pos.value.x}px`,
  top: `${pos.value.y}px`,
}))

function close() {
  open.value = false
}

function clampToViewport() {
  const el = menuEl.value
  if (!el)
    return

  const pad = props.viewportPadding
  const rect = el.getBoundingClientRect()

  const maxX = window.innerWidth - rect.width - pad
  const maxY = window.innerHeight - rect.height - pad

  pos.value = {
    x: Math.max(pad, Math.min(pos.value.x, maxX)),
    y: Math.max(pad, Math.min(pos.value.y, maxY)),
  }
}

async function openAt(clientX: number, clientY: number) {
  open.value = true
  pos.value = { x: clientX + props.offset, y: clientY + props.offset }

  await nextTick()
  clampToViewport()

  menuEl.value?.focus?.()
}

async function onContextMenu(e: MouseEvent) {
  if (props.disabled)
    return

  e.preventDefault()
  e.stopPropagation()

  await openAt(e.clientX, e.clientY)
}

const stopPointerDown = useEventListener(
  window,
  'pointerdown',
  (e) => {
    if (!open.value)
      return

    const target = e.target as Node | null
    if (!target)
      return

    if (menuEl.value?.contains(target))
      return

    close()
  },
  { capture: true },
)

const stopScroll = useEventListener(
  window,
  'scroll',
  () => {
    if (open.value)
      close()
  },
  { capture: true },
)

const stopResize = useEventListener(window, 'resize', () => {
  if (open.value)
    close()
})

const stopKeydown = useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (!open.value)
    return
  if (e.key === 'Escape')
    close()
})

onBeforeUnmount(() => {
  stopPointerDown()
  stopScroll()
  stopResize()
  stopKeydown()
})
</script>

<style scoped>
.uis-contextmenu-trigger {
  display: contents;
}

.uis-contextmenu-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}

.uis-contextmenu-layer[data-open='true'] {
  pointer-events: auto;
}

.uis-contextmenu {
  position: fixed;
  min-width: 180px;
  max-width: min(92vw, 420px);
  max-height: min(70vh, 520px);
  overflow: auto;
  padding: 6px;

  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);

  outline: none;
  transform-origin: top left;
  will-change: transform, opacity;
}

.uis-contextmenu-pop-enter-active {
  transition: opacity 120ms ease-out, transform 120ms ease-out;
}
.uis-contextmenu-pop-leave-active {
  transition: opacity 100ms ease-in, transform 100ms ease-in;
}
.uis-contextmenu-pop-enter-from,
.uis-contextmenu-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}
.uis-contextmenu-pop-enter-to,
.uis-contextmenu-pop-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .uis-contextmenu-pop-enter-active,
  .uis-contextmenu-pop-leave-active {
    transition: none;
  }
}
</style>
