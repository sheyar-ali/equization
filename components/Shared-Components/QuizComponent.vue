<!-- Start Of The Quizs Component -->
<template>
  <v-col
    lg="3"
    md="6"
    sm="12"
    cols="12"
    class="wow fadeIn tests-container mx-auto"
    :data-wow-delay="wowDelay"
  >
    <nuxt-link
      :to="localePath(questLink)"
      class="d-block w-100 card bg-white overflow-hidden"
    >
      <div class="card-head position-relative">
        <img
          :src="coverImage || require('@/assets/images/Home-Page-Images/EQUIZATION.png')"
          class="card-img-top w-100"
          alt="test-img"
          @error="$event.target.src = require('@/assets/images/Home-Page-Images/EQUIZATION.png')"
        />
        <div class="test-description position-absolute">
          <p class="text-white">
            {{ questNumbers }} {{ $t("quizesSection.question") }}
          </p>
          <p class="text-white">
            {{ playersNumbers }} {{ $t("quizesSection.player") }}
          </p>
        </div>
        <!-- Quiz Code Badge on card -->
        <div v-if="quizCode" class="quiz-code-overlay position-absolute">
          <span class="quiz-code-text">{{ quizCode }}</span>
        </div>
      </div>
      <h4 class="test-title text-center text-dark font-weight-bold">
        {{ quizTitle }}
      </h4>
      <div class="departments justify-center d-flex flex-wrap">
        <span
          v-for="(category, i) in categories"
          :key="i"
          class="font-weight-bold"
          >{{ category.categoryName }}</span
        >
      </div>
    </nuxt-link>
  </v-col>
</template>

<script>
export default {
  name: "QuizComponent",
  props: [
    "questLink",
    "questNumbers",
    "playersNumbers",
    "quizTitle",
    "categories",
    "categoryLink",
    "wowDelay",
    "coverImage",
    "quizCode",
  ],
};
</script>

<style scoped>
.tests-container {
  margin-bottom: 28px;
}

/* ── Premium Card Shell ── */
.card {
  padding: 0;
  border: none !important;
  border-radius: 28px;
  overflow: hidden;
  background: #fff;
  position: relative;
  transition: var(--transition-smooth, all 0.4s cubic-bezier(0.175,0.885,0.32,1.275));
}

/* Gradient top-accent bar */
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #363999, #6c63ff, #ff5e94, #ffc961);
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
  z-index: 2;
  border-radius: 28px 28px 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.card:hover::before { opacity: 1; }

/* ── Card Image ── */
.card-head { position: relative; overflow: hidden; margin-bottom: 0; }

img {
  display: block;
  object-fit: cover;
  height: 175px !important;
  width: 100%;
  transition: transform 0.5s ease;
}
.card:hover img { transform: scale(1.06); }

/* dark gradient at bottom of image */
.card-head::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 60px;
  background: linear-gradient(transparent, rgba(30, 27, 75, 0.55));
  pointer-events: none;
  z-index: 1;
}

/* ── Stats overlay (questions / players) ── */
.test-description {
  bottom: 6px;
  right: 6px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

p {
  background: linear-gradient(135deg, rgba(255, 94, 148, 0.9), rgba(255, 61, 127, 0.9));
  margin: 0;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(255, 94, 148, 0.4);
}

/* ── Quiz code badge ── */
.quiz-code-overlay {
  top: 10px;
  left: 10px;
  z-index: 2;
}

.quiz-code-text {
  background: linear-gradient(135deg, rgba(54, 57, 153, 0.92), rgba(108, 99, 255, 0.92));
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 1.5px;
  box-shadow: 0 2px 10px rgba(54, 57, 153, 0.4);
  backdrop-filter: blur(4px);
}

/* ── Card body ── */
h4 {
  padding: 14px 14px 6px;
  margin-bottom: 0;
  font-size: 17px;
  font-weight: 800;
  color: #1e1b4b;
  transition: color 0.3s ease;
  line-height: 1.4;
  /* clamp to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card:hover h4 { color: #ff5e94 !important; }

/* ── Category tags ── */
.departments {
  padding: 0 12px 14px;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  margin-bottom: 0;
}

@media only screen and (max-width: 600px) {
  .tests-container { margin-bottom: 8px; }
  img { height: 155px !important; }
}

/* ── LTR mirrors ── */
.ltr .test-description { right: auto !important; left: 6px; }
.ltr .quiz-code-overlay { left: auto !important; right: 10px; }

/* shimmer animation (local fallback in case global not loaded) */
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
</style>
