<template>
  <section class="play-page play-quiz">
    <v-container fluid>
      <div class="play-page-container">
        <QuestionHeader
          :timer="timer"
          :QuestionOrder="QuestionOrder"
          :score="score"
          :Questions="Questions"
        />
        <div
          class="question-container d-flex align-center justify-center flex-column"
        >
          <h1 class="question text-center text-white w-100">
            {{ this.questionText }}
          </h1>
          <v-progress-circular
            :rotate="180"
            :size="300"
            :width="15"
            :value="seconds * 20"
          >
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
  head() {
    return {
      title: this.$t("ready.title"),
    };
  },
  data() {
    return {
      questionText: "من عجائب الدنيا السبع القديمة في العالم :",
      seconds: 5,
      timer: 30,
      QuestionOrder: 1,
      Questions: 10,
      score: 0,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.seconds !== 0) {
        this.seconds -= 1;
      } else {
        clearInterval(this.interval);
        this.$router.push(this.localePath("/play-sub-domain/question"));
      }
    }, 1000);
  },
  components: {
    QuestionHeader,
  },
};
</script>

<style scoped>
.question-container {
  margin: 25px 0;
  padding: 0 70px;
}

.question-container h1 {
  margin-bottom: 25px;
  padding: 20px 10px;
  line-height: 35px;
  background-color: #38389a;
  border-radius: 10px;
  font-size: 24px;
}

.v-progress-circular {
  color: #ff5e94 !important;
  width: 250px !important;
}

h2.count-down {
  font-size: 65px !important;
}

@media only screen and (max-width: 767px) {
  .question-container {
    padding: 0 !important;
  }

  .question-container h1 {
    font-size: 20px !important;
    margin-bottom: 10px !important;
  }

  h2.count-down {
    font-size: 50px !important;
  }

  .v-progress-circular {
    width: 60% !important;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1200px) {
  .question-container {
    padding: 0 15px !important;
  }
}
</style>
