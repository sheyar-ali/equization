<!-- Start Of Why Us Component -->
<template>
  <v-col
    lg="4"
    md="6"
    cols="11"
    class="wow fadeIn feature bg-white feature-content"
    :data-wow-delay="wowDelay"
  >
    <div class="feature-header d-flex">
      <h3 class="font-weight-bold text-right" :featureTitle="featureTitle">
        {{ featureTitle }}
      </h3>
      <img :src="featureImg" :alt="featureImgAlt" />
    </div>
    <p class="feature-text text-justify" :featureText="featureText">
      {{ featureText }}
    </p>
  </v-col>
</template>

<script>
export default {
  name: "WhyUsComponent",
  props: [
    "featureTitle",
    "featureImg",
    "featureImgAlt",
    "featureText",
    "wowDelay",
  ],
};
</script>

<style scoped>
.feature {
  padding: 20px;
  border-radius: 20px;
  margin: 10px 0;
  cursor: context-menu;
  z-index: 2;
}

.feature:hover {
  -webkit-transform: scale(1.02);
  -moz-transform: scale(1.02);
  -ms-transform: scale(1.02);
  -o-transform: scale(1.02);
  transform: scale(1.02);
}

.feature:hover img {
  transform: rotate(-10deg);
}

.feature,
img {
  -webkit-transition: transform 0.3s ease-in-out;
  -moz-transition: transform 0.3s ease-in-out;
  -ms-transition: transform 0.3s ease-in-out;
  -o-transition: transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out;
}

.feature-header {
  margin-bottom: 15px;
}

h3 {
  font-size: 23px;
  color: #3a3798;
  line-height: 33px;
}

.feature img {
  width: 25%;
}

p {
  font-size: 18px;
  line-height: 29px;
  color: #8d8cd1;
  font-family: "Almarai";
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  .feature-content {
    flex: 0 0 48.5% !important;
  }

  .feature-content:nth-of-type(even) {
    margin-right: 15px;
  }

  /* Ltr Direction Style */
  .ltr .feature-content:nth-of-type(even) {
    margin-right: 0px;
    margin-left: 15px !important;
  } 
}

@media only screen and (min-width: 992px) {
  .feature-content {
    flex: 0 0 32.333333% !important;
  }
}

/* Ltr Direction Style */
.ltr .feature:hover img {
  transform: rotate(10deg) !important;
}
</style>
