<!-- Player Scoreboard - After each question results -->
<template>
  <section class="play-page play-quiz quiz-scoreboard">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHeader
          :timer="0"
          :QuestionOrder="questionIndex + 1"
          :score="score"
          :Questions="totalQuestions"
        />

        <div class="answer-result w-100">
          <div class="answer-result-content d-flex align-center justify-space-between w-100">
            <h2>{{ $t("finalResults.correctAnswer") }}
              <span v-for="(ans, i) in correctAnswers" :key="i">{{ ans.text }}<span v-if="i < correctAnswers.length - 1">, </span></span>
            </h2>
            <v-btn height="auto" class="white--text" @click="showExp = true" text>
              {{ $t("finalResults.showExplanation") }}
            </v-btn>
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

            <div class="table-body w-100 d-flex align-center flex-column" v-for="(entry, i) in leaderboard" :key="i">
              <div class="table-body-content d-flex align-center justify-center w-100">
                <div class="text-center"><h2>{{ entry.name }}</h2></div>
                <div class="text-center"><h2>{{ entry.lastAnswer ? entry.lastAnswer.points : 0 }}</h2></div>
                <div class="text-center"><h2>{{ entry.score }}</h2></div>
              </div>
              <v-divider horizontal class="last-divider w-100"></v-divider>
            </div>

            <div v-if="!leaderboard.length" class="text-center py-8">
              <p class="grey--text">في انتظار نتائج المزيد من اللاعبين...</p>
            </div>
          </div>
        </div>

        <p class="text-center white--text mt-4">في انتظار السؤال التالي...</p>
        <v-progress-linear indeterminate color="#ff5e94" height="4" rounded class="mt-2"></v-progress-linear>
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
import QuestionHeader from "@/components/PlayComponents/QuestionHeader";

export default {
  layout: "play",
  head() { return { title: this.$t("resultTables.scoreBoard.title") }; },

  data() {
    return {
      questionIndex:  0,
      totalQuestions: 0,
      score:          0,
      correctAnswers: [],
      leaderboard:    [],
      explanation:    '',
      showExp:        false,
    };
  },

  mounted() {
    if (!process.client) return;
    const gameState = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');

    this.questionIndex   = gameState.questionIndex  || 0;
    this.totalQuestions  = gameState.totalQuestions || 0;
    this.score           = gameState.score          || 0;
    this.explanation     = gameState.explanation    || '';
    this.correctAnswers  = gameState.correctAnswers || [];
    this.leaderboard     = (gameState.leaderboard || []).slice(0, 10);

    // Listen for next question or game end
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.on('question:received', (data) => {
        const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.questionIndex  = data.questionIndex;
        gs.questionText   = data.questionText;
        gs.questionImage  = data.questionImage || '';
        gs.timer          = data.timeLimit || 30;
        gs.questionId     = data.questionId;
        gs.answers        = data.answers || [];
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
        this.$router.push(this.localePath('/play/standby'));
      });

      socket.on('game:ended', (data) => {
        const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.finalResults = data.finalResults || [];
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
        this.$router.push(this.localePath('/play/totalscores'));
      });
    }
  },

  beforeDestroy() {
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.off('question:received');
      socket.off('game:ended');
    }
  },

  components: { QuestionHeader },
};
</script>

<style scoped>
.v-dialog .v-card { overflow: hidden; text-align: center; min-height: 200px; }
.v-dialog .v-card p.exp { padding: 20px; font-size: 20px; color: #a9aac5; text-align: justify; }
</style>
