<!-- Explore Page - Connected to API -->
<template>
  <section class="quizes-page explore overflow-hidden">
    <PageTitle :titleText="$t('quizesExplorePage.pageTitle')" />
    <section class="quizes">
      <v-container>
        <v-row class="quiz-categories flex-column">
          <!-- Search Box -->
          <v-col md="7" cols="12" class="mx-auto wow fadeIn">
            <div class="search-box">
              <v-form class="w-100 d-flex align-center" @submit.prevent="searchQuizzes">
                <v-text-field
                  class="search-box"
                  type="text"
                  :label="$t('quizesExplorePage.labelText')"
                  v-model="searchQuery"
                  solo flat
                  prepend-inner-icon="mdi-magnify"
                  @keyup.enter="searchQuizzes"
                ></v-text-field>
                <v-btn text class="white--text title" @click="searchQuizzes">
                  {{ $t("quizesExplorePage.buttonText") }}
                </v-btn>
              </v-form>
            </div>
          </v-col>

          <v-col cols="12 wow fadeIn">
            <div class="categories">
              <div class="categories-header d-flex justify-space-between align-center">
                <div class="d-flex align-center categories-header-title">
                  <h2 class="categories-title font-weight-bold">
                    {{ $t("quizesExplorePage.categoriesTitle") }}
                  </h2>
                  <nuxt-link :to="localePath('/categories')" class="font-weight-bold">
                    {{ $t("quizesExplorePage.categoriesLink") }}
                  </nuxt-link>
                </div>
                <div class="d-flex select-box">
                  <v-select
                    hide-details
                    v-model="sortBy"
                    :items="sortItems"
                    prepend-icon="mdi-filter-outline"
                    @change="fetchQuizzes"
                  ></v-select>
                </div>
              </div>
              <v-divider horizontal class="rounded"></v-divider>
              <!-- Categories Filter -->
              <div class="categories-box">
                <v-sheet class="mx-auto">
                  <v-slide-group v-model="selectedCategory" show-arrows>
                    <v-slide-item
                      v-for="cat in allCategories"
                      :key="cat._id"
                      v-slot="{ active, toggle }"
                    >
                      <v-chip
                        class="ma-2"
                        :color="active ? 'primary' : ''"
                        :text-color="active ? 'white' : ''"
                        @click="toggle(); filterByCategory(cat._id)"
                      >
                        {{ typeof cat.name === 'object' ? (cat.name.ar || cat.name.en) : cat.name }}
                        <span class="mr-1 font-weight-bold">({{ cat.quizCount || 0 }})</span>
                      </v-chip>
                    </v-slide-item>
                  </v-slide-group>
                </v-sheet>
              </div>
            </div>
          </v-col>

          <!-- Loading -->
          <v-row v-if="loading" class="justify-center my-8">
            <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
          </v-row>

          <!-- Quizzes from API -->
          <v-row v-else-if="quizes.length > 0" class="quizes-categories wow fadeIn">
            <QuizComponent
              v-for="(quiz, idx) in quizes"
              :key="quiz._id"
              :questLink="`/quiz?id=${quiz._id}`"
              :questNumbers="quiz.questions ? quiz.questions.length : quiz.questionCount || 0"
              :playersNumbers="quiz.statistics ? quiz.statistics.totalPlayers : 0"
              :quizTitle="quiz.title"
              :categories="formatCategories(quiz.categories)"
              :wowDelay="`${idx * 0.05}s`"
              :coverImage="quiz.coverImage"
            />
          </v-row>

          <!-- Empty state -->
          <v-col v-else cols="12" class="text-center py-10">
            <v-icon size="80" color="grey lighten-1">mdi-magnify-close</v-icon>
            <p class="title grey--text mt-4">لا توجد اختبارات تطابق بحثك</p>
            <v-btn color="primary" outlined @click="resetFilters">إعادة تعيين</v-btn>
          </v-col>

          <!-- Pagination -->
          <v-col cols="12" class="wow fadeIn" v-if="quizes.length > 0">
            <div class="d-flex justify-center align-center mt-4">
              <v-btn
                icon :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
              ><v-icon>mdi-chevron-right</v-icon></v-btn>
              <v-btn
                v-for="p in totalPages"
                :key="p"
                icon small
                :color="p === currentPage ? 'primary' : ''"
                @click="changePage(p)"
                class="mx-1"
              >{{ p }}</v-btn>
              <v-btn
                icon :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
              ><v-icon>mdi-chevron-left</v-icon></v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle    from "@/components/Shared-Components/PageTitle";
import QuizComponent from "@/components/Shared-Components/QuizComponent";

