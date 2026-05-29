<template>
  <div
    class="app-loader d-flex justify-center align-center"
    :class="{ 'app-loader--fullpage': fullpage }"
    :style="fullpage ? 'min-height: 60vh' : ''"
    role="status"
    :aria-label="$t('loading') || 'جاري التحميل'"
  >
    <v-progress-circular
      indeterminate
      :color="color"
      :size="size"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: "AppLoader",
  props: {
    /** Spinner color — any Vuetify color string */
    color: {
      type: String,
      default: "primary",
    },
    /** Spinner diameter in pixels */
    size: {
      type: [Number, String],
      default: 60,
    },
    /**
     * When true, adds `min-height: 60vh` so the spinner is vertically
     * centred on a page that has not yet loaded its content.
     */
    fullpage: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.app-loader {
  padding: 2rem 0;
}

.app-loader--fullpage {
  width: 100%;
}
</style>
