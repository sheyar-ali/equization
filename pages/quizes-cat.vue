<template>
  <section class="chemistry-categories">
    <!-- PageTite Component -->
    <PageTitle :titleText="$t('quizesCatPage.pageTitle')" />
    <section class="chemistry-category">
      <v-container>
        <v-row>
          <!-- QuizComponent -->
          <QuizComponent
            v-for="quiz in quizs"
            :key="quiz.id"
            :questLink="quiz.questLink"
            :questNumbers="quiz.questNumbers"
            :playersNumbers="quiz.playersNumbers"
            :quizTitle="quiz.quizTitle"
            :categories="quiz.categories"
            :wowDelay="quizsDelay[quiz.id - 1].wowDelay"
          />
        </v-row>
        <v-row>
          <v-col cols="12 wow fadeIn">
            <!-- Pagniation Component -->
            <Pagniation :pagesLength="3" />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import QuizComponent from "@/components/Shared-Components/QuizComponent";
import Pagniation from "@/components/Shared-Components/Pagniation";
export default {
  layout: "form",
  head() {
    return {
      title: this.$t("quizesCatPage.pageTitle"),
    };
  },
  data() {
    return {
      // Delay Of The Quiz Box In The Quizes Section
      quizsDelay: [
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
    // The Data Of The Quiz Section
    quizs() {
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
              categoryName: "كيمياء",
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
              categoryName: "كيمياء",
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
              categoryName: "كيمياء",
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
              categoryName: "كيمياء",
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
              categoryName: "كمياء",
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
              categoryName: "كيمياء",
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
              categoryName: "كيمياء",
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
              categoryName: "تاريخ",
              categoryLink: "/",
            },
            {
              categoryName: "كيمياء",
              categoryLink: "/",
            },
            {
              categoryName: "فيزياء",
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
              categoryName: "كمياء",
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
              categoryName: "كيمياء",
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
              categoryName: "كيمياء",
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
    QuizComponent,
    Pagniation,
  },
};
</script>

<style scoped>
.chemistry-category {
  margin-top: 50px;
}

@media only screen and (max-width: 600px) {
  .chemistry-category {
    margin-top: 30px !important;
  }
}
</style>
