<!-- Host Question Page - Show question to host, receive player answers in real time -->
<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHostHeader
          :timer="seconds"
          :QuestionOrder="questionIndex + 1"
          :Questions="totalQuestions"
          :answers="answeredCount"
          :players="playersCount"
        />

        <div class="question-container d-flex align-center justify-space-between flex-column">
          <div class="play-question-details w-100 d-flex align-center justify-center flex-column">
            <h1 class="question text-center text-white w-100">{{ questionText }}</h1>
            <v-progress-linear height="10" v-model="timerValue" color="#ff5e94" rounded></v-progress-linear>
          </div>

          <div v-if="questionImage" class="question-img d-flex align-center justify-center mx-auto overflow-hidden">
            <img :src="questionImage" alt="question-img" />
          </div>

          <!-- enabled=false (المستضيف لا يختار) showCorrect=false أثناء اللعبة -->
          <QuestionAnswers :answersData="answers" :enabled="false" :showCorrect="false" />
        </div>

        <!-- Show Results Button -->
        <div class="d-flex justify-center mt-4">
          <v-btn
            color="#ff5e94"
            dark
            large
            class="title"
            :disabled="!sessionCode"
            @click="showResults"
          >
            <v-icon class="mx-2">mdi-chart-bar</v-icon>
            {{ $t('resultTables.scoreBoard.headers.btn') || 'عرض النتائج' }}
          </v-btn>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
import QuestionHostHeader from "@/components/PlayComponents/QuestionHostHeader";
import QuestionAnswers    from "@/components/PlayComponents/QuestionAnswers";

