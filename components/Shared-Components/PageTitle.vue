<template>
  <div class="page-title d-flex justify-center align-center">
    <h1 class="wow zoomIn font-weight-bold">{{ titleText }}</h1>
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: ["titleText"]
};
</script>

<style scoped>
.page-title {
  margin-top: 60px;
  padding: 2.5rem 0;
  background: url("@/assets/images/Home-Page-Images/home-pattern.png"),
    linear-gradient(67deg, #36399a, #4d2f91);
  color: #ffc961;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}

@media only screen and (max-width: 600px) {
  .page-title {
    padding: 2rem 0 !important;
  }
  
  .page-title h1 {
    font-size: 30px !important;
  }
}
</style>
