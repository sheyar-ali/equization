<!-- Start Of About Platform Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('howItWorksPage.title')" />
    <section class="about wow fadeIn">
      <v-container>
        <!-- Introduction -->
        <p class="text-justify">
          {{ $t("howItWorksPage.introduction") }}
        </p>

        <SectionTitle
          :TitleText="$t('howItWorksPage.quizControlHeader')"
          style="margin-bottom: -3rem"
        />

        <!-- steps -->
        <div
          class="about-img mx-auto overflow-hidden d-flex align-center justify-center"
        >
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/how-it-works/log-in.png"
              class="d-block"
              alt="test-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.steps.createAccount") }}
            </p>
          </div>
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/about-icons/test.png"
              class="d-block mr-4"
              alt="test-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.steps.createQuiz") }}
            </p>
          </div>
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/how-it-works/share.png"
              class="d-block"
              alt="computer-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.steps.shareQuiz") }}
            </p>
          </div>
          <div class="dash-box"></div>

          <!-- Mobile Screen Image -->
          <img
            src="@/assets/images/about-icons/m-worldwide.png"
            class="d-none triple-img"
            alt="m-worldwide-img"
          />
        </div>

        <!-- create account -->
        <h2>
          {{ $t("howItWorksPage.createAcoountTitle") }}
        </h2>

        <p class="text-justify">
          {{ $t("howItWorksPage.createAcoountParagraph") }}
        </p>

        <!-- create quiz -->
        <h2>
          {{ $t("howItWorksPage.CreateQuizTitle") }}
        </h2>

        <p class="text-justify">
          {{ $t("howItWorksPage.createQuizparagraph") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.createQuizparagraph2") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.createQuizparagraph3") }}
        </p>

        <p class="text-center font-weight-bold mt-8">
          {{ $t("howItWorksPage.questionTypesparagraph") }}
        </p>

        <div
          class="about-img mx-auto overflow-hidden d-flex align-center justify-center"
        >
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/how-it-works/immigration.png"
              class="d-block"
              alt="test-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.questionsTypes.first") }}
            </p>
          </div>
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/how-it-works/list.png"
              class="d-block"
              alt="test-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.questionsTypes.second") }}
            </p>
          </div>
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/how-it-works/to-do-list.png"
              class="d-block"
              alt="computer-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.questionsTypes.third") }}
            </p>
          </div>
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/how-it-works/decision-making.png"
              class="d-block"
              alt="computer-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.questionsTypes.forth") }}
            </p>
          </div>
          <div class="dash-box"></div>
        </div>

        <!-- share quiz -->
        <h2>
          {{ $t("howItWorksPage.shareQuizTitle") }}
        </h2>

        <p class="text-justify">
          {{ $t("howItWorksPage.shareQuizpargraph") }}
        </p>

        <SectionTitle
          :TitleText="$t('howItWorksPage.activitySectionHeader')"
          class="mt-16"
          style="margin-bottom: -1.5rem"
        />

        <p class="text-center">
          {{ $t("howItWorksPage.activitySectionIntro") }}
        </p>

        <div
          class="about-img mx-auto overflow-hidden d-flex align-center justify-center"
        >
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/how-it-works/bussiness-man.png"
              class="d-block"
              alt="test-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.patterns.single.name") }}
            </p>
          </div>
          <div class="dash-box"></div>
          <div class="img-box">
            <img
              src="@/assets/images/how-it-works/group.png"
              class="d-block"
              alt="test-img"
            />
            <p class="text-center mb-0 mt-4">
              {{ $t("howItWorksPage.patterns.multi.name") }}
            </p>
          </div>
          <div class="dash-box"></div>
        </div>

        <!-- single -->
        <h2>
          {{ $t("howItWorksPage.patterns.single.title") }}
        </h2>

        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.single.paragraph") }}
        </p>

        <!-- multi -->
        <h2>
          {{ $t("howItWorksPage.patterns.multi.title") }}
        </h2>

        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph") }}
        </p>

        <img
          src="@/assets/images/how-it-works/host.png"
          class="d-block mx-auto my-5 mw-100"
          alt="answer-img"
        />

        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph2") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph3") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph4") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph5") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph6") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph7") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph8") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph9") }}
        </p>
        <p class="text-justify">
          {{ $t("howItWorksPage.patterns.multi.paragraph10") }}
        </p>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import SectionTitle from "@/components/Home-Page-Components/SectionTitle.vue";
export default {
  name: "howitworks",
  layout: "form",
  head() {
    return {
      title: this.$t("howItWorksPage.title"),
    };
  },
  components: {
    PageTitle,
    SectionTitle,
  },
};
</script>

<style scoped>
.about {
  margin-top: 70px;
  padding: 30px;
  background-color: #effbfb;
  border-top-left-radius: 70px;
  border-bottom-right-radius: 70px;
}

h2 {
  font-size: 28px !important;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: #3a3798;
  font-weight: 600;
  text-align: right !important;
}

p {
  font-size: 22px !important;
  line-height: 35px;
}

p:first-of-type {
  margin-bottom: 60px;
}

.about-img {
  margin: 70px 0;
}

.about-img img {
  width: 70%;
  margin: 0 auto;
}

.img-box {
  background: #fff;
  padding: 2rem 1rem 1rem;
  border-radius: 1rem;
  width: 30%;
  max-width: 220px;
}

.img-box p {
  font-size: 18px !important;
  line-height: 25px;
}

.dash-box {
  width: 15%;
  margin: 0 5px;
  border-top: 2.5px dashed #94a9ac;
}

.ltr h2 {
  text-align: left !important;
}

@media only screen and (max-width: 767px) {
  .container {
    padding: 30px 0 !important;
  }

  .about {
    margin-top: 40px;
    padding: 15px 20px;
  }

  p:first-of-type {
    margin-bottom: 25px !important;
  }

  .about-img {
    margin: 30px 0 !important;
    flex-direction: column;
  }

  .dash-box {
    height: 20px;
    width: 0 !important;
    border: none !important;
    border-right: 2.5px dashed #94a9ac !important;
  }

  .img-box {
    padding: 1.5rem 0.5rem 0rem;
    min-width: 60%;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
}
</style>
