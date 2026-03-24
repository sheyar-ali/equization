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
            @click="selectAnswer(i)"
            type="radio"
            name="radio"
            :id="`radioAnswers-${_uid}-${i}`"
            style="visibility: hidden; width: 0"
          />
          <label
            :for="`radioAnswers-${_uid}-${i}`"
            class="d-block h-100 w-100 answer-label"
            :class="getLabelClass(i)"
          >
            <div
              class="answer-content h-100 w-100 d-flex justify-center align-center"
            >
              <i class="far fa-circle icon-normal"></i>
              <i class="far fa-dot-circle icon-selected"></i>
              <i class="fas fa-check-circle icon-correct"></i>
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
    </v-row>
  </div>
</template>

<script>
export default {
  name: "QuestionAnwers",
  props: ["answersData", "enabled", "showCorrect"],
  data() {
    return {
      selectedIndex: -1,
    };
  },
  methods: {
    getLabelClass(i) {
      const answer = this.answersData[i];
      // showCorrect mode: host sees correct/incorrect immediately
      if (this.showCorrect) {
        return answer.isCorrect ? 'correct' : 'incorrect';
      }
      // Player selected this answer
      if (this.selectedIndex === i) {
        // If isCorrect is now known (after results:shown updated answersData)
        if (answer.isCorrect === true) return 'correct';
        if (answer.isCorrect === false && this.selectedIndex === i) return 'incorrect';
        return 'selected';
      }
      // After selection, show correct/incorrect for all answers if isCorrect is known
      if (this.selectedIndex !== -1 && answer.isCorrect === true) {
        return 'correct';
      }
      if (this.selectedIndex !== -1 && answer.isCorrect === false) {
        return 'incorrect';
      }
      return 'normal';
    },
    selectAnswer(i) {
      if (!this.enabled) return;
      if (this.selectedIndex !== -1) return;
      this.selectedIndex = i;
      this.$emit("answer-selected", this.answersData[i]);
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
.answer label.selected {
  background-color: #6c6cb4 !important;
  color: #fff;
}
.answer label.selected i {
  display: none !important;
}
.answer label.selected i.icon-selected {
  display: block !important;
}
.answer label.correct {
  background-color: #78bdbc !important;
  color: #fff;
}
.answer label.correct i {
  display: none !important;
}
.answer label.correct i.icon-correct {
  display: block !important;
}
.answer label.incorrect {
  background-color: #f1a2bd !important;
  color: #fff;
}
.answer label.incorrect i {
  display: none !important;
}
.answer label.incorrect i.icon-incorrect {
  display: block !important;
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

@media only screen and (max-width: 960px) {
  .answer-container.text-ans:nth-of-type(even),
  .ltr .answer-container.text-ans:nth-of-type(odd) {
    padding-right: 0 !important;
  }

  .answer-container.text-ans:nth-of-type(odd),
  .ltr .answer-container.text-ans:nth-of-type(even) {
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
