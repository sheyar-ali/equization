<template>
  <!-- Home Page -->
  <section class="home-page">
    <!-- Home Section -->
    <section class="section align-center home d-flex text-white">
      <MenuComponent />
      <!-- Floating decorative emoji / game symbols -->
      <div class="hero-decorations" aria-hidden="true">
        <span class="deco deco-1">🏆</span>
        <span class="deco deco-2">⚡</span>
        <span class="deco deco-3">🎯</span>
        <span class="deco deco-4">✨</span>
        <span class="deco deco-5">🎮</span>
        <span class="deco deco-6">🚀</span>
      </div>
      <v-container class="home-content d-flex">
        <img
          src="../assets/images/Home-Page-Images/Eouization.png"
          class="wow zoomIn d-block home-img mx-auto"
          alt="home-img"
        />
        <p class="wow zoomIn home-text text-center font-weight-bold mx-auto" data-wow-delay=".3s">
          {{ $t("homeSection.introText") }}
        </p>
        <v-row class="btns">
          <nuxt-link :to="localePath('/quizes/add')" class="wow zoomIn hero-btn hero-btn-primary text-center text-white" data-wow-delay=".6s">
            {{ $t("homeSection.homeBtns.firstBtn") }}
          </nuxt-link>
          <nuxt-link :to="localePath('/join')" class="wow zoomIn hero-btn hero-btn-outline text-center text-white" data-wow-delay=".8s">
            {{ $t("homeSection.homeBtns.secondBtn") }}
          </nuxt-link>
        </v-row>
      </v-container>
    </section>

    <!-- Section Numbers - from API -->
    <section class="numbers">
      <v-container class="numbers-content">
        <v-row class="justify-sm-center justify-md-center">
          <NumbersComponent
            v-for="number in numbers"
            :key="number.id"
            :numImgSrc="number.numImgSrc"
            :numImgAlt="number.numImgAlt"
            :titleText="number.titleText"
            :numValue="number.numValue"
            :wowClass="numbersDelay[number.id - 1].wowClass"
            :wowDelay="numbersDelay[number.id - 1].wowDelay"
          />
        </v-row>
      </v-container>
    </section>

    <!-- Why Us Section -->
    <section class="section align-center why-us" tag="section">
      <v-container>
        <SectionTitle :TitleText="$t('featuresSection.featureSectionTitle')" />
        <p class="wow zoomIn title-description text-center font-weight-bold" data-wow-delay=".2s">
          {{ $t("featuresSection.featureTitleText") }}
        </p>
        <div class="row feature-row">
          <WhyUsComponent
            v-for="feature in features"
            :key="feature.id"
            :featureTitle="feature.featureTitle"
            :featureImg="feature.featureImg"
            :featureImgAlt="feature.featureImgAlt"
            :featureText="feature.featureText"
            :wowDelay="featuresDelay[feature.id - 1].wowDelay"
          />
        </div>
      </v-container>
    </section>

    <!-- Quizzes Section - from API -->
    <section tag="section" class="quizs align-center section">
      <v-container>
        <SectionTitle :TitleText="$t('quizesSection.quizesSectionTitle')" />

        <!-- Loading state -->
        <v-row v-if="loadingQuizzes" class="justify-center my-8">
          <AppLoader />
        </v-row>

        <!-- Quizzes from API -->
        <div v-else-if="quizs.length > 0" class="row">
          <QuizComponent
            v-for="(quiz, idx) in quizs"
            :key="quiz._id"
            :questLink="`/quiz?id=${quiz._id}`"
            :questNumbers="quiz.questions ? quiz.questions.length : quiz.questionCount || 0"
            :playersNumbers="quiz.statistics ? quiz.statistics.totalPlayers : 0"
            :quizTitle="quiz.title"
            :categories="formatCategories(quiz.categories)"
            :wowDelay="getWowDelay(idx)"
            :coverImage="quiz.coverImage"
            :quizCode="quiz.quizCode"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <p class="title grey--text">{{ $t("quizesSection.noQuizzes") || 'لا توجد اختبارات بعد' }}</p>
        </div>

        <section class="tests-page d-flex wow zoomIn" data-wow-delay="0.5s">
          <nuxt-link :to="localePath('/explore')" class="show text-white d-flex">
            <span>{{ $t("quizesSection.showQuizes") }}</span>
            <img src="@/assets/images/Home-Page-Images/up-arrow.png" class="arrow-img" alt="arrow-icon" />
          </nuxt-link>
        </section>
      </v-container>
    </section>

    <!-- How Section -->
    <HowSection />
  </section>
