<template>
  <aside class="uis-sidebar">
    <nav class="uis-sidebar__nav">
      <div
        v-for="(components, dirName) in tree"
        :key="dirName"
        class="uis-sidebar__dir"
      >
        <div
          class="uis-sidebar__dir-header"
          :class="{ 'is-open': openDirs[dirName] }"
          @click="toggleDir(dirName)"
        >
          <span class="uis-sidebar__arrow">&#9654;</span>
          {{ dirName }}
        </div>

        <div v-show="openDirs[dirName]" class="uis-sidebar__dir-body">
          <div
            v-for="(comp, compName) in components"
            :key="compName"
            class="uis-sidebar__group"
          >
            <div
              class="uis-sidebar__component"
              :class="{ 'is-open': openGroups[compName] }"
              @click="toggleGroup(compName)"
            >
              <span class="uis-sidebar__arrow">&#9654;</span>
              {{ compName }}
            </div>

            <div v-show="openGroups[compName]" class="uis-sidebar__stories">
              <button
                v-for="storyName in comp.storyNames"
                :key="storyName"
                class="uis-sidebar__story"
                :class="{
                  'is-active': activeComponent === compName && activeStory === storyName,
                }"
                @click="$emit('select', compName, storyName)"
              >
                {{ storyName }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!Object.keys(tree).length" class="uis-sidebar__empty">
        Ничего не найдено
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { reactive, computed } from 'vue';

const META_KEYS = new Set(['directory']);

const props = defineProps({
  stories: { type: Object, required: true },
  search: { type: String, default: '' },
  activeComponent: { type: String, default: '' },
  activeStory: { type: String, default: '' }
});

defineEmits(['select']);

const openDirs = reactive({});
const openGroups = reactive({});

const tree = computed(() => {
  const q = props.search.toLowerCase().trim();
  const dirs = {};

  for (const [name, comp] of Object.entries(props.stories)) {
    const storyNames = getStoryNames(comp);
    if (!storyNames.length) continue;

    const matchesComponent = name.toLowerCase().includes(q);
    const matchesStory = storyNames.some((s) => s.toLowerCase().includes(q));

    if (q && !matchesComponent && !matchesStory) continue;

    const dir = getDirectory(comp);

    if (!dirs[dir]) dirs[dir] = {};
    dirs[dir][name] = { ...comp, storyNames };

    if (q) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      openDirs[dir] = true;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      openGroups[name] = true;
    }
  }

  return dirs;
});

function getDirectory(comp) {
  const dir = comp.exports.directory;
  if (typeof dir === 'string' && dir.trim()) return dir.trim();
  return '/';
}

function getStoryNames(comp) {
  return Object.keys(comp.exports).filter((k) => !META_KEYS.has(k));
}

function toggleDir(name) {
  openDirs[name] = !openDirs[name];
}

function toggleGroup(name) {
  openGroups[name] = !openGroups[name];
}
</script>
