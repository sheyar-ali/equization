<template>
  <v-col class="empty-data text-center" cols="12">
    <p class="ma-0">
      {{ descriptionText }}
    </p>
    <nuxt-link :to="localePath(linkPath)" class="white--text d-inline-block">
			{{ linkText }}
		</nuxt-link>
  </v-col>
</template>

<script>
export default {
  name: "EmptyData",
  props: ["descriptionText", "linkPath", "linkText"],
};
</script>

<style scoped>
p {
  background-color: #daf4f3;
  color: #a4abbb;
  padding: 10px 0;
  font-size: 25px;
  border-radius: 10px;
  font-weight: 600;
}

a {
  padding: 10px 35px;
  background-color: #f782ac !important;
  font-size: 23px !important;
  letter-spacing: normal !important;
  margin-top: 35px;
	border-radius: 10px;
}
</style>
