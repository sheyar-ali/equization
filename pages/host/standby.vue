<!-- Host Standby - Send question then countdown before question page -->
<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHostHeader
          :timer="timer"
          :QuestionOrder="questionIndex + 1"
          :Questions="totalQuestions"
          :answers="answeredCount"
          :players="playersCount"
        />

        <div class="question-container d-flex align-center justify-center flex-column">
          <h1 class="question text-center text-white w-100">
            {{ questionText || $t('ready.title') }}
          </h1>

          <v-progress-circular
            :rotate="180"
            :size="300"
            :width="15"
            :value="seconds * 20"
            color="#ff5e94"
          >
            <h2 class="display-2 font-weight-bold count-down">{{ seconds }}</h2>
          </v-progress-circular>

          <!-- Loading indicator while fetching question -->
          <div v-if="loadingQuestion" class="text-center mt-4">
            <v-progress-circular indeterminate color="white" size="30"></v-progress-circular>
            <p class="white--text mt-2">جاري تحميل السؤال...</p>
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
import QuestionHostHeader from "@/components/PlayComponents/QuestionHostHeader";

export default {
  layout: "play",
  head() { return { title: this.$t("ready.title") }; },

  data() {
    return {
      questionText:    '',
      seconds:         5,
      timer:           30,
      questionIndex:   0,
      totalQuestions:  0,
      answeredCount:   0,
      playersCount:    0,
      loadingQuestion: false,
      interval:        null,
    };
  },

  mounted() {
    if (!process.client) return;

    const sessionCode = sessionStorage.getItem('sessionCode') || '';
    const gameState   = JSON.parse(sessionStorage.getItem('gameState') || '{}');

    this.questionIndex  = gameState.questionIndex  || 0;
    this.totalQuestions = gameState.totalQuestions || 0;
    this.timer          = gameState.timer          || 30;
    this.playersCount   = gameState.playersCount   || 0;

    // إرسال السؤال عبر socket ← هذا هو الإصلاح الرئيسي
    this.sendQuestion(sessionCode, this.questionIndex);

    // الاستماع لإجابات اللاعبين
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.on('player:answered', (data) => {
        this.answeredCount = data.answeredCount || 0;
        this.playersCount  = data.totalPlayers  || this.playersCount;
      });
    }
  },

  methods: {
    sendQuestion(sessionCode, questionIndex) {
      if (!sessionCode) {
        // لا يوجد sessionCode، ابدأ العد التنازلي مباشرة
        this.startCountdown();
        return;
      }

      const socket = this.$socket?.getSocket?.();
      if (!socket) {
        this.startCountdown();
        return;
      }

      this.loadingQuestion = true;

      socket.emit('host:send-question',
        { sessionCode, questionIndex },
        (res) => {
          this.loadingQuestion = false;
          console.log('[Host Standby] send-question ack:', res);

          if (res?.success && res.question) {
            const q = res.question;
            // حفظ بيانات السؤال في gameState
            const gameState = JSON.parse(sessionStorage.getItem('gameState') || '{}');
            gameState.questionIndex  = questionIndex;
            gameState.questionText   = q.questionText;
            gameState.questionImage  = q.questionImage || '';
            gameState.timer          = q.timeLimit     || 30;
            gameState.answers        = q.answers       || [];         // للاعبين (بدون isCorrect)
            gameState.fullAnswers    = q.fullAnswers   || q.answers || []; // للمستضيف (مع isCorrect)
            gameState.questionId     = q.questionId    || '';
            sessionStorage.setItem('gameState', JSON.stringify(gameState));

            this.questionText = q.questionText;
            this.timer        = q.timeLimit || 30;
          } else {
            console.warn('[Host Standby] send-question failed:', res?.message);
          }

          this.startCountdown();
        }
      );
    },

    startCountdown() {
      this.interval = setInterval(() => {
        if (this.seconds > 0) {
          this.seconds -= 1;
        } else {
          clearInterval(this.interval);
          this.$router.push(this.localePath('/host/question'));
        }
      }, 1000);
    },
  },

  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
    const socket = this.$socket?.getSocket?.();
    if (socket) socket.off('player:answered');
  },

  components: { QuestionHostHeader },
};
</script>

<style scoped>
.question-container { margin: 25px 0; padding: 0 70px; }
.question-container h1 { margin-bottom: 25px; padding: 20px 10px; line-height: 35px; background-color: #38389a; border-radius: 10px; font-size: 24px; }
.v-progress-circular { color: #ff5e94 !important; width: 250px !important; }
h2.count-down { font-size: 65px !important; }
@media only screen and (max-width: 767px) {
  .question-container { padding: 0 !important; }
  .question-container h1 { font-size: 20px !important; margin-bottom: 10px !important; }
  h2.count-down { font-size: 50px !important; }
  .v-progress-circular { width: 60% !important; }
}
@media only screen and (min-width: 960px) and (max-width: 1200px) {
  .question-container { padding: 0 15px !important; }
}
</style>
