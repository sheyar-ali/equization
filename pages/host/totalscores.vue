<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <!-- QuestionHeader Component -->
        <QuestionHostHeader
          :timer="seconds"
          :QuestionOrder="QuestionOrder"
          :Questions="Questions"
          :answers="answersNum"
          :players="playersNum"
        />

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

          <div class="stat mx-auto">
            <v-row>
              <v-col
                cols="12"
                md="6"
                class="stat-col"
                v-for="stat in stats"
                :key="stat.id"
              >
                <div class="stat-content d-flex align-center w-100">
                  <span
                    class="result-icon text-white true-icon d-flex justify-center align-center"
                    v-if="stat.isCorrect"
                  >
                    <i class="fas fa-check"></i>
                  </span>

                  <span
                    class="result-icon text-white false-icon d-flex justify-center align-center"
                    v-else
                  >
                    <i class="fas fa-times"></i>
                  </span>

                  <span class="stat-number d-flex align-center justify-center">
                    {{ stat.statNumber }}
                  </span>

                  <h3>{{ stat.statQuestion }}</h3>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>

        <div class="result-description">
          <div class="table-content w-100 mx-auto">
            <div class="headers w-100 d-flex align-center">
              <div class="table-head">
                <h3 class="text-center">
                  {{ $t("resultTables.scoreBoard.headers.name") }}
                </h3>
              </div>

              <div class="table-head">
                <h3 class="text-center">
                  {{ $t("resultTables.scoreBoard.headers.currentResult") }}
                </h3>
              </div>

              <div class="table-head">
                <h3 class="text-center">
                  {{ $t("resultTables.scoreBoard.headers.finalResult") }}
                </h3>
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
                    {{ content.playerName }}
                  </h2>
                  <v-divider class="d-none"></v-divider>
                </div>

                <div
                  class="text-center d-flex align-center justify-center flex-column"
                >
                  <div class="description d-none">
                    <h6 class="text-center">
                      {{ $t("resultTables.scoreBoard.headers.currentResult") }}
                    </h6>
                  </div>

                  <h2>
                    {{ content.questionResult }}
                  </h2>
                </div>

                <v-divider vertical class="d-none"></v-divider>

                <div class="text-center">
                  <div class="description d-none">
                    <h6 class="text-center">
                      {{ $t("resultTables.scoreBoard.headers.finalResult") }}
                    </h6>
                  </div>

                  <h2>
                    {{ content.finalResult }}
                  </h2>
                </div>

                <v-divider vertical class="d-none"></v-divider>
              </div>

              <v-divider horizontal class="last-divider w-100"></v-divider>
            </div>
          </div>
        </div>

        <v-btn
          class="white--text d-block mx-auto title next-question"
          height="auto"
        >
          {{ $t("finalResults.endQuiz") }}
        </v-btn>
      </div>

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
import QuestionHostHeader from "@/components/PlayComponents/QuestionHostHeader";
export default {
  layout: "play",
  head() {
    return {
      title: this.$t("resultTables.scoreBoard.title"),
    };
  },
  data() {
    return {
      answersNum: 4,
      playersNum: 5,
      showExp: false,
      seconds: 30,
      QuestionOrder: 1,
      Questions: 10,
      score: 100,
      correctAnswer: "نص الإجابة الأولي التجريبية",
      questionExplanation:
        "شرح مفصل للإختبار يشرح الإختبار بشكل أكثر تفصيلاً, أكثر من الشرح المختصر الذي يسبقه, هذا الشرح تجريبي فقط, ولا يعتد به بتاتاً, وإنما هو لغرض المعاينة فقط ليس إلا, فلا يأخذ علي محمل الجد إطلاقاً, فكما وضحت سابقاً انه فقط لمعاينة كيف يبدو النص في الموقع في حال إن كان الوصف طويلاً يتعدي طوله الثلاث أسطر فيصبح بالشكل الحالي الذي هو يبدو عليه الآن.",
      tableContent: [
        {
          id: 1,
          playerName: "محمدالإسكندراني",
          questionResult: 100,
          finalResult: 856,
        },
        {
          id: 2,
          playerName: "اسم لاعب جديد",
          questionResult: 25,
          finalResult: 845,
        },
        {
          id: 3,
          playerName: "اسم لاعب مختلف",
          questionResult: 0,
          finalResult: 785,
        },
        {
          id: 4,
          playerName: "اسم لاعب آخر",
          questionResult: 10,
          finalResult: 457,
        },
        {
          id: 5,
          playerName: "اسم لاعب",
          questionResult: 0,
          finalResult: 425,
        },
      ],
      stats: [
        {
          id: 1,
          isCorrect: true,
          statNumber: 3,
          statQuestion: "نص الإجابة الأولي التجريبية",
        },
        {
          id: 2,
          isCorrect: false,
          statNumber: 1,
          statQuestion: "نص الإجابة الأولي التجريبية",
        },
        {
          id: 3,
          isCorrect: false,
          statNumber: 0,
          statQuestion: "نص الإجابة الأولي التجريبية",
        },
        {
          id: 4,
          isCorrect: false,
          statNumber: 1,
          statQuestion: "نص الإجابة الأولي التجريبية",
        },
      ],
    };
  },
  components: {
    QuestionHostHeader,
  },
};
</script>

<style scoped>
.stat {
  padding: 15px 30px;
  margin-top: 15px;
}

.stat .stat-col {
  padding: 5px !important;
}

.stat-content {
  padding: 15px 25px;
  background-color: #e5e4f2 !important;
  border-radius: 10px;
}

.stat-number {
  width: 30px;
  height: 30px;
  margin: 0 10px;
  background-color: #f7f7ff !important;
  color: #3a3798 !important;
  font-weight: 600;
  font-size: 23px;
  border-radius: 5px;
}

.stat-content h3 {
  color: #3a3798 !important;
  font-weight: 600;
  margin-right: 10px;
  font-size: 24px;
  line-height: 35px;
  width: calc(100% - 80px) !important;
  flex-grow: 1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
  .play-page .stat {
    padding: 20px 0;
    width: 100% !important;
  }

  .play-page .stat-content {
    padding: 20px 10px;
  }

  .stat-content h3 {
    font-size: 20px !important;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1200px) {
  .stat {
    padding: 20px 5px !important;
    width: 100% !important;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1500px) {
  .stat {
    padding: 20px 7px !important;
    width: 100% !important;
  }
}

/* Ltr Direction Style */
.ltr .stat-content h3 {
  text-align: left !important;
  margin-right: unset !important;
  margin-left: 10px !important;
}
</style>
