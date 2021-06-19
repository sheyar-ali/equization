<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <div class="scores-header d-flex align-center justify-space-between">
          <h1>
            {{ $t("finalResults.title") }}
          </h1>
          <div class="score-btns d-flex align-center">
            <!-- Download -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="accent-1" v-bind="attrs" v-on="on">
                  <a :href="localePath('/play/totalscores')" download>
                    <i class="fas fa-download"></i>
                  </a>
                </v-btn>
              </template>
              <span>{{ $t("finalResults.download") }}</span>
            </v-tooltip>

            <!-- Share -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="accent-1"
                  v-bind="attrs"
                  v-on="on"
                  @click="share = true"
                >
                  <i class="fas fa-share-alt"></i>
                </v-btn>
              </template>
              <span>{{ $t("finalResults.share") }}</span>
            </v-tooltip>
          </div>
          <!-- end btn -->
          <v-btn height="auto" class="white--text end-quiz title" text>
            {{ $t("finalResults.endQuiz") }}
          </v-btn>
        </div>

        <v-divider horizontal></v-divider>

        <div class="answer-result w-100">
          <div
            class="answer-result-content d-flex align-center justify-space-between w-100"
          >
            <h2>{{ $t("finalResults.correctAnswer") }} {{ correctAnswer }}</h2>
            <v-btn
              height="auto"
              class="white--text"
              @click="showExp = true"
              text
            >
              {{ $t("finalResults.showExplanation") }}
            </v-btn>
          </div>
        </div>

        <div class="result-description">
          <div class="table-content w-100 mx-auto">
            <div class="headers w-100 d-flex align-center">
              <div class="table-head">
                <h3 class="text-center">{{ $t("finalResults.question") }}</h3>
              </div>
              <div class="table-head">
                <h3 class="text-center">{{ $t("finalResults.trueFalse") }}</h3>
              </div>
              <div class="table-head">
                <h3 class="text-center">{{ $t("finalResults.duration") }}</h3>
              </div>
              <div class="table-head">
                <h3 class="text-center">{{ $t("finalResults.results") }}</h3>
              </div>
            </div>
            <v-divider horizontal></v-divider>
            <div
              class="table-body w-100 d-flex align-center flex-column"
              v-for="content in tableContent"
              :key="content.id"
            >
              <div
                class="table-body-content d-flex align-center justify-center w-100"
              >
                <div class="text-center">
                  <h2>
                    {{ content.question }}
                  </h2>
                  <v-divider class="d-none"></v-divider>
                </div>
                <div
                  class="text-center d-flex align-center justify-center flex-column"
                >
                  <div class="description d-none">
                    <h6 class="text-center">
                      {{ $t("finalResults.trueFalse") }}
                    </h6>
                  </div>
                  <span
                    class="result-icon text-white true-icon d-flex justify-center align-center"
                    v-if="content.isCorrect"
                  >
                    <i class="fas fa-check"></i>
                  </span>
                  <span
                    class="result-icon text-white false-icon d-flex justify-center align-center"
                    v-else
                  >
                    <i class="fas fa-times"></i>
                  </span>
                </div>
                <v-divider vertical class="d-none"></v-divider>
                <div class="text-center">
                  <div class="description d-none">
                    <h6 class="text-center">
                      {{ $t("finalResults.duration") }}
                    </h6>
                  </div>
                  <h2>
                    {{ content.duration }}
                  </h2>
                </div>
                <v-divider vertical class="d-none"></v-divider>
                <div class="text-center">
                  <div class="description d-none">
                    <h6 class="text-center">
                      {{ $t("finalResults.questionResult") }}
                    </h6>
                  </div>
                  <h2>
                    {{ content.results }}
                  </h2>
                </div>
              </div>
              <v-divider horizontal class="w-100"></v-divider>
            </div>

            <div class="final-results d-flex align-center justify-center w-100">
              <h3 style="visibilty: hidden"></h3>

              <h3 class="text-center">
                {{ $t("finalResults.finalResult") }}
              </h3>

              <v-divider vertical class="d-none"></v-divider>

              <h3 class="total-duration text-center">
                <p class="d-none">{{ $t("finalResults.duration") }}</p>
                {{ totalDuration }}
              </h3>

              <v-divider vertical class="d-none"></v-divider>

              <h3 class="total-result text-center">
                <p class="d-none">{{ $t("finalResults.finalResult") }}</p>
                {{ totalResults }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- share dialog -->
      <v-dialog v-model="share" max-width="550px">
        <v-card>
          <v-card-title class="text-center font-weight-bold d-block">
            {{ $t("finalResults.shareResults") }}
          </v-card-title>
          <v-divider></v-divider>
          <ShareNetwork
            v-for="network in networks"
            :network="network.network"
            :key="network.network"
            :url="shareURL"
            :title="$t('quizPage.shareMsg')"
            :quote="$t('quizPage.shareMsg')"
          >
            <v-icon
              class="pa-2"
              style="font-size: 48px"
              :color="network.color"
              >{{ network.icon }}</v-icon
            >
          </ShareNetwork>
        </v-card>
      </v-dialog>

      <!-- explanation dialog -->
      <v-dialog v-model="showExp" max-width="550px">
        <v-card>
          <v-card-title class="text-center font-weight-bold d-block">
            {{ $t("finalResults.questionExplanation") }}
          </v-card-title>
          <v-divider></v-divider>
          <p class="exp" v-if="questionExplanation">
            {{ questionExplanation }}
          </p>
          <p class="exp text-center" v-else>
            {{ $t("finalResults.noExplanation") }}
          </p>
        </v-card>
      </v-dialog>
    </v-container>
  </section>
</template>

<script>
export default {
  layout: "play",
  head() {
    let quiz = [];
    quiz["id"] = 5;
    if (this.$i18n.locale == "ar") {
      URL = `https://equization.com/quiz/${quiz.id}`;
      this.shareURL = `https://equization.com/quiz/${quiz.id}`;
    } else {
      URL = `https://equization.com/${this.$i18n.locale}/quiz/${quiz.id}`;
      this.shareURL = `https://equization.com/${this.$i18n.locale}/quiz/${quiz.id}`;
    }
    return {
      title: this.$t("finalResults.title"),
    };
  },
  data() {
    return {
      share: false,
      showExp: false,
      title: null,
      shareURL: null,
      meta: [],
      quiz: null,
      theHeaders: [
        { text: "السؤال", value: "question" },
        { text: "صح أم خطأ", value: "isCorrect" },
        { text: "المدة الزمنية", value: "duration" },
        { text: "النتائج", value: "results" },
      ],
      questionExplanation:
        "شرح مفصل للإختبار يشرح الإختبار بشكل أكثر تفصيلاً, أكثر من الشرح المختصر الذي يسبقه, هذا الشرح تجريبي فقط, ولا يعتد به بتاتاً, وإنما هو لغرض المعاينة فقط ليس إلا, فلا يأخذ علي محمل الجد إطلاقاً, فكما وضحت سابقاً انه فقط لمعاينة كيف يبدو النص في الموقع في حال إن كان الوصف طويلاً يتعدي طوله الثلاث أسطر فيصبح بالشكل الحالي الذي هو يبدو عليه الآن.",
      tableContent: [
        {
          id: 1,
          question: "نص السؤال الأول التجريبي",
          isCorrect: true,
          duration: 15.5,
          results: 100,
        },
        {
          id: 2,
          question: "نص السؤال الثاني التجريبي",
          isCorrect: false,
          duration: 10.3,
          results: 0,
        },
        {
          id: 3,
          question: "نص السؤال الثالث التجريبي",
          isCorrect: true,
          falseIcon: "",
          duration: 12.4,
          results: 60,
        },
        {
          id: 4,
          question: "نص السؤال الرابع التجريبي",
          isCorrect: true,
          falseIcon: "",
          duration: 6.8,
          results: 100,
        },
      ],
      totalDuration: 45,
      totalResults: 260,
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
      correctAnswer: "نص الإجابة الأولي التجريبية",
    };
  },
};
</script>

<style scoped>
.scores-header h1,
.score-btns,
.end-quiz {
  min-width: 8% !important;
}

.scores-header h1 {
  font-size: 30px !important;
}

.scores-header h1,
.score-btns i {
  color: #a4abbb !important;
}

.score-btns button {
  margin: 0 5px;
}

.score-btns i {
  font-size: 27px !important;
}

.score-btns button:hover i {
  color: #ff5e94 !important;
}

.end-quiz {
  padding: 3px 25px !important;
  background-color: #ff5e94;
  border-radius: 10px;
}

.table-body-content > div:first-of-type,
.headers div.table-head:first-of-type,
.final-results h3:first-of-type {
  flex-grow: 3 !important;
}

.table-body-content > div,
.headers div.table-head {
  flex-grow: 1;
  flex-basis: 1px !important;
}

.description,
.final-results p {
  font-size: 23px;
  color: #a4abbb;
  margin-bottom: 10px;
  font-weight: 600;
}

.final-results h3 {
  flex-grow: 1;
  flex-basis: 1px !important;
  color: #3a3798;
  font-size: 23px;
  font-weight: 600;
}

.final-results h3:nth-of-type(2) {
  color: #a4abbb !important;
}

.v-dialog .v-card {
  overflow: hidden !important;
  text-align: center;
  min-height: 200px;
}

.v-dialog .v-card p.exp {
  padding: 20px;
  font-size: 20px;
  color: #a9aac5;
  text-align: justify;
}

@media only screen and (max-width: 767px) {
  .scores-header,
  .answer-result-content {
    flex-direction: column !important;
  }

  .score-btns {
    margin: 20px 0 15px !important;
  }

  .table-body-content hr,
  .description,
  .final-results p,
  .final-results hr {
    display: block !important;
  }

  .final-results p {
    font-size: 15px !important;
  }

  .final-results h3:first-of-type {
    display: none !important;
  }
}

@media only screen and (max-width: 600px) {
  .final-results h3:nth-of-type(2) {
    font-size: 16px;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  .headers {
    display: none !important;
  }

  .answer-result {
    padding: 15px !important;
  }

  .table-body,
  .table-body-content {
    flex-wrap: wrap;
  }

  .table-body-content > div:first-of-type {
    flex-basis: 100% !important;
  }

  .table-body-content hr,
  .description,
  .final-results p,
  .final-results hr {
    display: block !important;
  }

  .final-results h3:first-of-type {
    display: none !important;
  }

  .final-results p {
    font-size: 15px !important;
  }
}

@media only screen and (min-width: 767px) and (max-width: 1200px) {
  .answer-result-content {
    flex-direction: column !important;
  }

  .answer-result-content h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 25px;
  }

  .result-description {
    width: 100% !important;
  }

  .answer-result {
    padding: 20px 0;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  .final-results h3,
  .headers h3,
  .table-body h2 {
    font-size: 20px;
  }

  .result-icon {
    font-size: 18px;
  }

  .result-description {
    width: 100% !important;
  }

  .answer-result {
    padding: 20px 0;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1500px) {
  .result-description {
    width: 95% !important;
  }
}
</style>
