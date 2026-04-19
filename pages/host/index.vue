<!-- Host Lobby Page - Connected to Socket.IO -->
<template>
  <section class="play-page players-numbers">
    <v-container fluid>
      <div class="play-page-container">

        <!-- Header: players count -->
        <PlayHeader
          :headerText="`${$t('settings.playersNumbers')}: ${players.length}`"
          :link="null"
        />

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-center align-center flex-column py-16">
          <v-progress-circular indeterminate color="white" size="60"></v-progress-circular>
          <p class="white--text mr-4 title mt-4">جاري إنشاء الجلسة...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-10">
          <v-icon size="60" color="red lighten-3">mdi-alert-circle</v-icon>
          <p class="white--text title mt-4">{{ error }}</p>
          <v-btn outlined color="white" class="mt-4" @click="$router.push(localePath('/explore'))">العودة للاختبارات</v-btn>
        </div>

        <template v-else-if="session">

          <!-- ─── Join Info Card ─────────────────────────────── -->
          <div class="join-card d-flex align-center justify-space-between flex-wrap">

            <!-- Play Link -->
            <div class="join-item">
              <p class="join-label">{{ $t("settings.goToLink") || 'ادخل الرابط' }}</p>
              <div class="join-value join-url">
                <v-icon small color="#3a3798" class="ml-1">mdi-web</v-icon>
                {{ playLink }}
              </div>
            </div>

            <!-- Session Code — big & prominent -->
            <div class="join-item join-code-block text-center">
              <p class="join-label">{{ $t("settings.enterNumber") || 'كود الجلسة' }}</p>
              <div class="session-code">
                <span
                  v-for="(ch, i) in sessionCodeChars"
                  :key="i"
                  class="code-char"
                >{{ ch }}</span>
              </div>
              <v-btn
                x-small text color="#ff5e94"
                class="copy-btn mt-1"
                @click="copyCode"
              >
                <v-icon x-small class="ml-1">mdi-content-copy</v-icon>
                {{ copied ? 'تم النسخ!' : 'نسخ الكود' }}
              </v-btn>
            </div>

            <!-- Quiz title -->
            <div class="join-item text-center" v-if="session.quiz">
              <p class="join-label">الاختبار</p>
              <div class="join-value quiz-title-badge">{{ session.quiz.title }}</div>
            </div>

          </div>

          <!-- Socket status -->
          <div class="text-center mt-2">
            <v-chip x-small :color="socketConnected ? 'green' : 'red'" text-color="white">
              <v-icon x-small left>{{ socketConnected ? 'mdi-wifi' : 'mdi-wifi-off' }}</v-icon>
              {{ socketConnected ? 'متصل' : 'غير متصل' }}
            </v-chip>
          </div>

          <v-divider horizontal class="my-4" style="border-color:rgba(255,255,255,0.15)"></v-divider>

          <!-- ─── Players List ───────────────────────────────── -->
          <div class="players-names d-flex align-center justify-center flex-wrap">
            <div v-if="players.length === 0" class="text-center w-100 py-8">
              <v-icon size="48" color="rgba(255,255,255,0.3)">mdi-account-multiple-outline</v-icon>
              <p class="white--text title mt-3">في انتظار انضمام اللاعبين...</p>
              <v-progress-linear indeterminate color="#ff5e94" height="3" class="mt-4" rounded></v-progress-linear>
            </div>
            <div
              class="name text-white text-center"
              v-for="(player, idx) in players"
              :key="player.socketId || player.playerId || idx"
            >
              <v-icon small color="white" class="mb-1">mdi-account</v-icon>
              <br/>
              <span>{{ player.name || player.playerName }}</span>
            </div>
          </div>

          <!-- ─── Start Button ───────────────────────────────── -->
          <div class="d-flex justify-center mt-8">
            <v-btn
              class="white--text start-btn title"
              x-large
              :disabled="players.length === 0"
              @click="startGame"
              color="#ff5e94"
              elevation="4"
            >
              <v-icon class="mx-2">mdi-play-circle</v-icon>
              بدء اللعبة &nbsp;
              <v-chip small color="white" text-color="#ff5e94" class="font-weight-bold">
                {{ players.length }} لاعب
              </v-chip>
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
      loading:         true,
      error:           null,
      session:         null,
      players:         [],
      playLink:        '',
      copied:          false,
      socketConnected: false,
    };
  },
  computed: {
    sessionCodeChars() {
      return this.session ? this.session.sessionCode.split('') : [];
    },
  },
  async mounted() {
    if (!process.client) return;
    const quizId = sessionStorage.getItem('currentQuizId');
    if (!quizId) {
      this.error   = 'لم يتم تحديد اختبار. يرجى اختيار اختبار أولاً.';
      this.loading = false;
      return;
    }
    await this.createSession(quizId);

    const origin = window.location.origin;
    const path   = this.localePath ? this.localePath('/play-sub-domain') : '/play-sub-domain';
    this.playLink = `${origin}${path}`;
  },
  methods: {
    async createSession(quizId) {
      try {
        this.loading = true;
        // Create session via REST API
        const res    = await this.$axios.post('/host', { quizId });
        this.session = res.data?.data?.session || res.data?.data;
        if (!this.session) throw new Error('لم يتم إنشاء الجلسة');
        // Now setup socket listeners
        await this.setupSocket();
      } catch (e) {
        this.error = e.response?.data?.message || e.message || 'فشل في إنشاء الجلسة';
      } finally {
        this.loading = false;
      }
    },

    async setupSocket() {
      if (!this.$socket) {
        console.warn('Socket plugin not available');
        return;
      }

      // Connect and wait for connection
      const socket = this.$socket.connect();
      if (!socket) return;

      // Wait up to 3s for connection
      await new Promise((resolve) => {
        if (socket.connected) {
          this.socketConnected = true;
          resolve();
        } else {
          const timeout = setTimeout(() => resolve(), 3000);
          socket.once('connect', () => {
            clearTimeout(timeout);
            this.socketConnected = true;
            resolve();
          });
        }
      });

      socket.on('connect', () => {
        this.socketConnected = true;
        console.log('[Host] Socket connected');
      });

      socket.on('disconnect', () => {
        this.socketConnected = false;
        console.log('[Host] Socket disconnected');
      });

      // ── الحدث الصحيح من الباك اند: 'player:joined' ──
      socket.on('player:joined', (data) => {
        console.log('[Host] player:joined', data);
        // data = { playerId, playerName, totalPlayers }
        // أضف اللاعب للقائمة إذا لم يكن موجوداً
        const exists = this.players.find(p => p.playerId === data.playerId);
        if (!exists) {
          this.players.push({
            playerId:   data.playerId,
            playerName: data.playerName,
            name:       data.playerName,
          });
        }
      });

      // ── لاعب غادر ──
      socket.on('player:left', (data) => {
        console.log('[Host] player:left', data);
        // data = { playerId, playerName, totalPlayers }
        this.players = this.players.filter(p => p.playerId !== data.playerId);
      });

      // ── سجّل المستضيف في الجلسة الموجودة (المُنشأة عبر REST) ──
      socket.emit('host:register-session',
        { sessionCode: this.session.sessionCode },
        (ack) => {
          console.log('[Host] host:register-session ack:', ack);
          if (!ack?.success) {
            console.warn('[Host] Failed to register socket session:', ack?.message);
          }
        }
      );
    },

    async startGame() {
      try {
        const code = this.session.sessionCode;
        const socket = this.$socket?.getSocket?.();

        // حفظ بيانات الجلسة الكاملة في gameState
        const gameState = {
          sessionCode:    code,
          questionIndex:  0,
          totalQuestions: this.session.quiz?.questions?.length
                          || this.session.questionCount
                          || 0,
          playersCount:   this.players.length,
          timer:          30,
          questionText:   '',
          questionImage:  '',
          answers:        [],
          leaderboard:    [],
          // ⬇️ علامة مهمة: host/standby سيُرسل السؤال الأول بنفسه
          // (عند next-question من scoreboard ستكون false)
          shouldSendQuestion: true,
        };
        sessionStorage.setItem('sessionCode', code);
        sessionStorage.setItem('gameState',   JSON.stringify(gameState));

        // ── استدعاء host:start-game ثم الانتقال بعد التأكد من النجاح ──
        if (socket) {
          socket.emit('host:start-game', { sessionCode: code }, (ack) => {
            console.log('[Host] start-game ack:', ack);
            if (ack?.success) {
              this.$router.push(this.localePath('/host/standby'));
            } else {
              console.error('[Host] Failed to start game:', ack?.message);
              this.error = ack?.message || 'فشل في بدء اللعبة';
            }
          });
        } else {
          // fallback إذا لم يوجد socket
          this.$router.push(this.localePath('/host/standby'));
        }
      } catch (e) {
        console.error('Start game error:', e);
      }
    },

    copyCode() {
      if (!process.client || !this.session) return;
      const code = this.session.sessionCode;
      const doCopy = () => {
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(doCopy).catch(() => this.fallbackCopy(code, doCopy));
      } else {
        this.fallbackCopy(code, doCopy);
      }
    },
    fallbackCopy(text, cb) {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      cb?.();
    },
  },
  beforeDestroy() {
    if (this.$socket) {
      const s = this.$socket.getSocket();
      if (s) {
        s.off('player:joined');
        s.off('player:left');
        s.off('connect');
        s.off('disconnect');
      }
    }
  },
  components: { PlayHeader },
};
</script>

