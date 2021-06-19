<!-- Start Of About Platform Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('featuresPage.title')" />
    <section class="about wow fadeIn">
      <v-container>
        <!-- Introduction -->

        <div
          class="feature my-10 d-flex align-center wow fadeIn"
          v-for="i in 11"
          :key="i"
        >
          <div class="order">
            <span>{{ i }}</span>
          </div>
          <p class="w-100 text-center">{{ $t(`featuresPage.f${i}`) }}</p>
        </div>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
export default {
  name: "features",
  layout: "form",
  head() {
    return {
      title: this.$t("featuresPage.title"),
    };
  },
  components: {
    PageTitle,
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

.feature {
  border-radius: 1rem;
  position: relative;
  padding: 18px 12px;
  padding-right: 45px;
  min-height: 100px;
}

.feature:nth-of-type(odd) {
  background: #fff;
  border: 2px solid #c3c1ff;
}

.feature:nth-of-type(even) {
  background: #3a3798;
}

.feature .order {
  font-size: 25px;
  border-radius: 5rem;
  color: #fff;
  background: #effbfb;
  height: 68px;
  width: 65px;
  position: absolute;
  right: -30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feature .order span {
  font-size: 25px;
  border-radius: 5rem;
  color: #fff;
  background: #ffc961;
  height: 60px;
  width: 60px;
  position: absolute;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

.feature p {
  font-size: 20px;
  line-height: 35px;
  margin: 0 !important;
}

.feature:nth-of-type(odd) p {
  color: #3a3798;
}

.feature:nth-of-type(even) p {
  color: #fff;
}

.ltr .feature {
  padding-right: 12px !important;
  padding-left: 45px !important;
}

.ltr .feature .order {
  right: unset !important;
  left: -30px !important;
}

.ltr .feature .order span {
  right: unset !important;
  left: 0 !important;
}

@media only screen and (max-width: 767px) {
  .container {
    padding: 0 !important;
  }

  .about {
    margin-top: 20px;
    padding: 15px 20px;
  }

  .feature,
  .ltr .feature {
    flex-direction: column;
    padding: 18px 12px !important;
    padding-top: 40px !important;
  }

  .feature .order,
  .ltr .feature .order {
    top: -30px !important;
    right: unset !important;
    left: unset !important;
    height: 63px;
    width: 66px;
  }

  .feature .order span,
  .ltr .feature .order span {
    top: 0 !important;
    right: unset !important;
    left: unset !important;
  }
}
</style>
