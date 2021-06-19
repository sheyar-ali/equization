<template>
  <div class="answers-content align-center justify-content-start">
    <v-row>
      <v-col cols="12" sm="11">
        <!-- Oly One Answer -->
        <div
          class="one-answer"
          v-if="questionType == $t('addQuestionPage.questionTypes.oneAnswer')"
        >
          <v-radio-group hide-details="auto" v-model="radioGroup">
            <template v-for="(answer, i) in answers">
              <v-row class="align-center answers-container" :key="i">
                <v-radio
                  class="radio-label"
                  @click="setRadioCorrect(answer)"
                  :value="i"
                ></v-radio>
                <v-col sm="8" cols="12" class="d-flex align-center full-box">
                  <v-text-field
                    v-model="answer.ansText"
                    outlined
                    type="text"
                    :label="`${$t('addQuestionPage.answer')} ${i + 1}`"
                    :rules="[
                      required($t('addQuestionPage.answer')),
                      minLength($t('addQuestionPage.answer'), 8),
                    ]"
                    prepend-inner-icon="mdi-format-text"
                  ></v-text-field>
                </v-col>
                <v-col sm="3" cols="12" class="d-flex align-center small-box">
                  <v-text-field
                    outlined
                    v-model="answer.points"
                    type="number"
                    class="question-mark"
                    min="0"
                    :label="$t('addQuestionPage.questionMark')"
                    prepend-inner-icon="mdi-format-text"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>
          </v-radio-group>
        </div>
        <!-- True Of False -->
        <div
          class="true-false"
          v-if="questionType == $t('addQuestionPage.questionTypes.trueFalse')"
        >
          <v-radio-group hide-details="auto" v-model="tfradioGroup">
            <template v-for="(answer, i) in answers">
              <v-row class="align-center answers-container" :key="i">
                <v-radio
                  class="radio-label"
                  @click="setRadioCorrect(answer)"
                ></v-radio>
                <v-col sm="8" cols="12" class="d-flex align-center full-box">
                  <v-text-field
                    outlined
                    v-model="answer.ansText"
                    type="text"
                    :label="`${$t('addQuestionPage.answer')} ${i + 1}`"
                    :rules="[
                      required($t('addQuestionPage.answer')),
                      minLength($t('addQuestionPage.answer'), 8),
                    ]"
                    prepend-inner-icon="mdi-format-text"
                  ></v-text-field>
                </v-col>
                <v-col sm="3" cols="12" class="d-flex align-center small-box">
                  <v-text-field
                    outlined
                    v-model="answer.points"
                    type="number"
                    min="0"
                    :label="$t('addQuestionPage.questionMark')"
                    prepend-inner-icon="mdi-format-text"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>
          </v-radio-group>
        </div>
        <!-- Multible Answers -->
        <div
          class="multible-answers"
          v-if="
            questionType == $t('addQuestionPage.questionTypes.multiAnswers')
          "
        >
          <template v-for="(answer, i) in answers">
            <v-row class="align-center answers-container" :key="i">
              <v-checkbox @click="setCheckBoxCorrect(answer)"></v-checkbox>
              <v-col sm="8" cols="12" class="d-flex align-center full-box">
                <v-text-field
                  outlined
                  v-model="answer.ansText"
                  type="text"
                  :label="`${$t('addQuestionPage.answer')} ${i + 1}`"
                  :rules="[
                    required($t('addQuestionPage.answer')),
                    minLength($t('addQuestionPage.answer'), 8),
                  ]"
                  prepend-inner-icon="mdi-format-text"
                ></v-text-field>
              </v-col>
              <v-col sm="3" cols="12" class="d-flex align-center small-box">
                <v-text-field
                  outlined
                  v-model="answer.points"
                  type="number"
                  min="0"
                  :label="$t('addQuestionPage.questionMark')"
                  prepend-inner-icon="mdi-format-text"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </div>
        <!-- No Answers -->
        <div
          class="no-answers"
          v-if="questionType == $t('addQuestionPage.questionTypes.noAnswer')"
        >
          <template v-for="(answer, i) in answers">
            <v-row class="align-center answers-container" :key="i">
              <div class="order-number d-flex align-center justify-center">
                <span>{{ i + 1 }}</span>
              </div>
              <v-col cols="10" class="d-flex align-center full-box">
                <v-text-field
                  outlined
                  v-model="answer.ansText"
                  type="text"
                  :label="`${$t('addQuestionPage.answer')} ${i + 1}`"
                  :rules="[
                    required($t('addQuestionPage.answer')),
                    minLength($t('addQuestionPage.answer'), 8),
                  ]"
                  prepend-inner-icon="mdi-format-text"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "TextAnswers",
  data() {
    return {
      qType: this.questionType,
      answers: this.answersData,
      radioGroup: 0,
      tfradioGroup: 0,
      file: [],
      required(errorName) {
        return (v) =>
          (v && v.length > 0) || `${this.$t("errorNameText")} ${errorName}`;
      },
      minLength(errorName, minNum) {
        return (v) =>
          (v && v.length >= minNum) ||
          `${errorName} ${this.$t("minLengthError")} ${minNum} ${this.$t(
            "characters"
          )}`;
      },
    };
  },
  watch: {
    questionType: function (val) {
      this.qType = val;
      this.answersCreation;
    },
  },
  computed: {
    answersCreation() {
      this.answers = [];
      this.radioGroup = 0;
      this.tfradioGroup = 0;
      if (this.qType == this.$t("addQuestionPage.questionTypes.oneAnswer")) {
        let count = 4;
        for (let i = 0; i < count; i++) {
          this.answers.push({
            ansText: "",
            imageUrl: "",
            isCorrect: i == 0 ? true : false,
            points: i == 0 ? 100 : 0,
          });
        }
      } else if (
        this.qType == this.$t("addQuestionPage.questionTypes.multiAnswers")
      ) {
        let count = 4;
        for (let i = 0; i < count; i++) {
          this.answers.push({
            ansText: "",
            imageUrl: "",
            isCorrect: false,
            points: 0,
          });
        }
      } else if (
        this.qType == this.$t("addQuestionPage.questionTypes.trueFalse")
      ) {
        let count = 2;
        for (let i = 0; i < count; i++) {
          this.answers.push({
            ansText: "",
            imageUrl: "",
            isCorrect: i == 0 ? true : false,
            points: i == 0 ? 100 : 0,
          });
        }
      } else {
        let count = 4;
        for (let i = 0; i < count; i++) {
          this.answers.push({
            ansText: "",
            imageUrl: "",
            isCorrect: true,
            points: 100,
          });
        }
      }
    },
    getCorrect() {
      let result = 0;
      this.answersData.forEach((ans, index) => {
        if (ans.isCorrect) {
          result = index;
        }
      });
      return result;
    },
    setCorrect() {
      this.radioGroup = this.getCorrect;
      this.tfradioGroup = this.getCorrect;
    },
  },
  mounted() {
    if (this.answersData.length == 0) {
      this.answersCreation;
    } else {
      this.setCorrect;
    }
  },
  methods: {
    onFileChange(answer, i) {
      if (this.file[i]) {
        let reader = new FileReader();
        reader.onload = () => {
          answer.imageUrl = reader.result;
        };
        reader.readAsDataURL(this.file[i]);
      }
    },
    clear(answer, i) {
      this.file[i] = "";
      answer.imageUrl = "";
    },
    setRadioCorrect(answer) {
      this.answers.forEach((ans) => {
        ans.points = ans.points == 100 ? 0 : ans.points;
      });
      answer.isCorrect = true;
      answer.points = 100;
    },
    setCheckBoxCorrect(answer) {
      answer.isCorrect = !answer.isCorrect;
      answer.points = 100;
      this.answers.forEach((ans) => {
        if (ans.isCorrect) {
          ans.points = 100;
        } else {
          ans.points = ans.points == 100 ? 0 : ans.points;
        }
      });
    },
  },
  props: ["questionType", "answersData"],
};
</script>

<style scoped>
.answers-content {
  margin-bottom: 20px;
  padding: 0 15px;
}

.answers-container {
  padding: 0 20px;
  margin-bottom: -21px !important;
}

.v-input--radio-group--column .v-radio:not(:last-child):not(:only-child) {
  margin-top: -7px;
}

.order-number {
  background-color: #efeff7;
  color: #3a3798 !important;
  width: 30px;
  height: 33px;
  margin-top: -18px;
  border-radius: 4px;
}

.order-number span {
  font-size: 18px;
  font-weight: 600;
}

.full-box,
.small-box {
  padding-bottom: 0 !important;
}

@media only screen and (max-width: 600px) {
  .full-box,
  .small-box {
    padding: 0 !important;
  }
}
</style>
