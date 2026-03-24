<!-- Host Scoreboard - After each question, show leaderboard -->
<template>
  <section class="play-page play-quiz quiz-scoreboard">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHostHeader
          :timer="timer"
          :QuestionOrder="questionIndex + 1"
          :Questions="totalQuestions"
          :answers="answeredCount"
          :players="playersCount"
        />

        <div class="answer-result w-100">
          <div class="answer-result-content d-flex align-center justify-space-between w-100">
            <h2>{{ $t("finalResults.correctAnswer") }} {{ correctAnswerText }}</h2>
            <v-btn height="auto" class="white--text" @click="showExp = true" text>
              {{ $t("finalResults.showExplanation") }}
            </v-btn>
          </div>

          <!-- Answer stats -->
          <div class="stat mx-auto">
            <v-row>
              <v-col cols="12" md="6" class="stat-col" v-for="stat in stats" :key="stat.id">
                <div class="stat-content d-flex align-center w-100">
                  <span class="result-icon text-white d-flex justify-center align-center" :class="stat.isCorrect ? 'true-icon' : 'false-icon'">
                    <i :class="stat.isCorrect ? 'fas fa-check' : 'fas fa-times'"></i>
                  </span>
                  <span class="stat-number d-flex align-center justify-center">{{ stat.count }}</span>
                  <h3>{{ stat.text }}</h3>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="result-description">
          <div class="table-content w-100 mx-auto">
            <div class="headers w-100 d-flex align-center">
              <div class="table-head"><h3 class="text-center">{{ $t("resultTables.scoreBoard.headers.name") }}</h3></div>
              <div class="table-head"><h3 class="text-center">{{ $t("resultTables.scoreBoard.headers.currentResult") }}</h3></div>
              <div class="table-head"><h3 class="text-center">{{ $t("resultTables.scoreBoard.headers.finalResult") }}</h3></div>
            </div>
            <v-divider horizontal></v-divider>
            <div class="table-body w-100 d-flex align-center flex-column" v-for="entry in leaderboard" :key="entry.id">
              <div class="table-body-content d-flex align-center justify-center w-100">
                <div class="text-center"><h2>{{ entry.name }}</h2></div>
                <div class="text-center"><h2>{{ entry.lastPoints }}</h2></div>
                <div class="text-center"><h2>{{ entry.score }}</h2></div>
              </div>
              <v-divider horizontal class="last-divider w-100"></v-divider>
            </div>

            <!-- Empty leaderboard -->
            <div v-if="!leaderboard.length" class="text-center py-6">
              <p class="grey--text">لم يجب أحد على هذا السؤال بعد</p>
            </div>
          </div>
        </div>

        <!-- Next Question / End Game -->
        <div class="d-flex justify-center mt-4 gap-4" style="gap:16px">
          <v-btn
            v-if="questionIndex + 1 < totalQuestions"
            class="white--text title next-question"
            color="#3a3798"
            height="auto"
            @click="nextQuestion"
          >
            <v-icon class="mx-2">mdi-skip-next</v-icon>
            {{ $t("resultTables.scoreBoard.headers.btn") || 'السؤال التالي' }}
          </v-btn>
          <v-btn
            v-else
            class="white--text title"
            color="#ff5e94"
            height="auto"
            @click="endGame"
          >
            <v-icon class="mx-2">mdi-flag-checkered</v-icon>
            {{ $t("finalResults.endQuiz") || 'إنهاء اللعبة' }}
          </v-btn>
        </div>
      </div>

      <!-- Explanation Dialog -->
      <v-dialog v-model="showExp" max-width="550px">
        <v-card>
          <v-card-title class="text-center font-weight-bold d-block">{{ $t("finalResults.questionExplanation") }}</v-card-title>
          <v-divider></v-divider>
          <p class="exp" v-if="explanation">{{ explanation }}</p>
          <p class="exp text-center" v-else>{{ $t("finalResults.noExplanation") }}</p>
        </v-card>
      </v-dialog>
    </v-container>
  </section>
</template>

<script>
import QuestionHostHeader from "@/components/PlayComponents/QuestionHostHeader";