export default {
  layout: "form",
  head() {
    return { title: this.$t("quizesExplorePage.pageTitle") };
  },
  data() {
    return {
      loading:          true,
      quizes:           [],
      allCategories:    [],
      searchQuery:      "",
      selectedCategory: null,
      activeCategory:   null,
      sortBy:           null,
      currentPage:      1,
      totalPages:       1,
      perPage:          12,
    };
  },
  computed: {
    sortItems() {
      return [
        { text: this.$t("quizesExplorePage.selectBox.firstSelect"),  value: null          },
        { text: this.$t("quizesExplorePage.selectBox.secondSelect"), value: '-createdAt'  },
        { text: this.$t("quizesExplorePage.selectBox.thirdSelect"),  value: '-statistics.totalPlays' },
      ];
    },
  },
  async mounted() {
    await Promise.all([this.fetchCategories(), this.fetchQuizzes()]);
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await this.$axios.get('/categories');
        this.allCategories = res.data?.data || [];
      } catch (e) {
        console.error('Error fetching categories:', e.message);
      }
    },
    async fetchQuizzes() {
      try {
        this.loading = true;
        const params = {
          page:  this.currentPage,
          limit: this.perPage,
        };
        if (this.searchQuery)   params.search   = this.searchQuery;
        if (this.activeCategory) params.category = this.activeCategory;
        if (this.sortBy)         params.sort     = this.sortBy;

        const res = await this.$axios.get('/quizzes', { params });
        this.quizes     = res.data?.data || [];
        this.totalPages = res.data?.pagination?.pages || 1;
      } catch (e) {
        console.error('Error fetching quizzes:', e.message);
        this.quizes = [];
      } finally {
        this.loading = false;
      }
    },
    searchQuizzes() {
      this.currentPage = 1;
      this.fetchQuizzes();
    },
    filterByCategory(catId) {
      this.activeCategory = this.activeCategory === catId ? null : catId;
      this.currentPage    = 1;
      this.fetchQuizzes();
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchQuizzes();
    },
    resetFilters() {
      this.searchQuery      = "";
      this.activeCategory   = null;
      this.selectedCategory = null;
      this.sortBy           = null;
      this.currentPage      = 1;
      this.fetchQuizzes();
    },
    formatCategories(categories) {
      if (!categories || !categories.length) return [];
      return categories.map(cat => ({
        categoryName: typeof cat.name === 'object' ? (cat.name.ar || cat.name.en || '') : (cat.name || ''),
        categoryLink: `/quizes-cat?cat=${cat.slug || cat._id}`,
      }));
    },
  },
  components: { PageTitle, QuizComponent },
};
</script>

<style>
.explore .quizes { margin-top: 40px !important; }
.search-box { padding-left: 9px; padding-right: 15px; border-radius: 25px; }
.search-box.v-text-field.v-text-field--solo .v-input__control { min-height: 60px !important; }
.search-box .v-input__slot { margin-bottom: 0 !important; border-radius: 20px; }
.search-box i { margin-top: 3px; font-size: 28px !important; }
.search-box input { padding-right: 10px !important; }
.search-box label { right: 9px !important; font-size: 20px !important; overflow: visible !important; }
.search-box .v-text-field__details { display: none !important; }
.search-box button { background-color: #3a3798 !important; height: auto !important; padding: 3px 35px 4px !important; border-radius: 20px !important; }
.explore .categories { margin-bottom: 30px; }
.explore .categories-title { color: #3a3798; }
.explore .categories-header a { color: #ff5e94; font-size: 20px; margin-right: 15px; margin-top: 3px; }
.explore .categories-title, .explore .categories-header a { font-family: "Almarai" !important; }
.explore .select-box { width: 15%; border: 2px solid #ccc; border-radius: 10px; }
.select-box .v-select__selection.v-select__selection--comma { font-size: 16px !important; color: #777373 !important; }
.select-box .v-input__slot { min-height: 30px !important; }
.explore .categories hr { margin: 0.5rem 0 !important; border-top-width: 2px !important; }
.search-box, .search-box .v-input__slot { background-color: #eeeeee !important; }
.categories-box .v-card { border-radius: 15px !important; }
@media only screen and (max-width: 600px) {
  .search-box button.title { padding: 3px 20px 4px !important; font-size: 18px !important; }
  .explore .select-box { width: 47% !important; }
}
@media only screen and (min-width: 767px) and (max-width: 992px) {
  .explore .select-box { width: 25% !important; }
}
.ltr .search-box { padding-right: 9px !important; }
.ltr .search-box input { padding-left: 10px !important; padding-right: 0 !important; }
.ltr .search-box label { right: auto !important; left: 9px !important; }
.ltr .categories-header-title a { margin-left: 15px; margin-right: 0 !important; }
</style>
