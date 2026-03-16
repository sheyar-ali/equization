<!-- play-sub-domain/totalscores.vue - Final results for player -->
<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <div class="scores-header d-flex align-center justify-space-between">
          <h1>{{ $t("finalResults.title") }}</h1>
          <div class="score-btns d-flex align-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="accent-1" v-bind="attrs" v-on="on" @click="share = true">
                  <i class="fas fa-share-alt"></i>
                </v-btn>
              </template>
              <span>{{ $t("finalResults.share") }}</span>
            </v-tooltip>
          </div>
          <v-btn height="auto" class="white--text end-quiz title" text @click="goHome">{{ $t("finalResults.endQuiz") }}</v-btn>
        </div>

        <v-divider horizontal></v-divider>

        <!-- My score card -->
        <div v-if="myResult" class="my-result-card text-center pa-4 mb-4">
          <v-icon size="50" :color="myResult.rank === 1 ? 'amber' : '#ff5e94'">
            {{ myResult.rank <= 3 ? 'mdi-trophy' : 'mdi-account-star' }}
          </v-icon>
          <h2 class="white--text mt-1">{{ myResult.name }}</h2>
          <p class="white--text">المرتبة: #{{ myResult.rank }} | النقاط: {{ myResult.score }}</p>
        </div>

        <!-- Final leaderboard -->
        <div class="result-description">
          <div class="table-content w-100 mx-auto">
            <div class="headers w-100 d-flex align-center">
              <div class="table-head"><h3 class="text-center">#</h3></div>
              <div class="table-head"><h3 class="text-center">{{ $t("resultTables.scoreBoard.headers.name") }}</h3></div>
              <div class="table-head"><h3 class="text-center">{{ $t("finalResults.results") }}</h3></div>
              <div class="table-head"><h3 class="text-center">الدقة</h3></div>
            </div>
            <v-divider horizontal></v-divider>

            <div class="table-body w-100 d-flex align-center flex-column" v-for="entry in finalResults" :key="entry.id">
              <div class="table-body-content d-flex align-center justify-center w-100" :class="{ 'my-row': entry.name === playerName }">
                <div class="text-center"><h2>{{ entry.rank }}</h2></div>
                <div class="text-center"><h2>{{ entry.name }}</h2></div>
                <div class="text-center"><h2>{{ entry.score }}</h2></div>
                <div class="text-center"><h2>{{ entry.accuracy }}%</h2></div>
              </div>
              <v-divider horizontal class="w-100"></v-divider>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Dialog -->
      <v-dialog v-model="share" max-width="550px">
        <v-card>
          <v-card-title class="text-center font-weight-bold d-block">{{ $t("finalResults.shareResults") }}</v-card-title>
          <v-divider></v-divider>
          <ShareNetwork v-for="n in networks" :network="n.network" :key="n.network" :url="shareURL" :title="$t('quizPage.shareMsg')">
            <v-icon class="pa-2" style="font-size: 48px" :color="n.color">{{ n.icon }}</v-icon>
          </ShareNetwork>
        </v-card>
      </v-dialog>
    </v-container>
  </section>
</template>

<script>
export default {
  layout: "play",
  head() { return { title: this.$t("finalResults.title") }; },
  data() {
    return {
      finalResults: [], playerName: '', myResult: null, share: false, shareURL: '',
      networks: [
        { network: 'facebook', icon: 'mdi-facebook', color: '#1877f2' },
        { network: 'whatsapp', icon: 'mdi-whatsapp', color: '#25d366' },
        { network: 'twitter',  icon: 'mdi-twitter',  color: '#1da1f2' },
        { network: 'telegram', icon: 'mdi-telegram', color: '#0088cc' },
      ],
    };
  },
  mounted() {
    if (!process.client) return;
    this.playerName = sessionStorage.getItem('playerName') || '';
    const gs = JSON.parse(sessionStorage.getItem('playerGameState') || '{}');
    this.finalResults = (gs.finalResults || []).map(p => ({ id: p.id || p._id, name: p.name, score: p.score, rank: p.rank, accuracy: p.accuracy || '0.0' }));
    this.myResult = this.finalResults.find(p => p.name === this.playerName) || null;
    this.shareURL = process.client ? window.location.origin : '';
    sessionStorage.removeItem('sessionCode');
    sessionStorage.removeItem('playerId');
    sessionStorage.removeItem('playerName');
    sessionStorage.removeItem('playerGameState');
    sessionStorage.removeItem('joinSessionCode');
  },
  methods: {
    goHome() { this.$router.push(this.localePath('/explore')); },
  },
};
</script>

<style scoped>
.scores-header h1 { font-size: 30px; color: #a4abbb; }
.end-quiz { padding: 3px 25px; background-color: #ff5e94; border-radius: 10px; }
.my-result-card { background-color: rgba(58,55,152,0.4); border-radius: 12px; }
.my-row { background-color: rgba(255,94,148,0.15); }
@media only screen and (max-width: 767px) { .scores-header { flex-direction: column; } }
</style>
