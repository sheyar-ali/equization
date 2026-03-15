<!-- Host Lobby Page - Connected to Socket.IO -->
<template>
  <section class="play-page players-numbers">
    <v-container fluid>
      <div class="play-page-container">
        <PlayHeader
          :headerText="`${$t('settings.playersNumbers')}: ${players.length}`"
          :playerCode="session ? session.sessionCode : ''"
          :link="null"
        />

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-center align-center py-16">
          <v-progress-circular indeterminate color="white" size="60"></v-progress-circular>
          <p class="white--text mr-4 title">جاري إنشاء الجلسة...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-10">
          <v-icon size="60" color="red lighten-3">mdi-alert-circle</v-icon>
          <p class="white--text title mt-4">{{ error }}</p>
          <v-btn outlined color="white" @click="$router.push(localePath('/explore'))">العودة</v-btn>
        </div>

        <template v-else-if="session">
          <div class="link-container d-flex align-center justify-content-start">
            <div class="link">
              <span>{{ $t("settings.goToLink") }}</span>
              <span>{{ playLink }}</span>
            </div>
            <div class="link">
              <span>{{ $t("settings.enterNumber") }}</span>
              <span>{{ session.sessionCode }}</span>
            </div>
          </div>

          <v-divider horizontal></v-divider>

          <!-- Players List -->
          <div class="players-names d-flex align-center justify-center flex-wrap">
            <div v-if="players.length === 0" class="text-center w-100 py-8">
              <p class="white--text title">في انتظار انضمام اللاعبين...</p>
              <v-progress-linear indeterminate color="#ff5e94" height="4" class="mt-4" rounded></v-progress-linear>
            </div>
            <div
              class="name text-white text-center"
              v-for="player in players"
              :key="player.socketId || player.name"
            >
              <span>{{ player.name }}</span>
            </div>
          </div>

          <!-- Start Game Button -->
          <div class="d-flex justify-center mt-6">
            <v-btn
              class="white--text start-btn title"
              large
              :disabled="players.length === 0"
              @click="startGame"
              color="#ff5e94"
            >
              <v-icon class="mx-2">mdi-play-circle</v-icon>
              بدء اللعبة ({{ players.length }} لاعب)
            </v-btn>
          </div>
        </template>
      </div>
    </v-container>
  </section>
</template>

<script>
import PlayHeader from "@/components/PlayComponents/PlayHeader";

export default {
  layout: "play",
  head() { return { title: this.$t("host.options.title") }; },
  data() {
    return {
      loading:  true,
      error:    null,
      session:  null,
      players:  [],
      playLink: '',
    };
  },
  async mounted() {
    const quizId = process.client ? sessionStorage.getItem('currentQuizId') : null;
    if (!quizId) {
      this.error   = 'لم يتم تحديد اختبار. يرجى اختيار اختبار أولاً.';
      this.loading = false;
      return;
    }
    await this.createSession(quizId);
    this.playLink = `${window.location.origin}${this.localePath ? this.localePath('/play-sub-domain') : '/play-sub-domain'}`;
  },
  methods: {
    async createSession(quizId) {
      try {
        this.loading = true;
        const res    = await this.$axios.post('/host', { quizId });
        this.session = res.data?.data;
        // Connect socket and listen for players
        this.setupSocket();
      } catch (e) {
        this.error = e.response?.data?.message || 'فشل في إنشاء الجلسة';
      } finally {
        this.loading = false;
      }
    },
    setupSocket() {
      if (!this.$socket) return;
      this.$socket.connect();
      const socket = this.$socket.getSocket();
      if (!socket) return;

      // Join as host
      this.$socket.createSession(this.session.sessionCode, this.$store.getters.user?._id);

      // Listen for player joins
      socket.on('player-joined', (data) => {
        this.players = data.players || [];
      });
      socket.on('player-left', (data) => {
        this.players = data.players || [];
      });
      socket.on('session-players', (data) => {
        this.players = data.players || [];
      });
    },
    async startGame() {
      try {
        if (this.$socket) {
          this.$socket.startGame(this.session.sessionCode);
        }
        // Store session code
        if (process.client) sessionStorage.setItem('sessionCode', this.session.sessionCode);
        this.$router.push(this.localePath('/host/standby'));
      } catch (e) {
        console.error('Start game error:', e);
      }
    },
  },
  beforeDestroy() {
    if (this.$socket) {
      const socket = this.$socket.getSocket();
      if (socket) {
        socket.off('player-joined');
        socket.off('player-left');
        socket.off('session-players');
      }
    }
  },
  components: { PlayHeader },
};
</script>

<style scoped>
.link { margin-top: 15px; margin-bottom: 30px; color: #898999 !important; }
.link:first-of-type { margin-left: 15px; }
.link span:first-of-type { margin-left: 10px; font-size: 27px; font-weight: 600; }
.link span:last-of-type { font-size: 23px; padding: 1px 15px; border-radius: 10px; background-color: #e8e8f4; }
.link-container + hr { height: 2px !important; max-height: 2px; background-color: rgba(0,0,0,.12) !important; }
.name { width: 22%; background-color: #3a3798; margin: 15px; padding: 10px 5px; font-size: 22px; border-radius: 10px; }
.start-btn { border-radius: 15px; padding: 10px 40px !important; height: auto !important; }
@media only screen and (max-width: 600px) {
  .link-container { flex-wrap: wrap; }
  .link:first-of-type { margin-left: 0 !important; }
  .link { display: flex; align-items: center; justify-content: center; flex-direction: column; width: 100%; margin-bottom: 15px; }
  .name { width: 100% !important; }
}
.ltr .link:first-of-type { margin-left: 0 !important; margin-right: 15px !important; }
.ltr .link span:first-of-type { margin-left: 0 !important; margin-right: 10px; }
</style>
