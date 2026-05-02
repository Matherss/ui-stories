import type { StoryMeta } from '../src/types/story-meta'

declare module 'virtual:stories' {
  import type { Component } from 'vue'

  export const stories: Record<string, Component>
  export const storiesMeta: Record<string, StoryMeta>
  export const storyVariantSources: Record<string, string[]>
}
