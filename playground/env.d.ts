import type { StoryMeta } from '../src/types/story-meta'

declare module 'virtual:stories' {
  import type { Component } from 'vue'

  export const storyLoaders: Record<string, () => Promise<{ default: Component }>>
  export const storiesMeta: Record<string, StoryMeta>
  export const storyVariantSourceLoaders: Record<string, () => Promise<{ default: string[] }>>
}
