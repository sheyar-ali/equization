<template>
  <section class="d-flex align-center justify-center page-section">
    <section class="account-section d-flex align-center mx-auto w-100">
      <v-container fluid>
        <v-row>
          <!-- Side Menu -->
          <SideMenu activeLink="myQuizzes" />
          <!-- Account Quizes Content -->
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100">
              <AccountHeader
                :headerText="headerContent.headerText"
                :backLink="headerContent.backLink"
                :backText="headerContent.backText"
                :isActive="headerContent.isActive"
              />
              <v-form class="forms" v-model="valid">
                <v-row>
                  <v-col md="7" cols="12">
                    <v-text-field
                      v-model="question.questionText"
                      outlined
                      type="text"
                      :label="$t('addQuestionPage.questionTextLabel')"
                      :rules="[
                        required($t('addQuestionPage.questionTextLabel')),
                        minLength($t('addQuestionPage.questionTextLabel'), 8),
                      ]"
                      prepend-inner-icon="mdi-format-text"
                    ></v-text-field>
                    <v-text-field
                      outlined
                      v-model="question.questionTimer"
                      type="number"
                      min="0"
                      :suffix="$t('questionPage.second')"
                      :label="$t('addQuestionPage.questionTimeLabel')"
                      :rules="[
                        required($t('addQuestionPage.questionTimeLabel')),
                      ]"
                      prepend-inner-icon="mdi-timer-outline"
                    ></v-text-field>
                    <v-row>
                      <v-col sm="6" cols="12">
                        <v-select
                          v-model="question.questionType"
                          :items="questionTypes"
                          id="questionType"
                          :rules="[
                            required($t('addQuestionPage.questionTypeLabel')),
                          ]"
                          :label="$t('addQuestionPage.questionTypeLabel')"
                          outlined
                          prepend-inner-icon="mdi-crosshairs-question"
                          required
                        ></v-select>
                      </v-col>
                      <v-col sm="6" cols="12">
                        <v-select
                          v-model="question.answerType"
                          :items="answerTypes"
                          id="answerType"
                          :rules="[
                            required($t('addQuestionPage.answerTypeLabel')),
                          ]"
                          :label="$t('addQuestionPage.answerTypeLabel')"
                          outlined
                          prepend-inner-icon="mdi-checkbox-marked-circle-outline"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-text-field
                      outlined
                      v-model="question.questionSrc"
                      type="text"
                      :label="$t('addQuestionPage.sourceLabel')"
                      prepend-inner-icon="mdi-source-branch-check"
                    ></v-text-field>
                  </v-col>
                  <v-col md="5" cols="12">
                    <div
                      class="quiz-creation-img w-100 d-flex align-center justify-center position-relative overflow-hidden"
                    >
                      <img
                        class="w-100 h-100 added-img"
                        v-if="question.imageUrl"
                        :src="question.imageUrl"
                      />
                      <i class="far fa-image" v-else></i>
                      <span
                        class="clear-img position-absolute d-flex align-center justify-center"
                        v-if="question.imageUrl"
                        @click="clear"
                        style="bottom: 10px; right: 10px;"
                      >
                        <i class="fas fa-trash-alt text-white"></i>
                      </span>
                    </div>
                    <v-file-input
                      v-model="file"
                      class="file-input"
                      @change="onFileChange"
                      @click:clear="clear"
                      :show-size="1000"
                      :label="this.$t('addQuizPage.chooseImg')"
                      accept="image/*"
                      outlined
                      hide-details="auto"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                    />
                  </v-col>
                </v-row>
                <v-row class="explanation-row">
                  <v-col
                    cols="12"
                    class="add-explanation d-flex align-center justify-center flex-column"
                  >
                    <div
                      v-html="explanation"
                      class="w-100 d-flex justify-content-start flex-column"
                    ></div>
                    <v-btn
                      text
                      height="auto"
                      class="white--text d-block title explanation-btn"
                      @click="expDialog = true"
                    >
                      {{ $t("addQuestionPage.addExplanation") }}
                    </v-btn>
                    <v-dialog max-width="700" v-model="expDialog">
                      <v-card>
                        <Editor v-model="explanation" />
                        <v-btn block @click="expDialog = false">{{
                          $t("questionPage.copyDialog.close")
                        }}</v-btn>
                      </v-card>
                    </v-dialog>
                  </v-col>
                </v-row>
                <v-row class="answers flex-column">
                  <v-col cols="12" class="answers-header d-flex flex-column">
                    <h3 class="answers-title d-flex justify-content-start">
                      {{ $t("addQuestionPage.answersTitle") }}
                    </h3>
                    <v-divider horizontal></v-divider>
                  </v-col>
                  <TextAnswers
                    :questionType="question.questionType"
                    :answersData="answers"
                    v-if="
                      question.answerType ==
                        $t('addQuestionPage.answersType.text')
                    "
                  />
                  <ImageAnswers
                    :questionType="question.questionType"
                    :answersData="answers"
                    v-if="
                      question.answerType ==
                        $t('addQuestionPage.answersType.image')
                    "
                  />
                  <v-row class="w-100 d-flex justify-center sub-btn-content">
                    <v-btn
                      class="white--text d-block title sub-btn"
                      height="auto"
                      :disabled="!valid"
                    >
                      {{ $t("addQuestionPage.title") }}
                    </v-btn>
                  </v-row>
                </v-row>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import SideMenu from "@/components/AccountComponents/SideMenu";
