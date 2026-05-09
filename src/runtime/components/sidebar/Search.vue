<script setup lang="ts">
const search = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
  }>(),
  { placeholder: 'Search' },
)
</script>

<template>
  <div class="uis-search">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17.5 17.5L12.5 12.5M2.5 8.33333C2.5 9.09938 2.65088 9.85792 2.94404 10.5657C3.23719 11.2734 3.66687 11.9164 4.20854 12.4581C4.75022 12.9998 5.39328 13.4295 6.10101 13.7226C6.80875 14.0158 7.56729 14.1667 8.33333 14.1667C9.09938 14.1667 9.85792 14.0158 10.5657 13.7226C11.2734 13.4295 11.9164 12.9998 12.4581 12.4581C12.9998 11.9164 13.4295 11.2734 13.7226 10.5657C14.0158 9.85792 14.1667 9.09938 14.1667 8.33333C14.1667 7.56729 14.0158 6.80875 13.7226 6.10101C13.4295 5.39328 12.9998 4.75022 12.4581 4.20854C11.9164 3.66687 11.2734 3.23719 10.5657 2.94404C9.85792 2.65088 9.09938 2.5 8.33333 2.5C7.56729 2.5 6.80875 2.65088 6.10101 2.94404C5.39328 3.23719 4.75022 3.66687 4.20854 4.20854C3.66687 4.75022 3.23719 5.39328 2.94404 6.10101C2.65088 6.80875 2.5 7.56729 2.5 8.33333Z" stroke="#3A3B3E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <input
      v-model="search"
      class="uis-search-input"
      type="search"
      :placeholder="placeholder"
      autocomplete="off"
    >
  </div>
</template>

<style scoped>
.uis-search {
  display: flex;
  padding: 8px 12px;
  align-items: center;
  gap: 8px;

  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);

  transition: background .15s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  &:has(.uis-search-input:focus) {
    background: rgba(255, 255, 255, 0.75);
  }
}

.uis-search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 14px;
  font-family: var(--uis-font-sans);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: #3A3B3E;
}

.uis-search-input::placeholder {
  color: #3A3B3E;
  opacity: 0.5;
}

.uis-search-input:focus {
  outline: none;
}

.uis-search-input:focus-visible {
  outline: none;
}

.uis-search-input::-webkit-search-cancel-button {
  filter: grayscale(100%);
  cursor: pointer;
}
</style>
