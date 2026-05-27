<!-- play-sub-domain/scoreBoard.vue - After question results -->
<template>
  <section class="play-page play-quiz quiz-scoreboard">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHeader :timer="0" :QuestionOrder="questionIndex + 1" :score="score" :Questions="totalQuestions" />

        <div class="answer-result w-100">
          <div class="answer-result-content d-flex align-center justify-space-between w-100">
            <h2>{{ $t("finalResults.correctAnswer") }}
              <span v-for="(a, i) in correctAnswers" :key="i">{{ a.text }}<span v-if="i < correctAnswers.length - 1">, </span></span>
            </h2>
            <v-btn height="auto" class="white--text" @click="showExp = true" text>{{ $t("finalResults.showExplanation") }}</v-btn>
          </div>
        </div>

        <div class="result-description">
          <div class="table-content w-100 mx-auto">
            <div class="headers w-100 d-flex align-center">
              <div class="table-head"><h3 class="text-center">{{ $t("resultTables.scoreBoard.headers.name") }}</h3></div>
              <div class="table-head"><h3 class="text-center">{{ $t("resultTables.scoreBoard.headers.currentResult") }}</h3></div>
              <div class="table-head"><h3 class="text-center">{{ $t("resultTables.scoreBoard.headers.finalResult") }}</h3></div>
            </div>
            <v-divider horizontal></v-divider>

            <div class="table-body w-100 d-flex align-center flex-column" v-for="(entry, i) in leaderboard" :key="i">
              <div class="table-body-content d-flex align-center justify-center w-100" :class="{ 'my-row': entry.name === playerName }">
                <div class="text-center"><h2>{{ entry.name }}</h2></div>
                <div class="text-center"><h2>{{ entry.lastAnswer ? entry.lastAnswer.points : 0 }}</h2></div>
                <div class="text-center"><h2>{{ entry.score }}</h2></div>
              </div>
              <v-divider horizontal class="last-divider w-100"></v-divider>
            </div>
            <div v-if="!leaderboard.length" class="text-center py-6">
              <p class="grey--text">في انتظار النتائج...</p>
            </div>
          </div>
        </div>

        <div class="current-order mx-auto" v-if="myRank">
          <span>{{ $t("resultTables.scoreBoard.headers.currentOrder") }}</span>
          <span>{{ myRank }}</span>
        </div>

        <p class="text-center white--text mt-4">في انتظار السؤال التالي...</p>
        <v-progress-linear indeterminate color="#ff5e94" height="4" rounded class="mt-2"></v-progress-linear>
      </div>

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
    return { questionIndex: 0, totalQuestions: 0, score: 0, correctAnswers: [], leaderboard: [], explanation: '', showExp: false, playerName: '', myRank: null };
  },
  mounted() {
    if (!process.client) return;
    this.playerName = sessionStorage.getItem('playerName') || '';
    const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
    this.questionIndex  = gs.questionIndex  || 0;
    this.totalQuestions = gs.totalQuestions || 0;
    this.score          = gs.score          || 0;
    this.explanation    = gs.explanation    || '';
    this.correctAnswers = gs.correctAnswers || [];
    this.leaderboard    = (gs.leaderboard   || []).slice(0, 10);
    const me = this.leaderboard.find(p => p.name === this.playerName);
    this.myRank = me ? this.leaderboard.indexOf(me) + 1 : null;

    const socket = this.$socket?.getSocket?.();
    if (socket) {
      this._onResultsShown = (data) => {
        this.correctAnswers = data.correctAnswers || [];
        if (data.leaderboard) {
          this.leaderboard = data.leaderboard.slice(0, 10);
          const me = this.leaderboard.find(p => p.name === this.playerName);
          this.myRank = me ? this.leaderboard.indexOf(me) + 1 : null;
        }
        const s = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        s.correctAnswers = data.correctAnswers || [];
        s.leaderboard    = data.leaderboard    || [];
        sessionStorage.setItem('playerGameState', JSON.stringify(s));
      };
      this._onQuestionReceived = (data) => {
        const s = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        s.questionIndex  = data.questionIndex;  s.questionText = data.questionText;
        s.questionImage  = data.questionImage || '';  s.timer = data.timeLimit || 30;
        s.questionId     = data.questionId;     s.answers = data.answers || [];
        s.startedAt      = data.startedAt || Date.now();
        s.totalQuestions = data.totalQuestions || s.totalQuestions;
        sessionStorage.setItem('playerGameState', JSON.stringify(s));
        this.$router.push(this.localePath('/play-sub-domain/standby'));
      };
      this._onGameEnded = (data) => {
        const s = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        s.finalResults = data.finalResults || [];
        sessionStorage.setItem('playerGameState', JSON.stringify(s));
        this.$router.push(this.localePath('/play-sub-domain/totalscores'));
      };

      this.$socket.swapOn('results:shown',    this._onResultsShown);
      this.$socket.swapOn('question:received', this._onQuestionReceived);
      this.$socket.swapOn('game:ended',       this._onGameEnded);
    }
  },
  beforeDestroy() {
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.off('results:shown',    this._onResultsShown);
      socket.off('question:received', this._onQuestionReceived);
      socket.off('game:ended',       this._onGameEnded);
    }
  },
  components: { QuestionHeader },
};
</script>

<style scoped>
.current-order { width: fit-content; padding: 10px 20px; background-color: #efefef; color: #988c9d; font-size: 18px; font-weight: 600; margin: 30px auto; border-radius: 20px; }
.my-row { background-color: rgba(255,94,148,0.15); }
.v-dialog .v-card { overflow: hidden; text-align: center; min-height: 200px; }
.v-dialog .v-card p.exp { padding: 20px; font-size: 20px; color: #a9aac5; text-align: justify; }
</style>
