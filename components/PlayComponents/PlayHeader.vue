<template>
  <div class="play-header">
    <div class="play-header-content d-flex justify-space-between align-center">
      <h2>{{ headerText }}</h2>
      <div class="player-code" v-if="playerCode">
        {{ playerCode }}
      </div>
      <v-btn text @click="$router.push(localePath(link))">
        {{ $t("quizPage.startBtn") }}
      </v-btn>
    </div>
    <v-divider horizontal class="rounded"></v-divider>
  </div>
</template>

<script>
export default {
  name: "PlayHeader",
  props: ["headerText", "playerCode", "link"],
};
</script>

<style scoped>
.play-header-content {
  margin-bottom: 15px;
  margin-right: 20px;
}

h2 {
  color: #898999;
  font-weight: 600;
}

.player-code {
  padding: 5px 20px;
  text-align: center;
  background-color: #fcf1df;
  color: #93919b;
  font-size: 25px;
  font-weight: 600;
  border-radius: 20px;
}

button {
  height: auto !important;
  padding: 5px 30px !important;
  background-color: #ff5e94 !important;
  color: #fff !important;
  font-size: 20px !important;
  font-family: "Cairo" !important;
  border-radius: 10px !important;
  letter-spacing: 0 !important;
}

@media only screen and (max-width: 767px) {
  .play-header-content {
    flex-direction: column !important;
  }

  h2 {
    font-size: 25px !important;
    margin-bottom: 10px;
  }

  button {
    margin: 10px 0;
  }
}

@media only screen and (max-width: 1200px) {
  h2,
  button {
    width: fit-content !important;
  }
}

/* Ltr Direction Style */
.ltr .play-header-content {
  margin-right: 0 !important;
  margin-left: 20px !important;
}
</style>
