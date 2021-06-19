<template>
  <div class="question-header">
    <div
      class="question-header-content d-flex align-center justify-space-between"
    >
      <div class="question-timer d-flex align-center justify-center">
        <v-icon> mdi-timer-outline </v-icon>
        <span class="number-span d-block text-center">
          {{ timer }}
        </span>
      </div>
      <div class="question-order d-flex align-center justify-center">
        <span>
          {{
            `${$t("question.question")} ${QuestionOrder} ${$t(
              "question.from"
            )} ${Questions}`
          }}
        </span>
      </div>
      <div class="question-number d-flex align-center justify-center">
        <v-icon> mdi-account </v-icon>
        <span class="number-span d-block text-center">
          {{ answers + " / " + players }}
        </span>
      </div>
    </div>
    <v-divider horizontal class="rounded header-divider"></v-divider>
  </div>
</template>

<script>
export default {
  name: "QuestionHeader",
  props: ["QuestionOrder", "Questions", "timer", "answers", "players"],
};
</script>

<style scoped>
.question-header-content {
  margin-bottom: 8px;
}

.v-divider {
  margin: 0.3rem 0 !important;
}

.question-timer,
.question-order,
.question-number {
  width: fit-content !important;
  min-width: 10% !important;
  padding: 5px 17px;
  border-radius: 20px;
  font-size: 15px;
  color: #988c9d;
}

.question-order {
  padding: 5px 25px;
}

span.number-span {
  display: block;
  width: 95%;
}

.question-timer {
  background-color: #ffe2ec;
}

.question-timer i {
  color: #ff5e94;
}

.question-order {
  background-color: #efefef;
}

.question-number {
  background-color: #fcf1df;
}

.question-number i {
  color: #f9b84d;
}

@media only screen and (max-width: 767px) {
  .question-header-content {
    flex-wrap: wrap !important;
  }

  .question-timer,
  .question-number {
    min-width: 48% !important;
  }

  .question-order {
    margin: 15px 0;
    order: 3;
    min-width: 100% !important;
  }
}

@media only screen and (max-width: 600px) {
  .question-header-content {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: center;
  }

  .question-header-content {
    margin-bottom: 0px !important;
  }
}

@media only screen and (min-width: 767px) and (max-width: 1200px) {
  .question-timer,
  .question-order,
  .question-number {
    min-width: 15% !important;
  }
}
</style>
