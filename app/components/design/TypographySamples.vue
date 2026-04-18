<template>
  <section class="uis-typography-samples">
    <h3 v-if="sectionTitle" class="uis-typography-samples__heading">{{ sectionTitle }}</h3>

    <div
      v-for="(preset, idx) in presets"
      :key="preset.selector + '-' + idx"
      class="uis-typography-samples__row"
    >
      <div class="uis-typography-samples__label">
        <div class="uis-typography-samples__selector">{{ preset.selector }}</div>
        <div class="uis-typography-samples__decls">{{ formatDecls(preset.properties) }}</div>
      </div>
      <!-- Host token CSS variables are scoped to .uis-story__preview (see hostStylesPlugin); inherit into sample. -->
      <div class="uis-story__preview uis-typography-samples__sample-host">
        <p
          class="uis-typography-samples__sample"
          :style="toStyle(preset.properties)"
        >
          {{ sampleText }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  presets: {
    type: Array,
    required: true,
  },
  sectionTitle: {
    type: String,
    default: 'Typography',
  },
  sampleText: {
    type: String,
    default: 'Lorem ipsum dolor sit amet',
  },
});

const DECL_ORDER = [
  'font',
  'font-size',
  'line-height',
  'font-weight',
  'font-family',
  'letter-spacing',
  'font-style',
  'text-transform',
];

/**
 * @param {Record<string, string>} props
 */
function formatDecls(props) {
  const keys = Object.keys(props);
  keys.sort((a, b) => {
    const ia = DECL_ORDER.indexOf(a);
    const ib = DECL_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  return keys.map((k) => `${k}: ${props[k]};`).join(' ');
}

/**
 * @param {Record<string, string>} props
 */
function toStyle(props) {
  /** @type {Record<string, string>} */
  const o = {};
  for (const [k, v] of Object.entries(props)) {
    const camel = k.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    o[camel] = v;
  }
  return o;
}
</script>

<style scoped>
.uis-typography-samples {
  margin-bottom: 2rem;
}

.uis-typography-samples__heading {
  margin: 0 0 0.75rem;
  font-size: var(--uis-font-size-md, 0.9375rem);
  font-weight: 600;
  opacity: 0.85;
}

.uis-typography-samples__row {
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.uis-typography-samples__row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.uis-typography-samples__label {
  margin-bottom: 0.5rem;
}

.uis-typography-samples__sample-host {
  display: block;
  max-width: 42rem;
}

.uis-typography-samples__selector {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: var(--uis-font-size-sm, 0.875rem);
  font-weight: 600;
  word-break: break-all;
}

.uis-typography-samples__decls {
  margin-top: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 12px;
  line-height: 1.45;
  opacity: 0.75;
  word-break: break-word;
}

.uis-typography-samples__sample {
  margin: 0;
  color: inherit;
}
</style>
