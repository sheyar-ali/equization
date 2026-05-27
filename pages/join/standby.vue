<!-- join/standby.vue - Countdown before question shows -->
<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHeader
          :timer="timer"
          :QuestionOrder="questionIndex + 1"
          :score="score"
          :Questions="totalQuestions"
        />
        <div class="question-container d-flex align-center justify-center flex-column">
          <h1 class="question text-center text-white w-100">{{ questionText || $t('ready.title') }}</h1>
          <v-progress-circular :rotate="180" :size="300" :width="15" :value="seconds * 20" color="#ff5e94">
            <h2 class="display-2 font-weight-bold count-down">{{ seconds }}</h2>
          </v-progress-circular>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
import QuestionHeader from "@/components/PlayComponents/QuestionHeader";
export default {
  layout: "play",
  head() { return { title: this.$t("ready.title") }; },
  data() {
    return { questionText: '', seconds: 5, timer: 30, questionIndex: 0, totalQuestions: 0, score: 0, interval: null };
  },
  mounted() {
    if (!process.client) return;
    const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
    this.questionIndex  = gs.questionIndex  || 0;
    this.totalQuestions = gs.totalQuestions || 0;
    this.questionText   = gs.questionText   || '';
    this.timer          = gs.timer          || 30;
    this.score          = gs.score          || 0;

    // ── تحديد وقت العد التنازلي بناءً على startedAt من الـ server ──────────
    // المستضيف يبدأ عداد 5 ثوانٍ ثم ينتقل لصفحة السؤال
    // اللاعب يجب أن ينتقل في نفس اللحظة التي ينتقل فيها المستضيف
    // نستخدم startedAt (timestamp من server) + 5000ms كنقطة الانتقال
    const STANDBY_DURATION = 5000; // 5 ثوانٍ كما في host/standby.vue
    const startedAt = gs.startedAt || 0;
    let countdownMs = STANDBY_DURATION;

    if (startedAt > 0) {
      const elapsed = Date.now() - startedAt;
      countdownMs = Math.max(0, STANDBY_DURATION - elapsed);
    }

    // حساب الثواني المتبقية (للعرض فقط)
    this.seconds = Math.ceil(countdownMs / 1000);
    if (this.seconds < 1) {
      // وقت العد التنازلي انقضى → انتقل فوراً
      this.$router.push(this.localePath('/join/question'));
      return;
    }

    this.interval = setInterval(() => {
      if (this.seconds > 0) { this.seconds -= 1; }
      else { clearInterval(this.interval); this.$router.push(this.localePath('/join/question')); }
    }, 1000);

    // انتقل بدقة عند انتهاء الوقت الفعلي (وليس بالثواني الكاملة فقط)
    setTimeout(() => {
      if (this.interval) { clearInterval(this.interval); }
      this.$router.push(this.localePath('/join/question'));
    }, countdownMs);
  },
  beforeDestroy() { if (this.interval) clearInterval(this.interval); },
  components: { QuestionHeader },
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
</style>
