<!-- Start Numbers Section Component -->
<template>
  <v-col
    :class="wowClass"
    class="numbers-box"
    cols="11"
    sm="10"
    md="7"
    lg="4"
    data-wow-duration="1.2s"
  >
    <div class="num-content d-flex position-relative">
      <div class="num-img position-absolute">
        <img :src="numImgSrc" class="d-block w-100 mx-auto" :alt="numImgAlt" />
      </div>
      <h5 class="num-title font-weight-bold">
        {{ titleText }}
      </h5>
      <p class="num-value font-weight-bold">
        {{ numValue }}
      </p>
    </div>
  </v-col>
</template>

<script>
export default {
  name: "NumbersComponent",
  props: [
    "numImgSrc",
    "numImgAlt",
    "titleText",
    "numValue",
    "wowClass",
    "wowDelay",
  ],
};
</script>

<style scoped>
/* Start Numbers Section */
.num-content {
  align-items: center;
  flex-direction: column;
  padding: 25px 5px 10px;
  border-radius: 50px;
  cursor: context-menu;
}

.num-content:hover {
  transform: scale(1.02);
  box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.08);
}

.num-content:hover .num-img,
.num-content:hover img {
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
}

.num-content:hover .num-img {
  border-radius: 50%;
}

.num-img {
  top: -50px;
  width: 100px;
  height: 100px;
  background: linear-gradient(69deg, #ffc961, #fde4b4);
  padding: 17px;
  border-radius: 25px;
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
  transform: rotate(-45deg);
  border-left: 1px solid #efedff;
  border-bottom: 1px solid #efedff;
}

.num-img img {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  filter: invert(1);
}

.num-content,
.num-img,
.num-img img {
  -webkit-transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
  -moz-transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
  -ms-transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
  -o-transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
}

.num-title {
  color: #b5b5b5;
  margin: 50px 0 0;
}

.num-value {
  color: #3a3798;
  font-size: 65px;
}
/* End Numbers Section */

@media only screen and (max-width: 600px) {
  .numbers-box:nth-of-type(2) {
    margin: 80px 0 !important;
  }

  .num-value {
    font-size: 58px !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .numbers-box:nth-of-type(2) {
    margin: 70px 0 !important;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1264px) {
  .numbers-box:nth-of-type(2) {
    margin: 70px 0 !important;
  }
}
</style>
