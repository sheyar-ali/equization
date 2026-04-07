<!-- play-sub-domain/name.vue - Enter player name and join session -->
<template>
  <section class="play-page">
    <v-container fluid class="w-100 h-100">
      <div class="play-page-container w-100 h-100">
        <div class="play-page-content w-100 h-100 d-flex align-center justify-center flex-column">
          <v-alert v-if="error" type="error" class="mb-4" dismissible @input="error=''">{{ error }}</v-alert>
          <v-alert v-if="success" type="success" class="mb-4">{{ success }}</v-alert>

          <v-form class="d-flex align-center justify-center flex-column w-100" v-model="valid" @submit.prevent="joinSession">
            <p class="w-100 text-center">{{ $t("play.numberInput") }}</p>
            <v-text-field
              outlined
              v-model="playerName"
              type="text"
              :label="$t('play.nameLabel')"
              :rules="[v => (v && v.trim().length >= 2) || 'أدخل اسمك (حرفان على الأقل)']"
              :disabled="loading"
              required
            ></v-text-field>
            <v-btn
              class="white--text d-block title sub-btn"
              height="auto"
              type="submit"
              :disabled="!valid || loading"
              :loading="loading"
            >{{ $t('play.loginBtn') }}</v-btn>
          </v-form>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
export default {
  layout: "play",
  head() { return { title: this.$t("play.title") }; },

  data() {
    return {
      valid: false,
      playerName: '',
      loading: false,
      error: '',
      success: '',
    };
  },

  mounted() {
    if (process.client) {
      // Pre-fill with logged-in user's name if available
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user) {
        this.playerName = user.firstName
          ? `${user.firstName} ${user.lastName || ''}`.trim()
          : user.username || '';
      }
    }
  },

  beforeDestroy() {
    // Clean up socket listeners set up in this component
    const socket = this.$socket?.getSocket?.();
    if (socket) {
      socket.off('game:started');
      socket.off('question:received');
    }
  },

  methods: {
    async joinSession() {
      if (!process.client) return;
      this.loading = true;
      this.error   = '';

      const sessionCode = sessionStorage.getItem('joinSessionCode') || '';
      if (!sessionCode) {
        this.error   = 'لم يتم تحديد كود الجلسة. ارجع وأدخل الكود.';
        this.loading = false;
        return;
      }

      // Connect socket and wait for it to be truly connected
      let socket = null;
      try {
        socket = await this._connectSocket();
      } catch (e) {
        this.error = 'فشل الاتصال بالخادم. حاول مرة أخرى.';
        this.loading = false;
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || 'null');

      socket.emit(
        'player:join-session',
        {
          sessionCode: sessionCode.toString().toUpperCase(),
          playerName:  this.playerName.trim(),
          userId:      user?._id || null,
        },
        (res) => {
          this.loading = false;
          if (res?.success) {
            // Store player info
            sessionStorage.setItem('sessionCode', sessionCode);
            sessionStorage.setItem('playerId',    res.playerId || '');
            sessionStorage.setItem('playerName',  this.playerName.trim());
            sessionStorage.setItem('playerGameState', JSON.stringify({
              questionIndex:  0,
              totalQuestions: 0,
              score:          0,
              quizTitle:      res.quizTitle || '',
            }));

            // Listen for game events (will be cleaned up in beforeDestroy)
            socket.off('game:started');
            socket.off('question:received');

            socket.on('game:started', (data) => {
              const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
              gs.totalQuestions = data.questionCount || 0;
              sessionStorage.setItem('playerGameState', JSON.stringify(gs));
            });

            socket.on('question:received', (data) => {
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

            this.$router.push(this.localePath('/play-sub-domain/beReady'));
          } else {
            this.error = res?.message || 'فشل الانضمام للجلسة';
          }
        }
      );
    },

    // Wait until socket is connected (up to 5 seconds)
    _connectSocket() {
      return new Promise((resolve, reject) => {
        if (!this.$socket) {
          reject(new Error('Socket plugin not available'));
          return;
        }

        const socket = this.$socket.connect();
        if (!socket) {
          reject(new Error('Could not create socket'));
          return;
        }

        if (socket.connected) {
          resolve(socket);
          return;
        }

        // Wait for connect event
        const timeout = setTimeout(() => {
          socket.off('connect', onConnect);
          socket.off('connect_error', onError);
          reject(new Error('Connection timeout'));
        }, 5000);

        const onConnect = () => {
          clearTimeout(timeout);
          socket.off('connect_error', onError);
          resolve(socket);
        };

        const onError = (err) => {
          clearTimeout(timeout);
          socket.off('connect', onConnect);
          reject(err);
        };

        socket.once('connect', onConnect);
        socket.once('connect_error', onError);
      });
    },
  },
};
</script>

<style scoped>
p { font-size: 27px; color: #75769a; margin-bottom: 20px; }
.v-input { flex: 0; width: 315px; }
.play-page-container .play-page-content button { width: 150px; background-color: #3a3798; padding: 3px 25px; border-radius: 10px; }
@media only screen and (max-width: 600px) { p { font-size: 25px; } }
</style>
