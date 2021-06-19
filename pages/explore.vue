<!-- Strat Of quizes Explore Page -->
<template>
  <section class="quizes-page explore overflow-hidden">
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('quizesExplorePage.pageTitle')" />
    <section class="quizes">
      <v-container>
        <v-row class="quiz-categories flex-column">
          <v-col md="7" cols="12" class="mx-auto wow fadeIn">
            <div class="search-box">
              <!-- Search Form -->
              <v-form class="w-100 d-flex align-center">
                <!-- Search Input -->
                <v-text-field
                  class="search-box"
                  type="text"
                  :label="$t('quizesExplorePage.labelText')"
                  solo
                  flat
                  prepend-inner-icon="mdi-magnify"
                >
                </v-text-field>
                <!-- Submit Input -->
                <v-btn text class="white--text title">
                  {{ $t("quizesExplorePage.buttonText") }}
                </v-btn>
              </v-form>
            </div>
          </v-col>
          <v-col cols="12 wow fadeIn">
            <!-- Page Header -->
            <div class="categories">
              <div
                class="categories-header d-flex justify-space-between align-center"
              >
                <div class="d-flex align-center categories-header-title">
                  <h2 class="categories-title font-weight-bold">
                    {{ $t("quizesExplorePage.categoriesTitle") }}
                  </h2>
                  <!-- Categories Page Link -->
                  <nuxt-link
                    :to="localePath('/categories')"
                    class="font-weight-bold"
                  >
                    {{ $t("quizesExplorePage.categoriesLink") }}
                  </nuxt-link>
                </div>
                <div class="d-flex select-box">
                  <!-- Classify Select -->
                  <v-select
                    hide-details
                    :value="items[0]"
                    :items="items"
                    prepend-icon="mdi-filter-outline"
                  >
                  </v-select>
                </div>
              </div>
              <v-divider horizontal class="rounded"></v-divider>
              <div class="categories-box">
                <v-sheet class="mx-auto">
                  <!-- QuizCategories Component -->
                  <QuizCategories />
                </v-sheet>
              </div>
            </div>
          </v-col>
          <v-row class="quizes-categories wow fadeIn">
            <!-- QuizComponent Component -->
            <QuizComponent
              v-for="quiz in quizes"
              :key="quiz.id"
              :questLink="quiz.questLink"
              :questNumbers="quiz.questNumbers"
              :playersNumbers="quiz.playersNumbers"
              :quizTitle="quiz.quizTitle"
              :categories="quiz.categories"
              :wowDelay="quizesDelay[quiz.id - 1].wowDelay"
            />
          </v-row>
          <v-col cols="12 wow fadeIn">
            <Pagination :pagesLength="3" />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import QuizCategories from "@/components/QuizCategories";
