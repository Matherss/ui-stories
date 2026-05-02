<script setup lang="ts">
const isDark = defineModel<boolean>('isDark', { default: false })
const showGrid = defineModel<boolean>('showGrid', { default: false })
</script>

<template>
  <div class="uis-content-themes">
    <button
      type="button"
      class="uis-icon-btn"
      :class="{ 'uis-icon-btn--on': !isDark }"
      title="Light theme"
      @click="isDark = false"
    >
      ◐
    </button>
    <button
      type="button"
      class="uis-icon-btn"
      :class="{ 'uis-icon-btn--on': isDark }"
      title="Dark theme"
      @click="isDark = true"
    >
      ◑
    </button>
    <button
      type="button"
      class="uis-icon-btn"
      :class="{ 'uis-icon-btn--on': showGrid }"
      title="Grid"
      @click="showGrid = !showGrid"
    >
      ▦
    </button>
  </div>
</template>

<style scoped>
.uis-content-themes {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  z-index: 1;
}

.uis-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgb(248 250 252 / 90%);
  color: #64748b;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.uis-icon-btn--on {
  background: #e0f2fe;
  color: #0369a1;
}
</style>
