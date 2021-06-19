<template>
  <div class="account-header">
    <div
      class="account-header-content d-flex justify-space-between align-center"
    >
      <h2 class="font-weight-bold">{{ headerText }}</h2>
      <nuxt-link
        :to="localePath(backLink)"
        v-if="isActive"
      >
        {{ backText }}
      </nuxt-link>
    </div>
    <v-divider horizontal class="rounded"></v-divider>
  </div>
</template>

<script>
export default {
  name: "AccountHeader",
  props: ["headerText", "backLink", "backText", "isActive"],
};
</script>

<style scoped>
.account-header-content {
  margin-bottom: 15px;
}

h2 {
  color: #a4abbb;
}

a {
  color: #ff5e94 !important;
  font-size: 20px !important;
}

@media only screen and (max-width: 600px) {
  h2 {
    font-size: 25px !important;
  }
}
</style>
