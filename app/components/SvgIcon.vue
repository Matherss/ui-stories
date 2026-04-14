<template>
  <svg
    class="icon"
    :width="width"
    :height="height"
    :style="color ? { color } : undefined"
  >
    <use :href="spriteHref" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';
import { svgSpritePath } from 'virtual:ui-stories-config';

const props = defineProps({
  name: { type: String, default: '' },
  width: { type: [Number, String], default: 24 },
  height: { type: [Number, String], default: 24 },
  color: { type: String, default: '' }
});

const spriteHref = computed(() => {
  const slashIdx = props.name.lastIndexOf('/');
  const sprite = slashIdx !== -1 ? props.name.slice(0, slashIdx) : 'icons';
  const symbol = slashIdx !== -1 ? props.name.slice(slashIdx + 1) : props.name;
  return `${svgSpritePath}${sprite}.svg#${symbol}`;
});
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
  flex-shrink: 0;
  fill: currentColor;
}
</style>
