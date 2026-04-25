<template>
  <div class="uis-story">
    <div class="uis-story__toolbar">
      <button
        v-for="t in themes"
        :key="t.id"
        class="uis-story__theme-btn"
        :class="{ 'is-active': theme === t.id }"
        :title="t.label"
        @click="theme = t.id"
      >
        <span class="uis-story__theme-swatch" :class="'is-' + t.id" />
      </button>
    </div>

    <div class="uis-story__resizer" :class="'is-theme-' + theme">
      <div class="uis-story__preview">
        <component :is="renderedComponent" />
      </div>
    </div>

    <div v-if="hasControls" class="uis-story__controls">
      <h3 class="uis-story__controls-title">Controls</h3>

      <div
        v-for="(def, propName) in story.propsChanger"
        :key="propName"
        class="uis-story__control-row"
        :class="{ 'is-control-tall': def.type === 'object' }"
      >
        <label class="uis-story__control-label">{{ propName }}</label>

        <ControlInput
          v-if="def.type === 'input'"
          v-model="propsState[propName]"
        />
        <ControlSelect
          v-else-if="def.type === 'select'"
          v-model="propsState[propName]"
          :options="def.options"
        />
        <ControlSwitch
          v-else-if="def.type === 'switch'"
          v-model="propsState[propName]"
        />
        <ControlMultiselect
          v-else-if="def.type === 'multiselect'"
          v-model="propsState[propName]"
          :options="def.options"
        />
        <ControlObject
          v-else-if="def.type === 'object'"
          v-model="propsState[propName]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, toRefs } from 'vue';
import ControlInput from './controls/ControlInput.vue';
import ControlSelect from './controls/ControlSelect.vue';
import ControlSwitch from './controls/ControlSwitch.vue';
import ControlMultiselect from './controls/ControlMultiselect.vue';
import ControlObject from './controls/ControlObject.vue';
import { strings } from 'virtual:ui-stories-config';

const themes = [
  { id: 'light', label: strings.themeLight },
  { id: 'dark', label: strings.themeDark },
  { id: 'checker', label: strings.themeChecker },
];
const theme = ref('light');

const props = defineProps({
  story: { type: Object, required: true },
});

const story = props.story;

const hasControls = computed(
  () => story.propsChanger && Object.keys(story.propsChanger).length > 0,
);

const propsState = reactive(buildInitialState(story.propsChanger));

function buildInitialState(propsChanger) {
  const state = {};
  if (!propsChanger) return state;

  for (const [key, def] of Object.entries(propsChanger)) {
    if (def.type === 'switch') {
      state[key] = def.default ?? false;
    } else if (def.type === 'multiselect') {
      state[key] = def.default ?? [];
    } else if (def.type === 'object') {
      const d = def.default;
      state[key] =
        d != null && typeof d === 'object'
          ? structuredClone(d)
          : {};
    } else if (def.type === 'input' || def.type === 'select') {
      state[key] = def.default ?? '';
    } else {
      state[key] = def.default ?? '';
    }
  }
  return state;
}

const controlRefs = toRefs(propsState);
const rendered = story.renderer({ args: propsState, refs: controlRefs });
const renderedComponent = computed(() =>
  rendered && typeof rendered === 'object' && 'component' in rendered
    ? rendered.component
    : rendered,
);
</script>

