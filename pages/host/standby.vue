<!-- Host Standby - Send question (if needed) then countdown synchronized with players -->
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

// ── ثابت مشترك بين المستضيف واللاعبين ──
// مدة شاشة "Get Ready" قبل ظهور السؤال (بالميلي ثانية)
const STANDBY_DURATION_MS = 5000;

export default {
  layout: "play",
  head() { return { title: this.$t("ready.title") }; },

  data() {
    return {
      sessionCode:     '',
      questionText:    '',
      seconds:         5,
      timer:           30,
      questionIndex:   0,
      totalQuestions:  0,
      answeredCount:   0,
      playersCount:    0,
      loadingQuestion: false,
      interval:        null,
      exitTimeout:     null,
      allAnswered:     false,  // flag: جميع اللاعبين أجابوا أثناء العد التنازلي
      navigated:       false,  // منع الانتقال المزدوج
    };
  },

  mounted() {
    if (!process.client) return;

    this.sessionCode   = sessionStorage.getItem('sessionCode') || '';
    const gameState    = JSON.parse(sessionStorage.getItem('gameState') || '{}');

    this.questionIndex  = gameState.questionIndex  || 0;
    this.totalQuestions = gameState.totalQuestions || 0;
    this.timer          = gameState.timer          || 30;
    this.playersCount   = gameState.playersCount   || 0;

    // ── إعداد المستمعين للـ socket قبل أي إرسال ──
    this._setupSocketListeners();

    // ── منطق محوري: المستضيف يُرسل السؤال فقط إذا كان `shouldSendQuestion = true` ──
    // (من host/index.vue عند البدء، أو من host/scoreboard.vue عند "السؤال التالي")
    if (gameState.shouldSendQuestion) {
      // أزل العلامة لئلا يُرسَل مرتين
      gameState.shouldSendQuestion = false;
      sessionStorage.setItem('gameState', JSON.stringify(gameState));
      this.sendQuestion(this.sessionCode, this.questionIndex);
    } else {
      // السؤال أُرسل مسبقاً (من scoreboard) — ابدأ العد التنازلي المتزامن
      this._startSyncedCountdown(gameState.startedAt || Date.now());
    }
  },

  methods: {
    // ── إعداد المستمعين: question:received + all:answered ────────────────────
    _setupSocketListeners() {
      const socket = this.$socket?.getSocket?.();
      if (!socket) return;

      // ملاحظة: المستضيف أيضاً يستلم question:received من السيرفر
      // لأنه عضو في نفس الغرفة. نستخدم startedAt منه للتزامن.
      socket.off('question:received');
      socket.off('player:answered');
      socket.off('all:answered');

      socket.on('question:received', (data) => {
        console.log('[Host Standby] question:received', data);
        const gs = JSON.parse(sessionStorage.getItem('gameState') || '{}');
        gs.questionIndex  = data.questionIndex;
        gs.totalQuestions = data.totalQuestions || gs.totalQuestions;
        gs.questionText   = data.questionText;
        gs.questionImage  = data.questionImage || '';
        gs.timer          = data.timeLimit || 30;
        gs.questionId     = data.questionId;
        gs.answers        = data.answers || [];        // للاعبين (بدون isCorrect) — احتياطياً
        gs.startedAt      = data.startedAt || Date.now();
        sessionStorage.setItem('gameState', JSON.stringify(gs));

        this.questionText  = data.questionText;
        this.questionIndex = data.questionIndex;
        this.timer         = data.timeLimit || 30;

        // ابدأ العد التنازلي المتزامن من نفس startedAt الذي يستخدمه اللاعبون
        this._startSyncedCountdown(gs.startedAt);
      });

      socket.on('player:answered', (data) => {
        this.answeredCount = data.answeredCount || 0;
        this.playersCount  = data.totalPlayers  || this.playersCount;
      });

      // ── إذا أجاب جميع اللاعبين أثناء العد التنازلي → تخطّ إلى النتائج فوراً ──
      socket.on('all:answered', (data) => {
        console.log('[Host Standby] All players answered — skipping countdown');
        this.allAnswered   = true;
        this.answeredCount = data.answeredCount || this.answeredCount;
        this.playersCount  = data.totalPlayers  || this.playersCount;
        // احفظ flag في sessionStorage ليلتقطها host/question.vue
        const gs = JSON.parse(sessionStorage.getItem('gameState') || '{}');
        gs.allAnsweredEarly = true;
        sessionStorage.setItem('gameState', JSON.stringify(gs));
        // أوقف العد التنازلي وانتقل فوراً لصفحة السؤال
        this._goToQuestionPage();
      });
    },

    // ── إرسال السؤال — يستخدم فقط إذا كان hostIndex بدأ اللعبة ────────────────
    sendQuestion(sessionCode, questionIndex) {
      if (!sessionCode) {
        // لا يوجد sessionCode، ابدأ العد التنازلي محلياً
        this._startSyncedCountdown(Date.now());
        return;
      }

      const socket = this.$socket?.getSocket?.();
      if (!socket) {
        this._startSyncedCountdown(Date.now());
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
            // حفظ بيانات السؤال في gameState (المستضيف يحتاج fullAnswers)
            const gs = JSON.parse(sessionStorage.getItem('gameState') || '{}');
            gs.questionIndex  = questionIndex;
            gs.questionText   = q.questionText;
            gs.questionImage  = q.questionImage || '';
            gs.timer          = q.timeLimit     || 30;
            gs.answers        = q.answers       || [];           // للاعبين (بدون isCorrect)
            gs.fullAnswers    = q.fullAnswers   || q.answers || []; // للمستضيف (مع isCorrect)
            gs.questionId     = q.questionId    || '';
            gs.startedAt      = q.startedAt     || Date.now();   // التوقيت من السيرفر
            sessionStorage.setItem('gameState', JSON.stringify(gs));

            this.questionText = q.questionText;
            this.timer        = q.timeLimit || 30;

            // ابدأ العد التنازلي المتزامن
            this._startSyncedCountdown(gs.startedAt);
          } else {
            console.warn('[Host Standby] send-question failed:', res?.message);
            // fallback
            this._startSyncedCountdown(Date.now());
          }
        }
      );
    },

    // ── العد التنازلي المتزامن — مطابق للاعبين ────────────────────────────────
    // يستخدم startedAt (timestamp من السيرفر) + STANDBY_DURATION_MS كنقطة الانتقال
    _startSyncedCountdown(startedAt) {
      if (this.interval) clearInterval(this.interval);
      if (this.exitTimeout) clearTimeout(this.exitTimeout);

      const elapsed      = Math.max(0, Date.now() - startedAt);
      const remainingMs  = Math.max(0, STANDBY_DURATION_MS - elapsed);
      this.seconds       = Math.max(1, Math.ceil(remainingMs / 1000));

      if (remainingMs <= 0) {
        this._goToQuestionPage();
        return;
      }

      this.interval = setInterval(() => {
        const e = Math.max(0, Date.now() - startedAt);
        const r = Math.max(0, STANDBY_DURATION_MS - e);
        this.seconds = Math.max(0, Math.ceil(r / 1000));
        if (r <= 0) {
          clearInterval(this.interval);
        }
      }, 250);

      // انتقل بدقة عند انتهاء الوقت الفعلي (وليس الثواني الكاملة فقط)
      this.exitTimeout = setTimeout(() => {
        this._goToQuestionPage();
      }, remainingMs);
    },

    _goToQuestionPage() {
      if (this.navigated) return;
      this.navigated = true;
      if (this.interval) clearInterval(this.interval);
      if (this.exitTimeout) clearTimeout(this.exitTimeout);
      this.$router.push(this.localePath('/host/question'));
    },
  },

  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
    if (this.exitTimeout) clearTimeout(this.exitTimeout);
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.off('question:received');
      socket.off('player:answered');
      socket.off('all:answered');
    }
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
