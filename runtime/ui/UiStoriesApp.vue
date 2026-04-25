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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from '#app';
import allStories from 'virtual:stories';
import optionalPagesData from 'virtual:optional-pages';
import { strings } from 'virtual:ui-stories-config';
import StorySidebar from './components/StorySidebar.vue';
import StoryCanvas from './components/StoryCanvas.vue';

import './styles/ui-stories.scss';

const stories = allStories;
const search = ref('');
const activeComponent = ref('');
const activeStoryName = ref('');
const activeOptionalId = ref('');

const optionalPagesNav = computed(() =>
  optionalPagesData.map((p) => ({ id: p.id, title: p.title })),
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

const route = useRoute();
const router = useRouter();

function onSelectOptional(pageId) {
  activeOptionalId.value = pageId;
  activeComponent.value = '';
  activeStoryName.value = '';
  router.replace({
    query: { ...route.query, uis: `__page__/${pageId}` },
    hash: '',
  });
}

function onSelectStory(componentName, storyName) {
  activeOptionalId.value = '';
  activeComponent.value = componentName;
  activeStoryName.value = storyName;
  router.replace({
    query: { ...route.query, uis: `${componentName}/${storyName}` },
    hash: '',
  });
}

function applyUisParam() {
  const uis = route.query?.uis;
  const val = typeof uis === 'string' ? uis : Array.isArray(uis) ? uis[0] : '';
  if (!val) return;

  if (val.startsWith('__page__/')) {
    const id = val.slice('__page__/'.length);
    if (id && optionalPagesData.some((p) => p.id === id)) {
      activeOptionalId.value = id;
      activeComponent.value = '';
      activeStoryName.value = '';
    }
    return;
  }

  const [comp, story] = val.split('/');
  if (comp && story && stories[comp]?.exports[story]) {
    activeOptionalId.value = '';
    activeComponent.value = comp;
    activeStoryName.value = story;
  }
}

onMounted(() => {
  // Vite will inject the generated CSS.
  import('virtual:host-styles');
  applyUisParam();
});

watch(
  () => route.query.uis,
  () => applyUisParam(),
);
</script>

