<!-- Start Of Quizes Categories Page -->
<template>
  <section class="quizes-categories">
    <PageTitle :titleText="$t('quizesCategories.pageTitle')" />
    <section class="categories">
      <v-container>
        <v-row class="wow fadeIn">
          <!-- QuizCategoriesPage Component -->
          <QuizCategoriesPage
            v-for="category in categories"
            :key="category.id"
            :categoryImgSrc="category.categoryImgSrc"
            :categoryImgAlt="category.categoryImgAlt"
            :categoryTitle="category.categoryTitle"
            :categoryQuestionsNumber="category.categoryQuestionsNumber"
            :catLink="category.catLink"
            :wowDelay="categoriesDelay[category.id - 1].wowDelay"
          />
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import QuizCategoriesPage from "@/components/QuizCategoriesPage";
export default {
  layout: "form",
  head() {
    return {
      title: this.$t("quizesCategories.pageTitle"),
    };
  },
  data() {
    return {
      // Delay Of The Quiz Box In The Quizes Section
      categoriesDelay: [
        {
          id: 1,
          wowDelay: "0s",
        },
        {
          id: 2,
          wowDelay: "0.1s",
        },
        {
          id: 3,
          wowDelay: ".2s",
        },
        {
          id: 4,
          wowDelay: ".3s",
        },
        {
          id: 5,
          wowDelay: ".4s",
        },
        {
          id: 6,
          wowDelay: ".5s",
        },
        {
          id: 7,
          wowDelay: ".4s",
        },
        {
          id: 8,
          wowDelay: ".45s",
        },
        {
          id: 9,
          wowDelay: ".5s",
        },
        {
          id: 10,
          wowDelay: ".55s",
        },
        {
          id: 11,
          wowDelay: ".6s",
        },
        {
          id: 12,
          wowDelay: ".66s",
        },
      ],
    };
  },
  computed: {
    // Data Of QuizCategoriesPage Component
    categories() {
      return [
        {
          id: 1,
          categoryImgSrc: require("@/assets/images/categories-img/global.png"),
          categoryImgAlt: "global-information-img",
          categoryTitle: this.$t("categoriesNames.publicInfoCategory"),
          categoryQuestionsNumber: "5645",
          catLink: "/quizes-cat",
        },
        {
          id: 2,
          categoryImgSrc: require("@/assets/images/categories-img/languages.png"),
          categoryTitle: this.$t("categoriesNames.languagesCategory"),
          categoryImgAlt: "languages-img",
          categoryQuestionsNumber: "356",
          catLink: "/quizes-cat",
        },
        {
          id: 3,
          categoryImgSrc: require("@/assets/images/categories-img/education.png"),
          categoryImgAlt: "education-img",
          categoryTitle: this.$t("categoriesNames.educationCategory"),
          categoryQuestionsNumber: "898",
          catLink: "/quizes-cat",
        },
        {
          id: 4,
          categoryImgSrc: require("@/assets/images/categories-img/atom.png"),
          categoryImgAlt: "science-img",
          categoryTitle: this.$t("categoriesNames.scienceCategory"),
          categoryQuestionsNumber: "789",
          catLink: "/quizes-cat",
        },
        {
          id: 5,
          categoryImgSrc: require("@/assets/images/categories-img/ancient-scroll.png"),
          categoryImgAlt: "history-img",
          categoryTitle: this.$t("categoriesNames.historyCategory"),
          categoryQuestionsNumber: "645",
          catLink: "/quizes-cat",
        },
        {
          id: 6,
          categoryImgSrc: require("@/assets/images/categories-img/pendulum.png"),
          categoryImgAlt: "physics-img",
          categoryTitle: this.$t("categoriesNames.physicsCategory"),
          categoryQuestionsNumber: "694",
          catLink: "/quizes-cat",
        },
        {
          id: 7,
          categoryImgSrc: require("@/assets/images/categories-img/flask.png"),
          categoryImgAlt: "chemistry-img",
          categoryTitle: this.$t("categoriesNames.chemistryCategory"),
          categoryQuestionsNumber: "650",
          catLink: "/quizes-cat",
        },
        {
          id: 8,
          categoryImgSrc: require("@/assets/images/categories-img/mathematics.png"),
          categoryImgAlt: "mathematics-img",
          categoryTitle: this.$t("categoriesNames.mathematicsCategory"),
          categoryQuestionsNumber: "658",
          catLink: "/quizes-cat",
        },
        {
          id: 9,
          categoryImgSrc: require("@/assets/images/categories-img/global-network.png"),
          categoryImgAlt: "information-img",
          categoryTitle: this.$t("categoriesNames.informationCategory"),
          categoryQuestionsNumber: "756",
          catLink: "/quizes-cat",
        },
        {
          id: 10,
          categoryImgSrc: require("@/assets/images/categories-img/tools.png"),
          categoryImgAlt: "arts-img",
          categoryTitle: this.$t("categoriesNames.artsCategory"),
          categoryQuestionsNumber: "756",
          catLink: "/quizes-cat",
        },
        {
          id: 11,
          categoryImgSrc: require("@/assets/images/categories-img/fitness.png"),
          categoryImgAlt: "sport-img",
          categoryTitle: this.$t("categoriesNames.sportCategory"),
          categoryQuestionsNumber: "254",
          catLink: "/quizes-cat",
        },
        {
          id: 12,
          categoryImgSrc: require("@/assets/images/categories-img/check-box.png"),
          categoryImgAlt: "all-categories",
          categoryTitle: this.$t("categoriesNames.allCategories"),
          categoryQuestionsNumber: "254",
          catLink: "/quizes-cat",
        },
      ];
    },
  },
  components: {
    PageTitle,
    QuizCategoriesPage,
  },
};
</script>

<style scoped>
.categories {
  margin-top: 50px;
}

@media only screen and (max-width: 600px) {
  .categories {
    margin-top: 30px !important;
  }
}
</style>
