<!-- play/question.vue - Solo individual quiz question -->
<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHeader
          :timer="seconds"
          :QuestionOrder="questionIndex + 1"
          :score="score"
          :Questions="totalQuestions"
        />

        <div class="question-container d-flex align-center justify-space-between flex-column">
          <div class="play-question-details w-100 d-flex align-center justify-center flex-column">
            <h1 class="question text-center text-white w-100">{{ questionText }}</h1>
            <v-progress-linear height="10" v-model="timerValue" color="#ff5e94" rounded></v-progress-linear>
          </div>

          <div v-if="questionImage" class="question-img d-flex align-center justify-center mx-auto overflow-hidden">
            <img :src="questionImage" alt="question-img" />
          </div>

          <!-- Feedback badge after answering -->
          <div v-if="answered" class="answered-badge text-center mb-2">
            <template v-if="timeExpired && !lastCorrect">
              <v-chip color="orange" dark large class="px-6">
                <v-icon left>mdi-clock-alert-outline</v-icon>
                انتهى الوقت!
              </v-chip>
            </template>
            <template v-else>
              <v-chip :color="lastCorrect ? 'success' : 'error'" dark large class="px-6">
                <v-icon left>{{ lastCorrect ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                {{ lastCorrect ? `+${lastPoints} نقطة` : 'إجابة خاطئة' }}
              </v-chip>
            </template>
          </div>

          <!-- Answers: always shown, showCorrect after answering (solo mode knows correct answer) -->
          <QuestionAnswers
            :answersData="answers"
            :enabled="!answered"
            :showCorrect="answered"
            @answer-selected="submitAnswer"
          />
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
import QuestionHeader  from "@/components/PlayComponents/QuestionHeader";
import QuestionAnswers from "@/components/PlayComponents/QuestionAnswers";

export default {
  layout: "play",
  head() { return { title: this.$t("question.question") }; },

  data() {
    return {
      questionIndex:  0,
      totalQuestions: 0,
      questionText:   '',
      questionImage:  '',
      answers:        [],  // includes isCorrect for solo play
      seconds:        30,
      timerValue:     100,
      score:          0,
      answered:       false,
      lastCorrect:    false,
      lastPoints:     0,
      timeExpired:    false,
      interval:       null,
      answerStartTime: 0,
      questionId:     '',
      soloAnswers:    [],  // accumulated answers for final submit
    };
  },

  mounted() {
    if (!process.client) return;

    const gameState = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
    this.questionIndex   = gameState.questionIndex   || 0;
    this.totalQuestions  = gameState.totalQuestions  || 0;
    this.questionText    = gameState.questionText    || '';
    this.questionImage   = gameState.questionImage   || '';
    this.seconds         = gameState.timer           || 30;
    this.score           = gameState.score           || 0;
    this.questionId      = gameState.questionId      || '';
    this.soloAnswers     = JSON.parse(sessionStorage.getItem('soloAnswers') || '[]');

    // Solo mode: answers include isCorrect from the API
    const raw = gameState.answers || [];
    this.answers = raw.map(a => ({
      ansText:   a.text   || a.ansText  || '',
      imageUrl:  a.image  || a.imageUrl || '',
      _id:       a._id,
      isCorrect: a.isCorrect || false,  // available in solo mode (from /play/start API)
    }));

    this.answerStartTime = Date.now();

    this.interval = setInterval(() => {
      if (this.timerValue > 0) {
        this.timerValue -= 100 / (this.seconds * 5);
      } else {
        clearInterval(this.interval);
        if (!this.answered) {
          this.answered    = true;
          this.timeExpired = true;
          // Save a timeout answer
          this._saveAnswer([], 0, false, this.seconds * 1000);
          // Navigate after 2s (player sees correct answer highlighted)
          setTimeout(() => this._navigateNext(), 2000);
        }
      }
    }, 200);
  },

  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  },

  methods: {
    submitAnswer(selectedAnswer) {
      if (this.answered) return;
      this.answered = true;
      clearInterval(this.interval);

      const timeSpent = Date.now() - this.answerStartTime;
      const selected  = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
      const selectedIds = selected.map(a => String(a._id));

      // Check correctness locally (solo mode has isCorrect)
      const correctIds = this.answers.filter(a => a.isCorrect).map(a => String(a._id));
      const isCorrect  = correctIds.length === selectedIds.length &&
                         correctIds.every(id => selectedIds.includes(id));

      // Calculate points with time bonus
      const timeLimitMs = this.seconds * 1000;
      const elapsed     = Math.min(timeSpent, timeLimitMs);
      const timeRatio   = 1 - (elapsed / timeLimitMs) * 0.5;
      const points      = isCorrect ? Math.round(100 * timeRatio) : 0;

      this.lastCorrect = isCorrect;
      this.lastPoints  = points;
      this.score      += points;

      this._saveAnswer(selectedIds, points, isCorrect, timeSpent);

      // Navigate after 2s so player sees correct answer
      setTimeout(() => this._navigateNext(), 2000);
    },

    _saveAnswer(selectedIds, points, isCorrect, timeSpent) {
      this.soloAnswers.push({
        questionId:      this.questionId,
        selectedAnswers: selectedIds,
        isCorrect,
        points,
        timeSpent,
      });
      sessionStorage.setItem('soloAnswers', JSON.stringify(this.soloAnswers));

      // Update score in gameState
      const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
      gs.score = this.score;
      sessionStorage.setItem('playerGameState', JSON.stringify(gs));
    },

    _navigateNext() {
      const nextIndex  = this.questionIndex + 1;
      const questions  = JSON.parse(sessionStorage.getItem('soloQuestions') || '[]');

      if (nextIndex < questions.length) {
        // Save next question to gameState
        const nextQ = questions[nextIndex];
        const gs    = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.questionIndex  = nextIndex;
        gs.questionText   = nextQ.questionText;
        gs.questionImage  = nextQ.questionImage || '';
        gs.questionId     = nextQ._id;
        gs.timer          = nextQ.timeLimit || 30;
        gs.answers        = nextQ.answers;  // includes isCorrect
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
        this.$router.push(this.localePath('/play/standby'));
      } else {
        // Last question - go to total scores
        this.$router.push(this.localePath('/play/totalscores'));
      }
    },
  },

  components: { QuestionHeader, QuestionAnswers },
};
</script>

<style scoped>
.play-page-container { height: calc(100vh - 80px); margin-bottom: 0; padding: 8px 15px 15px; }
.question-container { height: calc(100vh - 160px); margin: 10px 0; padding: 0 70px; }
.question-container h1 { margin-bottom: 5px; padding: 15px; line-height: 34px; background-color: #38389a; border-radius: 10px; font-size: 20px; max-height: 119px; display: -webkit-box !important; -webkit-box-orient: vertical; overflow: hidden; -webkit-line-clamp: 3; }
.answered-badge { width: 100%; padding: 8px 0; }
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
