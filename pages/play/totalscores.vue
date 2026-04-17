<!-- play/totalscores.vue - Solo play final results -->
<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <div class="scores-header d-flex align-center justify-space-between">
          <h1>{{ $t("finalResults.title") }}</h1>
          <v-btn height="auto" class="white--text end-quiz title" text @click="goHome">
            {{ $t("finalResults.endQuiz") }}
          </v-btn>
        </div>

        <v-divider horizontal></v-divider>

        <!-- My result highlight -->
        <div class="my-result-card text-center pa-6 mb-4">
          <v-icon size="60" :color="accuracy >= 80 ? 'amber' : accuracy >= 50 ? '#ff5e94' : 'grey'">
            {{ accuracy >= 80 ? 'mdi-trophy' : accuracy >= 50 ? 'mdi-account-star' : 'mdi-emoticon-sad-outline' }}
          </v-icon>
          <h2 class="white--text mt-2">{{ playerName }}</h2>
          <p class="white--text subtitle-1 mt-1">
            النقاط: <strong>{{ score }}</strong> |
            الصحيح: <strong>{{ correct }}</strong>/{{ total }} |
            الدقة: <strong>{{ accuracy }}%</strong>
          </p>
        </div>

        <!-- Question-by-question breakdown -->
        <div class="result-description">
          <h3 class="white--text text-center mb-3">تفاصيل الإجابات</h3>
          <div class="table-content w-100 mx-auto">
            <div
              v-for="(item, i) in answerBreakdown"
              :key="i"
              class="breakdown-item pa-3 mb-2 rounded"
              :class="item.isCorrect ? 'correct-row' : 'incorrect-row'"
            >
              <div class="d-flex align-center justify-space-between">
                <span class="white--text font-weight-bold">س{{ i + 1 }}:</span>
                <v-chip :color="item.isCorrect ? 'teal' : 'pink'" dark small>
                  {{ item.isCorrect ? `+${item.points} نقطة` : 'خاطئة' }}
                </v-chip>
              </div>
              <p class="white--text mt-1 mb-0" style="font-size:14px; opacity:0.9">
                {{ item.questionText }}
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
      playerName:      '',
      score:           0,
      correct:         0,
      total:           0,
      accuracy:        0,
      answerBreakdown: [],
    };
  },

  mounted() {
    if (!process.client) return;

    this.playerName = sessionStorage.getItem('soloPlayerName') || sessionStorage.getItem('playerName') || 'لاعب';
    const gs        = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
    this.score      = gs.score || 0;
    this.total      = gs.totalQuestions || 0;

    // Build answer breakdown from soloAnswers + soloQuestions
    const soloAnswers   = JSON.parse(sessionStorage.getItem('soloAnswers')   || '[]');
    const soloQuestions = JSON.parse(sessionStorage.getItem('soloQuestions') || '[]');

    this.correct = soloAnswers.filter(a => a.isCorrect).length;
    this.accuracy = this.total > 0 ? Math.round((this.correct / this.total) * 100) : 0;

    this.answerBreakdown = soloQuestions.map((q, i) => {
      const ans = soloAnswers[i] || {};
      return {
        questionText: q.questionText,
        isCorrect:    ans.isCorrect || false,
        points:       ans.points    || 0,
      };
    });

    // Clean up solo session data
    sessionStorage.removeItem('soloQuestions');
    sessionStorage.removeItem('soloAnswers');
    sessionStorage.removeItem('soloQuizId');
    sessionStorage.removeItem('playerGameState');
  },

  methods: {
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
.scores-header h1 { font-size: 28px; color: #a4abbb; }
.end-quiz { padding: 3px 25px; background-color: #ff5e94; border-radius: 10px; }
.my-result-card { background-color: rgba(58,55,152,0.4); border-radius: 12px; }
.breakdown-item.correct-row { background-color: rgba(120,189,188,0.25); border-right: 4px solid #78bdbc; }
.breakdown-item.incorrect-row { background-color: rgba(241,162,189,0.2); border-right: 4px solid #f1a2bd; }
.ltr .breakdown-item.correct-row { border-right: none; border-left: 4px solid #78bdbc; }
.ltr .breakdown-item.incorrect-row { border-right: none; border-left: 4px solid #f1a2bd; }
</style>