export default {
  layout: "play",
  head() { return { title: this.$t("resultTables.scoreBoard.title") }; },

  data() {
    return {
      sessionCode:       '',
      questionIndex:     0,
      totalQuestions:    0,
      timer:             30,
      answeredCount:     0,
      playersCount:      0,
      correctAnswerText: '',
      explanation:       '',
      leaderboard:       [],
      stats:             [],
      showExp:           false,
    };
  },

  mounted() {
    if (!process.client) return;

    this.sessionCode = sessionStorage.getItem('sessionCode') || '';
    const gameState  = JSON.parse(sessionStorage.getItem('gameState') || '{}');

    this.questionIndex   = gameState.questionIndex   || 0;
    this.totalQuestions  = gameState.totalQuestions  || 0;
    this.timer           = gameState.timer           || 30;
    this.playersCount    = gameState.playersCount    || 0;
    this.explanation     = gameState.explanation     || '';

    // Build leaderboard from gameState
    const lb = gameState.leaderboard || [];
    this.leaderboard = lb.slice(0, 10).map(p => ({
      id:         p.id || p._id,
      name:       p.name,
      score:      p.score,
      lastPoints: p.lastAnswer?.points || 0,
    }));

    // Build answer stats from gameState
    const answers = gameState.answers || [];
    const rawLb   = lb;
    this.stats = answers.map((ans, idx) => {
      const count = rawLb.filter(p =>
        p.lastAnswer?.selectedAnswers?.includes(String(ans._id))
      ).length;
      return {
        id:        idx,
        isCorrect: ans.isCorrect,
        count,
        text:      ans.text || ans.ansText || '',
      };
    });

    // Correct answer text
    const correctAns = answers.find(a => a.isCorrect);
    this.correctAnswerText = correctAns?.text || correctAns?.ansText || '';

    // Listen for live updates
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.on('results:shown', (data) => {
        // Update leaderboard live if needed
        if (data.leaderboard) {
          this.leaderboard = data.leaderboard.slice(0, 10).map(p => ({
            id:         p.id || p._id,
            name:       p.name,
            score:      p.score,
            lastPoints: p.lastAnswer?.points || 0,
          }));
        }
      });
    }
  },

  beforeDestroy() {
    const socket = this.$socket?.getSocket?.();
    if (socket) socket.off('results:shown');
  },

  methods: {
    async nextQuestion() {
      const nextIndex = this.questionIndex + 1;
      if (nextIndex >= this.totalQuestions) {
        await this.endGame();
        return;
      }

      // Send next question via socket
      const socket = this.$socket?.getSocket?.();
      if (socket) {
        socket.emit('host:send-question',
          { sessionCode: this.sessionCode, questionIndex: nextIndex },
          (res) => {
            if (res?.success && res.question) {
              const q = res.question;
              const gameState = JSON.parse(sessionStorage.getItem('gameState') || '{}');
              gameState.questionIndex  = nextIndex;
              gameState.questionText   = q.questionText;
              gameState.questionImage  = q.questionImage || '';
              gameState.timer          = q.timeLimit || 30;
              gameState.answers        = q.answers || [];
              gameState.fullAnswers    = q.fullAnswers || q.answers || [];
              gameState.leaderboard    = [];
              sessionStorage.setItem('gameState', JSON.stringify(gameState));
              this.$router.push(this.localePath('/host/standby'));
            } else {
              console.error('[Scoreboard] nextQuestion failed:', res?.message);
            }
          }
        );
      }
    },

    async endGame() {
      const socket = this.$socket?.getSocket?.();
      if (socket) {
        socket.emit('host:end-game', { sessionCode: this.sessionCode }, (res) => {
          const gameState = JSON.parse(sessionStorage.getItem('gameState') || '{}');
          gameState.finalResults = res?.finalResults || [];
          sessionStorage.setItem('gameState', JSON.stringify(gameState));
          this.$router.push(this.localePath('/host/totalscores'));
        });
      } else {
        this.$router.push(this.localePath('/host/totalscores'));
      }
    },
  },

  components: { QuestionHostHeader },
};
</script>

<style scoped>
.stat { padding: 15px 30px; margin-top: 15px; }
.stat .stat-col { padding: 5px !important; }
.stat-content { padding: 15px 25px; background-color: #e5e4f2; border-radius: 10px; }
.stat-number { width: 30px; height: 30px; margin: 0 10px; background-color: #f7f7ff; color: #3a3798; font-weight: 600; font-size: 23px; border-radius: 5px; }
.stat-content h3 { color: #3a3798; font-weight: 600; margin-right: 10px; font-size: 20px; line-height: 35px; flex-grow: 1; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
.v-dialog .v-card { overflow: hidden; text-align: center; min-height: 200px; }
.v-dialog .v-card p.exp { padding: 20px; font-size: 20px; color: #a9aac5; text-align: justify; }
@media only screen and (max-width: 767px) {
  .play-page .stat { padding: 20px 0; width: 100%; }
  .stat-content h3 { font-size: 16px !important; }
}
</style>
