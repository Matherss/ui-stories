import { inject, onUnmounted, provide, reactive, watch, type Reactive } from 'vue'
import type { Control, ControlsResult } from './controls'
import { uisControlsRegistryKey, uisStoryIdKey, type ControlRuntimeItem } from '../inject-keys'

export function useControls<T extends Record<string, Control>>(controls: T) {
  const result = {} as ControlsResult<T>

  for (const [key, config] of Object.entries(controls) as [keyof T & string, T[keyof T]][]) {
    const item: Record<string, unknown> = {
      name: key,
      type: config.type,
      value: config.default,
    }

    if (config.type === 'select') {
      if ('options' in config && Array.isArray(config.options))
        item.options = [...config.options]
      else
        console.error(`[ui-stories] Select control "${key}" must include "options".`)
    }

    result[key] = item as ControlsResult<T>[typeof key]
  }

  const reactiveResult = reactive(result)

  const storyId = inject(uisStoryIdKey, null)
  const registry = inject(uisControlsRegistryKey, null)

  if (storyId && registry) {
    watch(
      storyId,
      (id, prevId) => {
        if (prevId)
          registry.delete(prevId)
        if (id)
          registry.set(id, reactiveResult as Reactive<Record<string, ControlRuntimeItem>>)
      },
      { immediate: true },
    )

    onUnmounted(() => {
      const id = storyId.value
      if (id)
        registry.delete(id)
    })
  }

  provide('uis-controls', reactiveResult)

  return reactiveResult
}
