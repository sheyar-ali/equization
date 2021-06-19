<!-- Start Of Use Cases Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('useCases.title')" />
    <section class="use-cases">
      <v-container>
        <div class="row feature-row">
          <!-- WhyUsComponent -->
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
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import WhyUsComponent from "@/components/Home-Page-Components/WhyUsComponent";
export default {
  name: "Use-Cases",
  layout: "form",
  head() {
    return {
      title: this.$t("useCases.title"),
    };
  },
  data() {
    return {
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
    };
  },
  computed: {
    // The Data Of The Features Section
    features() {
      return [
        {
          id: 1,
          featureTitle: this.$t("useCases.firstFeature.featureTitle"),
          featureImg: require("@/assets/images/about-icons/school.png"),
          featureImgAlt: "school-img",
          featureText: this.$t("useCases.firstFeature.featureText"),
        },
        {
          id: 2,
          featureTitle: this.$t("useCases.secondFeature.featureTitle"),
          featureImg: require("@/assets/images/about-icons/online-lesson.png"),
          featureImgAlt: "online-lesson-img",
          featureText: this.$t("useCases.secondFeature.featureText"),
        },
        {
          id: 3,
          featureTitle: this.$t("useCases.thirdFeature.featureTitle"),
          featureImg: require("@/assets/images/about-icons/training.png"),
          featureImgAlt: "training-img",
          featureText: this.$t("useCases.thirdFeature.featureText"),
        },
        {
          id: 4,
          featureTitle: this.$t("useCases.forthFeature.featureTitle"),
          featureImg: require("@/assets/images/about-icons/meeting.png"),
          featureImgAlt: "meeting-img",
          featureText: this.$t("useCases.forthFeature.featureText"),
        },
        {
          id: 5,
          featureTitle: this.$t("useCases.fifthFeature.featureTitle"),
          featureImg: require("@/assets/images/about-icons/company.png"),
          featureImgAlt: "company-img",
          featureText: this.$t("useCases.fifthFeature.featureText"),
        },
        {
          id: 6,
          featureTitle: this.$t("useCases.lastFeature.featureTitle"),
          featureImg: require("@/assets/images/about-icons/friends.png"),
          featureImgAlt: "friends-img",
          featureText: this.$t("useCases.lastFeature.featureText"),
        },
      ];
    },
  },
  components: {
    PageTitle,
    WhyUsComponent,
  },
};
</script>

<style scoped>
.use-cases {
  margin-top: 70px;
  padding: 50px 0;
  background-color: #effbfb;
  border-top-left-radius: 70px;
  border-bottom-right-radius: 70px;
}

@media only screen and (max-width: 600px) {
  .use-cases {
    margin-top: 40px;
  }
}
</style>
