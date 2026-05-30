<template>
  <v-container fluid class="pa-6">
    <h1 class="page-title mb-6">نظرة عامة</h1>

    <!-- Stats cards -->
    <v-row class="mb-6">
      <v-col v-for="card in statCards" :key="card.label" cols="12" sm="6" lg="3">
        <v-card class="stat-card rounded-lg" elevation="2">
          <v-card-text class="d-flex align-center pa-5">
            <v-avatar :color="card.color" size="56" class="ml-4">
              <v-icon dark size="28">{{ card.icon }}</v-icon>
            </v-avatar>
            <div>
              <div class="stat-number">{{ card.loading ? '…' : card.value }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent quizzes -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="rounded-lg" elevation="2">
          <v-card-title class="section-title">
            <v-icon left color="#6c63ff">mdi-help-box-multiple</v-icon>
            آخر الاختبارات
          </v-card-title>
          <v-divider />
          <v-data-table
            :headers="quizHeaders"
            :items="recentQuizzes"
            :loading="loadingQuizzes"
            hide-default-footer
            :items-per-page="5"
            dir="rtl"
          >
            <template #item.isPublic="{ item }">
              <v-chip x-small :color="item.isPublic ? 'teal' : 'grey'" dark>
                {{ item.isPublic ? 'عام' : 'خاص' }}
              </v-chip>
            </template>
            <template #item.statistics="{ item }">
              {{ item.statistics ? item.statistics.totalPlays : 0 }} لعبة
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Top categories -->
      <v-col cols="12" md="4">
        <v-card class="rounded-lg" elevation="2">
          <v-card-title class="section-title">
            <v-icon left color="#ff5e94">mdi-tag-multiple</v-icon>
            التصنيفات
          </v-card-title>
          <v-divider />
          <v-list dense>
            <v-list-item v-for="cat in categories" :key="cat._id" class="px-4">
              <v-list-item-avatar size="32" :color="cat.color || '#6c63ff'">
                <v-icon dark small>{{ cat.icon || 'mdi-tag' }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ getCatName(cat) }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip x-small color="#eef" text-color="#6c63ff">{{ cat.quizCount }}</v-chip>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="!categories.length">
              <v-list-item-title class="grey--text text-center">لا توجد تصنيفات بعد</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-card-actions class="px-4 pb-3">
            <v-btn text small color="#6c63ff" :to="localePath('/admin/categories')">
              إدارة التصنيفات
              <v-icon right small>mdi-arrow-left</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'admin',
  head() { return { title: 'لوحة التحكم — eQuization' }; },

  data() {
    return {
      stats:          { users: 0, quizzes: 0, plays: 0, categories: 0 },
      loadingStats:   true,
      recentQuizzes:  [],
      loadingQuizzes: true,
      categories:     [],

      quizHeaders: [
        { text: 'العنوان',   value: 'title',      align: 'right' },
        { text: 'الحالة',   value: 'isPublic',   align: 'center' },
        { text: 'المشاركات', value: 'statistics', align: 'center' },
      ],
    };
  },

  computed: {
    statCards() {
      return [
        { label: 'المستخدمون',  value: this.stats.users,      icon: 'mdi-account-group',     color: '#6c63ff', loading: this.loadingStats },
        { label: 'الاختبارات',  value: this.stats.quizzes,    icon: 'mdi-help-box-multiple',  color: '#ff5e94', loading: this.loadingStats },
        { label: 'المشاركات',   value: this.stats.plays,      icon: 'mdi-play-circle',        color: '#f7941d', loading: this.loadingStats },
        { label: 'التصنيفات',   value: this.stats.categories, icon: 'mdi-tag-multiple',       color: '#00bcd4', loading: this.loadingStats },
      ];
    },
  },

  async mounted() {
    await Promise.all([this.fetchStats(), this.fetchRecentQuizzes(), this.fetchCategories()]);
  },

  methods: {
    async fetchStats() {
      this.loadingStats = true;
      try {
        const [quizzesRes, catsRes] = await Promise.all([
          this.$axios.get('/quizzes?limit=1'),
          this.$axios.get('/categories'),
        ]);
        this.stats.quizzes    = quizzesRes.data?.pagination?.total || 0;
        this.stats.categories = catsRes.data?.data?.categories?.length || 0;
      } catch (e) { /* silent */ }
      finally { this.loadingStats = false; }
    },

    async fetchRecentQuizzes() {
      this.loadingQuizzes = true;
      try {
        const res = await this.$axios.get('/quizzes?limit=5&sort=-createdAt');
        this.recentQuizzes = res.data?.data || [];
      } catch (e) { /* silent */ }
      finally { this.loadingQuizzes = false; }
    },

    async fetchCategories() {
      try {
        const res = await this.$axios.get('/categories');
        this.categories = res.data?.data?.categories || [];
      } catch (e) { /* silent */ }
    },

    getCatName(cat) {
      if (!cat.name) return '';
      if (typeof cat.name === 'string') return cat.name;
      return cat.name.ar || cat.name.en || '';
    },
  },
};
</script>

<style scoped>
.page-title    { font-size: 26px; color: #1e1b4b; font-family: 'Cairo'; font-weight: 700; }
.section-title { font-size: 17px; color: #1e1b4b; font-family: 'Cairo'; font-weight: 700; }
.stat-card     { border-right: 4px solid #6c63ff; }
.stat-number   { font-size: 28px; font-weight: 700; color: #1e1b4b; line-height: 1.1; }
.stat-label    { font-size: 13px; color: #75769a; font-family: 'Cairo'; }
</style>
