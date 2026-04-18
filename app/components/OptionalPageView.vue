<template>
  <div class="uis-optional-page">
    <h2 class="uis-optional-page__title">{{ page.title }}</h2>

    <DesignTokens
      v-if="page.colorTokens?.length"
      section-title="Colors"
      token-type="color"
      :tokens="page.colorTokens"
    />

    <TypographySamples
      v-if="page.typographyPresets?.length"
      section-title="Typography presets (classes)"
      :presets="page.typographyPresets"
    />

    <DesignTokens
      v-if="page.typographyTokens?.length"
      section-title="Typography tokens ($variables)"
      token-type="typography"
      :tokens="page.typographyTokens"
    />

    <p
      v-if="
        !page.colorTokens?.length &&
          !page.typographyTokens?.length &&
          !page.typographyPresets?.length
      "
      class="uis-optional-page__empty"
    >
      No SCSS variables matched colors or typography in the configured files.
    </p>
  </div>
</template>

<script setup>
import DesignTokens from './design/DesignTokens.vue';
import TypographySamples from './design/TypographySamples.vue';

defineProps({
  page: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.uis-optional-page {
  padding: var(--uis-story-pad, 24px);
  max-width: 960px;
}

.uis-optional-page__title {
  margin: 0 0 1.25rem;
  font-size: var(--uis-font-size-xl, 1.25rem);
  font-weight: 700;
}

.uis-optional-page__empty {
  margin: 0;
  opacity: 0.7;
  font-size: var(--uis-font-size-sm, 0.875rem);
}
</style>