import QuizComponent from "@/components/Shared-Components/QuizComponent";
import Pagination from "@/components/Shared-Components/Pagniation";
export default {
  layout: "form",
  head() {
    return {
      title: this.$t("quizesExplorePage.pageTitle"),
    };
  },
  data() {
    return {
      // Delay Of The Quiz Box In The Quizes Section
      quizesDelay: [
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
    // Data Of The Classify Select
    items() {
      return [
        `${this.$t("quizesExplorePage.selectBox.firstSelect")}`,
        `${this.$t("quizesExplorePage.selectBox.secondSelect")}`,
        `${this.$t("quizesExplorePage.selectBox.thirdSelect")}`,
      ];
    },
    quizes: function() {
      // Data Of The Quiz Component
      return [
        {
          id: 1,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الأول",
          categories: [
            {
              categoryName: "معلومات عامة",
              categoryLink: "/",
            },
            {
              categoryName: "كيمياء",
              categoryLink: "/",
            },
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 2,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الثانى",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "معلومات عامة",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 3,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الثالث",
          categories: [
            {
              categoryName: "تاريخ",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
            {
              categoryName: "فيزياء",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 4,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الرابع",
          categories: [
            {
              categoryName: "تعليم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 5,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الخامس",
          categories: [
            {
              categoryName: "تاريخ",
              categoryLink: "/",
            },
            {
              categoryName: "لغات أجنبية",
              categoryLink: "/",
            },
            {
              categoryName: "فيزياء",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 6,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار السادس",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
            {
              categoryName: "كيمياء",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 7,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار السابع",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 8,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الثامن",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
            {
              categoryName: "تاريخ",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 9,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار التاسع",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 10,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار العاشر",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
            {
              categoryName: "تاريخ",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 11,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الحادى عشر",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 12,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الثانى عشر",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
            {
              categoryName: "تاريخ",
              categoryLink: "/",
            },
          ],
        },
      ];
    },
  },
  components: {
    PageTitle,
    QuizCategories,
    QuizComponent,
    Pagination,
  },
  props: ["titleText"],
};
</script>

<style>
.explore .quizes {
  margin-top: 40px !important;
}

.search-box {
  padding-left: 9px;
  padding-right: 15px;
  border-radius: 25px;
}

.search-box.v-text-field.v-text-field--solo .v-input__control {
  min-height: 60px !important;
}

.search-box .v-input__slot {
  margin-bottom: 0 !important;
  border-radius: 20px;
}

.search-box i {
  margin-top: 3px;
  font-size: 28px !important;
}

.search-box input {
  padding-right: 10px !important;
}

.search-box label {
  right: 9px !important;
  font-size: 20px !important;
  overflow: visible !important;
}

.search-box .v-text-field__details {
  display: none !important;
}

.search-box button {
  background-color: #3a3798 !important;
  height: auto !important;
  padding: 3px 35px 4px !important;
  border-radius: 20px !important;
}

.explore .categories {
  margin-bottom: 30px;
}

.explore .categories-title {
  color: #3a3798;
}

.explore .categories-header a {
  color: #ff5e94;
  font-size: 20px;
  margin-right: 15px;
  margin-top: 3px;
}

.explore .categories-title,
.explore .categories-header a {
  font-family: "Almarai" !important;
}

.explore .select-box {
  width: 15%;
  border: 2px solid #ccc;
  border-radius: 10px;
}

.select-box .v-select__selection.v-select__selection--comma {
  font-size: 16px !important;
  color: #777373 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.select-box .v-select__selections {
  justify-content: flex-start !important;
  padding: 0 3px;
  line-height: normal !important;
}

.select-box .v-input__prepend-outer {
  margin-left: 0 !important;
}

.select-box .v-text-field .v-label {
  top: 6px !important;
  overflow: visible !important;
}

.select-box .v-input__slot {
  min-height: 30px !important;
}

.select-box .v-input__append-inner {
  margin-top: 3px !important;
}

.select-box .v-icon.notranslate.mdi-menu-down,
.select-box .v-input.v-input--is-focused i {
  color: #ccc !important;
}

.explore .categories hr {
  margin: 0.5rem 0 !important;
  border-top-width: 2px !important;
}

.search-box,
.search-box .v-input__slot {
  background-color: #eeeeee !important;
}

.categories-box .v-card {
  border-radius: 15px !important;
}

@media only screen and (max-width: 600px) {
  .search-box button.title {
    padding: 3px 20px 4px !important;
    font-size: 18px !important;
  }

  .search-box.v-text-field.v-text-field--solo .v-input__control {
    min-height: 53px !important;
  }

  .explore .categories {
    margin-bottom: 15px !important;
  }

  .explore .quizes {
    margin-top: 15px !important;
  }

  .categories-header-title {
    flex-direction: column;
  }

  .categories-title {
    font-size: 22px !important;
  }

  .categories-header-title a {
    margin: 3px 0 0 !important;
    font-size: 16px !important;
  }

  .select-box {
    width: 47% !important;
  }

  .categories-box .v-card {
    width: 125px !important;
  }

  .v-slide-group__next {
    min-width: 23px !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    height: 100% !important;
    background-image: linear-gradient(
      90deg,
      white 0%,
      rgba(255, 255, 255, 0) 100%
    ) !important;
  }
  .v-slide-group__prev {
    min-width: 10px !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .select-box {
    width: 30% !important;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  .explore .select-box {
    width: 25% !important;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1264px) {
  .explore .select-box {
    width: 19% !important;
  }
}

/* Ltr Direction Style */

.ltr .v-slide-group__next {
  left: unset !important;
  right: 0 !important;
  background-image: -webkit-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    white 100%
  ) !important;
  background-image: -moz-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    white 100%
  ) !important;
  background-image: -o-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    white 100%
  ) !important;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    white 100%
  ) !important;
}

.ltr .search-box {
  padding-right: 9px !important;
}

.ltr .search-box input {
  padding-left: 10px !important;
  padding-right: 0 !important;
}

.ltr .search-box label {
  right: auto !important;
  left: 9px !important;
}

.ltr .categories-header-title a {
  margin-left: 15px;
  margin-right: 0 !important;
  margin-top: 3px;
}
</style>