</template>

<script>
import MenuComponent    from "@/components/Navbar-Components/MenuComponent.vue";
import NumbersComponent from "@/components/Home-Page-Components/NumbersComponent.vue";
import SectionTitle     from "@/components/Home-Page-Components/SectionTitle.vue";
import WhyUsComponent   from "@/components/Home-Page-Components/WhyUsComponent.vue";
import QuizComponent    from "@/components/Shared-Components/QuizComponent";
import HowSection       from "@/components/Home-Page-Components/HowSection.vue";
import quizHelpers      from "@/mixins/quizHelpers";

export default {
  mixins: [quizHelpers],
  name: "Home",
  layout: "default",
  head() {
    return {
      title: this.$t("homePageTitle"),
      meta: [{ hid: "description", name: "description", content: "Home Page In eQuization" }],
    };
  },
  data() {
    return {
      loadingQuizzes: true,
      quizs: [],
      apiStats: null,
      numbersDelay: [
        { wowClass: "wow zoomIn", wowDelay: ".1s" },
        { wowClass: "wow zoomIn", wowDelay: ".2s" },
        { wowClass: "wow zoomIn", wowDelay: ".3s" },
      ],
      featuresDelay: [
        { wowDelay: "0s"   },
        { wowDelay: ".1s"  },
        { wowDelay: ".2s"  },
        { wowDelay: ".3s"  },
        { wowDelay: ".4s"  },
        { wowDelay: ".5s"  },
      ],
    };
  },
  computed: {
    numbers() {
      return [
        {
          id: 1,
          numImgSrc:  require("@/assets/images/Home-Page-Images/quiz.png"),
          numImgAlt:  "notes-img",
          titleText:  this.$t("numbersSection.firstCardTitle"),
          numValue:   this.apiStats ? String(this.apiStats.totalQuizzes) : "0",
        },
        {
          id: 2,
          numImgSrc:  require("@/assets/images/Home-Page-Images/question.png"),
          numImgAlt:  "questions-img",
          titleText:  this.$t("numbersSection.secondCardTitle"),
          numValue:   this.apiStats ? String(this.apiStats.totalQuestions) : "0",
        },
        {
          id: 3,
          numImgSrc:  require("@/assets/images/Home-Page-Images/group.png"),
          numImgAlt:  "players-img",
          titleText:  this.$t("numbersSection.lastCardTitle"),
          numValue:   this.apiStats ? String(this.apiStats.totalPlayers) : "0",
        },
      ];
    },
    features() {
      return [
        { id: 1, featureTitle: this.$t("featuresSection.firstFeature.featureTitle"),  featureImg: require("@/assets/images/Home-Page-Images/interactive.png"),    featureImgAlt: "interactive-img",    featureText: this.$t("featuresSection.firstFeature.featureText")  },
        { id: 2, featureTitle: this.$t("featuresSection.secondFeature.featureTitle"), featureImg: require("@/assets/images/Home-Page-Images/boxing-gloves.png"),  featureImgAlt: "boxing-gloves-img",  featureText: this.$t("featuresSection.secondFeature.featureText") },
        { id: 3, featureTitle: this.$t("featuresSection.thirdFeature.featureTitle"),  featureImg: require("@/assets/images/Home-Page-Images/graduate.png"),       featureImgAlt: "graduate-img",       featureText: this.$t("featuresSection.thirdFeature.featureText")  },
        { id: 4, featureTitle: this.$t("featuresSection.forthFeature.featureTitle"),  featureImg: require("@/assets/images/Home-Page-Images/share.png"),          featureImgAlt: "share-img",          featureText: this.$t("featuresSection.forthFeature.featureText")  },
        { id: 5, featureTitle: this.$t("featuresSection.fifthFeature.featureTitle"),  featureImg: require("@/assets/images/Home-Page-Images/clock.png"),          featureImgAlt: "clock-img",          featureText: this.$t("featuresSection.fifthFeature.featureText")  },
        { id: 6, featureTitle: this.$t("featuresSection.lastFeature.featureTitle"),   featureImg: require("@/assets/images/Home-Page-Images/remote.png"),         featureImgAlt: "remote-img",         featureText: this.$t("featuresSection.lastFeature.featureText")   },
      ];
    },
  },
  async mounted() {
    await Promise.all([this.fetchFeaturedQuizzes(), this.fetchStats()]);
  },
  methods: {
    async fetchFeaturedQuizzes() {
      try {
        this.loadingQuizzes = true;
        const res = await this.$axios.get('/quizzes?limit=8&sort=-statistics.totalPlays');
        if (res.data && res.data.data) {
          this.quizs = res.data.data.slice(0, 8);
        }
      } catch (e) {
        console.error('Error fetching quizzes:', e.message);
      } finally {
        this.loadingQuizzes = false;
      }
    },
    async fetchStats() {
      try {
        const [quizzesRes, categoriesRes] = await Promise.all([
          this.$axios.get('/quizzes?limit=1'),
          this.$axios.get('/categories'),
        ]);
        const totalQuizzes   = quizzesRes.data?.pagination?.total || 0;
        const totalQuestions = totalQuizzes * 5; // تقريبي
        // حساب مجموع اللاعبين من الاختبارات
        const quizzesAll = quizzesRes.data?.data || [];
        const totalPlayers = quizzesAll.reduce((s, q) => s + (q.statistics?.totalPlayers || 0), 0);
        this.apiStats = { totalQuizzes, totalQuestions, totalPlayers };
      } catch (e) {
        this.apiStats = { totalQuizzes: 0, totalQuestions: 0, totalPlayers: 0 };
      }
    },
    // formatCategories and getWowDelay provided by quizHelpers mixin
  },
  components: { MenuComponent, NumbersComponent, SectionTitle, WhyUsComponent, QuizComponent, HowSection, AppLoader: () => import("@/components/Shared-Components/AppLoader") },
};
</script>

