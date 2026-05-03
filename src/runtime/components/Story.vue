<template>
  <ClientOnly>
    <div class="uis-story">
      <UIStoriesContent>
        <slot />
      </UIStoriesContent>
    </div>
  </ClientOnly>
</template>

<style scoped>
.uis-story {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  flex: 1;
}
</style>
