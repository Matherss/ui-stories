import { provide, reactive } from 'vue'
import type { Control, ControlsResult } from './controls'

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

  provide('uis-controls', result)

  return reactive(result)
}
