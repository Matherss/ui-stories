<script setup>
import UiButton from '~/components/ui/UiButton.vue';

const counter = ref(0);
</script>

<template>
  <div>
    <h1>Optional Page Example</h1>
    <p>Counter: {{ counter }}</p>
    <UiButton variant="primary" @click="counter++">+</UiButton>&nbsp;
    <UiButton variant="primary" @click="counter--">-</UiButton>
  </div>
</template>