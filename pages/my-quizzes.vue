<template>
  <section class="page-section justify-center align-center d-flex">
    <section class="account-section d-flex align-center justify-center mx-auto">
      <v-container fluid>
        <v-row>
          <SideMenu activeLink="myQuizzes" />
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100">
              <AccountHeader
                :headerText="$t('myQuizzesPage.AccountHeader.headerText')"
                backLink="/"
                :backText="$t('AccountPage.AccountHeader.backText')"
                :isActive="false"
              />

              <!-- Loading -->
              <div v-if="loading" class="d-flex justify-center py-10">
                <AppLoader :fullpage="false" />
              </div>

              <!-- Quizzes from API -->
              <v-row class="quizzes" v-else-if="quizs.length > 0">
                <QuizComponent
                  v-for="(quiz, idx) in quizs"
                  :key="quiz._id"
                  :questLink="`/quizes/my-quiz?id=${quiz._id}`"
                  :questNumbers="quiz.questions ? quiz.questions.length : 0"
                  :playersNumbers="quiz.statistics ? quiz.statistics.totalPlayers : 0"
                  :quizTitle="quiz.title"
                  :categories="formatCategories(quiz.categories)"
                  :wowDelay="`${idx * 0.1}s`"
                  :coverImage="quiz.coverImage"
                  :quizCode="quiz.quizCode"
                />
              </v-row>

              <!-- Empty -->
              <v-row v-else>
                <EmptyData
                  :descriptionText="$t('emptyData.noQuizzes') || 'لم تقم بإنشاء أي اختبارات بعد'"
                  linkPath="/quizes/add"
                  :linkText="$t('emptyData.createQuiz') || 'إنشاء اختبار جديد'"
                />
              </v-row>

              <!-- Pagination -->
              <div v-if="quizs.length > 0 && totalPages > 1" class="d-flex justify-center mt-4">
                <v-btn icon :disabled="page === 1" @click="changePage(page-1)"><v-icon>mdi-chevron-right</v-icon></v-btn>
                <v-btn v-for="p in totalPages" :key="p" icon small :color="p===page?'primary':''" @click="changePage(p)" class="mx-1">{{ p }}</v-btn>
                <v-btn icon :disabled="page === totalPages" @click="changePage(page+1)"><v-icon>mdi-chevron-left</v-icon></v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import SideMenu      from "@/components/AccountComponents/SideMenu";
import AccountHeader from "@/components/AccountComponents/AccountHeader";
import QuizComponent from "@/components/Shared-Components/QuizComponent";
import EmptyData     from "@/components/AccountComponents/EmptyData";
import quizHelpers   from "@/mixins/quizHelpers";

export default {
  mixins: [quizHelpers],
  layout: "account",
  middleware: ['auth'],
  head() { return { title: this.$t("myQuizzesPage.AccountHeader.headerText") }; },
  data() {
    return { loading: true, quizs: [], page: 1, totalPages: 1 };
  },
  async mounted() { await this.fetchMyQuizzes(); },
  methods: {
    async fetchMyQuizzes() {
      try {
        this.loading = true;
        const res = await this.$axios.get('/quizzes/user/my-quizzes', {
          params: { page: this.page, limit: 12 },
        });
        this.quizs      = res.data?.data || [];
        this.totalPages = res.data?.pagination?.pages || 1;
      } catch (e) {
        console.error('Error:', e.message);
        this.quizs = [];
      } finally {
        this.loading = false;
      }
    },
    changePage(p) { this.page = p; this.fetchMyQuizzes(); },
    // formatCategories provided by quizHelpers mixin
  },
  components: { SideMenu, AccountHeader, QuizComponent, EmptyData, AppLoader: () => import("@/components/Shared-Components/AppLoader") },
};
</script>
