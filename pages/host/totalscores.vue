<!-- Host Total Scores - Final results after game ends -->
<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <div class="scores-header d-flex align-center justify-space-between">
          <h1>{{ $t("finalResults.title") }}</h1>
          <div class="score-btns d-flex align-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="accent-1" v-bind="attrs" v-on="on">
                  <i class="fas fa-download"></i>
                </v-btn>
              </template>
              <span>{{ $t("finalResults.download") }}</span>
            </v-tooltip>
          </div>
          <v-btn height="auto" class="white--text end-quiz title" text @click="goHome">
            {{ $t("finalResults.endQuiz") || 'إنهاء' }}
          </v-btn>
        </div>

        <v-divider horizontal></v-divider>

        <!-- Final Leaderboard -->
        <div class="result-description">
          <div class="table-content w-100 mx-auto">
            <div class="headers w-100 d-flex align-center">
              <div class="table-head"><h3 class="text-center">{{ $t("resultTables.scoreBoard.headers.name") }}</h3></div>
              <div class="table-head"><h3 class="text-center">المرتبة</h3></div>
              <div class="table-head"><h3 class="text-center">{{ $t("finalResults.results") }}</h3></div>
              <div class="table-head"><h3 class="text-center">الدقة</h3></div>
            </div>
            <v-divider horizontal></v-divider>

            <div
              class="table-body w-100 d-flex align-center flex-column"
              v-for="entry in finalResults"
              :key="entry.id"
            >
              <div class="table-body-content d-flex align-center justify-center w-100">
                <div class="text-center"><h2>{{ entry.name }}</h2></div>
                <div class="text-center">
                  <h2>
                    <v-icon v-if="entry.rank === 1" color="amber">mdi-trophy</v-icon>
                    <v-icon v-else-if="entry.rank === 2" color="grey lighten-1">mdi-medal</v-icon>
                    <v-icon v-else-if="entry.rank === 3" color="brown lighten-1">mdi-medal</v-icon>
                    <span v-else>#{{ entry.rank }}</span>
                  </h2>
                </div>
                <div class="text-center"><h2>{{ entry.score }}</h2></div>
                <div class="text-center"><h2>{{ entry.accuracy }}%</h2></div>
              </div>
              <v-divider horizontal class="last-divider w-100"></v-divider>
            </div>

            <div v-if="!finalResults.length" class="text-center py-10">
              <v-icon size="50" color="grey">mdi-chart-bar</v-icon>
              <p class="grey--text mt-4">لا توجد نتائج نهائية</p>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
export default {
  layout: "play",
  head() { return { title: this.$t("resultTables.scoreBoard.title") }; },

  data() {
    return { finalResults: [] };
  },

  mounted() {
    if (!process.client) return;
    const gameState = JSON.parse(sessionStorage.getItem('gameState') || '{}');
    this.finalResults = (gameState.finalResults || []).map(p => ({
      id:       p.id || p._id,
      name:     p.name,
      score:    p.score,
      rank:     p.rank,
      accuracy: p.accuracy || '0.0',
    }));
    sessionStorage.removeItem('sessionCode');
    sessionStorage.removeItem('gameState');
    sessionStorage.removeItem('currentQuizId');
  },

  methods: {
    goHome() { this.$router.push(this.localePath('/explore')); },
  },
};
</script>

<style scoped>
.scores-header h1, .score-btns, .end-quiz { min-width: 8%; }
.scores-header h1 { font-size: 30px; }
.scores-header h1, .score-btns i { color: #a4abbb; }
.score-btns button { margin: 0 5px; }
.score-btns i { font-size: 27px; }
.end-quiz { padding: 3px 25px; background-color: #ff5e94; border-radius: 10px; }
@media only screen and (max-width: 767px) {
  .scores-header { flex-direction: column; }
  .score-btns { margin: 20px 0 15px; }
}
</style>
