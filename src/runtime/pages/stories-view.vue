<script setup lang="ts">
import { computed, inject, type Component, type ComputedRef, type Ref } from 'vue'
import { definePageMeta } from '#imports'
import Block from '../components/ui/Block.vue'
import { uisStoryIdKey } from '../inject-keys'

definePageMeta({
  layout: false,
})

const story = inject<ComputedRef<Component | null>>('uis-story')
const storyLoading = inject<Ref<boolean>>('uis-story-loading')
const storyId = inject(uisStoryIdKey, null)

const hasStoryId = computed(() => !!storyId?.value)
</script>

<template>
  <Block stretch>
    <main class="uis-main">
      <component :is="story" v-if="story" :key="storyId ?? undefined" />
      <div v-else-if="storyLoading" class="uis-empty">
        Loading story…
      </div>
      <div v-else-if="hasStoryId" class="uis-empty">
        Story not found
      </div>
      <div v-else class="uis-empty">
        Select a story in the sidebar
      </div>
    </main>
  </Block>
</template>

<style>
.uis-main {
  flex: 1;
  min-width: 0;
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