import AccountHeader from "@/components/AccountComponents/AccountHeader";
import Editor from "@/components/AccountComponents/Editor";
import TextAnswers from "@/components/AccountComponents/AnswersComponents/TextAnswers";
import ImageAnswers from "@/components/AccountComponents/AnswersComponents/ImageAnswers";
export default {
  middleware: ['auth'],
  layout: "account",
  head() {
    return {
      title: this.$t("editQuestoonPage.title"),
    };
  },
  data() {
    return {
      answers: [
        {
          ansText: "3",
          imageUrl: "",
          isCorrect: false,
          points: 0,
        },
        {
          ansText: "5",
          imageUrl: "",
          isCorrect: true,
          points: 100,
        },
        {
          ansText: "10",
          imageUrl: "",
          isCorrect: false,
          points: 0,
        },
        {
          ansText: "0",
          imageUrl: "",
          isCorrect: false,
          points: 0,
        },
      ],
      question: {
        questionText: "كم عدد أهرمات الجيزة",
        imageUrl:
          "https://res.cloudinary.com/dpmvrlnsv/image/upload/v1614245383/defaults/EQUIZATION.png",
        questionSrc: "https://maleskndrany.com",
        questionTimer: 10,
        questionType: this.$t("addQuestionPage.questionTypes.oneAnswer"),
        answerType: this.$t("addQuestionPage.answersType.text"),
      },
      valid: false,
      show1: false,
      file: null,
      explanation: null,
      expDialog: false,
      textAnswers: "",
      questionTypes: [
        this.$t("addQuestionPage.questionTypes.oneAnswer"),
        this.$t("addQuestionPage.questionTypes.multiAnswers"),
        this.$t("addQuestionPage.questionTypes.trueFalse"),
        this.$t("addQuestionPage.questionTypes.noAnswer"),
      ],
      answerTypes: [
        this.$t("addQuestionPage.answersType.text"),
        this.$t("addQuestionPage.answersType.image"),
      ],
      visible: true,
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
      emailRules(errorName) {
        return (v) =>
          /.@+./.test(v) || `${errorName} ${this.$t("emailRulesError")}`;
      },
    };
  },
  computed: {
    // Header Content
    headerContent() {
      return {
        headerText: this.$t("editQuestoonPage.title"),
        backLink: "/quizes/my-quiz",
        backText: this.$t("AccountPage.AccountHeader.backText"),
        isActive: true,
      };
    },
  },
  methods: {
    onFileChange() {
      if (this.file) {
        let reader = new FileReader();
        reader.onload = () => {
          this.question.imageUrl = reader.result;
        };
        reader.readAsDataURL(this.file);
      }
    },
    clear() {
      this.file = null;
      this.question.imageUrl = "";
    },
    changeSelection() {
      console.log("Good");
    },
  },
  components: {
    SideMenu,
    AccountHeader,
    Editor,
    TextAnswers,
    ImageAnswers,
  },
};
</script>

<style scoped>
.fa-image {
  font-size: 170px;
  color: #a4abbb !important;
}

.explanation-row {
  margin-top: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

.add-explanation {
  background-color: #e3f7f6;
  border-radius: 10px;
  padding: 20px 0 !important;
}

button.explanation-btn {
  min-width: 20% !important;
  padding: 7px 16px 9px !important;
  background-color: #adc1c0 !important;
  border-radius: 10px;
}

.add-explanation p {
  width: 95% !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  line-height: 29px !important;
  text-align: center;
}

.answers {
  margin-top: 25px !important;
}

.answers-title {
  color: #a4abbb !important;
}

.sub-btn-content {
  margin-top: 15px;
}

.sub-btn-content .sub-btn {
  min-width: 19% !important;
  padding: 7px 16px 8px !important;
  width: auto !important;
}
</style>
