<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary',
  isDisabled?: boolean,
}>()
</script>

<template>
  <button type="button" :class="['btn', variant === 'secondary' ? 'btn--secondary' : 'btn--primary', isDisabled ? 'btn--disabled' : '']">
    <slot />
  </button>
</template>

<style scoped>
/* MUI-like elevations (rgb shadows, short transitions, no lift transform) */
.btn {
  --mui-primary: #1976d2;
  --mui-primary-dark: #1565c0;
  --mui-primary-focus: rgba(25, 118, 210, 0.35);
  --mui-elevation-2:
    0 3px 1px -2px rgb(0 0 0 / 20%),
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
  --mui-elevation-4:
    0 2px 4px -1px rgb(0 0 0 / 20%),
    0 4px 5px 0 rgb(0 0 0 / 14%),
    0 1px 10px 0 rgb(0 0 0 / 12%);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 36px;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.02857em;
  line-height: 1.75;
  text-transform: none;
  cursor: pointer;
  transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
    color 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:focus-visible {
  outline: 2px solid var(--btn-ring);
  outline-offset: 2px;
}

.btn:disabled {
  cursor: not-allowed;
}

/* Contained primary */
.btn--primary {
  --btn-ring: var(--mui-primary);
  border: none;
  color: #fff;
  background-color: var(--mui-primary);
  box-shadow: var(--mui-elevation-2);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--mui-primary-dark);
  box-shadow: var(--mui-elevation-4);
}

.btn--primary:active:not(:disabled) {
  box-shadow: var(--mui-elevation-2);
}

.btn--primary:focus-visible {
  --btn-ring: var(--mui-primary-focus);
}

.btn--primary:disabled {
  color: rgb(0 0 0 / 26%);
  background-color: rgb(0 0 0 / 12%);
  box-shadow: none;
}

/* Outlined secondary (MUI OutlinedButton aesthetic) */
.btn--secondary {
  --btn-ring: rgb(0 0 0 / 45%);
  color: rgb(0 0 0 / 87%);
  background-color: transparent;
  border: 1px solid rgb(0 0 0 / 23%);
  box-shadow: none;
}

.btn--secondary:hover:not(:disabled) {
  background-color: rgb(0 0 0 / 4%);
  border-color: rgb(0 0 0 / 87%);
}

.btn--secondary:active:not(:disabled) {
  background-color: rgb(0 0 0 / 8%);
}

.btn--secondary:focus-visible {
  --btn-ring: rgb(0 0 0 / 45%);
}

.btn--secondary:disabled {
  color: rgb(0 0 0 / 26%);
  border-color: rgb(0 0 0 / 12%);
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
