import type { ComputedRef, InjectionKey, Reactive } from 'vue'

/** Raw Vue fragments inside `<UIStoriesVariant ...>...</UIStoriesVariant>` from the story file. Provided by the stories page. */
export const uisVariantSourcesKey: InjectionKey<ComputedRef<string[]>> = Symbol('uis.variantSources')

export interface ControlRuntimeItem {
  name: string
  value: unknown
  type: string
  options?: string[]
}

export type ControlsRegistry = Map<string, Reactive<Record<string, ControlRuntimeItem>>>

export const uisStoryIdKey: InjectionKey<ComputedRef<string | null>> = Symbol('uis.storyId')
export const uisControlsRegistryKey: InjectionKey<ControlsRegistry> = Symbol('uis.controlsRegistry')
