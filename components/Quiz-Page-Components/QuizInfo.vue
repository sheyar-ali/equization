<template>
  <v-col md="6" sm="6" cols="6" class="quiz-numbers">
    <div class="info-columns d-flex justify-space-between align-center">
      <div class="quiz-description">
        <h2 class="info-title text-center">{{ title }}</h2>
        <p class="info-number font-weight-bold ma-0 text-center">
          {{ number }}
        </p>
      </div>
      <div class="info-img d-flex justify-end">
        <img :src="imgSrc" class="d-block w-100" />
      </div>
    </div>
  </v-col>
</template>

<script>
export default {
  name: "QuizInfo",
  props: ["title", "number", "imgSrc"],
};
</script>

<style scoped>
.quiz-numbers {
  padding: 0;
}

.info-columns {
  padding: 15px 15px;
  background-color: #eafafa;
  border-radius: 10px;
}

.quiz-description {
  flex-grow: 1;
}

.info-title {
  font-size: 19px;
  color: #5a595e;
  font-weight: bold;
  max-width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.info-number {
  color: #73babc;
  font-size: 45px;
  line-height: 1.2 !important;
}

.info-img {
  width: 33%;
}

@media only screen and (max-width: 600px) {
  .quiz-numbers {
    margin: 0px auto 15px !important;
  }

  .info-img {
    width: 25% !important;
  }

  .info-title {
    margin: auto !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .quiz-numbers {
    padding: 20px 15px !important;
    margin: 0px auto 15px !important;
  }

  .info-title {
    margin: auto !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .quiz-numbers   { margin: 0 0 8px !important; padding: 0 4px !important; }
  .info-columns   { padding: 8px 10px; }
  .info-number    { font-size: 24px !important; }
  .info-title     { font-size: 13px !important; max-width: 90px; }
  .info-img       { width: 22% !important; }
}

@media only screen and (min-width: 960px) and (max-width: 992px) {
  .quiz-numbers:first-of-type {
    padding-left: 8px;
  }

  .quiz-numbers:nth-of-type(2) {
    padding-right: 8px;
  }

  .ltr .quiz-numbers:first-of-type {
    padding-right: 8px !important;
    padding-left: 0 !important;
  }

  .ltr .quiz-numbers:nth-of-type(2) {
    padding-left: 8px !important;
    padding-right: 0 !important;
  }
}

@media only screen and (min-width: 1200px) {
  .ltr h2.info-title {
    font-size: 15px !important;
  }
}

@media only screen and (min-width: 992px) {
  .quiz-numbers:first-of-type {
    padding-left: 8px;
  }

  .quiz-numbers:nth-of-type(2) {
    padding-right: 8px;
  }

  .ltr .quiz-numbers:first-of-type {
    padding-right: 8px;
    padding-left: 0 !important;
  }

  .ltr .quiz-numbers:nth-of-type(2) {
    padding-left: 8px;
    padding-right: 0 !important;
  }
}
</style>
