import { provide, reactive } from 'vue'
import type { Control } from '../../types'

export function useControls<T extends Record<string, Control>>(controls: T) {
  const result: Record<string, any> = reactive({})

  for (const [key, config] of Object.entries(controls)) {
    result[key] = {
      name: key,
      type: config.type,
      value: config.default,
    }

    if (config.type === 'select') {
      if ('options' in config && Array.isArray(config.options))
        result[key].options = config.options
      else
        console.error(`[ui-stories] Select control "${key}" must include "options".`)
    }
  }

  provide('uis-controls', result)

  return result
}
