<!-- Start Of The Section Title Component -->
<template>
  <div class="section-title d-flex">
    <h1
      class="wow zoomIn section-title-text w-100 text-uppercase font-weight-bold text-center"
      :TitleText="TitleText"
    >
      {{ TitleText }}
    </h1>
    <p class="title-line mx-auto w-100">
      <span class="wow zoomIn d-block mx-auto" data-wow-delay=".5s"></span>
    </p>
  </div>
</template>

<script>
export default {
  name: "SectionTitle",
  props: ["TitleText"],
};
</script>

<style scoped>
h1 {
  color: #3a3798;
  margin-bottom: 20px;
  font-size: 46px;
}

p {
  margin-bottom: 50px;
}

span {
  height: 5px;
  width: 25%;
  background-color: #ffc961;
  border-radius: 10px;
}

@media only screen and (max-width: 600px) {
  .section-title h1 {
    font-size: 30px !important;
  }

  .section-title span {
    width: 50% !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .section-title span {
    width: 50%;
  }
}
</style>
