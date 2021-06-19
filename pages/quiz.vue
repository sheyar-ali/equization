<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('quizPage.pageTitle')" />
    <section class="quiz-page d-flex mx-auto wow fadeIn">
      <v-container class="rounded overflow-hidden">
        <v-row class="flex-column">
          <v-col
            cols="12"
            class="d-flex quiz-header justify-space-between align-center"
          >
            <!-- back btn -->
            <span
              @click="$router.push(localePath('/explore'))"
              class="d-flex align-center font-weight-bold back-link"
            >
              <i class="fas fa-angle-right back-icon"></i>
              <span class="back-text">{{ $t("quizPage.backLink") }}</span>
            </span>

            <!-- actions -->
            <div class="popup-icons">
              <!-- favorite -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon color="pink accent-1" v-bind="attrs" v-on="on">
                    <i class="fas fa-heart"></i>
                  </v-btn>
                </template>
                <span>{{ $t("quizPage.addToFavorite") }}</span>
              </v-tooltip>

              <!-- share -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="pink accent-1"
                    @click="share = true"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <i class="fas fa-share-alt"></i>
                  </v-btn>
                </template>
                <span>{{ $t("quizPage.shareQuiz") }}</span>
              </v-tooltip>
            </div>

            <!-- start btn -->
            <v-btn
              @click="startQuiz = true"
              class="white--text start-quiz title"
              text
            >
              {{ $t("quizPage.startBtn") }}
            </v-btn>
          </v-col>
          <v-divider Horizontal class="rounded"></v-divider>
          <v-col cols="12" class="d-flex justify-space-between quiz-container">
            <v-row>
              <v-col md="6" cols="12">
                <div class="quiz-content">
                  <!-- The Title Of The Quiz -->
                  <h1 class="quiz-title font-weight-bold text-justify">
                    {{ quizDetails.quizTitle }}
                  </h1>
                  <p class="title-line rounded"></p>
                  <div class="quiz-description overflow-hidden">
                    <p class="font-weight-bold">
                      {{ quizDetails.quizDescription }}
                    </p>
                    <p class="full-desc" id="fullDesc">
                      {{ quizDetails.quizFullDescription }}
                    </p>
                    <p
                      @click="showDesc = true"
                      class="read-more hidden"
                      id="read-more"
                    >
                      {{ $t("quizPage.showMore") }}
                    </p>
                  </div>
                  <v-row
                    class="d-flex w-100 player-details justify-space-between"
                  >
                    <!-- PlayersDetails Component -->
                    <PlayersDetails
                      v-for="detail in playersDetails"
                      :key="detail.id"
                      :iconClass="detail.icon"
                      :text="detail.text"
                    />
                  </v-row>
                </div>
              </v-col>
              <v-col md="6" cols="12">
                <div class="quiz-img h-100">
                  <!-- Quiz Img -->
                  <img
                    src="@/assets/images/Home-Page-Images/EQUIZATION.png"
                    class="d-block w-100 h-100"
                    alt="quiz-img"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-row class="quiz-info justify-space-between">
            <v-col md="6" cols="12" class="quiz-info-content">
              <v-row class="justify-space-between ma-0">
                <!-- QuizInfo Component -->
                <QuizInfo
                  v-for="info in quizInfo"
                  :key="info.id"
                  :title="info.infoTitle"
                  :number="info.infoNumber"
                  :imgSrc="info.infoImgSrc"
                />
              </v-row>
            </v-col>
            <v-col class="quiz-categories-content">
              <h2 class="w-100 text-right">
                {{ $t("quizPage.quizCategoriesTitle") }}
              </h2>
              <v-divider Horizontal class="rounded"></v-divider>
              <div class="d-flex ma-0 quiz-page-categories align-center">
                <!-- Categories Component -->
                <Categories
                  v-for="category in categories"
                  :key="category.id"
                  :catLink="category.catLink"
                  :catImgSrc="category.catImgSrc"
                  :catTitle="category.catTitle"
                />
              </div>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </section>

    <!-- share dialog -->
    <v-dialog v-model="share" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">
          {{ $t("quizPage.shareQuiz") }}
        </v-card-title>
        <v-divider></v-divider>
        <ShareNetwork
          v-for="network in networks"
          :network="network.network"
          :key="network.network"
          :url="shareURL"
          :title="$t('quizPage.shareMsg')"
          :description="`${quizDetails.quizDescription}`"
          :quote="$t('quizPage.shareMsg')"
        >
          <v-icon class="pa-2" style="font-size: 48px" :color="network.color">{{
            network.icon
          }}</v-icon>
          <!-- <span>{{ network.name }}</span> -->
        </ShareNetwork>
      </v-card>
    </v-dialog>

    <!-- description dialog -->
    <v-dialog v-model="showDesc" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">
          {{ $t("quizPage.descriptionTitle") }}
        </v-card-title>
        <v-divider></v-divider>
        <p class="full-desc">
          {{ quizDetails.quizFullDescription }}
        </p>
      </v-card>
    </v-dialog>

    <!-- start dialog -->
    <v-dialog v-model="startQuiz" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">
          {{ $t("quizPage.startBtn") }}
        </v-card-title>
        <v-divider></v-divider>
        <p class="text-center mt-5 h5">
          {{ $t("dialog.dialogTitle") }}
        </p>
        <v-row class="px-10 pt-2 pb-5">
          <v-col class="pa-2">
            <v-btn
              outlined
              @click="$router.push(localePath('/play/options'))"
              color="primary"
              class="w-100"
              style="height: 50px"
            >
              <v-icon class="mx-2"> mdi-account-outline </v-icon>
              <span style="font-family: 'Almarai'" class="font-weight-bold">{{
                $t("dialog.individualPlayer")
              }}</span>
            </v-btn>
          </v-col>
          <v-col class="pa-2">
            <v-btn
              @click="$router.push(localePath('/host/options'))"
              outlined
              color="primary"
              class="w-100"
              style="height: 50px"
            >
              <v-icon class="mx-2"> mdi-account-group-outline </v-icon>
              <span style="font-family: 'Almarai'" class="font-weight-bold">{{
                $t("dialog.multiPlayers")
              }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import PlayersDetails from "@/components/Quiz-Page-Components/PlayerDetails";
import QuizInfo from "@/components/Quiz-Page-Components/QuizInfo";
import Categories from "@/components/Quiz-Page-Components/Categories";
export default {
  layout: "form",
  head() {
    let quiz = [];
    quiz["id"] = 5;
    if (this.$i18n.locale == "ar") {
      this.shareURL = `https://equization.com/quiz/${quiz.id}`;
    } else {
      this.shareURL = `https://equization.com/${this.$i18n.locale}/quiz/${quiz.id}`;
    }
    return {
      title: this.$t("quizPage.quizDetails.title"),
    };
  },
  data() {
    return {
      showDesc: false,
      messageBody: "",
      share: false,
      title: null,
      shareURL: null,
      startQuiz: false,
      meta: [],
      quiz: null,
      networks: [
        {
          network: "facebook",
          name: "Facebook",
          icon: "mdi-facebook",
          color: "#1877f2",
        },
        {
          network: "whatsapp",
          name: "Whatsapp",
          icon: "mdi-whatsapp",
          color: "#25d366",
        },
        {
          network: "email",
          name: "Email",
          icon: "mdi-email-outline",
          color: "#333333",
        },
        {
          network: "twitter",
          name: "Twitter",
          icon: "mdi-twitter",
          color: "#1da1f2",
        },
        {
          network: "linkedin",
          name: "LinkedIn",
          icon: "mdi-linkedin",
          color: "#007bb5",
        },
        {
          network: "quora",
          name: "Quora",
          icon: "mdi-quora",
          color: "#a82400",
        },
        {
          network: "reddit",
          name: "Reddit",
          icon: "mdi-reddit",
          color: "#ff4500",
        },
        {
          network: "skype",
          name: "Skype",
          icon: "mdi-skype",
          color: "#00aff0",
        },
        {
          network: "sms",
          name: "SMS",
          icon: "mdi-comment-processing-outline",
          color: "#333333",
        },
        {
          network: "telegram",
          name: "Telegram",
          icon: "mdi-telegram",
          color: "#0088cc",
        },
        {
          network: "buffer",
          name: "Buffer",
          icon: "mdi-buffer",
          color: "#323b43",
        },
        {
          network: "evernote",
          name: "Evernote",
          icon: "mdi-evernote",
          color: "#2dbe60",
        },
        {
          network: "pinterest",
          name: "Pinterest",
          icon: "mdi-pinterest",
          color: "#bd081c",
        },
        { network: "vk", name: "Vk", icon: "mdi-vk", color: "#4a76a8" },
        {
          network: "wordpress",
          name: "Wordpress",
          icon: "mdi-wordpress",
          color: "#21759b",
        },
        { network: "xing", name: "Xing", icon: "mdi-xing", color: "#026466" },
      ],
      // Data for quizDetails Component
      quizDetails: {
        quizTitle: "تجربة عنوان إختبار تجريبي",
        quizDescription: "شرح مختصر للإختبار يشرح الإختبار بشكل مختصر جداً",
        quizFullDescription:
          "شرح مفصل للإختبار يشرح الإختبار بشكل أكثر تفصيلاً, أكثر من الشرح المختصر الذي يسبقه, هذا الشرح تجريبي فقط, ولا يعتد به بتاتاً, وإنما هو لغرض المعاينة فقط ليس إلا, فلا يأخذ علي محمل الجد إطلاقاً, فكما وضحت سابقاً انه فقط لمعاينة كيف يبدو النص في الموقع في حال إن كان الوصف طويلاً يتعدي طوله الثلاث أسطر فيصبح بالشكل الحالي الذي هو يبدو عليه الآن.",
        // quizFullDescription: "وصف مفصل قصير جداً لا يتعدي طول الوصف سطرين علي الأكثر, بل قد يكون اقصر من ذلك أيضاً, فقد لا يتجاوز طوله بضع كلمات ",
      },
      // Data for playersDetails Component
      playersDetails: [
        {
          id: 1,
          icon: "far fa-user",
          text: this.$t("quizPage.playerName"),
        },
        {
          id: 2,
          icon: "far fa-calendar-alt",
          text: this.$t("quizPage.dateText"),
        },
      ],
      // Data for quizInfo Component
      quizInfo: [
        {
          id: 1,
          infoTitle: this.$t("quizPage.questionInfoTitle"),
          infoNumber: "25",
          infoImgSrc: require("@/assets/images/Home-Page-Images/question.png"),
        },
        {
          id: 2,
          infoTitle: this.$t("quizPage.playersInfoTitle"),
          infoNumber: "250",
          infoImgSrc: require("@/assets/images/Home-Page-Images/group.png"),
        },
      ],
      // Data for The Categories Component
      categories: [
        {
          id: 1,
          catImgSrc: require("@/assets/images/categories-img/global.png"),
          catTitle: this.$t("categoriesNames.publicInfoCategory"),
          catLink: "/quizes-cat",
        },
        {
          id: 2,
          catImgSrc: require("@/assets/images/categories-img/languages.png"),
          catTitle: this.$t("categoriesNames.languagesCategory"),
          catLink: "/quizes-cat",
        },
        {
          id: 3,
          catImgSrc: require("@/assets/images/categories-img/education.png"),
          catTitle: this.$t("categoriesNames.educationCategory"),
          catLink: "/quizes-cat",
        },
      ],
    };
  },
  methods: {
    // Back to The Previous Link Method
    back() {
      if (process.browser) {
        this.$router.go(-1);
      }
    },
  },
  mounted() {
    if (process.browser) {
      const desc = document.getElementById("fullDesc").innerHTML;
      if (desc.length > 150) {
        document.getElementById("read-more").classList.remove("hidden");
      }
    }
  },
  components: {
    PageTitle,
    PlayersDetails,
    QuizInfo,
    Categories,
  },
};
</script>

<style scoped>
.quiz-page {
  margin-top: 50px;
}

.container {
  padding: 10px 25px !important;
}

.quiz-header {
  padding: 17px 10px !important;
}

.back-link,
.start-quiz {
  width: 15% !important;
  cursor: pointer;
}

.back-icon {
  font-size: 28px;
  margin-left: 7px;
}

.back-text {
  font-size: 20px;
}

.back-text,
.back-icon {
  color: #ff5e94;
}

.popup-icons i {
  font-size: 25px;
  color: #d3d6db;
  margin: 0 13px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.popup-icons .v-btn[aria-expanded="true"] i {
  color: #ff5e94;
}

.start-quiz {
  height: auto !important;
  padding: 5px 30px !important;
  background-color: #ff5e94;
  font-family: "Cairo" !important;
  border-radius: 10px !important;
}

hr {
  margin: 0 0 0.2rem !important;
}

.quiz-container {
  padding-bottom: 0;
}

.quiz-title {
  font-size: 35px;
  color: #3a3798;
}

.title-line {
  width: 80%;
  height: 3px;
  margin: 20px 0 15px;
  background-color: #ffc961;
}

.quiz-description p {
  font-family: "Almarai";
  color: #a8a6d4;
  font-size: 20px;
  margin-bottom: 20px;
  text-align: right;
  line-height: 35px;
}

.quiz-description p:first-of-type {
  margin-bottom: 13px;
}

.quiz-description p.full-desc {
  height: 100px;
  overflow: hidden;
  color: #a9aac5;
  margin-bottom: 35px;
  text-align: justify;
}

.quiz-description p.read-more {
  text-align: center;
  margin-top: -100px;
  background-image: linear-gradient(0deg, #fff, rgba(255, 255, 255, 0));
  position: relative;
  padding-top: 42px;
  color: #ff5e94;
  cursor: pointer;
  margin-bottom: 25px;
}

.quiz-description p.read-more.hidden {
  display: none;
}

.player-details {
  margin: 0;
}

.quiz-img img {
  object-fit: cover;
}

.quiz-info {
  padding: 12px;
}

.quiz-info-content {
  flex: 0 0 48.5% !important;
  padding: 0;
}

.quiz-categories-content {
  flex: 0 0 48.5% !important;
  padding: 0;
}

.quiz-categories-content hr {
  margin-bottom: 10px !important;
}

.quiz-categories-content h2 {
  color: #3a3798;
  margin-bottom: 7px;
}

.quiz-info {
  margin: 5px 0 10px;
}

.v-dialog .v-card {
  overflow: hidden !important;
  text-align: center;
  min-height: 200px;
}

.v-dialog .v-card p.full-desc {
  padding: 20px;
  font-size: 20px;
  color: #a9aac5;
  text-align: justify;
}

@media only screen and (max-width: 600px) {
  .quiz-page {
    margin-top: 20px;
  }

  .quiz-header {
    flex-wrap: wrap !important;
  }

  .start-quiz {
    margin: 20px auto 0;
  }

  .quiz-info-content,
  .quiz-categories-content {
    flex: 0 0 100% !important;
    padding-left: 0 !important;
  }

  .quiz-info-content {
    padding: 0 12px !important;
  }

  .quiz-container {
    flex-direction: column-reverse !important;
    padding-bottom: 0;
  }

  .back-link,
  .start-quiz {
    width: 32% !important;
  }

  .popup-icons i {
    margin: 0 5px !important;
  }

  .quiz-container .quiz-content .quiz-title {
    font-size: 25px !important;
    margin-top: 15px;
  }

  .quiz-container .quiz-content .quiz-title,
  .quiz-description p {
    text-align: center !important;
  }

  .quiz-description p {
    font-size: 18px !important;
  }

  .quiz-description p.full-desc {
    max-height: 100px !important;
    height: unset !important;
  }

  .quiz-container .quiz-content,
  .quiz-container .quiz-img {
    width: 100% !important;
    margin: auto;
  }

  .title-line {
    width: 100% !important;
    margin-right: auto !important;
    margin-left: auto !important;
  }

  .quiz-page-categories {
    flex-wrap: wrap;
    flex-direction: column;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .quiz-container {
    flex-direction: column-reverse !important;
  }

  .quiz-header .start-quiz,
  .ltr .quiz-header .start-quiz {
    width: 50% !important;
  }

  .popup-icons i {
    margin: 0 5px !important;
  }

  .quiz-container .quiz-content .quiz-title {
    margin-top: 15px;
  }

  .quiz-container .quiz-content .quiz-title,
  .quiz-description p,
  .quiz-categories-content h2 {
    text-align: center !important;
  }

  .quiz-container .quiz-content,
  .quiz-container .quiz-img {
    margin: auto;
  }

  .title-line {
    width: 100% !important;
    margin-right: auto !important;
    margin-left: auto !important;
  }

  .quiz-description p.full-desc {
    max-height: 100px !important;
    height: unset !important;
  }

  .row.quiz-info {
    flex-direction: column;
  }

  .quiz-info-content {
    padding: 12px 0 !important;
  }

  .quiz-page-categories {
    flex-wrap: wrap;
    flex-direction: column;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  .quiz-container .quiz-content .quiz-title {
    margin-top: 15px;
  }

  .quiz-header .start-quiz,
  .ltr .quiz-header .start-quiz {
    width: 30% !important;
  }

  .quiz-container {
    flex-direction: column-reverse !important;
  }

  .quiz-container .quiz-content .quiz-title,
  .quiz-description p,
  .quiz-categories-content h2 {
    text-align: center !important;
  }

  .quiz-container .quiz-content,
  .quiz-container .quiz-img {
    margin: auto;
  }

  .title-line {
    margin-right: auto !important;
    margin-left: auto !important;
  }

  .quiz-description p.full-desc {
    max-height: 100px !important;
    height: unset !important;
  }

  .quiz-info-content,
  .quiz-categories-content {
    flex: 0 0 90% !important;
    max-width: 90% !important;
    padding-top: 0;
    margin: auto !important;
  }

  .quiz-page-categories {
    flex-wrap: wrap !important;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  .quiz-header .start-quiz,
  .ltr .quiz-header .start-quiz {
    width: 30% !important;
  }

  .quiz-content h1.quiz-title {
    font-size: 26px !important;
  }

  .quiz-content .quiz-description p {
    font-size: 16px !important;
  }
}

@media only screen and (min-width: 767px) and (max-width: 1200px) {
  .start-quiz {
    width: fit-content !important;
    min-width: 35% !important;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1264px) {
  .quiz-page .container {
    max-width: 2000px !important;
    width: 95% !important;
  }
}

@media only screen and (min-width: 992px) {
  .ltr .quiz-title {
    width: 90% !important;
  }

  .ltr .title-line {
    width: 95% !important;
  }
}

/* Ltr Direction Style */
.ltr .quiz-header .back-link,
.ltr .quiz-header .start-quiz {
  width: 20% !important;
}

.ltr .back-icon {
  margin-left: 0 !important;
  margin-right: 7px !important;
}

.ltr .quiz-description p:first-of-type {
  text-align: left;
}

.ltr .quiz-categories-content h2 {
  text-align: left !important;
}

@media only screen and (max-width: 600px) {
  .quiz-header .start-quiz,
  .ltr .quiz-header .start-quiz,
  .back-link,
  .ltr .back-link {
    width: 68% !important;
  }

  .quiz-categories-content h2,
  .ltr .quiz-categories-content h2 {
    text-align: center !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .quiz-header .start-quiz,
  .ltr .quiz-header .start-quiz {
    width: 50% !important;
  }

  .ltr .quiz-categories-content h2 {
    text-align: center !important;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  .ltr .quiz-categories-content h2 {
    text-align: center !important;
  }
}
</style>
