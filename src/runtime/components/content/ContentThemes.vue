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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1_537)">
        <path d="M5.28587 14.7142L4.10753 15.8925M5.28587 5.28583L4.10753 4.1075M14.7142 5.28583L15.8925 4.1075M14.7142 14.7142L15.8925 15.8925M3.33335 10H1.66669M10 3.33333V1.66666M16.6667 10H18.3334M10 16.6667V18.3333M12.3567 12.3567C12.675 12.0492 12.929 11.6814 13.1037 11.2747C13.2784 10.868 13.3703 10.4306 13.3742 9.988C13.378 9.5454 13.2937 9.10647 13.1261 8.69682C12.9585 8.28716 12.711 7.91499 12.398 7.60201C12.085 7.28904 11.7128 7.04153 11.3032 6.87393C10.8935 6.70632 10.4546 6.62198 10.012 6.62583C9.5694 6.62968 9.132 6.72163 8.72532 6.89633C8.31864 7.07102 7.95083 7.32496 7.64334 7.64333C7.03614 8.272 6.70016 9.11401 6.70776 9.988C6.71535 10.862 7.06592 11.698 7.68394 12.3161C8.30197 12.9341 9.13801 13.2846 10.012 13.2922C10.886 13.2998 11.728 12.9639 12.3567 12.3567Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1_537">
        <rect width="20" height="20" fill="currentColor"/>
        </clipPath>
      </defs>
    </svg>
    </button>
    <button
      type="button"
      class="uis-icon-btn"
      :class="{ 'uis-icon-btn--on': isDark }"
      title="Dark theme"
      @click="isDark = true"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2.5C10.11 2.5 10.2192 2.5 10.3275 2.5C9.25697 3.49475 8.56885 4.8332 8.38276 6.28268C8.19668 7.73216 8.5244 9.20103 9.30897 10.4339C10.0935 11.6669 11.2853 12.5859 12.6772 13.0312C14.0691 13.4766 15.573 13.4201 16.9275 12.8717C16.4065 14.1254 15.5548 15.2142 14.4635 16.0219C13.3722 16.8296 12.0821 17.3259 10.7308 17.4578C9.3795 17.5898 8.01774 17.3525 6.79076 16.7712C5.56379 16.1899 4.51762 15.2864 3.76385 14.1572C3.01008 13.0279 2.57698 11.7152 2.51076 10.3591C2.44454 9.00305 2.74767 7.65441 3.38783 6.45709C4.02799 5.25977 4.98116 4.25869 6.14566 3.56061C7.31016 2.86253 8.64231 2.49366 10 2.49333V2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button
      type="button"
      class="uis-icon-btn"
      :class="{ 'uis-icon-btn--on': showGrid }"
      title="Grid"
      @click="showGrid = !showGrid"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.16667 4.16667H6.66667M10 4.16667H17.5M2.5 8.33334H11.6667M15 8.33334H15.8333M4.16667 12.5H8.33333M11.6667 12.5H17.5M2.5 16.6667H10M13.3333 16.6667H15.8333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.uis-content-themes {
  padding: 12px;
  display: flex;
  z-index: 1;
}

.uis-icon-btn {
  background: transparent;
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  color: #3A3B3E;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
}

.uis-icon-btn--on {
  background: #EFF0F2;
}
</style>
