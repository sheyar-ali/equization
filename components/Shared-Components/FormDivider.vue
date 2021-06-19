<template>
  <div>
    <v-divider horizontal class="form-divider"></v-divider>
    <p class="title text-center">
      <span class="divider-text">{{ DividerText }}</span>
      <nuxt-link :to="DividerLink" class="pink--text text--lighten-2">{{ DividerLinkText }}</nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  name: "FormDivider",
  props: ["DividerText", "DividerLink", "DividerLinkText"]
};
</script>

<style scoped>
.form-divider {
  margin-top: 35px;
}

p {
  padding: 10px 0 5px;
  margin-bottom: 0px !important;
}

span {
  color: #9292b1 !important;
}

@media only screen and (max-width: 990px){
  .v-application .title{
    font-size: 18px !important;
  }
} 

</style>
