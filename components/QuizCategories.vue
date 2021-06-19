<template>
  <v-slide-group v-model="model" mandatory show-arrows>
    <v-slide-item
      v-for="category in categories"
      :key="category.id"
      v-slot="{ toggle, active }"
      class="overflow-hidden"
    >
      <v-card
        flat
        class="ma-2 d-flex align-center"
        :style="
          active ? `border: 2px solid #aeafe4` : `border: 2px solid transparent`
        "
        height="155"
        width="134.5"
        @click="toggle"
      >
        <v-row class="fill-height flex-column" align="center" justify="center">
          <img
            :src="category.imgSrc"
            class="d-block mx-auto"
            :alt="category.imgAlt"
          />
          <p class="category-name text-center font-weight-bold">
            {{ category.categoryName }}
          </p>
        </v-row>
      </v-card>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  name: "QuizCategories",
  data() {
    return {
      model: "",
      categories: [
        {
          id: 1,
          imgSrc: require("@/assets/images/categories-img/check-box.png"),
          imgAlt: "All Categories",
          categoryName: this.$t("categoriesNames.allCategories"),
        },
        {
          id: 2,
          imgSrc: require("@/assets/images/categories-img/global.png"),
          imgAlt: "Global Information Categories",
          categoryName: this.$t("categoriesNames.publicInfoCategory"),
        },
        {
          id: 3,
          imgSrc: require("@/assets/images/categories-img/languages.png"),
          imgAlt: "Foriegn Languages Categories",
          categoryName: this.$t("categoriesNames.languagesCategory"),
        },
        {
          id: 4,
          imgSrc: require("@/assets/images/categories-img/education.png"),
          imgAlt: "Education Categories",
          categoryName: this.$t("categoriesNames.educationCategory"),
        },
        {
          id: 5,
          imgSrc: require("@/assets/images/categories-img/atom.png"),
          imgAlt: "Sciencs Categories",
          categoryName: this.$t("categoriesNames.scienceCategory"),
        },
        {
          id: 6,
          imgSrc: require("@/assets/images/categories-img/ancient-scroll.png"),
          imgAlt: "History Categories",
          categoryName: this.$t("categoriesNames.historyCategory"),
        },
        {
          id: 7,
          imgSrc: require("@/assets/images/categories-img/pendulum.png"),
          imgAlt: "Physics Categories",
          categoryName: this.$t("categoriesNames.physicsCategory"),
        },
        {
          id: 8,
          imgSrc: require("@/assets/images/categories-img/tools.png"),
          imgAlt: "Arts Categories",
          categoryName: this.$t("categoriesNames.artsCategory"),
        },
        {
          id: 9,
          imgSrc: require("@/assets/images/categories-img/flask.png"),
          imgAlt: "Chemistry Categories",
          categoryName: this.$t("categoriesNames.chemistryCategory"),
        },
        {
          id: 10,
          imgSrc: require("@/assets/images/categories-img/mathematics.png"),
          imgAlt: "Mathematics Categories",
          categoryName: this.$t("categoriesNames.mathematicsCategory"),
        },
        {
          id: 11,
          imgSrc: require("@/assets/images/categories-img/fitness.png"),
          imgAlt: "Sport Categories",
          categoryName: this.$t("categoriesNames.sportCategory"),
        },
        {
          id: 12,
          imgSrc: require("@/assets/images/categories-img/global-network.png"),
          imgAlt: "Information Categories",
          categoryName: this.$t("categoriesNames.informationCategory"),
        },
      ],
    };
  },
};
</script>

<style scoped>
img {
  width: 45% !important;
  margin-bottom: 20px;
}

p {
  color: #3a3798;
  margin-bottom: 0 !important;
}

.v-card {
  background-color: #e6e7f0 !important;
}

/* Ltr Direction Style */
.ltr p.category-name {
  width: 80% !important;
}
</style>
