<template>
  <div class="wow fadeIn">
    <v-alert type="success" class="text-center headline">{{
      alertText
    }}</v-alert>
    <p class="alert-description text-center">
      {{ alertDescription }}
    </p>
    <nuxt-link
      :to="link"
      class="back-to white--text d-block mx-auto title text-center"
    >
      <span>{{ linkText }}</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: "ContactAlert",
  props: ["alertText", "alertDescription", "link", "linkText"],
};
</script>

<style scoped>
p {
  margin-top: 30px;
}

a {
  margin: 40px 0 !important;
}
</style>