<style scoped>
section { padding: 70px 0; overflow: hidden; }
.section { min-height: 100vh; justify-content: center; overflow: hidden; }
.home-page { padding: 0 !important; }

/* ═══════════════════════════════
   HERO SECTION – Animated gradient
   ═══════════════════════════════ */
.home {
  background:
    url("../assets/images/Home-Page-Images/home-pattern.png"),
    linear-gradient(-45deg, #1e1b4b, #363999, #4a2d8f, #6c2d96, #363999, #1e1b4b);
  background-size: auto, 400% 400%;
  animation: gradientShift 12s ease infinite;
  border-bottom-left-radius: 280px;
  position: relative;
  overflow: hidden;
}

/* Subtle radial glow at centre of hero */
.home::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 70%;
  background: radial-gradient(ellipse at center, rgba(108,99,255,0.18) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ── Floating decorations ── */
.hero-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.deco {
  position: absolute;
  font-size: 2rem;
  opacity: 0.22;
  user-select: none;
}

.deco-1 { top: 12%; right: 8%;  font-size: 2.8rem; animation: float    5s ease-in-out infinite; }
.deco-2 { top: 22%; left: 6%;   font-size: 2.2rem; animation: floatAlt 6s ease-in-out infinite; }
.deco-3 { top: 68%; right: 12%; font-size: 2.4rem; animation: float    7s ease-in-out infinite 1s; }
.deco-4 { top: 55%; left: 5%;   font-size: 1.8rem; animation: sparkle  2.5s ease-in-out infinite; }
.deco-5 { top: 80%; left: 18%;  font-size: 2.0rem; animation: floatAlt 8s ease-in-out infinite 0.5s; }
.deco-6 { top: 30%; right: 22%; font-size: 1.6rem; animation: float    9s ease-in-out infinite 2s; }

@keyframes gradientShift {
  0%   { background-position: auto, 0% 50%; }
  50%  { background-position: auto, 100% 50%; }
  100% { background-position: auto, 0% 50%; }
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33%       { transform: translateY(-14px) rotate(4deg); }
  66%       { transform: translateY(-7px) rotate(-3deg); }
}
@keyframes floatAlt {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%       { transform: translateY(-20px) rotate(6deg); }
}
@keyframes sparkle {
  0%, 100% { opacity: 0.22; transform: scale(1); }
  50%       { opacity: 0.55; transform: scale(1.4); }
}

/* ── Hero content ── */
.home-content { position: relative; z-index: 2; }

.home-img {
  width: 45%;
  filter: drop-shadow(0 20px 50px rgba(108, 99, 255, 0.4));
  animation: float 7s ease-in-out infinite;
}
.home-img, .home-text { margin-bottom: 50px; }
.home-text { font-size: 34px; width: 77%; text-shadow: 0 2px 20px rgba(0,0,0,0.3); }

/* ── CTA Buttons ── */
.btns, .num-content, .tests-page { justify-content: center; }
.btns { gap: 16px; flex-wrap: wrap; }

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  padding: 14px 44px;
  font-size: 22px;
  font-family: "Almarai";
  font-weight: 700;
  border-top-right-radius: 18px;
  border-top-left-radius: 18px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.hero-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.12);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.hero-btn:hover::after { opacity: 1; }

.hero-btn-primary {
  background: linear-gradient(135deg, #ff5e94, #ff3d7f);
  box-shadow: 0 8px 30px rgba(255, 94, 148, 0.5);
  animation: glowPulse 2.5s ease-in-out infinite;
}
.hero-btn-primary:hover {
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 16px 50px rgba(255, 94, 148, 0.7) !important;
}

.hero-btn-outline {
  background: rgba(255,255,255,0.12);
  border: 2px solid rgba(255,255,255,0.5);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.hero-btn-outline:hover {
  background: rgba(255,255,255,0.22);
  transform: translateY(-4px) scale(1.04);
  border-color: #ffc961;
  box-shadow: 0 12px 40px rgba(255, 196, 97, 0.35) !important;
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 8px 30px rgba(255, 94, 148, 0.5); }
  50%       { box-shadow: 0 12px 50px rgba(255, 94, 148, 0.85), 0 0 60px rgba(255, 94, 148, 0.3); }
}

/* ═══════════════
   Numbers band
   ═══════════════ */
.numbers { padding: 155px 0 120px !important; }

/* ════════════════
   Why Us section
   ════════════════ */
.why-us {
  background: linear-gradient(160deg, #f0f4ff 0%, #e8f0fe 50%, #f5f0ff 100%);
  border-top-right-radius: 280px;
}

.title-description {
  font-size: 19px;
  line-height: 32px;
  margin-bottom: 70px;
  color: #7c7bb5;
  font-family: "Almarai";
  z-index: 1;
}

/* ════════════════════
   "Show all" quiz CTA
   ════════════════════ */
.tests-page { justify-content: center; }

a.show {
  margin-top: 10px;
  background: linear-gradient(135deg, #ff5e94, #ff3d7f);
  padding: 12px 32px;
  font-size: 22px;
  border-radius: 22px;
  box-shadow: 0 8px 30px rgba(255, 94, 148, 0.45);
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
a.show:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 50px rgba(255, 94, 148, 0.65);
}
a.show:hover img { transform: rotate(-90deg) translateY(-10px); }
a.show img {
  margin-right: 16px;
  width: 28px; height: 28px;
  filter: invert(1);
  transform: rotate(-90deg);
  transition: transform 0.35s ease;
}

/* ════════
   Quizzes section
   ════════ */
.quizs { background: #fff; }

/* ══════════════
   Responsive
   ══════════════ */
@media only screen and (max-width: 600px) {
  .home { border-bottom-left-radius: 175px !important; }
  .home-img { width: 75% !important; }
  .home-text { font-size: 24px !important; width: 100% !important; }
  .btns { flex-direction: column; align-items: center; }
  .hero-btn { width: 78%; margin: 5px 0 !important; padding: 12px 30px; font-size: 20px; }
  .home-text br { display: none; }
  .why-us { padding-top: 120px !important; border-top-right-radius: 175px !important; }
  .deco { font-size: 1.4rem !important; }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .why-us { padding-top: 120px !important; }
  .home-img { width: 53% !important; }
  .home-text { width: 95% !important; }
  .home-text br { display: none; }
}

/* LTR mirrors */
body.ltr a.show img { margin-right: 0; transform: rotate(90deg) !important; }
body.ltr a.show:hover img { transform: translate(10px) rotate(90deg) !important; }
body.ltr a.show span { margin-right: 20px; }
body.ltr .hero-btn { letter-spacing: 0.3px; }
</style>
