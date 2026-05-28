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
  background: linear-gradient(135deg, #1e1b4b 0%, #363999 40%, #6c63ff 70%, #ff5e94 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 18px;
  font-size: 48px;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

p {
  margin-bottom: 50px;
}

/* Animated rainbow underline */
span {
  height: 5px;
  width: 25%;
  background: linear-gradient(90deg, #363999, #6c63ff, #ff5e94, #ffc961, #363999);
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
  border-radius: 10px;
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

@media only screen and (max-width: 600px) {
  .section-title h1  { font-size: 28px !important; }
  .section-title span { width: 50% !important; }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .section-title h1  { font-size: 38px !important; }
  .section-title span { width: 40%; }
}
</style>
