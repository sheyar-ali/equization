<!-- play/totalscores.vue - Solo play final results -->
<template>
  <section class="play-page play-quiz total-scores-page">
    <v-container fluid>
      <div class="play-page-container">
        <div class="scores-header d-flex align-center justify-space-between">
          <h1>{{ $t("finalResults.title") }}</h1>
          <v-btn height="auto" class="white--text end-quiz title" text @click="goHome">
            {{ $t("finalResults.endQuiz") }}
          </v-btn>
        </div>

        <v-divider horizontal></v-divider>

        <!-- Loading state while submitting -->
        <div v-if="submitting" class="text-center py-12">
          <v-progress-circular indeterminate color="#ff5e94" size="60"></v-progress-circular>
          <p class="result-label mt-4">جاري حساب النتائج...</p>
        </div>

        <template v-else>
          <!-- My result highlight -->
          <div class="my-result-card text-center pa-6 mb-4">
            <v-icon size="60" :color="accuracy >= 80 ? 'amber' : accuracy >= 50 ? '#ff5e94' : '#a4abbb'">
              {{ accuracy >= 80 ? 'mdi-trophy' : accuracy >= 50 ? 'mdi-account-star' : 'mdi-emoticon-sad-outline' }}
            </v-icon>
            <h2 class="result-name mt-2">{{ playerName }}</h2>
            <p class="result-stats mt-1">
              النقاط: <strong>{{ score }}</strong> |
              الصحيح: <strong>{{ correct }}</strong>/{{ total }} |
              الدقة: <strong>{{ accuracy }}%</strong>
            </p>
          </div>

          <!-- Question-by-question breakdown -->
          <div class="result-description">
            <h3 class="section-title text-center mb-3">تفاصيل الإجابات</h3>
            <div class="table-content w-100 mx-auto">
              <div
                v-for="(item, i) in answerBreakdown"
                :key="i"
                class="breakdown-item pa-3 mb-2 rounded"
                :class="item.isCorrect ? 'correct-row' : 'incorrect-row'"
              >
                <div class="d-flex align-center justify-space-between mb-1">
                  <v-chip :color="item.isCorrect ? 'teal' : 'pink'" dark small>
                    {{ item.isCorrect ? `+${item.points} نقطة` : 'خاطئة' }}
                  </v-chip>
                  <span class="question-num">س{{ i + 1 }}</span>
                </div>
                <p class="question-text mb-0">{{ item.questionText }}</p>
                <p v-if="!item.isCorrect && item.correctAnswerText" class="correct-hint mb-0">
                  ✓ الإجابة الصحيحة: {{ item.correctAnswerText }}
                </p>
              </div>

              <div v-if="!answerBreakdown.length" class="text-center py-10">
                <v-icon size="50" color="grey">mdi-chart-bar</v-icon>
                <p class="grey--text mt-4">لا توجد تفاصيل</p>
              </div>
            </div>
          </div>

          <!-- Play Again -->
          <div class="d-flex justify-center mt-6" style="gap: 16px">
            <v-btn color="#3a3798" dark large @click="playAgain">
              <v-icon left>mdi-refresh</v-icon>
              العب مجددًا
            </v-btn>
            <v-btn color="#ff5e94" dark large @click="goHome">
              <v-icon left>mdi-home</v-icon>
              الرئيسية
            </v-btn>
          </div>
        </template>
      </div>
    </v-container>
  </section>
</template>

