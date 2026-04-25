<template>
  <button
    class="ui-button"
    :class="[`ui-button--${variant}`, `ui-button--${size}`]"
    :disabled="disabled"
    :data-has-nuxt="String(!!nuxtApp)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();

withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
  }>(),
  {
    variant: 'default',
    size: 'md',
    disabled: false,
  },
);
</script>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  background: #fff;
  color: #1f2937;
}

.ui-button:hover {
  background: #f3f4f6;
}

.ui-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-button--sm { padding: 4px 12px; font-size: 13px; }
.ui-button--md { padding: 8px 16px; font-size: 14px; }
.ui-button--lg { padding: 12px 24px; font-size: 16px; }

.ui-button--primary {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.ui-button--primary:hover { background: #1d4ed8; }

.ui-button--outline {
  background: transparent;
  border-color: #2563eb;
  color: #2563eb;
}
.ui-button--outline:hover { background: #eff6ff; }
</style>
