<!-- Questions List Page - Dynamic from API -->
<template>
  <section class="question-page d-flex align-center justify-center" style="min-height:100vh; width:100%;">
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

              <!-- Loading -->
              <div v-if="loading" class="d-flex justify-center align-center py-16">
                <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
              </div>

              <!-- Error -->
              <div v-else-if="error" class="text-center pa-8">
                <v-icon size="64" color="red">mdi-alert-circle</v-icon>
                <p class="title mt-4">{{ error }}</p>
                <v-btn color="primary" @click="fetchQuestions">إعادة التحميل</v-btn>
              </div>

              <template v-else>
                <!-- Quiz Info Bar -->
                <div v-if="quizData" class="quiz-info-bar d-flex align-center justify-space-between pa-3 mb-4 rounded">
                  <div>
                    <span class="font-weight-bold title">{{ quizData.title }}</span>
                    <v-chip small class="mr-2 ml-2" color="primary" text-color="white">
                      {{ questions.length }} {{ $t('questionPage.questionsCount') || 'سؤال' }}
                    </v-chip>
                  </div>
                  <div class="d-flex gap-2">
                    <v-btn
                      small outlined color="primary"
                      @click="$router.push(localePath(`/quizes/my-quiz?id=${quizId}`))"
                    >
                      <v-icon small class="ml-1">mdi-eye</v-icon>
                      عرض الاختبار
                    </v-btn>
                  </div>
                </div>

                <!-- Questions List -->
                <v-row class="questions-container" v-if="questions.length > 0">
                  <Question
                    v-for="(question, idx) in questions"
                    :key="question._id"
                    :imgSrc="question.imageUrl || ''"
                    :questionTitle="question.questionText || question.text || ''"
                    :questionTime="String(question.timeLimit || 30)"
                    :answersNumber="String(question.answers ? question.answers.length : 0)"
                    :questionOrder="idx + 1"
                    @delete="deleteQuestion(question._id)"
                    @edit="editQuestion(question._id)"
                  />
                </v-row>

                <!-- Empty State -->
                <v-row v-else>
                  <EmptyData :descriptionText="$t('questionPage.emptyData.descriptionText')" />
                </v-row>

                <!-- Add Question Button -->
                <div class="sub-btn d-flex align-center justify-center">
                  <v-btn
                    class="white--text title sub-btn d-flex align-center"
                    color="primary"
                    @click="$router.push(localePath(`/quizes/questions/add?quizId=${quizId}`))"
                  >
                    <v-icon class="ml-2">mdi-plus-circle</v-icon>
                    {{ $t("questionPage.subBtn") }}
                  </v-btn>
                </div>
              </template>

              <!-- Delete Confirmation Dialog -->
              <v-dialog v-model="deleteDialog" max-width="400px">
                <v-card>
                  <v-card-title class="text-center font-weight-bold d-block">
                    حذف السؤال
                  </v-card-title>
                  <v-divider></v-divider>
                  <p class="text-center mt-5 h5">هل أنت متأكد من حذف هذا السؤال؟</p>
                  <v-row class="px-10 pt-2 pb-5">
                    <v-col class="pa-2">
                      <v-btn color="#ff5e94" class="white--text w-100" height="50"
                        :loading="deleting" @click="confirmDelete">
                        <v-icon class="mx-2">mdi-trash-can-outline</v-icon>
                        حذف
                      </v-btn>
                    </v-col>
                    <v-col class="pa-2">
                      <v-btn outlined class="w-100" height="50" @click="deleteDialog = false">إلغاء</v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-dialog>
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
import Question from "@/components/AccountComponents/Question";
import EmptyData from "@/components/AccountComponents/EmptyData";

export default {
  layout: "account",
  head() {
    return {
      title: this.$t("questionPage.title"),
    };
  },
  data() {
    return {
      loading: true,
      error: null,
      questions: [],
      quizData: null,
      deleteDialog: false,
      deleting: false,
      questionToDelete: null,
    };
  },
  computed: {
    quizId() {
      return this.$route.query.quizId
        || (process.client ? sessionStorage.getItem('currentQuizId') : null);
    },
    headerContent() {
      return {
        headerText: `${this.$t("questionPage.headerText")} ${this.quizData ? this.quizData.title : ''}`,
        backLink: this.quizId ? `/quizes/my-quiz?id=${this.quizId}` : '/my-quizzes',
        backText: this.$t("AccountPage.AccountHeader.backText"),
        isActive: true,
      };
    },
  },
  async mounted() {
    if (this.quizId) {
      await Promise.all([this.fetchQuizData(), this.fetchQuestions()]);
    } else {
      this.error = 'لم يتم تحديد اختبار. يرجى العودة واختيار اختبار.';
      this.loading = false;
    }
  },
  methods: {
    async fetchQuizData() {
      try {
        const res = await this.$axios.get(`/quizzes/${this.quizId}`);
        this.quizData = res.data?.data?.quiz || res.data?.data || null;
      } catch (e) {
        console.error('Fetch quiz data error:', e);
      }
    },
    async fetchQuestions() {
      this.loading = true;
      this.error = null;
      try {
        const res = await this.$axios.get(`/questions/quiz/${this.quizId}`);
        this.questions = res.data?.data?.questions || res.data?.data || [];
      } catch (e) {
        this.error = e.response?.data?.message || 'فشل في تحميل الأسئلة';
        console.error('Fetch questions error:', e);
      } finally {
        this.loading = false;
      }
    },
    editQuestion(questionId) {
      this.$router.push(this.localePath(`/quizes/questions/edit?id=${questionId}&quizId=${this.quizId}`));
    },
    deleteQuestion(questionId) {
      this.questionToDelete = questionId;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      if (!this.questionToDelete) return;
      this.deleting = true;
      try {
        await this.$axios.delete(`/questions/${this.questionToDelete}`);
        this.questions = this.questions.filter(q => q._id !== this.questionToDelete);
        this.deleteDialog = false;
        this.questionToDelete = null;
      } catch (e) {
        console.error('Delete question error:', e);
        alert(e.response?.data?.message || 'فشل في حذف السؤال');
      } finally {
        this.deleting = false;
      }
    },
  },
  components: {
    SideMenu,
    AccountHeader,
    Question,
    EmptyData,
  },
};
</script>

<style scoped>
.questions-container {
  margin-top: 23px;
  margin-bottom: 10px;
}

.sub-btn {
  margin: 27px 0 19px;
}

.sub-btn button {
  height: 51px !important;
  min-width: 200px !important;
  padding: 1px 35px 3px !important;
  border-radius: 10px !important;
}

.empty-data a {
  display: none !important;
}

.quiz-info-bar {
  background: #f5f5ff;
  border: 1px solid #e0e0f0;
}

.gap-2 {
  gap: 8px;
}
</style>
