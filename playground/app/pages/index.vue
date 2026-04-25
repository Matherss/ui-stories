<template>
  <div class="playground-home">
    <h1>UI Stories Playground</h1>
    <p>This is a Nuxt 4 host app for developing <code>@ui-stories</code>.</p>

    <div class="demo">
      <h2>Components preview</h2>
      <UiButton>Default button</UiButton>
      <UiButton variant="primary">Primary button</UiButton>
      <UiButton variant="outline" size="lg">Large outline</UiButton>
    </div>

    <div>
      <NuxtLink to="/__ui-stories">UI Stories</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.playground-home {
  max-width: 720px;
  margin: 40px auto;
  font-family: system-ui, sans-serif;
}

.demo {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.demo h2 {
  width: 100%;
}
</style>
