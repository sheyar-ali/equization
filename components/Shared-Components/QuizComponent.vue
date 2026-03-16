<!-- Start Of The Quizs Component -->
<template>
  <v-col
    lg="3"
    md="6"
    sm="12"
    cols="12"
    class="wow fadeIn tests-container mx-auto"
    :data-wow-delay="wowDelay"
  >
    <nuxt-link
      :to="localePath(questLink)"
      class="d-block w-100 card bg-white overflow-hidden"
    >
      <div class="card-head position-relative">
        <img
          :src="coverImage || require('@/assets/images/Home-Page-Images/EQUIZATION.png')"
          class="card-img-top w-100"
          alt="test-img"
          @error="$event.target.src = require('@/assets/images/Home-Page-Images/EQUIZATION.png')"
        />
        <div class="test-description position-absolute">
          <p class="text-white">
            {{ questNumbers }} {{ $t("quizesSection.question") }}
          </p>
          <p class="text-white">
            {{ playersNumbers }} {{ $t("quizesSection.player") }}
          </p>
        </div>
      </div>
      <h4 class="test-title text-center text-dark font-weight-bold">
        {{ quizTitle }}
      </h4>
      <div class="departments justify-center d-flex flex-wrap">
        <span
          v-for="(category, i) in categories"
          :key="i"
          class="font-weight-bold"
          >{{ category.categoryName }}</span
        >
      </div>
    </nuxt-link>
  </v-col>
</template>

<script>
export default {
  name: "QuizComponent",
  props: [
    "questLink",
    "questNumbers",
    "playersNumbers",
    "quizTitle",
    "categories",
    "categoryLink",
    "wowDelay",
    "coverImage",
  ],
};
</script>

<style scoped>
.tests-container {
  margin-bottom: 25px;
}

.card {
  padding: 0;
  border: none;
  border-radius: 35px;
}

img {
  display: block;
  object-fit: cover;
  height: 150px !important;
}

.card-head,
h4,
.departments {
  margin-bottom: 15px;
}

.test-description {
  bottom: 1px;
  right: 3px;
}

p {
  background-color: rgba(255, 94, 148, 0.8);
  margin: 5px 0;
  padding: 3px 7px;
  font-size: 14px;
  border-radius: 9px;
}

@media only screen and (max-width: 600px) {
  .tests-container {
    margin-bottom: 0px;
  }
}

/* Ltr Direction Style */
.ltr .test-description {
  right: auto !important;
  left: 3px;
}
</style>
