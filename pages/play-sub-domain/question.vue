<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHeader
          :timer="seconds"
          :QuestionOrder="QuestionOrder"
          :score="score"
          :Questions="Questions"
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
import QuestionHeader from "@/components/PlayComponents/QuestionHeader";
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
      answersType: this.$t("addQuestionPage.questionTypes.multiAnswers"),
      answers: [
        {
          ansText: "",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/420px-Kheops-Pyramid.jpg",
          isCorrect: true,
          points: 100,
        },
        {
          ansText: "",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/PHAROS2013-3000x2250.jpg/315px-PHAROS2013-3000x2250.jpg",
          isCorrect: true,
          points: 100,
        },
        {
          ansText: "",
          imageUrl:
            "https://www.albdel.com/wp-content/uploads/2018/09/eiffel-tower.jpg",
          isCorrect: false,
          points: 0,
        },
        {
          ansText: "",
          imageUrl:
            "https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1920,c_scale,q_auto/cnnarabic/2020/02/04/images/146272.jpg",
          isCorrect: false,
          points: 0,
        },
      ],
      seconds: 30, // question timer
      value: 100,
      questionText: "من عجائب الدنيا السبع القديمة في العالم :",
      QuestionOrder: 1, // current question order
      Questions: 10, // total questions
      score: 230, // player score
      QuestionImgSrc:
        "https://www.elaham.com/wp-content/uploads/2018/01/g1.jpg",
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
    QuestionHeader,
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
