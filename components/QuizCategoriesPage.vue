<template>
  <v-col
    lg="3"
    md="6"
    sm="12"
    cols="12"
    class="categories-content mx-auto wow fadeIn"
    :data-wow-delay="wowDelay"
  >
    <nuxt-link :to="localePath(catLink)" class="card bg-white overflow-hidden">
      <div class="category-img d-flex justify-center align-center">
        <img :src="categoryImgSrc" class="mx-auto" :alt="categoryImgAlt" />
      </div>
      <div class="category-content">
        <h4 class="test-title text-center text-dark font-weight-bold">
          {{ categoryTitle }}
        </h4>
        <div
          class="category-description justify-center d-flex flex-wrap bg-white"
        >
          <span class="font-weight-bold">
            {{ ` ${categoryQuestionsNumber} ${$t("quizesCategories.quiz")} ` }}
          </span>
        </div>
      </div>
    </nuxt-link>
  </v-col>
</template>

<script>
export default {
  name: "QuizCategoriesPage",
  props: [
    "categoryImgSrc",
    "categoryImgAlt",
    "categoryTitle",
    "categoryQuestionsNumber",
    "catLink",
    "wowDelay",
  ],
};
</script>

<style scoped>
.categories-content {
  margin-bottom: 25px !important;
}

.card {
  padding: 0;
  border: none;
  border-radius: 35px;
}

.category-img {
  padding: 30px 0;
  background-color: #e6e7f0 !important;
}

img {
  width: 40%;
}

.category-img,
h4,
.category-description span {
  margin-bottom: 15px;
}

.category-description {
  margin-bottom: 10px;
}

span {
  cursor: auto !important;
}
</style>