export default {
  layout: "play",
  head() { return { title: this.$t("question.question") }; },

  data() {
    return {
      sessionCode:    '',
      questionIndex:  0,
      totalQuestions: 0,
      questionText:   '',
      questionImage:  '',
      answers:        [],
      timer:          30,
      timerValue:     100,
      seconds:        30,  // الثواني المعروضة
      answeredCount:  0,
      playersCount:   0,
      interval:       null,
      resultsShowing: false,  // منع استدعاء showResults مرتين
      questionEndsAt: 0,      // توقيت نهاية السؤال (startedAt + STANDBY_MS + timer*1000)
    };
  },

  mounted() {
    if (!process.client) return;

    this.sessionCode = sessionStorage.getItem('sessionCode') || '';
    const gameState  = JSON.parse(sessionStorage.getItem('gameState') || '{}');

    this.questionIndex   = gameState.questionIndex   || 0;
    this.totalQuestions  = gameState.totalQuestions  || 0;
    this.questionText    = gameState.questionText    || '';
    this.questionImage   = gameState.questionImage   || '';
    this.timer           = gameState.timer           || 30;
    this.seconds         = this.timer;
    this.playersCount    = gameState.playersCount    || 0;

    // Format answers for display
    // gameState.answers comes from socket (sanitized, no isCorrect)
    // We store the full answers with isCorrect in gameState.fullAnswers
    const raw = gameState.fullAnswers || gameState.answers || [];
    this.answers = raw.map(a => ({
      ansText:   a.text     || a.ansText  || '',
      imageUrl:  a.image    || a.imageUrl || '',
      isCorrect: a.isCorrect || false,
      points:    a.isCorrect ? 100 : 0,
    }));

    // ── حساب نهاية السؤال بشكل متزامن مع اللاعبين ──
    // startedAt = توقيت إرسال السؤال من السيرفر
    // نهاية السؤال = startedAt + STANDBY_MS (5s) + timer*1000
    const STANDBY_MS = 5000;
    const startedAt  = gameState.startedAt || Date.now();
    this.questionEndsAt = startedAt + STANDBY_MS + (this.timer * 1000);

    // اضبط timerValue و seconds بناءً على الوقت المتبقي الفعلي
    const remainingMs = Math.max(0, this.questionEndsAt - Date.now());
    this.seconds      = Math.max(0, Math.ceil(remainingMs / 1000));
    this.timerValue   = (remainingMs / (this.timer * 1000)) * 100;

    // ── إذا أجاب الجميع أثناء standby (allAnsweredEarly flag) → عرض النتائج فوراً ──
    if (gameState.allAnsweredEarly) {
      // امسح الـ flag لئلا يتكرر في الأسئلة التالية
      gameState.allAnsweredEarly = false;
      sessionStorage.setItem('gameState', JSON.stringify(gameState));
      this.timerValue = 0;
      this.seconds    = 0;
      // انتظر نصف ثانية لضمان تحميل الصفحة كاملاً ثم أظهر النتائج
      setTimeout(() => this.showResults(), 500);
      return; // لا حاجة لإعداد مستمعي السوكيت للحالة العادية
    }

    // Timer countdown متزامن — يعتمد على Date.now() - questionEndsAt
    this.interval = setInterval(() => {
      const r = Math.max(0, this.questionEndsAt - Date.now());
      this.seconds    = Math.max(0, Math.ceil(r / 1000));
      this.timerValue = (r / (this.timer * 1000)) * 100;
      if (r <= 0) {
        clearInterval(this.interval);
        this.timerValue = 0;
        // انتظر ثانية ثم أظهر النتائج تلقائياً
        setTimeout(() => this.showResults(), 1000);
      }
    }, 200);

    // Listen for player answers
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.on('player:answered', (data) => {
        this.answeredCount = data.answeredCount || 0;
        this.playersCount  = data.totalPlayers  || this.playersCount;
      });

      // ── عند إجابة كل اللاعبين → عرض النتائج تلقائياً فوراً ──────────────────
      socket.on('all:answered', (data) => {
        console.log('[Host] All players answered — auto show results');
        this.answeredCount = data.answeredCount || this.answeredCount;
        this.playersCount  = data.totalPlayers  || this.playersCount;
        clearInterval(this.interval);  // أوقف العداد
        this.timerValue = 0;           // أظهر الشريط فارغاً
        this.seconds    = 0;
        // استدعِ showResults فوراً بدون انتظار العداد
        this.showResults();
      });
    }
  },

  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.off('player:answered');
      socket.off('all:answered');
    }
  },

  methods: {
    async showResults() {
      if (!this.sessionCode) return;
      if (this.resultsShowing) return;  // منع الاستدعاء المزدوج
      this.resultsShowing = true;
      try {
        const socket = this.$socket?.getSocket?.();
        if (!socket) return;
        socket.emit('host:show-results',
          { sessionCode: this.sessionCode, questionIndex: this.questionIndex },
          (res) => {
            if (res?.success) {
              const gameState = JSON.parse(sessionStorage.getItem('gameState') || '{}');
              gameState.leaderboard    = res.leaderboard    || [];
              gameState.correctAnswers = res.correctAnswers || [];
              sessionStorage.setItem('gameState', JSON.stringify(gameState));
              this.$router.push(this.localePath('/host/scoreboard'));
            }
          }
        );
      } catch (e) {
        console.error('Show results error:', e);
      }
    },
  },

  components: { QuestionHostHeader, QuestionAnswers },
};
</script>

<style scoped>
.play-page-container { height: calc(100vh - 80px); margin-bottom: 0; padding: 8px 15px 15px; }
.question-container { height: calc(100vh - 200px); margin: 10px 0; padding: 0 70px; }
.question-container h1 { margin-bottom: 5px; padding: 15px; line-height: 34px; background-color: #38389a; border-radius: 10px; font-size: 20px; max-height: 119px; display: -webkit-box !important; -webkit-box-orient: vertical; overflow: hidden; -webkit-line-clamp: 3; }
.question-img { max-width: 90%; margin: 10px 0 0; flex-grow: 1; }
.question-img img { max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 10px; }
@media only screen and (max-width: 992px) {
  .play-page-container { height: unset; min-height: calc(100vh - 85px); }
  .question-container { padding: 0; height: unset; min-height: calc(100vh - 230px); }
}
@media only screen and (max-width: 600px) {
  .play-page-container { border: none; box-shadow: none; height: unset; min-height: calc(92vh - 50px); }
  .question-container { height: unset; min-height: calc(92vh - 120px); }
  .question-container h1 { font-size: 17px; max-height: 96px; }
}
</style>
