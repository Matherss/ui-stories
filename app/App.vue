<template>
  <div class="uis-app">
    <header class="uis-header">
      <span class="uis-header__logo">UI Stories</span>
      <input
        v-model="search"
        class="uis-header__search"
        type="text"
        placeholder="Поиск компонента..."
      />
    </header>

    <div class="uis-body">
      <StorySidebar
        :stories="stories"
        :search="search"
        :active-component="activeComponent"
        :active-story="activeStoryName"
        @select="onSelect"
      />

      <main class="uis-main">
        <StoryCanvas
          v-if="activeStoryDef"
          :key="activeComponent + '/' + activeStoryName"
          :story="activeStoryDef"
        />
        <div v-else class="uis-empty">
          Выберите компонент в боковом меню
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import allStories from 'virtual:stories';
import StorySidebar from './components/StorySidebar.vue';
import StoryCanvas from './components/StoryCanvas.vue';

const stories = allStories;
const search = ref('');
const activeComponent = ref('');
const activeStoryName = ref('');

const activeStoryDef = computed(() => {
  if (!activeComponent.value || !activeStoryName.value) return null;
  const comp = stories[activeComponent.value];
  if (!comp) return null;
  return comp.exports[activeStoryName.value] || null;
});

function onSelect(componentName, storyName) {
  activeComponent.value = componentName;
  activeStoryName.value = storyName;
  window.location.hash = `#${componentName}/${storyName}`;
}

function parseHash() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  const [comp, story] = hash.split('/');
  if (comp && story && stories[comp]?.exports[story]) {
    activeComponent.value = comp;
    activeStoryName.value = story;
  }
}

onMounted(() => {
  parseHash();
  window.addEventListener('hashchange', parseHash);
});
</script>
