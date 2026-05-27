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
                      type="number"
                      value="0"
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
                          v-model="questionType"
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
                          v-model="answerType"
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
                      type="text"
                      :label="$t('addQuestionPage.sourceLabel')"
                      prepend-inner-icon="mdi-source-branch-check"
                    ></v-text-field>
                  </v-col>
                  <v-col md="5" cols="12">
                    <div
                      class="quiz-creation-img w-100 d-flex align-center justify-center overflow-hidden position-relative"
                    >
                      <img
                        class="w-100 h-100 added-img"
                        v-if="imageUrl"
                        :src="imageUrl"
                      />
                      <i class="far fa-image" v-else></i>
                      <span
                        v-if="imageUrl"
                        class="clear-img position-absolute d-flex align-center justify-center"
                        @click="clear"
                        style="bottom: 10px; left: 10px;"
                      >
                        <i class="fas fa-trash-alt"></i>
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
                    <!-- question text -->
                    <v-text-field
                      outlined
                      type="text"
                      v-model="questionText"
                      :label="$t('addQuestionPage.questionTextLabel')"
                      :rules="[
                        required($t('addQuestionPage.questionTextLabel')),
                        minLength($t('addQuestionPage.questionTextLabel'), 8),
                      ]"
                      prepend-inner-icon="mdi-format-text"
                      class="mt-3"
                    ></v-text-field>
                    <v-dialog max-width="700" v-model="expDialog">
                      <v-card>
                        <Editor v-model="explanation" />
                        <v-btn block @click="expDialog = false">
                          {{ $t("questionPage.copyDialog.close") }}
                        </v-btn>
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
                    :questionType="questionType"
                    :answersData="textAnswersData"
                    v-if="answerType == $t('addQuestionPage.answersType.text')"
                    @update="textAnswersData = $event"
                  />
                  <ImageAnswers
                    :questionType="questionType"
                    :answersData="imageAnswersData"
                    v-if="answerType == $t('addQuestionPage.answersType.image')"
                    @update="imageAnswersData = $event"
                  />

                  <!-- Error / Success alerts -->
                  <v-alert v-if="successMsg" type="success" class="mx-4 mt-4">{{ successMsg }}</v-alert>
                  <v-alert v-if="errorMsg"   type="error"   class="mx-4 mt-4">{{ errorMsg }}</v-alert>

                  <v-row class="w-100 d-flex justify-center sub-btn-content">
                    <v-btn
                      class="white--text d-block title sub-btn"
                      height="auto"
                      :disabled="!valid"
                      :loading="saving"
                      color="primary"
                      @click="submitQuestion"
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
      title: this.$t("addQuestionPage.title"),
    };
  },
  data() {
    return {
      valid: false,
      saving: false,
      file: null,
      imageUrl: null,
      explanation: null,
      expDialog: false,
      questionText: '',
      textAnswersData: [],
      imageAnswersData: [],
      successMsg: '',
      errorMsg: '',
      questionType: this.$t("addQuestionPage.questionTypes.oneAnswer"),
      answerType: this.$t("addQuestionPage.answersType.text"),
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
      const quizId = this.$route.query.quizId
        || (process.client ? sessionStorage.getItem('currentQuizId') : null);
      return {
        headerText: this.$t("addQuestionPage.headerText"),
        backLink: quizId ? `/quizes/questions?quizId=${quizId}` : '/my-quizzes',
        backText: this.$t("AccountPage.AccountHeader.backText"),
        isActive: true,
      };
    },
  },
  methods: {
    onFileChange() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = () => { this.imageUrl = reader.result; };
        reader.readAsDataURL(this.file);
      }
    },
    clear() {
      this.file = null;
      this.imageUrl = '';
    },
    buildAnswers() {
      const rawAnswers = this.answerType === this.$t('addQuestionPage.answersType.text')
        ? this.textAnswersData
        : this.imageAnswersData;
      if (!rawAnswers || rawAnswers.length === 0) {
        // Build default true/false answers
        return [
          { text: 'صحيح', isCorrect: true,  points: 100 },
          { text: 'خطأ',  isCorrect: false, points: 0   },
        ];
      }
      return rawAnswers.map(a => ({
        text:      a.ansText || a.text || '',
        imageUrl:  a.imageUrl || '',
        isCorrect: a.isCorrect || false,
        points:    a.points !== undefined ? a.points : (a.isCorrect ? 100 : 0),
      }));
    },
    async submitQuestion() {
      this.saving = true;
      this.successMsg = '';
      this.errorMsg = '';
      try {
        const quizId = this.$route.query.quizId
          || (process.client ? sessionStorage.getItem('currentQuizId') : null);
        if (!quizId) throw new Error('معرّف الاختبار غير موجود');
        const answers = this.buildAnswers();
        const payload = {
          quizId,
          questionText: this.questionText,
          type:        this.questionType === this.$t('addQuestionPage.questionTypes.multiAnswers') ? 'multiple' : 'single',
          timeLimit:   30,
          answers,
          explanation: this.explanation || '',
          imageUrl:    this.imageUrl || '',
        };
        await this.$axios.post('/questions', payload);
        this.successMsg = 'تمت إضافة السؤال بنجاح!';
        // Reset form
        this.questionText = '';
        this.imageUrl     = null;
        this.explanation  = null;
        this.textAnswersData  = [];
        this.imageAnswersData = [];
      } catch (e) {
        this.errorMsg = e.response?.data?.message || 'فشل في حفظ السؤال';
        console.error('Create question error:', e);
      } finally {
        this.saving = false;
      }
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
