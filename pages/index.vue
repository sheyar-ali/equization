<template>
  <!-- Home Page -->
  <section class="home-page">
    <!-- Home Section -->
    <section class="section align-center home d-flex text-white">
      <!-- Menu Component -->
      <MenuComponent />

      <v-container class="home-content d-flex">
        <!-- Start Home Section Content -->

        <img
          src="../assets/images/Home-Page-Images/Eouization.png"
          class="wow zoomIn d-block home-img mx-auto"
          alt="home-img"
        />

        <p
          class="wow zoomIn home-text text-center font-weight-bold mx-auto"
          data-wow-delay=".3s"
        >
          {{ $t("homeSection.introText") }}
        </p>

        <v-row class="btns">
          <nuxt-link
            :to="localePath('/quizes/add')"
            class="wow zoomIn text-center text-white"
            data-wow-delay=".6s"
            >{{ $t("homeSection.homeBtns.firstBtn") }}</nuxt-link
          >
          <nuxt-link
            :to="localePath('/play-sub-domain')"
            class="wow zoomIn text-center text-white"
            data-wow-delay=".8s"
            >{{ $t("homeSection.homeBtns.secondBtn") }}</nuxt-link
          >
        </v-row>
      </v-container>
    </section>

    <!-- Section Numbers -->
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

        <p
          class="wow zoomIn title-description text-center font-weight-bold"
          data-wow-delay=".2s"
        >
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
    <!-- End Why Us Section -->
    <!-- Quizs Section -->
    <section tag="section" class="quizs align-center section">
      <v-container>
        <SectionTitle :TitleText="$t('quizesSection.quizesSectionTitle')" />

        <div class="row">
          <QuizComponent
            v-for="quiz in quizs"
            :key="quiz.id"
            :questLink="quiz.questLink"
            :questNumbers="quiz.questNumbers"
            :playersNumbers="quiz.playersNumbers"
            :quizTitle="quiz.quizTitle"
            :categories="quiz.categories"
            :wowDelay="quizsDelay[quiz.id - 1].wowDelay"
          />
        </div>

        <section class="tests-page d-flex wow zoomIn" data-wow-delay="0.5s">
          <nuxt-link
            :to="localePath('/explore')"
            class="show text-white d-flex"
          >
            <span>{{ $t("quizesSection.showQuizes") }}</span>
            <img
              src="@/assets/images/Home-Page-Images/up-arrow.png"
              class="arrow-img"
              alt="arrow-icon"
            />
          </nuxt-link>
        </section>
      </v-container>
    </section>

    <!-- How Section -->
    <HowSection />
  </section>
</template>

