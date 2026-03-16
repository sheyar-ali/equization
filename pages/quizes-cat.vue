<template>
  <section class="chemistry-categories">
    <!-- PageTitle Component -->
    <PageTitle :titleText="pageTitle" />

    <section class="chemistry-category">
      <v-container>
        <!-- Category Filter Chips -->
        <v-row v-if="categories.length" class="mb-4">
          <v-col cols="12">
            <v-chip-group v-model="selectedCategorySlug" active-class="primary--text" column>
              <v-chip value="" outlined>{{ $t('explore.allCategories') || 'الكل' }}</v-chip>
              <v-chip
                v-for="cat in categories"
                :key="cat._id"
                :value="cat.slug"
                outlined
              >
                {{ getCatName(cat) }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Loading -->
        <v-row v-if="loading">
          <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card" height="200" />
          </v-col>
        </v-row>

        <!-- Error -->
        <v-row v-else-if="error">
          <v-col cols="12" class="text-center py-10">
            <v-icon size="60" color="grey">mdi-alert-circle-outline</v-icon>
            <p class="title grey--text mt-4">{{ error }}</p>
            <v-btn outlined color="primary" @click="fetchQuizzes">إعادة المحاولة</v-btn>
          </v-col>
        </v-row>

        <!-- Quizzes Grid -->
        <v-row v-else-if="quizzes.length">
          <QuizComponent
            v-for="(quiz, index) in quizzes"
            :key="quiz._id"
            :questLink="localePath(`/quiz?id=${quiz._id}`)"
            :questNumbers="String(quiz.questions ? quiz.questions.length : 0)"
            :playersNumbers="String(quiz.statistics ? quiz.statistics.totalPlayers : 0)"
            :quizTitle="quiz.title"
            :categories="formatCategories(quiz.categories)"
            :wowDelay="delays[index % delays.length]"
            :coverImage="quiz.coverImage"
          />
        </v-row>

        <!-- Empty State -->
        <v-row v-else>
          <v-col cols="12" class="text-center py-10">
            <v-icon size="60" color="grey">mdi-magnify</v-icon>
            <p class="title grey--text mt-4">لا توجد اختبارات في هذه الفئة</p>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <v-row v-if="totalPages > 1">
          <v-col cols="12" class="d-flex justify-center">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="fetchQuizzes"
              circle
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import QuizComponent from "@/components/Shared-Components/QuizComponent";

export default {
  layout: "form",
  head() {
    return { title: this.pageTitle };
  },

  data() {
    return {
      quizzes: [],
      categories: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      limit: 12,
      selectedCategorySlug: '',
      delays: ["0s","0.1s",".2s",".3s",".4s",".5s",".4s",".45s",".5s",".55s",".6s",".66s"],
    };
  },

  computed: {
    pageTitle() {
      if (this.selectedCategorySlug) {
        const cat = this.categories.find(c => c.slug === this.selectedCategorySlug);
        return cat ? this.getCatName(cat) : this.$t('quizesCatPage.pageTitle');
      }
      return this.$t('quizesCatPage.pageTitle');
    }
  },

  watch: {
    selectedCategorySlug() {
      this.currentPage = 1;
      this.fetchQuizzes();
    }
  },

  async mounted() {
    await Promise.all([this.fetchCategories(), this.fetchQuizzes()]);
  },

  methods: {
    async fetchCategories() {
      try {
        const res = await this.$axios.get('/categories');
        this.categories = res.data?.data || [];
      } catch (e) {
        console.error('Failed to fetch categories:', e);
      }
    },

    async fetchQuizzes() {
      this.loading = true;
      this.error = null;
      try {
        const catFromRoute = this.$route.query.cat;
        const params = {
          page: this.currentPage,
          limit: this.limit,
          isPublic: 'true',
        };

        // Filter by category
        const activeCat = this.selectedCategorySlug || catFromRoute;
        if (activeCat) {
          // Find category ID by slug
          const cat = this.categories.find(c => c.slug === activeCat || c._id === activeCat);
          if (cat) {
            params.category = cat._id;
          } else {
            params.category = activeCat;
          }
        }

        const res = await this.$axios.get('/quizzes', { params });
        const data = res.data;

        if (data.success) {
          this.quizzes = data.data || [];
          if (data.pagination) {
            this.totalPages = data.pagination.pages || 1;
          }
        }
      } catch (e) {
        this.error = 'فشل في تحميل الاختبارات';
        console.error('Failed to fetch quizzes:', e);
      } finally {
        this.loading = false;
      }
    },

    getCatName(cat) {
      if (!cat || !cat.name) return '';
      if (typeof cat.name === 'object') {
        return cat.name.ar || cat.name.en || '';
      }
      return cat.name || '';
    },

    formatCategories(cats) {
      if (!cats || !cats.length) return [];
      return cats.map(cat => ({
        categoryName: this.getCatName(cat),
        categoryLink: this.localePath(`/quizes-cat?cat=${cat.slug || cat._id}`),
      }));
    },
  },

  components: { PageTitle, QuizComponent },
};
</script>

<style scoped>
.chemistry-category {
  margin-top: 50px;
}

@media only screen and (max-width: 600px) {
  .chemistry-category {
    margin-top: 30px !important;
  }
}
</style>
