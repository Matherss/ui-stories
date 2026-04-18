<template>
  <div class="uis-control uis-control--object">
    <div class="uis-object-editor">
      <pre
        ref="gutterEl"
        class="uis-object-editor__gutter"
        aria-hidden="true"
        :style="{ width: gutterWidthStyle }"
      >{{ lineNumbersText }}</pre>
      <div class="uis-object-editor__body">
        <pre
          ref="highlightEl"
          class="uis-object-editor__highlight"
          aria-hidden="true"
          v-html="highlighted"
        ></pre>
        <textarea
          class="uis-object-editor__textarea"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          :value="text"
          @focus="focused = true"
          @blur="focused = false"
          @scroll="onTextareaScroll"
          @input="onTextareaInput"
        />
      </div>
    </div>
    <p v-if="parseError" class="uis-object-editor__error">{{ parseError }}</p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { highlightJson } from './jsonHighlight.js';

const props = defineProps({
  modelValue: {
    type: [Object, Array],
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

const text = ref('');
const parseError = ref('');
const focused = ref(false);
const highlightEl = ref(null);
const gutterEl = ref(null);

const lineNumbersText = computed(() => {
  const n = text.value.split('\n').length;
  return Array.from({ length: n }, (_, i) => String(i + 1)).join('\n');
});

const gutterWidthStyle = computed(() => {
  const digits = String(text.value.split('\n').length).length;
  const ch = Math.max(2, digits) + 1;
  return `${ch}ch`;
});

function formatValue(v) {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return '{}';
  }
}

function cloneForEmit(parsed) {
  return JSON.parse(JSON.stringify(parsed));
}

const highlighted = computed(() => highlightJson(text.value));

function tryParseAndEmit() {
  const raw = text.value.trim();
  if (raw === '') {
    parseError.value = '';
    emit('update:modelValue', {});
    return;
  }
  try {
    const parsed = JSON.parse(text.value);
    if (parsed !== null && typeof parsed !== 'object') {
      parseError.value = 'Expected object or array.';
      return;
    }
    parseError.value = '';
    emit('update:modelValue', cloneForEmit(parsed));
  } catch (e) {
    parseError.value = e instanceof Error ? e.message : String(e);
  }
}

function onTextareaInput(e) {
  text.value = e.target.value;
  tryParseAndEmit();
}

function onTextareaScroll(e) {
  const top = e.target.scrollTop;
  const left = e.target.scrollLeft;
  const hi = highlightEl.value;
  if (hi) {
    hi.scrollTop = top;
    hi.scrollLeft = left;
  }
  const gut = gutterEl.value;
  if (gut) {
    gut.scrollTop = top;
  }
}

watch(
  () => props.modelValue,
  (v) => {
    if (focused.value) return;
    text.value = formatValue(v);
    parseError.value = '';
  },
  { deep: true, immediate: true }
);
</script>
