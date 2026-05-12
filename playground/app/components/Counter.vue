<script setup lang="ts">
const model = defineModel<number>({ required: true })
</script>

<template>
  <div class="counter">
    <button type="button" @click="model--">-</button>
    <span>{{ model }}</span>
    <button type="button" @click="model++">+</button>
  </div>
</template>

<style scoped>
.counter {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.counter button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #f1f5f9;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  transition: background 0.2s ease-in-out;
}

.counter button:hover {
  background: #e2e8f0;
}


.counter span {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
}
</style>