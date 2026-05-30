<template>
  <v-container fluid class="pa-6">
    <h1 class="page-title mb-6">إدارة الاختبارات</h1>

    <!-- Search + filters -->
    <v-card class="rounded-lg mb-4" elevation="1">
      <v-card-text class="py-3">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="search"
              outlined dense hide-details
              prepend-inner-icon="mdi-magnify"
              label="بحث في عنوان الاختبار"
              clearable @click:clear="onClear" @keyup.enter="fetchQuizzes"
              dir="rtl"
            />
          </v-col>
          <v-col cols="6" sm="3">
            <v-select
              v-model="filterPublic"
              :items="publicOptions"
              item-text="label" item-value="value"
              outlined dense hide-details label="الحالة"
              @change="fetchQuizzes"
            />
          </v-col>
          <v-col cols="6" sm="3">
            <v-btn depressed color="#6c63ff" dark block @click="fetchQuizzes" height="40">
              <v-icon left>mdi-filter</v-icon>
              تصفية
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="rounded-lg" elevation="2">
      <v-data-table
        :headers="headers"
        :items="quizzes"
        :loading="loading"
        :server-items-length="total"
        :options.sync="tableOptions"
        loading-text="جاري التحميل..."
        no-data-text="لا توجد اختبارات"
        dir="rtl"
        @update:options="fetchQuizzes"
      >
        <template #item.title="{ item }">
          <nuxt-link :to="localePath(`/quiz?id=${item._id}`)" class="quiz-link font-weight-bold">
            {{ item.title }}
          </nuxt-link>
          <div class="caption grey--text">{{ item.creator ? item.creator.username : '' }}</div>
        </template>

        <template #item.isPublic="{ item }">
          <v-chip x-small :color="item.isPublic ? 'teal' : 'grey'" dark>
            {{ item.isPublic ? 'عام' : 'خاص' }}
          </v-chip>
        </template>

        <template #item.plays="{ item }">
          {{ item.statistics ? item.statistics.totalPlays : 0 }}
        </template>

        <template #item.questions="{ item }">
          {{ item.questions ? item.questions.length : 0 }}
        </template>

        <template #item.createdAt="{ item }">
          <span class="caption">{{ formatDate(item.createdAt) }}</span>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon small color="#6c63ff" :to="localePath(`/quiz?id=${item._id}`)">
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
          <v-btn icon small color="red" @click="confirmDelete(item)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Delete confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-lg text-center pa-4">
        <v-icon size="56" color="red" class="mb-2">mdi-alert-circle</v-icon>
        <v-card-title class="justify-center">حذف الاختبار؟</v-card-title>
        <v-card-text>
          سيتم حذف «{{ deleteTarget ? deleteTarget.title : '' }}» وجميع أسئلته نهائيًا.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn text @click="deleteDialog = false">إلغاء</v-btn>
          <v-btn color="red" dark depressed :loading="deleting" @click="doDelete">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :color="snack.color" top right timeout="3000">
      {{ snack.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'admin',
  head() { return { title: 'الاختبارات — لوحة التحكم' }; },

  data() {
    return {
      quizzes:      [],
      total:        0,
      loading:      true,
      search:       '',
      filterPublic: 'all',
      tableOptions: { page: 1, itemsPerPage: 10 },
      deleteDialog: false,
      deleting:     false,
      deleteTarget: null,
      snack:        { show: false, text: '', color: 'success' },
      publicOptions: [
        { label: 'الكل',  value: 'all'   },
        { label: 'عام',   value: 'true'  },
        { label: 'خاص',   value: 'false' },
      ],
      headers: [
        { text: 'العنوان',        value: 'title',     align: 'right'  },
        { text: 'الحالة',         value: 'isPublic',  align: 'center' },
        { text: 'الأسئلة',        value: 'questions', align: 'center' },
        { text: 'المشاركات',      value: 'plays',     align: 'center' },
        { text: 'تاريخ الإنشاء',  value: 'createdAt', align: 'center' },
        { text: 'إجراءات',        value: 'actions', sortable: false, align: 'center' },
      ],
    };
  },

  methods: {
    async fetchQuizzes() {
      this.loading = true;
      try {
        const { page, itemsPerPage } = this.tableOptions;
        const params = new URLSearchParams({ page, limit: itemsPerPage });
        if (this.search)                           params.append('search',   this.search);
        if (this.filterPublic && this.filterPublic !== 'all')
          params.append('isPublic', this.filterPublic);

        const res = await this.$axios.get(`/quizzes?${params}`);
        this.quizzes = res.data?.data || [];
        this.total   = res.data?.pagination?.total || this.quizzes.length;
      } catch (e) {
        this.showSnack('فشل تحميل الاختبارات', 'error');
      } finally {
        this.loading = false;
      }
    },

    onClear() { this.search = ''; this.fetchQuizzes(); },

    confirmDelete(quiz) {
      this.deleteTarget = quiz;
      this.deleteDialog = true;
    },

    async doDelete() {
      this.deleting = true;
      try {
        await this.$axios.delete(`/quizzes/${this.deleteTarget._id}`);
        this.showSnack('تم حذف الاختبار');
        this.deleteDialog = false;
        await this.fetchQuizzes();
      } catch (e) {
        this.showSnack(e.response?.data?.message || 'فشل الحذف', 'error');
      } finally {
        this.deleting = false;
      }
    },

    formatDate(d) {
      return d ? new Date(d).toLocaleDateString('ar-EG') : '';
    },

    showSnack(text, color = 'success') {
      this.snack = { show: true, text, color };
    },
  },
};
</script>

<style scoped>
.page-title { font-size: 24px; color: #1e1b4b; font-family: 'Cairo'; font-weight: 700; }
.quiz-link  { color: #6c63ff; text-decoration: none; }
.quiz-link:hover { text-decoration: underline; }
</style>
