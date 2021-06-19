<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHostHeader
          :timer="seconds"
          :QuestionOrder="QuestionOrder"
          :Questions="Questions"
          :answers="answersNum"
          :players="playersNum"
        />

        <div
          class="question-container d-flex align-center justify-space-between flex-column"
        >
          <div
            class="play-question-details w-100 d-flex align-center justify-center flex-column"
          >
            <!-- Question Text -->
            <h1 class="question text-center text-white w-100">
              {{ questionText }}
            </h1>

            <!-- Timer -->
            <v-progress-linear height="10" v-model="value"></v-progress-linear>
          </div>

          <!-- Question Image -->
          <div
            v-if="QuestionImgSrc"
            class="question-img d-flex align-center justify-center mx-auto overflow-hidden"
          >
            <img :src="`${QuestionImgSrc}`" alt="question-img" />
          </div>

          <!-- Answers -->
          <CheckBoxAnswers
            :answersData="answers"
            :enabled="true"
            v-if="
              answersType ==
              this.$t('addQuestionPage.questionTypes.multiAnswers')
            "
          />
          <QuestionAnswers :answersData="answers" :enabled="true" v-else />
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
import QuestionHostHeader from "@/components/PlayComponents/QuestionHostHeader";
import QuestionAnswers from "@/components/PlayComponents/QuestionAnswers";
import CheckBoxAnswers from "@/components/PlayComponents/CheckBoxAnswers";
export default {
  layout: "play",
  head() {
    return {
      title: this.$t("question.question"),
    };
  },
  data() {
    return {
      answersNum: 4, // total number of submited answers
      playersNum: 5, // total players
      answersType: this.$t("addQuestionPage.questionTypes.oneAnswer"), // type of answers
      answers: [
        {
          ansText: "صحيح",
          imageUrl: "",
          isCorrect: true,
          points: 100,
        },
        {
          ansText: "خطأ",
          imageUrl: "",
          isCorrect: false,
          points: 0,
        },
      ],
      seconds: 30, // question timer
      value: 100,
      questionText:
        "المسجد الأقصى أحد أكبر مساجد العالم وأحد المساجد الثلاثة التي يشد المسلمون الرحال إليها، وهو أيضًا أول القبلتين في الإسلام. يقع داخل البلدة القديمة بالقدس في فلسطين.",
      QuestionOrder: 1, // current question order
      Questions: 10, // total questions
      QuestionImgSrc:
        "http://ammannet.net/sites/default/files/styles/news_landing/public/2020-09/%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF%20%D8%A7%D9%84%D8%A7%D9%82%D8%B5%D9%89.jpg",
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.value !== 0) {
        this.value -= 0.2;
      }
    }, 200 / (100 / this.seconds));
  },
  components: {
    QuestionHostHeader,
    QuestionAnswers,
    CheckBoxAnswers,
  },
};
</script>

<style scoped>
.play-page-container {
  height: calc(100vh - 80px);
  margin-bottom: 0px !important;
  padding: 8px 15px 15px;
}

.question-container {
  height: calc(100vh - 160px);
  margin: 10px 0;
  padding: 0 70px;
}

.question-container h1 {
  margin-bottom: 5px;
  padding: 15px;
  line-height: 34px;
  background-color: #38389a;
  border-radius: 10px;
  font-size: 20px;
  max-height: 119px;
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 3;
}

.v-progress-linear {
  color: #ff5e94 !important;
  border-radius: 5px;
}

h2.count-down {
  font-size: 85px !important;
}

.question-img {
  max-width: 90% !important;
  margin: 10px 0 0;
  flex-grow: 1;
}

.question-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.question-answers {
  margin-top: 15px !important;
}

@media only screen and (max-width: 992px) {
  .play-page-container {
    height: unset !important;
    min-height: calc(100vh - 85px) !important;
  }

  .question-container {
    padding: 0 !important;
    height: unset !important;
    min-height: calc(100vh - 185px) !important;
  }

  .question-img img {
    max-width: 80%;
  }
}

@media only screen and (max-width: 600px) {
  .play-page-container {
    border: none !important;
    box-shadow: none !important;
    height: unset !important;
    min-height: calc(92vh - 50px) !important;
  }

  .question-container {
    height: unset !important;
    min-height: calc(92vh - 100px) !important;
  }

  .question-container h1 {
    line-height: 27px;
    font-size: 17px;
    max-height: 96px;
  }

  .question-img img {
    max-width: 80%;
    max-height: 200px;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1200px) {
  .question-container {
    padding: 0 15px !important;
  }
}
</style>
