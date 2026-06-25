<script setup lang="ts">
import { storyLoaders, storiesMeta, storyVariantSourceLoaders } from 'virtual:stories'
import { computed, nextTick, provide, reactive, ref, shallowRef, watch, type Component } from 'vue'
import { definePageMeta, useRoute, useRuntimeConfig } from '#imports'
import Block from '../components/ui/Block.vue'
import { uisControlsRegistryKey, uisStoryIdKey, uisStoryLoadingKey, uisVariantSourcesKey } from '../inject-keys'

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

const storiesIds = computed(() => Object.keys(storiesMeta))

const controlsRegistry = reactive(new Map())

const storyComponent = shallowRef<Component | null>(null)
const storyLoading = ref(false)
const variantSourcesList = shallowRef<string[]>([])

watch(storyId, async (id, _prev, onCleanup) => {
  let cancelled = false
  onCleanup(() => {
    cancelled = true
  })

  storyComponent.value = null
  variantSourcesList.value = []

  if (!id) {
    storyLoading.value = false
    return
  }

  storyLoading.value = true

  const loader = storyLoaders[id]
  const sourcesLoader = storyVariantSourceLoaders[id]

  if (loader) {
    const mod = await loader()
    if (!cancelled) {
      storyComponent.value = mod.default
      await nextTick()
    }
  }

  if (!cancelled && sourcesLoader) {
    const mod = await sourcesLoader()
    if (!cancelled)
      variantSourcesList.value = mod.default ?? []
  }

  if (!cancelled)
    storyLoading.value = false
}, { immediate: true })

const story = computed(() => storyComponent.value)

const storyMeta = computed(() => {
  const id = storyId.value
  if (!id)
    return null
  return storiesMeta[id] ?? null
})

provide('uis-story-meta', storyMeta)
provide('uis-story', story)
provide(uisStoryLoadingKey, storyLoading)
provide(uisStoryIdKey, storyId)
provide(uisControlsRegistryKey, controlsRegistry)

const variantSources = computed(() => variantSourcesList.value)
provide(uisVariantSourcesKey, variantSources)
</script>

<template>
  <ClientOnly>
    <div class="uis-root">
      <div class="uis-container">
        <Block>
          <UIStoriesSidebar
            :story-ids="storiesIds"
            :stories-meta="storiesMeta"
            :current-id="storyId"
            :base-path="basePath"
          />
        </Block>
        <NuxtPage />
        <Block v-if="storyId">
          <UIStoriesCode />
        </Block>
      </div>
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
  background: var(--uis-bg);
  padding: 24px 0;
  min-height: 100dvh;
}

.uis-container {
  display: flex;
  flex-wrap: wrap;

  width: 100%;
  max-width: 1800px;
  padding: 0 24px;
  margin: 0 auto;
  gap: 8px;
}
</style>
