<template>
  <v-col cols="12" md="6" class="text-center form-description wow fadeIn">
    <h2 class="form-title font-weight-bold">{{ formTitle }}</h2>
    <p class="line mx-auto rounded"></p>
    <p class="form-title-description">
      {{ formDescription }}
    </p>
    <img
      class="d-md-block mx-auto d-sm-none form-content-img"
      :src="imgSrc"
      :alt="imgAlt"
    />
  </v-col>
</template>

<script>
export default {
  name: "FormContent",
  props: ["formTitle", "formDescription", "imgSrc", "imgAlt"],
};
</script>

<style scoped>
.form-title {
  color: #5f53a9;
  font-size: 35px;
  margin-bottom: 15px;
  font-family: "Almarai" !important;
}

p.line {
  width: 200px;
  height: 2px;
  background-color: #ffc961;
}

img {
  margin-top: 10px !important;
}
</style>
