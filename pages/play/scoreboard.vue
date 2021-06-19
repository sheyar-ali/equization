<!-- Start Of The ScoreBoard Component -->
<template>
  <section class="play-page play-quiz quiz-scoreboard">
    <v-container fluid>
      <div class="play-page-container">
        <!-- QuestionHeader Component -->
        <QuestionHeader
          :timer="seconds"
          :QuestionOrder="QuestionOrder"
          :score="score"
          :Questions="Questions"
        />

        <div class="answer-result w-100">
          <div
            class="answer-result-content d-flex align-center justify-space-between w-100"
          >
            <h2>{{ $t("finalResults.correctAnswer") }} {{ correctAnswer }}</h2>

            <!-- Show Explanation Button -->
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
          {{ $t("resultTables.scoreBoard.headers.btn") }}
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
import QuestionHeader from "@/components/PlayComponents/QuestionHeader";
export default {
  layout: "play",
  head() {
    return {
      title: this.$t("resultTables.scoreBoard.title"),
    };
  },
  data() {
    return {
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
          playerName: "محمد الإسكندراني",
          questionResult: 100,
          finalResult: 856,
        },
      ],
    };
  },
  components: {
    QuestionHeader,
  },
};
</script>

<style scoped>
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
</style>
