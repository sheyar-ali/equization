<template>
  <!-- Home Page -->
  <section class="home-page">
    <!-- Home Section -->
    <section class="section align-center home d-flex text-white">
      <MenuComponent />
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
          <nuxt-link :to="localePath('/quizes/add')" class="wow zoomIn text-center text-white" data-wow-delay=".6s">
            {{ $t("homeSection.homeBtns.firstBtn") }}
          </nuxt-link>
          <nuxt-link :to="localePath('/join')" class="wow zoomIn text-center text-white" data-wow-delay=".8s">
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
.home {
  background: url("../assets/images/Home-Page-Images/home-pattern.png"),
    linear-gradient(67deg, #36399a, #4d2f91);
  border-bottom-left-radius: 280px;
}
.home-img { width: 45%; }
.home-img, .home-text { margin-bottom: 50px; }
.home-text { font-size: 34px; width: 77%; }
.btns, .num-content, .test-page { justify-content: center; }
.btns a { margin: 0 10px; transition: background-image 0.5s ease-in-out; }
.btns a, .platform a { padding: 7px 40px; font-size: 24px; font-family: "Almarai"; border-top-right-radius: 18px; border-top-left-radius: 18px; border-bottom-left-radius: 28.5px; border-bottom-right-radius: 28.5px; }
.home .btns a { background-image: linear-gradient(-4deg, rgba(254, 94, 147, 0.8), rgba(253, 75, 121, 0.8)); }
.home .btns a:hover { background-image: linear-gradient(176deg, rgba(254, 94, 147, 0.8), rgba(253, 75, 121, 0.8)); }
.numbers { padding: 155px 0 120px !important; }
.why-us { background-color: #effbfb; border-top-right-radius: 280px; }
.title-description { font-size: 19px; line-height: 32px; margin-bottom: 70px; color: #8d8cd1; font-family: "Almarai"; z-index: 1; }
.tests-page { justify-content: center; }
a.show { margin-top: 10px; background-color: #ff5e94; padding: 10px 25px; font-size: 25px; border-radius: 20px; }
a.show:hover img { transform: rotate(-90deg) translateY(-10px); }
a.show img { margin-right: 20px; width: 30px; height: 30px; filter: invert(1); transform: rotate(-90deg); transition: transform 0.3s ease-in-out; }
@media only screen and (max-width: 600px) {
  .home { border-bottom-left-radius: 175px !important; }
  .home-img { width: 75% !important; }
  .home-text { font-size: 26px !important; width: 100% !important; }
  .btns { flex-direction: column; }
  .btns a { width: 70%; margin: 7px auto !important; border-radius: 28.5px !important; }
  .home-text br { display: none; }
  .why-us { padding-top: 120px !important; border-top-right-radius: 175px !important; }
}
@media only screen and (min-width: 600px) and (max-width: 992px) {
  .why-us { padding-top: 120px !important; }
  .home-img { width: 53% !important; }
  .home-text { width: 95% !important; }
  .home-text br { display: none; }
}
body.ltr a.show img { margin-right: 0; transform: rotate(90deg) !important; }
body.ltr a.show:hover img { transform: translate(10px) rotate(90deg) !important; }
body.ltr a.show span { margin-right: 20px; }
</style>