<script>
import MenuComponent from "@/components/Navbar-Components/MenuComponent.vue";
import NumbersComponent from "@/components/Home-Page-Components/NumbersComponent.vue";
import SectionTitle from "@/components/Home-Page-Components/SectionTitle.vue";
import WhyUsComponent from "@/components/Home-Page-Components/WhyUsComponent.vue";
import QuizComponent from "@/components/Shared-Components/QuizComponent";
import HowSection from "@/components/Home-Page-Components/HowSection.vue";
export default {
  name: "Home",
  layout: "default",
  head() {
    return {
      title: this.$t("homePageTitle"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Home Page In eQuization",
        },
      ],
    };
  },
  data() {
    return {
      // Delay Of The Animations of Numbers Section
      numbersDelay: [
        {
          wowClass: "wow zoomIn",
          wowDelay: ".1s",
        },
        {
          wowClass: "wow zoomIn",
          wowDelay: ".2s",
        },
        {
          wowClass: "wow zoomIn",
          wowDelay: ".3s",
        },
      ],
      // Delay Of The Features Box In The Features Section
      featuresDelay: [
        {
          wowDelay: "0s",
        },
        {
          wowDelay: ".1s",
        },
        {
          wowDelay: ".2s",
        },
        {
          wowDelay: ".3s",
        },
        {
          wowDelay: ".4s",
        },
        {
          wowDelay: ".5s",
        },
      ],
      // Delay Of The Quiz Box In The Quizes Section
      quizsDelay: [
        {
          id: 1,
          wowClass: "wow slideInRight",
          wowDelay: "0s",
        },
        {
          id: 2,
          wowClass: "wow zoomIn",
          wowDelay: "0.1s",
        },
        {
          id: 3,
          wowClass: "wow zoomIn",
          wowDelay: ".2s",
        },
        {
          id: 4,
          wowClass: "wow slideInLeft",
          wowDelay: ".3s",
        },
        {
          id: 5,
          wowClass: "wow slideInRight",
          wowDelay: ".4s",
        },
        {
          id: 6,
          wowClass: "wow zoomIn",
          wowDelay: ".5s",
        },
        {
          id: 7,
          wowClass: "wow zoomIn",
          wowDelay: ".6s",
        },
        {
          id: 8,
          wowClass: "wow slideInLeft",
          wowDelay: ".7s",
        },
      ],
    };
  },
  computed: {
    // The Data Of The Number Section
    numbers() {
      return [
        {
          id: 1,
          numImgSrc: require("@/assets/images/Home-Page-Images/quiz.png"),
          numImgAlt: "notes-img",
          titleText: this.$t("numbersSection.firstCardTitle"),
          numValue: "150",
        },
        {
          id: 2,
          numImgSrc: require("@/assets/images/Home-Page-Images/question.png"),
          numImgAlt: "questions-img",
          titleText: this.$t("numbersSection.secondCardTitle"),
          numValue: "2450",
        },
        {
          id: 3,
          numImgSrc: require("@/assets/images/Home-Page-Images/group.png"),
          numImgAlt: "players-img",
          titleText: this.$t("numbersSection.lastCardTitle"),
          numValue: "12154",
        },
      ];
    },
    // The Data Of The Features Section
    features() {
      return [
        {
          id: 1,
          featureTitle: this.$t("featuresSection.firstFeature.featureTitle"),
          featureImg: require("@/assets/images/Home-Page-Images/interactive.png"),
          featureImgAlt: "interactive-img",
          featureText: this.$t("featuresSection.firstFeature.featureText"),
        },
        {
          id: 2,
          featureTitle: this.$t("featuresSection.secondFeature.featureTitle"),
          featureImg: require("@/assets/images/Home-Page-Images/boxing-gloves.png"),
          featureImgAlt: "boxing-gloves-img",
          featureText: this.$t("featuresSection.secondFeature.featureText"),
        },
        {
          id: 3,
          featureTitle: this.$t("featuresSection.thirdFeature.featureTitle"),
          featureImg: require("@/assets/images/Home-Page-Images/graduate.png"),
          featureImgAlt: "graduate-img",
          featureText: this.$t("featuresSection.thirdFeature.featureText"),
        },
        {
          id: 4,
          featureTitle: this.$t("featuresSection.forthFeature.featureTitle"),
          featureImg: require("@/assets/images/Home-Page-Images/share.png"),
          featureImgAlt: "share-img",
          featureText: this.$t("featuresSection.forthFeature.featureText"),
        },
        {
          id: 5,
          featureTitle: this.$t("featuresSection.fifthFeature.featureTitle"),
          featureImg: require("@/assets/images/Home-Page-Images/clock.png"),
          featureImgAlt: "clock-img",
          featureText: this.$t("featuresSection.fifthFeature.featureText"),
        },
        {
          id: 6,
          featureTitle: this.$t("featuresSection.lastFeature.featureTitle"),
          featureImg: require("@/assets/images/Home-Page-Images/remote.png"),
          featureImgAlt: "remote-img",
          featureText: this.$t("featuresSection.lastFeature.featureText"),
        },
      ];
    },
    // The Data Of The Quiz Section
    quizs() {
      return [
        {
          id: 1,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الأول",
          categories: [
            {
              categoryName: "معلومات عامة",
              categoryLink: "/",
            },
            {
              categoryName: "كيمياء",
              categoryLink: "/",
            },
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 2,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الثانى",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "معلومات عامة",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 3,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الثالث",
          categories: [
            {
              categoryName: "تاريخ",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
            {
              categoryName: "فيزياء",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 4,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الرابع",
          categories: [
            {
              categoryName: "تعليم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 5,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الخامس",
          categories: [
            {
              categoryName: "تاريخ",
              categoryLink: "/",
            },
            {
              categoryName: "لغات أجنبية",
              categoryLink: "/",
            },
            {
              categoryName: "فيزياء",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 6,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار السادس",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
            {
              categoryName: "كمياء",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 7,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار السابع",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
          ],
        },
        {
          id: 8,
          questLink: "/quiz",
          questNumbers: "25",
          playersNumbers: "55",
          quizTitle: "عنوان الاختبار الثامن",
          categories: [
            {
              categoryName: "علوم",
              categoryLink: "/",
            },
            {
              categoryName: "رياضيات",
              categoryLink: "/",
            },
            {
              categoryName: "تاريخ",
              categoryLink: "/",
            },
          ],
        },
      ];
    },
  },
  components: {
    MenuComponent,
    NumbersComponent,
    SectionTitle,
    WhyUsComponent,
    QuizComponent,
    HowSection,
  },
};
</script>

<style scoped>
/* Start Of The Fixed Styles In Home Page */
section {
  padding: 70px 0;
  overflow: hidden;
}

.section {
  min-height: 100vh;
  justify-content: center;
  overflow: hidden;
}
/* End Of The Fixed Styles In The Home Page */

/* Start Home Section */
.home-page {
  padding: 0 !important;
}

.home {
  background: url("../assets/images/Home-Page-Images/home-pattern.png"),
    linear-gradient(67deg, #36399a, #4d2f91);
  border-bottom-left-radius: 280px;
}

.home-img {
  width: 45%;
}

.home-img,
.home-text {
  margin-bottom: 50px;
}

.home-text {
  font-size: 34px;
  width: 77%;
}

.btns,
.num-content,
.test-page {
  justify-content: center;
}

.btns a {
  margin: 0 10px;
  -webkit-transition: background-image 0.5s ease-in-out;
  -moz-transition: background-image 0.5s ease-in-out;
  -ms-transition: background-image 0.5s ease-in-out;
  -o-transition: background-image 0.5s ease-in-out;
  transition: background-image 0.5s ease-in-out;
}

.btns a,
.platform a {
  padding: 7px 40px;
  font-size: 24px;
  font-family: "Almarai";
  border-top-right-radius: 18px;
  border-top-left-radius: 18px;
  border-bottom-left-radius: 28.5px;
  border-bottom-right-radius: 28.5px;
}

.home .btns a {
  background-image: linear-gradient(
    -4deg,
    rgba(254, 94, 147, 0.8),
    rgba(253, 75, 121, 0.8)
  );
}

.home .btns a:hover {
  background-image: linear-gradient(
    176deg,
    rgba(254, 94, 147, 0.8),
    rgba(253, 75, 121, 0.8)
  );
}
/* End Home Section */

/* Start Numbers Section */
.numbers {
  padding: 155px 0 120px !important;
}
/* End Numbers Section */

/* Start Section Why Us */
.why-us {
  background-color: #effbfb;
  border-top-right-radius: 280px;
}

.title-description {
  font-size: 19px;
  line-height: 32px;
  margin-bottom: 70px;
  color: #8d8cd1;
  font-family: "Almarai";
  z-index: 1;
}
/* End Section Why Us */

/* Start Section Quizs */
.tests-page {
  justify-content: center;
}

a.show {
  margin-top: 10px;
  background-color: #ff5e94;
  padding: 10px 25px;
  font-size: 25px;
  border-radius: 20px;
}

a.show:hover img {
  -webkit-transform: rotate(-90deg) translateY(-10px);
  -moz-transform: rotate(-90deg) translateY(-10px);
  -ms-transform: rotate(-90deg) translateY(-10px);
  -o-transform: rotate(-90deg) translateY(-10px);
  transform: rotate(-90deg) translateY(-10px);
}

a.show img {
  margin-right: 20px;
  width: 30px;
  height: 30px;
  filter: invert(1);
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
  -webkit-transition: transform 0.3s ease-in-out;
  -moz-transition: transform 0.3s ease-in-out;
  -ms-transition: transform 0.3s ease-in-out;
  -o-transition: transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out;
}
/* End Section Quizs */

@media only screen and (max-width: 600px) {
  .home {
    border-bottom-left-radius: 175px !important;
  }

  .home-img {
    width: 75% !important;
  }

  .home-text {
    font-size: 26px !important;
    width: 100% !important;
  }

  .btns {
    flex-direction: column;
  }

  .btns a {
    width: 70%;
    margin: 7px auto !important;
    border-radius: 28.5px !important;
  }

  .ltr .home .btns a {
    font-size: 18px !important;
  }

  .home-text br {
    display: none;
  }

  .why-us {
    padding-top: 120px !important;
    border-top-right-radius: 175px !important;
  }

  .how {
    border-bottom-left-radius: 115px !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .why-us {
    padding-top: 120px !important;
  }

  .home-img {
    width: 53% !important;
  }

  .home-text {
    width: 95% !important;
  }

  .home-text br {
    display: none;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .home-img {
    width: 65% !important;
  }
}

/* Ltr Direction */
body.ltr a.show img {
  margin-right: 0;
  transform: rotate(90deg) !important;
}

body.ltr a.show:hover img {
  transform: translate(10px) rotate(90deg) !important;
}

body.ltr a.show span {
  margin-right: 20px;
}
</style>
