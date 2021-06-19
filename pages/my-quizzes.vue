<template>
  <section class="page-section justify-center align-center d-flex">
    <section class="account-section d-flex align-center justify-center mx-auto">
      <v-container fluid>
        <v-row>
          <!-- Side Menu -->
          <SideMenu activeLink="myQuizzes" />
          <!-- Account Quizes Content -->
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100">
              <!-- AccountHeader Component -->
              <AccountHeader
                :headerText="headerContent.headerText"
                :backLink="headerContent.backLink"
                :backText="headerContent.backText"
                :isActive="headerContent.isActive"
              />
              <v-row class="quizzes" v-if="quizs.length > 0">
                <!-- Quizes Component -->
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
              <v-row v-else>
                <!-- EmptyData Component -->
                <EmptyData
                  :descriptionText="emptyData.descriptionText"
                  :linkPath="emptyData.linkPath"
                  :linkText="emptyData.linkText"
                />
              </v-row>
              <!-- Pagination Component -->
              <Pagination :pagesLength="3" v-if="quizs.length > 0" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import SideMenu from "@/components/AccountComponents/SideMenu";
import AccountHeader from "@/components/AccountComponents/AccountHeader";
import QuizComponent from "@/components/Shared-Components/QuizComponent";
import EmptyData from "@/components/AccountComponents/EmptyData";
import Pagination from "@/components/Shared-Components/Pagniation";
export default {
  layout: "account",
  head() {
    return {
      title: this.$t("myQuizzesPage.AccountHeader.headerText"),
    };
  },
  data() {
    return {
      // Data Of The QuizComponent
      quizsDelay: [
        {
          id: 1,
          wowClass: "wow slideInRight",
          wowDelay: "0s",
        },
        {
          id: 2,
          wowClass: "wow zoomIn",
          wowDelay: "0.1s",
        },
        {
          id: 3,
          wowClass: "wow zoomIn",
          wowDelay: ".2s",
        },
        {
          id: 4,
          wowClass: "wow slideInLeft",
          wowDelay: ".3s",
        },
        {
          id: 5,
          wowClass: "wow slideInRight",
          wowDelay: ".4s",
        },
        {
          id: 6,
          wowClass: "wow zoomIn",
          wowDelay: ".5s",
        },
      ],
    };
  },
  computed: {
    // Header Content
    headerContent() {
      return {
        headerText: this.$t("myQuizzesPage.AccountHeader.headerText"),
        backLink: "/",
        backText: this.$t("AccountPage.AccountHeader.backText"),
        isActive: false,
      };
    },
    // The Data Of The Quizzes
    quizs() {
      return [
        {
          id: 1,
          questLink: "/quizes/my-quiz",
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
          questLink: "/quizes/my-quiz",
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
          questLink: "/quizes/my-quiz",
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
          questLink: "/quizes/my-quiz",
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
          questLink: "/quizes/my-quiz",
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
          questLink: "/quizes/my-quiz",
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
      ];
    },
    // Data Of The Empty Data Component
    emptyData() {
      return {
        descriptionText: this.$t("myQuizzesPage.emptyData.descriptionText"),
        linkPath: "/",
        linkText: this.$t("myQuizzesPage.emptyData.linkText"),
      };
    },
  },
  components: {
    SideMenu,
    AccountHeader,
    QuizComponent,
    EmptyData,
    Pagination,
  },
};
</script>

<style scoped>
.account-section-content {
  padding-bottom: 20px !important;
}

.quizzes {
  margin: 0 -12px !important;
}

@media only screen and (min-width: 1200px) {
  .quizzes {
    padding: 0 60px !important;
  }
}
</style>