<script>
export default {
  layout: "play",
  head() { return { title: this.$t("finalResults.title") }; },

  data() {
    return {
      submitting:      true,
      playerName:      '',
      score:           0,
      correct:         0,
      total:           0,
      accuracy:        0,
      answerBreakdown: [],
    };
  },

  async mounted() {
    if (!process.client) return;

    this.playerName = sessionStorage.getItem('soloPlayerName') || sessionStorage.getItem('playerName') || 'لاعب';

    const soloAnswers   = JSON.parse(sessionStorage.getItem('soloAnswers')   || '[]');
    const soloQuestions = JSON.parse(sessionStorage.getItem('soloQuestions') || '[]');
    const quizId        = sessionStorage.getItem('soloQuizId');

    this.total = soloQuestions.length;

    // Submit to backend for accurate scoring + history recording
    if (quizId && soloAnswers.length) {
      await this.submitToBackend(quizId, soloAnswers, soloQuestions);
    } else {
      // Fallback: build from local data
      this.buildBreakdownLocally(soloAnswers, soloQuestions);
      this.submitting = false;
    }

    // Clean up session data
    sessionStorage.removeItem('soloQuestions');
    sessionStorage.removeItem('soloAnswers');
    sessionStorage.removeItem('soloQuizId');
    sessionStorage.removeItem('playerGameState');

    // Show "read more" if applicable
    this.$nextTick(() => {
      const el = document.getElementById('fullDesc');
      if (el && el.innerHTML.length > 150) {
        const rm = document.getElementById('read-more');
        if (rm) rm.classList.remove('hidden');
      }
    });
  },

  methods: {
    async submitToBackend(quizId, soloAnswers, soloQuestions) {
      try {
        const totalTimeSpent = soloAnswers.reduce((acc, a) => acc + (a.timeSpent || 0), 0);
        const res = await this.$axios.post('/play/submit', {
          quizId,
          playerName: this.playerName,
          answers:    soloAnswers,
          timeSpent:  totalTimeSpent,
        });

        const result          = res.data?.data?.result;
        const processedAns    = res.data?.data?.answers || [];

        if (result) {
          this.score    = result.score;
          this.correct  = result.correctAnswers;
          this.total    = result.totalQuestions || this.total;
          this.accuracy = parseFloat(result.accuracy) || 0;
        }

        // Build breakdown: server tells us isCorrect; questions have the answer texts
        this.answerBreakdown = soloQuestions.map((q, i) => {
          const srv = processedAns[i] || {};
          const correctAnswerText = (q.answers || [])
            .filter(a => a.isCorrect)
            .map(a => a.text)
            .join(' / ');
          return {
            questionText:     q.questionText || `سؤال ${i + 1}`,
            isCorrect:        srv.isCorrect  || false,
            points:           srv.points     || 0,
            correctAnswerText,
          };
        });
      } catch (e) {
        // Fallback to local
        this.buildBreakdownLocally(soloAnswers, soloQuestions);
      } finally {
        this.submitting = false;
      }
    },

    buildBreakdownLocally(soloAnswers, soloQuestions) {
      const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
      this.score   = gs.score || 0;
      this.correct = soloAnswers.filter(a => a.isCorrect).length;
      this.accuracy = this.total > 0 ? Math.round((this.correct / this.total) * 100) : 0;

      this.answerBreakdown = soloQuestions.map((q, i) => {
        const ans = soloAnswers[i] || {};
        const correctAnswerText = (q.answers || [])
          .filter(a => a.isCorrect)
          .map(a => a.text)
          .join(' / ');
        return {
          questionText:     q.questionText,
          isCorrect:        ans.isCorrect || false,
          points:           ans.points    || 0,
          correctAnswerText,
        };
      });
    },

    goHome() {
      this.$router.push(this.localePath('/explore'));
    },
    playAgain() {
      const quizId = sessionStorage.getItem('currentQuizId');
      if (quizId) {
        this.$router.push(this.localePath('/play/options'));
      } else {
        this.goHome();
      }
    },
  },
};
</script>

<style scoped>
/* ── Header ── */
.scores-header h1 { font-size: 28px; color: #3a3798; }
.end-quiz { padding: 3px 25px; background-color: #ff5e94; border-radius: 10px; }

/* ── Result card ── */
.my-result-card {
  background: linear-gradient(135deg, #3a3798 0%, #6c63ff 60%, #ff5e94 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(58, 55, 152, 0.35);
}
.result-name  { font-size: 26px; color: #fff; font-weight: 700; }
.result-stats { font-size: 16px; color: rgba(255,255,255,0.9); }
.result-label { font-size: 18px; color: #75769a; }

/* ── Breakdown ── */
.section-title { font-size: 20px; color: #3a3798; font-weight: 700; }

.breakdown-item { border: 1px solid transparent; }

.breakdown-item.correct-row {
  background-color: rgba(120, 189, 188, 0.18);
  border-right: 4px solid #78bdbc;
  border-color: rgba(120,189,188,0.4);
}
.breakdown-item.incorrect-row {
  background-color: rgba(241, 162, 189, 0.15);
  border-right: 4px solid #f1a2bd;
  border-color: rgba(241,162,189,0.4);
}

/* LTR overrides */
.ltr .breakdown-item.correct-row   { border-right: none; border-left: 4px solid #78bdbc; }
.ltr .breakdown-item.incorrect-row { border-right: none; border-left: 4px solid #f1a2bd; }

.question-num  { font-size: 14px; color: #75769a; font-weight: 600; }
.question-text { font-size: 15px; color: #3a3798; font-weight: 500; line-height: 1.6; text-align: right; }
.correct-hint  { font-size: 13px; color: #2a8e8d; font-weight: 600; margin-top: 4px; text-align: right; }

.ltr .question-text { text-align: left; }
.ltr .correct-hint  { text-align: left; }
</style>
