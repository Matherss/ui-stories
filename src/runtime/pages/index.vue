<script setup lang="ts">
import { stories, storiesMeta, storyVariantSources } from 'virtual:stories'
import { computed, provide } from 'vue'
import {
  uisVariantSourcesKey,
} from '../inject-keys'
import { definePageMeta, useRoute, useRuntimeConfig } from '#imports'

definePageMeta({
  layout: false,
})

const route = useRoute()
const config = useRuntimeConfig()

const basePath = computed(() => {
  const p = (config.public as { uiStories?: { route?: string } }).uiStories?.route
  return typeof p === 'string' ? p : '/stories'
})

const storyId = computed(() => {
  const id = route.params.id
  if (id == null || id === '')
    return null
  return Array.isArray(id) ? id[0] ?? null : id
})

const storiesIds = computed(() => Object.keys(stories))

const story = computed(() => {
  const id = storyId.value
  if (!id)
    return null
  return stories[id]
})

const storyMeta = computed(() => {
  const id = storyId.value
  if (!id)
    return null
  return storiesMeta[id] ?? null
})

provide('uis-story-meta', storyMeta)

const variantSourcesList = computed(() => {
  const id = storyId.value
  if (!id)
    return [] as string[]
  return storyVariantSources[id] ?? []
})
provide(uisVariantSourcesKey, variantSourcesList)
</script>

<template>
  <ClientOnly>
    <div class="uis-root">
      <UIStoriesSidebar
        :story-ids="storiesIds"
        :stories-meta="storiesMeta"
        :current-id="storyId"
        :base-path="basePath"
      />
      <main class="uis-main">
        <component :is="story" v-if="story" />
        <div v-else class="uis-empty">
          Select a story in the sidebar
        </div>
      </main>
      <UIStoriesCode v-if="story" />
    </div>
  </ClientOnly>
</template>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.uis-root {
  display: flex;
  min-height: 100dvh;
  background: var(--uis-bg);
}

.uis-main {
  flex: 1;
  min-width: 0;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
}

.uis-empty {
  margin: auto;
  padding: 40px;
  text-align: center;
  font-size: 15px;
}
</style>
