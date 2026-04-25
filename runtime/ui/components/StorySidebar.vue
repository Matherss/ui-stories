<template>
  <aside class="uis-sidebar">
    <div class="uis-sidebar__section">
      <div v-if="optionalPages?.length" class="uis-sidebar__title">{{ strings.optionalPagesSection }}</div>
      <button
        v-for="p in optionalPages"
        :key="p.id"
        class="uis-sidebar__item"
        :class="{ 'is-active': activeOptionalId === p.id }"
        type="button"
        @click="$emit('select-optional', p.id)"
      >
        {{ p.title }}
      </button>
    </div>

    <div class="uis-sidebar__section">
      <div class="uis-sidebar__title">Stories</div>

      <div
        v-for="group in filteredGroups"
        :key="group.directory"
        class="uis-sidebar__group"
      >
        <div class="uis-sidebar__group-title">{{ group.directory }}</div>

        <div
          v-for="comp in group.components"
          :key="comp.name"
          class="uis-sidebar__component"
        >
          <div class="uis-sidebar__component-title">{{ comp.name }}</div>
          <button
            v-for="s in comp.stories"
            :key="s"
            class="uis-sidebar__story"
            :class="{ 'is-active': activeComponent === comp.name && activeStory === s && !activeOptionalId }"
            type="button"
            @click="$emit('select', comp.name, s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <div v-if="!filteredGroups.length" class="uis-sidebar__empty">
        {{ strings.emptySearchResults }}
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { strings } from 'virtual:ui-stories-config';

const props = defineProps({
  stories: { type: Object, required: true },
  search: { type: String, default: '' },
  activeComponent: { type: String, default: '' },
  activeStory: { type: String, default: '' },
  optionalPages: { type: Array, default: () => [] },
  activeOptionalId: { type: String, default: '' },
});

defineEmits(['select', 'select-optional']);

const groups = computed(() => {
  const byDir = new Map();
  for (const [componentName, mod] of Object.entries(props.stories)) {
    const directory = mod.exports?.directory || '/';
    const exports = mod.exports || {};
    const storyNames = Object.keys(exports)
      .filter((k) => k !== 'directory')
      .sort((a, b) => a.localeCompare(b));

    if (!byDir.has(directory)) byDir.set(directory, new Map());
    byDir.get(directory).set(componentName, storyNames);
  }

  const out = [];
  for (const [directory, compsMap] of byDir.entries()) {
    const components = [];
    for (const [name, stories] of compsMap.entries()) {
      components.push({ name, stories });
    }
    components.sort((a, b) => a.name.localeCompare(b.name));
    out.push({ directory, components });
  }
  out.sort((a, b) => a.directory.localeCompare(b.directory));
  return out;
});

const filteredGroups = computed(() => {
  const q = (props.search || '').trim().toLowerCase();
  if (!q) return groups.value;

  const filtered = [];
  for (const g of groups.value) {
    const comps = [];
    for (const c of g.components) {
      const storyMatches = c.stories.filter((s) => s.toLowerCase().includes(q));
      const compMatch = c.name.toLowerCase().includes(q);
      if (compMatch || storyMatches.length) {
        comps.push({
          name: c.name,
          stories: compMatch ? c.stories : storyMatches,
        });
      }
    }
    if (comps.length) filtered.push({ directory: g.directory, components: comps });
  }
  return filtered;
});
</script>

