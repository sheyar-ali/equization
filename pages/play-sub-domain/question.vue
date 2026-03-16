<!-- play-sub-domain/question.vue - Player answers the question -->
<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHeader :timer="seconds" :QuestionOrder="questionIndex + 1" :score="score" :Questions="totalQuestions" />

        <div class="question-container d-flex align-center justify-space-between flex-column">
          <div class="play-question-details w-100 d-flex align-center justify-center flex-column">
            <h1 class="question text-center text-white w-100">{{ questionText }}</h1>
            <v-progress-linear height="10" v-model="timerValue" color="#ff5e94" rounded></v-progress-linear>
          </div>

          <div v-if="questionImage" class="question-img d-flex align-center justify-center mx-auto overflow-hidden">
            <img :src="questionImage" alt="question-img" />
          </div>

          <!-- Answered feedback -->
          <div v-if="answered" class="answered-feedback text-center py-10">
            <v-icon :color="lastCorrect ? 'green' : 'red lighten-1'" size="80">
              {{ lastCorrect ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            <p class="white--text title mt-2">{{ lastCorrect ? `+${lastPoints} نقطة` : 'إجابة خاطئة' }}</p>
          </div>

          <CheckBoxAnswers v-else-if="isMulti" :answersData="answers" :enabled="true" @answer-selected="submitAnswer" />
          <QuestionAnswers v-else :answersData="answers" :enabled="true" @answer-selected="submitAnswer" />
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
import QuestionHeader  from "@/components/PlayComponents/QuestionHeader";
import QuestionAnswers from "@/components/PlayComponents/QuestionAnswers";
import CheckBoxAnswers from "@/components/PlayComponents/CheckBoxAnswers";

export default {
  layout: "play",
  head() { return { title: this.$t("question.question") }; },
  data() {
    return {
      sessionCode: '', playerId: '', questionId: '',
      questionIndex: 0, totalQuestions: 0,
      questionText: '', questionImage: '', isMulti: false,
      answers: [], seconds: 30, timerValue: 100, score: 0,
      answered: false, lastCorrect: false, lastPoints: 0,
      interval: null, answerStartTime: 0,
    };
  },
  mounted() {
    if (!process.client) return;
    this.sessionCode = sessionStorage.getItem('sessionCode') || '';
    this.playerId    = sessionStorage.getItem('playerId')    || '';
    const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
    this.questionIndex   = gs.questionIndex   || 0;
    this.totalQuestions  = gs.totalQuestions  || 0;
    this.questionText    = gs.questionText    || '';
    this.questionImage   = gs.questionImage   || '';
    this.seconds         = gs.timer           || 30;
    this.score           = gs.score           || 0;
    this.questionId      = gs.questionId      || '';
    this.answers = (gs.answers || []).map(a => ({ ansText: a.text || '', imageUrl: a.image || '', _id: a._id, isCorrect: false, points: 0 }));
    this.answerStartTime = Date.now();

    this.interval = setInterval(() => {
      if (this.timerValue > 0) { this.timerValue -= 100 / (this.seconds * 5); }
      else { clearInterval(this.interval); if (!this.answered) setTimeout(() => this.$router.push(this.localePath('/play-sub-domain/scoreBoard')), 500); }
    }, 200);

    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.on('results:shown', (data) => {
        const s = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        s.correctAnswers = data.correctAnswers || [];
        s.leaderboard    = data.leaderboard    || [];
        sessionStorage.setItem('playerGameState', JSON.stringify(s));
        clearInterval(this.interval);
        setTimeout(() => this.$router.push(this.localePath('/play-sub-domain/scoreBoard')), 500);
      });
      socket.on('game:ended', (data) => {
        const s = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        s.finalResults = data.finalResults || [];
        sessionStorage.setItem('playerGameState', JSON.stringify(s));
        this.$router.push(this.localePath('/play-sub-domain/totalscores'));
      });
      socket.on('question:received', (data) => {
        const s = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        s.questionIndex = data.questionIndex; s.questionText = data.questionText;
        s.questionImage = data.questionImage || ''; s.timer = data.timeLimit || 30;
        s.questionId = data.questionId; s.answers = data.answers || [];
        sessionStorage.setItem('playerGameState', JSON.stringify(s));
        this.$router.push(this.localePath('/play-sub-domain/standby'));
      });
    }
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
    const socket = this.$socket?.getSocket?.();
    if (socket) { socket.off('results:shown'); socket.off('game:ended'); socket.off('question:received'); }
  },
  methods: {
    submitAnswer(selected) {
      if (this.answered) return;
      this.answered = true;
      clearInterval(this.interval);
      const timeSpent = Date.now() - this.answerStartTime;
      const selectedAnswers = Array.isArray(selected) ? selected.map(a => a._id) : [selected._id];
      this.$socket?.submitAnswer({ sessionCode: this.sessionCode, questionId: this.questionId, selectedAnswers, timeSpent }, (res) => {
        if (res?.success) {
          this.lastCorrect = res.isCorrect; this.lastPoints = res.points || 0; this.score = res.totalScore || this.score;
          const s = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
          s.score = this.score;
          sessionStorage.setItem('playerGameState', JSON.stringify(s));
        }
      });
    },
  },
  components: { QuestionHeader, QuestionAnswers, CheckBoxAnswers },
};
</script>

<style scoped>
.play-page-container { height: calc(100vh - 80px); margin-bottom: 0; padding: 8px 15px 15px; }
.question-container { height: calc(100vh - 160px); margin: 10px 0; padding: 0 70px; }
.question-container h1 { margin-bottom: 5px; padding: 15px; line-height: 34px; background-color: #38389a; border-radius: 10px; font-size: 20px; max-height: 119px; display: -webkit-box !important; -webkit-box-orient: vertical; overflow: hidden; -webkit-line-clamp: 3; }
.answered-feedback { width: 100%; }
.question-img { max-width: 90%; margin: 10px 0 0; flex-grow: 1; }
.question-img img { max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 10px; }
@media only screen and (max-width: 992px) {
  .play-page-container { height: unset; min-height: calc(100vh - 85px); }
  .question-container { padding: 0; height: unset; min-height: calc(100vh - 185px); }
}
@media only screen and (max-width: 600px) {
  .play-page-container { border: none; box-shadow: none; height: unset; min-height: calc(92vh - 50px); }
  .question-container { height: unset; min-height: calc(92vh - 100px); }
  .question-container h1 { font-size: 17px; max-height: 96px; }
}
</style>
