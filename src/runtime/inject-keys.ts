import type { ComputedRef, InjectionKey } from 'vue'

/** Raw Vue fragments inside `<UIStoriesVariant ...>...</UIStoriesVariant>` from the story file. Provided by the stories page. */
export const uisVariantSourcesKey: InjectionKey<ComputedRef<string[]>> = Symbol('uis.variantSources')
