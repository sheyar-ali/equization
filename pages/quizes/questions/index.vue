<template>
  <section
    class="question-page d-flex align-center justify-center"
    style="min-height: 100vh; width: 100%;"
  >
    <section class="account-section d-flex align-center mx-auto w-100">
      <v-container fluid>
        <v-row>
          <!-- Side Menu -->
          <SideMenu activeLink="myQuizzes" />
          <!-- Account Quizes Content -->
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100">
              <AccountHeader
                :headerText="headerContent.headerText"
                :backLink="headerContent.backLink"
                :backText="headerContent.backText"
                :isActive="headerContent.isActive"
              />
              <v-row class="questions-container" v-if="questions.length > 0">
                <Question
                  v-for="question in questions"
                  :key="question.id"
                  :imgSrc="question.imgSrc"
                  :questionTitle="question.questionTitle"
                  :questionTime="question.questionTime"
                  :answersNumber="question.answersNumber"
                />
              </v-row>
              <v-row v-else>
                <EmptyData :descriptionText="emptyData.descriptionText" />
              </v-row>
              <div class="sub-btn d-flex align-center justify-center">
                <v-btn
                  class="white--text title sub-btn d-flex align-center"
                  @click="$router.push(localePath('/quizes/questions/add'))"
                >
                  {{ $t("questionPage.subBtn") }}
                </v-btn>
              </div>
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
import Question from "@/components/AccountComponents/Question";
import EmptyData from "@/components/AccountComponents/EmptyData";
export default {
  layout: "account",
  head() {
    return {
      title: this.$t("questionPage.title"),
    };
  },
  data() {
    return {
      questionName: "تجرية إختبار عنوان تجريبي",
    };
  },
  computed: {
    // Header Content
    headerContent() {
      return {
        headerText: `${this.$t("questionPage.headerText")} ${
          this.questionName
        }`,
        backLink: "/quizes/my-quiz",
        backText: this.$t("AccountPage.AccountHeader.backText"),
        isActive: true,
      };
    },
    // Questions Data
    questions() {
      return [
        {
          id: 1,
          imgSrc: require("@/assets/images/Home-Page-Images/EQUIZATION.png"),
          questionTitle: "نص السؤال الأول التجريبي نص غير صحيح",
          questionTime: "30",
          answersNumber: "4",
        },
        {
          id: 2,
          imgSrc: "",
          questionTitle: "نص السؤال الأول التجريبي",
          questionTime: "30",
          answersNumber: "4",
        },
        {
          id: 3,
          imgSrc: "",
          questionTitle: "نص السؤال الأول التجريبي",
          questionTime: "30",
          answersNumber: "4",
        },
        {
          id: 4,
          imgSrc: "",
          questionTitle: "نص السؤال الأول التجريبي",
          questionTime: "30",
          answersNumber: "4",
        },
        {
          id: 5,
          imgSrc: "",
          questionTitle: "نص السؤال الأول التجريبي",
          questionTime: "30",
          answersNumber: "4",
        },
        {
          id: 6,
          imgSrc: "",
          questionTitle: "نص السؤال الأول التجريبي",
          questionTime: "30",
          answersNumber: "4",
        },
      ];
    },
    // Empty Data Content
    emptyData() {
      return {
        descriptionText: this.$t("questionPage.emptyData.descriptionText"),
      };
    },
  },
  components: {
    SideMenu,
    AccountHeader,
    Question,
    EmptyData,
  },
};
</script>

<style scoped>
.questions-container {
  margin-top: 23px;
  margin-bottom: 10px;
}

.sub-btn {
  margin: 27px 0 19px;
}

.sub-btn button {
  height: 51px !important;
  min-width: 200px !important;
  padding: 1px 35px 3px !important;
}

.empty-data a {
  display: none !important;
}
</style>
