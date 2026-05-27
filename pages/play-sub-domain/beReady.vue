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
    this.quizTitle   = gs.quizTitle   || '';
    // Init from join ack so the count is correct immediately
    this.playersCount = gs.playerCount || 1;

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
        setTimeout(() => this._setupSocketListeners(), 500);
        return;
      }

      this._onPlayerJoined = (data) => {
        this.playersCount = data.totalPlayers || this.playersCount;
        const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.playerCount = this.playersCount;
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
      };
      this._onPlayerLeft = (data) => {
        this.playersCount = data.totalPlayers || this.playersCount;
        const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.playerCount = this.playersCount;
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
      };
      this._onGameStarted = (data) => {
        const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.totalQuestions = data.questionCount || 0;
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
      };
      this._onQuestionReceived = (data) => {
        const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
        gs.questionIndex  = data.questionIndex;
        gs.totalQuestions = data.totalQuestions || gs.totalQuestions;
        gs.questionText   = data.questionText;
        gs.questionImage  = data.questionImage || '';
        gs.timer          = data.timeLimit || 30;
        gs.questionId     = data.questionId;
        gs.answers        = data.answers || [];
        gs.startedAt      = data.startedAt || Date.now();
        sessionStorage.setItem('playerGameState', JSON.stringify(gs));
        this.$router.push(this.localePath('/play-sub-domain/standby'));
      };

      // swapOn ensures only one handler per event exists — safe across Vue page transitions
      this.$socket.swapOn('player:joined',     this._onPlayerJoined);
      this.$socket.swapOn('player:left',       this._onPlayerLeft);
      this.$socket.swapOn('game:started',      this._onGameStarted);
      this.$socket.swapOn('question:received', this._onQuestionReceived);
    },
  },

  beforeDestroy() {
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      // Targeted removal — only removes this page's handlers.
      // If the incoming page already called swapOn for the same event, its handler survives.
      socket.off('player:joined',    this._onPlayerJoined);
      socket.off('player:left',      this._onPlayerLeft);
      socket.off('game:started',     this._onGameStarted);
      socket.off('question:received', this._onQuestionReceived);
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
