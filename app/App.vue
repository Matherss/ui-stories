<template>
  <div class="uis-app">
    <header class="uis-header">
      <span class="uis-header__logo">UI Stories</span>
      <input
        v-model="search"
        class="uis-header__search"
        type="text"
        :placeholder="strings.searchPlaceholder"
      />
    </header>

    <div class="uis-body">
      <StorySidebar
        :stories="stories"
        :search="search"
        :active-component="activeComponent"
        :active-story="activeStoryName"
        :optional-pages="optionalPagesNav"
        :active-optional-id="activeOptionalId"
        @select="onSelectStory"
        @select-optional="onSelectOptional"
      />

      <main class="uis-main">
        <component
          v-if="activeOptionalPage"
          :is="activeOptionalPage.component"
          :key="'opt-' + activeOptionalId"
        />
        <StoryCanvas
          v-else-if="activeStoryDef"
          :key="activeComponent + '/' + activeStoryName"
          :story="activeStoryDef"
        />
        <div v-else class="uis-empty">
          {{ strings.emptySelection }}
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import allStories from 'virtual:stories';
import optionalPagesData from 'virtual:optional-pages';
import { strings } from 'virtual:ui-stories-config';
import StorySidebar from './components/StorySidebar.vue';
import StoryCanvas from './components/StoryCanvas.vue';
const stories = allStories;
const search = ref('');
const activeComponent = ref('');
const activeStoryName = ref('');
const activeOptionalId = ref('');

const optionalPagesNav = computed(() =>
  optionalPagesData.map((p) => ({ id: p.id, title: p.title }))
);

const activeOptionalPage = computed(() => {
  if (!activeOptionalId.value) return null;
  return optionalPagesData.find((p) => p.id === activeOptionalId.value) || null;
});

const activeStoryDef = computed(() => {
  if (activeOptionalId.value) return null;
  if (!activeComponent.value || !activeStoryName.value) return null;
  const comp = stories[activeComponent.value];
  if (!comp) return null;
  return comp.exports[activeStoryName.value] || null;
});

function onSelectOptional(pageId) {
  activeOptionalId.value = pageId;
  activeComponent.value = '';
  activeStoryName.value = '';
  window.location.hash = `#__page__/${pageId}`;
}

function onSelectStory(componentName, storyName) {
  activeOptionalId.value = '';
  activeComponent.value = componentName;
  activeStoryName.value = storyName;
  window.location.hash = `#${componentName}/${storyName}`;
}

function parseHash() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return;

  if (hash.startsWith('__page__/')) {
    const id = hash.slice('__page__/'.length);
    if (id && optionalPagesData.some((p) => p.id === id)) {
      activeOptionalId.value = id;
      activeComponent.value = '';
      activeStoryName.value = '';
    }
    return;
  }

  const [comp, story] = hash.split('/');
  if (comp && story && stories[comp]?.exports[story]) {
    activeOptionalId.value = '';
    activeComponent.value = comp;
    activeStoryName.value = story;
  }
}

onMounted(() => {
  parseHash();
  window.addEventListener('hashchange', parseHash);
});
</script>
