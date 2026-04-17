<!-- play/options.vue - Start individual quiz -->
<template>
  <section class="play-page">
    <v-container fluid class="w-100 h-100">
      <div class="play-page-container w-100 h-100">
        <div class="play-page-content w-100 h-100 d-flex align-center justify-center flex-column">

          <v-progress-circular v-if="loading" indeterminate color="#ff5e94" size="80"></v-progress-circular>
          <p v-if="loading" class="white--text mt-4 title">جاري تحميل الاختبار...</p>

          <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

          <!-- Enter player name if not logged in -->
          <template v-if="!loading && !error && showNameInput">
            <v-form @submit.prevent="startGame" class="d-flex flex-column align-center w-100">
              <p class="white--text text-center mb-4 title">أدخل اسمك للبدء</p>
              <v-text-field
                outlined dark
                v-model="playerName"
                label="الاسم"
                :rules="[v => !!v || 'الاسم مطلوب']"
                style="max-width: 300px; width: 100%"
              ></v-text-field>
              <v-btn class="white--text mt-2" color="#ff5e94" large @click="startGame" :disabled="!playerName">
                ابدأ الاختبار
              </v-btn>
            </v-form>
          </template>

        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
export default {
  layout: "play",
  head() { return { title: 'ابدأ الاختبار' }; },
  data() {
    return {
      loading: false,
      error: '',
      showNameInput: false,
      playerName: '',
    };
  },
  async mounted() {
    if (!process.client) return;

    const quizId = sessionStorage.getItem('currentQuizId');
    if (!quizId) {
      this.error = 'لم يتم تحديد اختبار. يرجى العودة واختيار اختبار.';
      return;
    }

    // Check if user is logged in
    const user = this.$store?.state?.auth?.user || null;
    if (user) {
      this.playerName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;
      await this.startGame();
    } else {
      this.showNameInput = true;
    }
  },
  methods: {
    async startGame() {
      if (!this.playerName && !this.$store?.state?.auth?.user) return;

      const quizId = sessionStorage.getItem('currentQuizId');
      if (!quizId) { this.error = 'لم يتم تحديد اختبار'; return; }

      this.loading = true;
      this.showNameInput = false;
      this.error = '';

      try {
        const res = await this.$axios.post('/play/start', {
          quizId,
          playerName: this.playerName || 'لاعب',
        });

        const data = res.data?.data;
        if (!data) throw new Error('فشل في تحميل الاختبار');

        const { quiz, questions, totalQuestions } = data;

        // Save all questions (WITH isCorrect for solo play) to sessionStorage
        sessionStorage.setItem('soloQuizId', quizId);
        sessionStorage.setItem('soloPlayerName', this.playerName);
        sessionStorage.setItem('soloQuestions', JSON.stringify(questions));
        sessionStorage.setItem('soloAnswers', JSON.stringify([])); // accumulated answers

        // Set first question in playerGameState
        const firstQ = questions[0];
        const gameState = {
          questionIndex: 0,
          totalQuestions,
          questionText:  firstQ.questionText,
          questionImage: firstQ.questionImage || '',
          questionId:    firstQ._id,
          timer:         firstQ.timeLimit || 30,
          score:         0,
          // For solo: store full answers WITH isCorrect
          answers: firstQ.answers,
        };
        sessionStorage.setItem('playerGameState', JSON.stringify(gameState));

        this.$router.push(this.localePath('/play/standby'));
      } catch (e) {
        this.error = e.response?.data?.message || 'حدث خطأ في تحميل الاختبار';
        this.loading = false;
        this.showNameInput = true;
      }
    },
  },
};
</script>

<style scoped>
p { font-size: 20px; color: #75769a; }
</style>
