<template>
  <section class="uis-design-tokens" :data-type="tokenType">
    <h3 v-if="sectionTitle" class="uis-design-tokens__heading">{{ sectionTitle }}</h3>

    <ul class="uis-design-tokens__list">
      <li
        v-for="t in tokens"
        :key="t.name"
        class="uis-design-tokens__item"
      >
        <div
          v-if="tokenType === 'color'"
          class="uis-design-tokens__swatch"
          :style="swatchStyle(t.resolved)"
          role="img"
          :aria-label="t.name"
        />

        <div
          class="uis-design-tokens__meta"
          :class="{ 'uis-design-tokens__meta--full': tokenType !== 'color' }"
        >
          <div class="uis-design-tokens__name">{{ t.name }}</div>
          <div class="uis-design-tokens__value">{{ formatLine(t) }}</div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  tokens: {
    type: Array,
    required: true,
  },

  tokenType: {
    type: String,
    required: true,

    validator: (v) => ['color', 'typography'].includes(v),
  },

  sectionTitle: {
    type: String,
    default: '',
  },
});

function formatLine(t) {
  if (t.immediateRef) {
    return `${t.immediateRef} (${t.resolved})`;
  }
  return t.resolved;
}

/**
 * @param {string} resolved
 */
function swatchStyle(resolved) {
  return {
    backgroundColor: resolved,
  };
}
</script>

<style scoped>
.uis-design-tokens {
  margin-bottom: 2rem;
}

.uis-design-tokens__heading {
  margin: 0 0 0.75rem;
  font-size: var(--uis-font-size-md, 0.9375rem);
  font-weight: 600;
  opacity: 0.85;
}

.uis-design-tokens__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.uis-design-tokens__item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-width: 0;
}

.uis-design-tokens__swatch {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.uis-design-tokens__meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.125rem;
}

.uis-design-tokens__meta--full {
  padding-top: 0;
}

.uis-design-tokens__name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: var(--uis-font-size-sm, 0.875rem);
  font-weight: 600;
  word-break: break-all;
}

.uis-design-tokens__value {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: var(--uis-font-size-sm, 0.875rem);
  opacity: 0.85;
  word-break: break-all;
}
</style>
