<template>
  <div class="question-answers w-100">
    <v-row class="w-100 ma-0">
      <v-col
        :class="`answer-container ${answer.ansText ? 'text-ans' : 'img-ans'}`"
        v-for="(answer, i) in answersData"
        :key="i"
        :cols="`${answer.ansText ? 12 : 6}`"
        :md="`${answer.ansText ? 6 : 3}`"
      >
        <div
          class="text-center answer h-100 w-100 d-flex align-center justify-center overflow-hidden"
        >
          <input
            type="checkbox"
            name="checkbox"
            :id="`radioAnswers-${i}`"
            style="visibility: hidden; width: 0"
            :disabled="!enabled"
          />
          <label
            :for="`radioAnswers-${i}`"
            class="d-block h-100 w-100 answer-label normal"
          >
            <div
              class="answer-content overflow-hidden h-100 w-100 d-flex justify-center align-center"
            >
              <i class="far fa-square icon-normal"></i>
              <i class="fas fa-square icon-selected"></i>
              <i class="fas fa-check-square icon-correct"></i>
              <i class="fas fa-times-circle icon-incorrect"></i>

              <p
                class="text-center text d-flex align-center justify-center"
                v-if="answer.ansText"
              >
                <span>
                  {{ answer.ansText }}
                </span>
              </p>
              <p class="text-center" v-else-if="answer.imageUrl">
                <img
                  :src="answer.imageUrl"
                  class="d-block w-100"
                  alt="answer-img"
                />
              </p>
            </div>
          </label>
        </div>
      </v-col>
      <v-btn
        id="submitBtn"
        class="text-white d-block mx-auto"
        text
        @click="selectAnswer()"
        v-if="enabled"
      >
        {{ $t("question.sendAnswersBtn") }}
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "QuestionAnwers",
  props: ["answersData", "enabled"],
  data() {
    return {
      isSelected: false,
    };
  },
  methods: {
    selectAnswer() {
      if (this.isSelected) {
        return;
      }
      if (process.browser) {
        const answersList = document.querySelectorAll(".answer-label");
        const submitBtn = document.getElementById("submitBtn");

        // show correct
        this.answersData.forEach((ans, index) => {
          answersList[index].classList.remove("normal");
          answersList[index].classList.remove("selected");

          if (ans.isCorrect) {
            answersList[index].classList.add("correct");
          } else {
            answersList[index].classList.add("incorrect");
          }
        });

        submitBtn.classList.remove("d-block");
        submitBtn.classList.add("d-none");
      }
      this.isSelected = true;
    },
  },
};
</script>

<style scoped>
.question-answers {
  padding: 0 20px;
}

.answer-container {
  padding: 0 !important;
  margin-bottom: 10px;
}

.answer-container.img-ans {
  min-height: 120px !important;
}

.answer-container:nth-of-type(even) {
  padding-right: 5px !important;
}

.answer-container:nth-of-type(odd) {
  padding-left: 5px !important;
}

.answer {
  background-color: #e5e4f2;
  border-radius: 10px;
}

.answer input:checked + label {
  background-color: #6c6cb4 !important;
  color: #fff !important;
}

.answer input:checked + label.normal i {
  display: none !important;
}

.answer input:checked + label i.icon-selected {
  display: block !important;
}

.answer label {
  padding: 22px;
  color: #38389a;
  font-size: 23px;
  font-weight: 600;
  margin-bottom: 0 !important;
  cursor: pointer;
}

.img-answers label {
  padding: 30px !important;
}

.answer-content p {
  font-size: 18px;
  width: 95% !important;
  margin-bottom: 0 !important;
}

.answer-content p.text {
  height: 30px !important;
}

.answer-content p.text span {
  margin-right: 10px;
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
}

.answer-content.img-answer-content p {
  width: 93% !important;
}

img {
  height: 300px !important;
  border-radius: 10px;
  object-fit: cover;
}

.answer label.normal i {
  display: none !important;
}

.answer label.normal i.icon-normal {
  display: block !important;
}

.answer input + label.correct {
  background-color: #78bdbc !important;
  color: #fff;
}

.answer input + label.correct i {
  display: none !important;
}

.answer input:checked + label.correct i {
  display: none !important;
}

.answer input + label.correct i.icon-correct {
  display: block !important;
}

.answer input + label.incorrect {
  background-color: #f1a2bd !important;
  color: #fff;
}

.answer input + label.incorrect i {
  display: none !important;
}

.answer input:checked + label.incorrect i {
  display: none !important;
}

.answer input + label.incorrect i.icon-incorrect {
  display: block !important;
}

button {
  margin-top: 5px !important;
  padding: 0 40px !important;
  background-color: #38389a;
  letter-spacing: 0 !important;
  font-size: 18px !important;
  min-width: 170px !important;
  min-height: 40px;
  border-radius: 10px;
}

.answer-content img {
  height: 160px !important;
}

.answer-container.img-ans .answer label i {
  margin-left: 10px;
  position: absolute;
  top: 10px;
  right: 17px;
}

.answer-container.img-ans .answer label {
  padding: 5px 0px !important;
}

.answer-container.img-ans {
  padding: 0 5px !important;
}

.ltr .answer-container.img-ans .answer label i {
  margin-left: 0 !important;
  margin-right: 10px;
  position: absolute;
  top: 10px;
  right: unset !important;
  left: 17px !important;
}

@media only screen and (max-width: 600px) {
  .question-answers {
    padding: 0 !important;
  }

  .answer-content p {
    font-size: 16px !important;
  }

  .answer-content.img-answer-content p {
    width: 90% !important;
  }

  .img-answer-content img {
    height: auto !important;
  }

  .answer-content img {
    height: 135px !important;
  }
}

@media only screen and (max-width: 960px) {
  .answer-container:nth-of-type(even),
  .ltr .answer-container:nth-of-type(odd) {
    padding-right: 0 !important;
  }

  .answer-container:nth-of-type(odd),
  .ltr .answer-container:nth-of-type(even) {
    padding-left: 0 !important;
  }
}

@media only screen and (max-width: 600px) {
  img,
  .ltr img {
    margin: 0 !important;
  }

  .ltr .answer-container.img-ans:nth-of-type(odd) .answer label i {
    right: unset !important;
    left: 12px !important;
  }

  .answer-container.img-ans:nth-of-type(even) .answer label i {
    right: 15px;
  }

  .ltr .answer label i {
    margin-right: 10px !important;
    margin-left: 0 !important;
    right: unset !important;
    left: 10px !important;
  }

  .ltr .answer-container:nth-of-type(even) .answer label i {
    right: unset !important;
    left: 15px !important;
  }
}

/* Ltr Direction Style */
.ltr .answer-container.text-ans:nth-of-type(even) {
  padding-right: 0 !important;
  padding-left: 5px !important;
}

.ltr .answer-container.text-ans:nth-of-type(odd) {
  padding-left: 0 !important;
  padding-right: 5px !important;
}

.ltr .answer-content p.text {
  margin-right: 0 !important;
  margin-left: 5px !important;
}

@media only screen and (max-width: 992px) {
  .answer-container.img-ans:nth-of-type(odd) {
    padding-left: 5px !important;
  }

  .answer-container.img-ans:nth-of-type(even) {
    padding-right: 5px !important;
  }

  .ltr .answer-container.img-ans:nth-of-type(even) {
    padding-right: 0 !important;
    padding-left: 5px !important;
  }

  .ltr .answer-container.img-ans:nth-of-type(odd) {
    padding-left: 0 !important;
    padding-right: 5px !important;
  }
}
</style>
