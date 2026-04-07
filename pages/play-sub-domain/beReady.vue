<!-- play-sub-domain/beReady.vue - Waiting lobby after joining -->
<template>
  <section class="play-page">
    <v-container fluid class="w-100 h-100">
      <div class="play-page-container w-100 h-100">
        <div class="play-page-content w-100 h-100 d-flex align-center justify-center flex-column">
          <p class="w-100 text-center"><i class="fas fa-check-circle"></i></p>
          <p class="w-100 text-center">{{ $t('beReady.excellent') }}</p>
          <p class="w-100 text-center">{{ $t('beReady.wait') }}</p>
          <p class="w-100 text-center d-flex align-center justify-center">
            <span>{{ $t('beReady.playersNumber') }}</span>
            <span>{{ playersCount }}</span>
          </p>

          <v-progress-linear indeterminate color="#ff5e94" height="4" rounded class="mt-6" style="max-width:300px"></v-progress-linear>
          <p class="w-100 text-center mt-4" style="font-size:18px">{{ quizTitle }}</p>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
export default {
  layout: "play",
  head() { return { title: this.$t('beReady.title') }; },

  data() {
    return {
      playersCount: 1,
      quizTitle: '',
    };
  },

  mounted() {
    if (!process.client) return;
    const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
    this.quizTitle = gs.quizTitle || '';

    // تأكد من اتصال الـ socket
    if (this.$socket) {
      this.$socket.connect();
    }

    // انتظر قليلاً للتأكد من الاتصال ثم استمع للأحداث
    this.$nextTick(() => {
      this._setupSocketListeners();
    });
  },

  methods: {
    _setupSocketListeners() {
      const socket = this.$socket?.getSocket?.();
      if (!socket) {
        // أعد المحاولة بعد 500ms
        setTimeout(() => this._setupSocketListeners(), 500);
        return;
      }

      console.log('[BeReady] Socket connected:', socket.connected, 'id:', socket.id);

      // Remove any existing listeners first to prevent duplicates
      socket.off('player:joined');
      socket.off('player:left');
      socket.off('game:started');
      socket.off('question:received');

      socket.on('player:joined', (data) => {
        this.playersCount = data.totalPlayers || this.playersCount;
      });

      socket.on('player:left', (data) => {
        this.playersCount = data.totalPlayers || this.playersCount;
      });

      socket.on('game:started', (data) => {
        const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.totalQuestions = data.questionCount || 0;
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
        console.log('[BeReady] game:started received, totalQuestions:', gs.totalQuestions);
      });

      socket.on('question:received', (data) => {
        console.log('[BeReady] question:received!', data.questionText);
        const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.questionIndex  = data.questionIndex;
        gs.totalQuestions = data.totalQuestions || gs.totalQuestions;
        gs.questionText   = data.questionText;
        gs.questionImage  = data.questionImage || '';
        gs.timer          = data.timeLimit || 30;
        gs.questionId     = data.questionId;
        gs.answers        = data.answers || [];
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
        this.$router.push(this.localePath('/play-sub-domain/standby'));
      });
    },
  },

  beforeDestroy() {
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.off('player:joined');
      socket.off('player:left');
      socket.off('game:started');
      // Do NOT remove question:received here - play-sub-domain/question.vue needs it
      // It will be removed in question.vue's beforeDestroy
    }
  },
};
</script>

<style scoped>
p { color: #75769a; font-size: 35px; margin-bottom: 0; }
i { font-size: 70px; color: #3f51b5; }
span:last-of-type { background-color: #dcdbed; border-radius: 5px; padding: 10px; max-height: 36px; display: inline-flex; align-items: center; justify-content: center; margin: 8px 10px 0; overflow: hidden; }
p:first-of-type { margin-bottom: 20px; }
p:nth-of-type(3) { margin-bottom: 40px; }
@media only screen and (max-width: 600px) { p { font-size: 25px; } }
</style>
