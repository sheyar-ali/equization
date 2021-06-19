<template>
  <div class="answers-content align-center justify-content-start">
    <v-row>
      <v-col cols="12">
        <!-- Oly One Answer -->
        <div
          class="one-answer"
          v-if="questionType == $t('addQuestionPage.questionTypes.oneAnswer')"
        >
          <v-radio-group hide-details="auto" v-model="radioGroup">
            <v-row class="align-center answers-container">
              <template v-for="(answer, i) in answers">
                <v-col cols="12" md="6" class="img-answer" :key="i">
                  <v-row class="image-answer-container">
                    <v-col cols="1" class="image-icon">
                      <v-radio
                        class="radio-label"
                        @click="setRadioCorrect(answer)"
                        :value="i"
                      ></v-radio>
                    </v-col>
                    <v-col cols="11" class="image-answer-content">
                      <div
                        class="image-box d-flex align-center justify-center w-100"
                      >
                        <div
                          class="w-100 h-100 position-relative overflow-hidden"
                        >
                          <div
                            class="real-question-img w-100 h-100"
                            v-if="answer.imageUrl"
                          >
                            <img
                              :src="answer.imageUrl"
                              class="question-img w-100 h-100"
                            />
                          </div>
                          <div
                            class="temp-question-img d-flex align-center justify-center"
                            v-else
                          >
                            <img
                              src="@/assets/images/Account-Images/image-gallery.png"
                              alt="question-img"
                            />
                          </div>
                          <span
                            class="clear-img position-absolute d-flex align-center justify-center"
                            v-if="answer.imageUrl"
                            @click="clear(answer, i)"
                            style="bottom: 10px; right: 10px;"
                          >
                            <i class="fas fa-trash-alt text-white"></i>
                          </span>
                        </div>
                      </div>
                      <v-file-input
                        v-model="file[i]"
                        class="file-input"
                        @change="onFileChange(answer, i)"
                        @click:clear="clear(answer, i)"
                        :show-size="1000"
                        :label="$t('chooseImg')"
                        accept="image/*"
                        outlined
                        hide-details="auto"
                        prepend-icon=""
                        prepend-inner-icon="mdi-camera"
                      />
                      <v-text-field
                        outlined
                        type="number"
                        class="question-mark"
                        min="0"
                        :value="answer.points"
                        :label="$t('addQuestionPage.questionMark')"
                        prepend-inner-icon="mdi-format-text"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </template>
            </v-row>
          </v-radio-group>
        </div>
        <!-- Multible Answers -->
        <div
          class="multible-answers"
          v-if="
            questionType == $t('addQuestionPage.questionTypes.multiAnswers')
          "
        >
          <v-row class="align-center answers-container">
            <template v-for="(answer, i) in answers">
              <v-col cols="12" md="6" class="img-answer" :key="i">
                <v-row class="image-answer-container">
                  <v-col cols="1" class="image-icon">
                    <v-checkbox
                      @click="setCheckBoxCorrect(answer)"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="11" class="image-answer-content">
                    <div
                      class="image-box d-flex align-center justify-center w-100"
                    >
                      <div
                        class="w-100 h-100 position-relative overflow-hidden"
                      >
                        <div
                          class="real-question-img w-100 h-100"
                          v-if="answer.imageUrl"
                        >
                          <img
                            :src="answer.imageUrl"
                            class="question-img w-100 h-100"
                          />
                        </div>
                        <div
                          class="temp-question-img d-flex align-center justify-center"
                          v-else
                        >
                          <img
                            src="@/assets/images/Account-Images/image-gallery.png"
                            alt="question-img"
                          />
                        </div>
                        <span
                          class="clear-img position-absolute d-flex align-center justify-center"
                          v-if="answer.imageUrl"
                          @click="clear(answer, i)"
                          style="bottom: 10px; right: 10px;"
                        >
                          <i class="fas fa-trash-alt text-white"></i>
                        </span>
                      </div>
                    </div>
                    <v-file-input
                      v-model="file[i]"
                      class="file-input"
                      @change="onFileChange(answer, i)"
                      @click:clear="clear(answer, i)"
                      :show-size="1000"
                      :label="$t('chooseImg')"
                      accept="image/*"
                      outlined
                      hide-details="auto"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                    />
                    <v-text-field
                      outlined
                      type="number"
                      class="question-mark"
                      min="0"
                      :value="answer.points"
                      :label="$t('addQuestionPage.questionMark')"
                      prepend-inner-icon="mdi-format-text"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </div>
        <!-- True Of False -->
        <div
          class="true-false"
          v-if="questionType == $t('addQuestionPage.questionTypes.trueFalse')"
        >
          <v-radio-group hide-details="auto" v-model="tfradioGroup">
            <v-row class="align-center answers-container">
              <template v-for="(answer, i) in answers">
                <v-col cols="12" md="6" class="img-answer" :key="i">
                  <v-row class="image-answer-container">
                    <v-col cols="1" class="image-icon">
                      <v-radio
                        class="radio-label"
                        @click="setRadioCorrect(answer)"
                        :value="i"
                      ></v-radio>
                    </v-col>
                    <v-col cols="11" class="image-answer-content">
                      <div
                        class="image-box d-flex align-center justify-center w-100"
                      >
                        <div
                          class="w-100 h-100 position-relative overflow-hidden"
                        >
                          <div
                            class="real-question-img w-100 h-100"
                            v-if="answer.imageUrl"
                          >
                            <img
                              :src="answer.imageUrl"
                              class="question-img w-100 h-100"
                            />
                          </div>
                          <div
                            class="temp-question-img d-flex align-center justify-center"
                            v-else
                          >
                            <img
                              src="@/assets/images/Account-Images/image-gallery.png"
                              alt="question-img"
                            />
                          </div>
                          <span
                            class="clear-img position-absolute d-flex align-center justify-center"
                            v-if="answer.imageUrl"
                            @click="clear(answer, i)"
                            style="bottom: 10px; right: 10px;"
                          >
                            <i class="fas fa-trash-alt text-white"></i>
                          </span>
                        </div>
                      </div>
                      <v-file-input
                        v-model="file[i]"
                        class="file-input"
                        @change="onFileChange(answer, i)"
                        @click:clear="clear(answer, i)"
                        :show-size="1000"
                        :label="$t('chooseImg')"
                        accept="image/*"
                        outlined
                        hide-details="auto"
                        prepend-icon=""
                        prepend-inner-icon="mdi-camera"
                      />
                      <v-text-field
                        outlined
                        type="number"
                        class="question-mark"
                        min="0"
                        :value="answer.points"
                        :label="$t('addQuestionPage.questionMark')"
                        prepend-inner-icon="mdi-format-text"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </template>
            </v-row>
          </v-radio-group>
        </div>
        <!-- No Answers -->
        <div
          class="no-answers"
          v-if="questionType == $t('addQuestionPage.questionTypes.noAnswer')"
        >
          <v-row class="align-center answers-container">
            <template v-for="(answer, i) in answers">
              <v-col cols="12" md="6" class="img-answer" :key="i">
                <v-row class="image-answer-container">
                  <v-col cols="1" class="image-icon">
                    <div
                      class="order-number d-flex align-center justify-center"
                    >
                      <span>{{ i + 1 }}</span>
                    </div>
                  </v-col>
                  <v-col cols="11" class="image-answer-content">
                    <div
                      class="image-box d-flex align-center justify-center w-100"
                    >
                      <div
                        class="w-100 h-100 position-relative overflow-hidden"
                      >
                        <div
                          class="real-question-img w-100 h-100"
                          v-if="answer.imageUrl"
                        >
                          <img
                            :src="answer.imageUrl"
                            class="question-img w-100 h-100"
                          />
                        </div>
                        <div
                          class="temp-question-img d-flex align-center justify-center"
                          v-else
                        >
                          <img
                            src="@/assets/images/Account-Images/image-gallery.png"
                            alt="question-img"
                          />
                        </div>
                        <span
                          class="clear-img position-absolute d-flex align-center justify-center"
                          v-if="answer.imageUrl"
                          @click="clear(answer, i)"
                          style="bottom: 10px; right: 10px;"
                        >
                          <i class="fas fa-trash-alt text-white"></i>
                        </span>
                      </div>
                    </div>
                    <v-file-input
                      v-model="file[i]"
                      class="file-input"
                      @change="onFileChange(answer, i)"
                      @click:clear="clear(answer, i)"
                      :show-size="1000"
                      :label="$t('chooseImg')"
                      accept="image/*"
                      outlined
                      hide-details="auto"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ImageAnswers",
  data() {
    return {
      qType: this.questionType,
      answers: this.answersData,
      radioGroup: 0,
      tfradioGroup: 0,
      file: [],
    };
  },
  watch: {
    questionType: function(val) {
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
      this.file[i] = null;
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
.img-answer {
  margin-bottom: 25px;
}

.img-answer:nth-of-type(even) {
  padding-right: 25px;
}

.img-answer:nth-of-type(odd) {
  padding-left: 25px;
}

.answers-content {
  margin-bottom: 20px;
  padding: 0 15px;
}

.answers-container {
  padding: 0 20px;
  margin-bottom: -21px !important;
}

.order-number {
  background-color: #d3d4e8;
  color: #3a3798 !important;
  width: 30px;
  height: 33px;
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

.image-answer-container {
  background-color: #efeff7;
  border-radius: 10px;
  padding: 15px 10px 0;
}

.image-box {
  height: 200px;
  background-color: #a5a6d2;
  border-radius: 10px;
  margin-bottom: 20px;
}

.question-img {
  border-radius: 10px;
  object-fit: cover;
}

.temp-question-img {
  padding: 30px 20px;
}

.temp-question-img img {
  filter: invert(1);
  opacity: 0.7;
}

/* Ltr Direction Style */
.ltr .img-answer:nth-of-type(even) {
  padding-left: 25px;
  padding-right: 0 !important;
}

.ltr .img-answer:nth-of-type(odd) {
  padding-right: 25px;
  padding-left: 0 !important;
}

@media only screen and (max-width: 600px) {
  .col-11 {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  .img-answer,
  .ltr .img-answer {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }
}
</style>
