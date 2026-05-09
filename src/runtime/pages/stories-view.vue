<script setup lang="ts">
import { inject } from 'vue'
import { definePageMeta } from '#imports'
import Block from '../components/ui/Block.vue'

definePageMeta({
  layout: false,
})

const story = inject('uis-story')
</script>

<template>
  <Block stretch>
    <main class="uis-main">
      <component :is="story" v-if="story" />
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