<style scoped>
/* ── Join Info Card ── */
.join-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px;
  padding: 20px 28px;
  margin: 10px 0 4px;
  gap: 20px;
}

.join-item { min-width: 200px; }

.join-label {
  color: #898999;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.join-value {
  color: #e8e8f4;
  font-size: 18px;
  font-weight: 600;
  padding: 8px 16px;
  background: rgba(58,55,152,0.35);
  border-radius: 10px;
  display: inline-block;
}

.join-url {
  font-size: 15px;
  word-break: break-all;
}

.quiz-title-badge {
  font-size: 16px;
  max-width: 260px;
}

/* ── Session Code ── */
.join-code-block { flex: 0 0 auto; }

.session-code {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 4px;
}

.code-char {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 64px;
  font-size: 32px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, #3a3798, #5452b8);
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(58,55,152,0.5);
  letter-spacing: 0;
  border: 2px solid rgba(255,255,255,0.15);
}

.copy-btn { font-size: 12px !important; opacity: 0.8; }
.copy-btn:hover { opacity: 1; }

/* ── Players ── */
.name {
  width: 18%;
  min-width: 110px;
  background: rgba(58,55,152,0.45);
  margin: 10px;
  padding: 14px 8px 10px;
  font-size: 18px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: transform 0.2s;
}
.name:hover { transform: translateY(-3px); }

/* ── Start Button ── */
.start-btn {
  border-radius: 16px !important;
  padding: 12px 48px !important;
  height: auto !important;
  font-size: 20px !important;
  letter-spacing: 0.5px;
}

@media only screen and (max-width: 600px) {
  .join-card { flex-direction: column; padding: 16px; }
  .join-item { min-width: unset; width: 100%; }
  .code-char { width: 42px; height: 54px; font-size: 26px; }
  .name { width: 45%; }
}
</style>
