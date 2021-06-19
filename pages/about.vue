<!-- Start Of About Platform Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('aboutPage.title')" />
    <section class="about wow fadeIn">
      <v-container>
        <!-- First title In The Page -->
        <p class="text-justify">
          {{ $t("aboutPage.firstHeader") }}
        </p>
        <!-- Second Title In The Page -->
        <p class="text-justify">
          {{ $t("aboutPage.secondHeader") }}
        </p>
        <!-- First Box Contains Images In The Page -->
        <div
          class="about-img mx-auto overflow-hidden d-flex align-center justify-center"
        >
          <img
            src="@/assets/images/about-icons/test.png"
            class="d-block"
            alt="test-img"
          />
          <div class="dash-box"></div>
          <img
            src="@/assets/images/about-icons/worldwide.png"
            class="d-block"
            alt="worldwide-img"
          />
          <div class="dash-box"></div>
          <img
            src="@/assets/images/about-icons/computer.png"
            class="d-block"
            alt="computer-img"
          />
          <!-- Mobile Screen Image -->
          <img
            src="@/assets/images/about-icons/m-worldwide.png"
            class="d-none triple-img"
            alt="m-worldwide-img"
          />
        </div>
        <!-- Third Title -->
        <p class="text-center">
          {{ $t("aboutPage.thirdHeader") }}
        </p>
        <!-- Last Box Contains Images In The Page -->
        <div class="about-img mx-auto d-flex align-center justify-center">
          <img
            src="@/assets/images/about-icons/reading.png"
            class="d-block"
            alt="reading-img"
          />
          <img
            src="@/assets/images/about-icons/competition.png"
            class="d-block"
            alt="competition-img"
          />
          <img
            src="@/assets/images/about-icons/open-book.png"
            class="d-block"
            alt="open-book-img"
          />
        </div>
        <p class="text-center">
          {{ $t("aboutPage.forthHeader") }}
        </p>
        <div class="about-img mx-auto d-flex align-center justify-center">
          <img
            src="@/assets/images/about-icons/student.png"
            class="d-block"
            alt="student-img"
          />
          <img
            src="@/assets/images/about-icons/united.png"
            class="d-block"
            alt="united-img"
          />
          <img
            src="@/assets/images/about-icons/teacher.png"
            class="d-block"
            alt="teacher-img"
          />
        </div>
        <!-- Last Title In The Page -->
        <p class="text-justify">
          {{ $t("aboutPage.lastHeader") }}
        </p>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
export default {
  name: "About",
  layout: "form",
  head() {
    return {
      title: this.$t("aboutPage.title"),
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

.about-img:nth-of-type(2),
.about-img:nth-of-type(3) {
  width: 55%;
}

.about-img:first-of-type img {
  width: 10%;
}

.about-img:nth-of-type(2) img:first-of-type,
.about-img:nth-of-type(3) img:first-of-type {
  transform: rotate(10deg);
}

.about-img:nth-of-type(2) img:nth-of-type(2),
.about-img:nth-of-type(3) img:nth-of-type(2) {
  margin: 0 13%;
}

.about-img:nth-of-type(2) img:last-of-type,
.about-img:nth-of-type(3) img:last-of-type {
  transform: rotate(-10deg);
}

.about-img:nth-of-type(2) img,
.about-img:nth-of-type(3) img {
  width: 16%;
}

.dash-box {
  width: 15%;
  margin: 0 5px;
  border-top: 2.5px dashed #94a9ac;
}

@media only screen and (max-width: 767px) {
  .about {
    margin-top: 40px;
    padding: 15px 20px;
  }

  p:first-of-type {
    margin-bottom: 25px !important;
  }

  .about-img {
    margin: 30px 0 !important;
  }

  .about-img:first-of-type img,
  .dash-box {
    display: none !important;
    width: 70% !important;
  }

  .about-img:first-of-type .triple-img {
    display: block !important;
  }

  .about-img:nth-of-type(2),
  .about-img:nth-of-type(3) {
    width: 100% !important;
  }

  .about-img:nth-of-type(2) img,
  .about-img:nth-of-type(3) img {
    width: 21% !important;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  .about-img:first-of-type img {
    width: 15% !important;
  }

  .about-img:nth-of-type(2) img,
  .about-img:nth-of-type(3) img {
    width: 25% !important;
  }
}

/* Ltr Direction Style */
.ltr .about-img:nth-of-type(2) img:first-of-type,
.ltr .about-img:nth-of-type(3) img:first-of-type {
  transform: rotate(-10deg);
}

.ltr .about-img:nth-of-type(2) img:last-of-type,
.ltr .about-img:nth-of-type(3) img:last-of-type {
  transform: rotate(10deg) !important;
}
</style>
