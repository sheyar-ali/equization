<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="page-title">إدارة التصنيفات</h1>
      <v-btn color="#6c63ff" dark depressed rounded @click="openCreate">
        <v-icon left>mdi-plus</v-icon>
        تصنيف جديد
      </v-btn>
    </div>

    <!-- Table -->
    <v-card class="rounded-lg" elevation="2">
      <v-data-table
        :headers="headers"
        :items="categories"
        :loading="loading"
        loading-text="جاري التحميل..."
        no-data-text="لا توجد تصنيفات — استخدم زر التصنيف الجديد أو شغّل seed-categories"
        dir="rtl"
      >
        <!-- Icon + colour preview -->
        <template #item.icon="{ item }">
          <v-avatar :color="item.color || '#6c63ff'" size="36">
            <v-icon dark small>{{ item.icon || 'mdi-tag' }}</v-icon>
          </v-avatar>
        </template>

        <template #item.name="{ item }">
          <span class="font-weight-bold">{{ getCatName(item) }}</span>
          <div class="caption grey--text">{{ item.slug }}</div>
        </template>

        <template #item.quizCount="{ item }">
          <v-chip small color="#eef" text-color="#6c63ff">{{ item.quizCount }}</v-chip>
        </template>

        <template #item.isActive="{ item }">
          <v-chip x-small :color="item.isActive ? 'teal' : 'grey'" dark>
            {{ item.isActive ? 'نشط' : 'مخفي' }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon small color="#6c63ff" @click="openEdit(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small color="red" @click="confirmDelete(item)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="dialog" max-width="520" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="dialog-title pa-5">
          {{ editId ? 'تعديل التصنيف' : 'تصنيف جديد' }}
          <v-spacer />
          <v-btn icon @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pt-5">
          <v-text-field v-model="form.nameAr"    label="الاسم بالعربية *"  outlined dense dir="rtl" />
          <v-text-field v-model="form.nameEn"    label="الاسم بالإنجليزية" outlined dense />
          <v-text-field v-model="form.slug"      label="المعرّف (slug) *"   outlined dense
            hint="أحرف صغيرة وأرقام وشرطات فقط — مثال: foreign-languages" persistent-hint />
          <v-text-field v-model="form.descAr"    label="الوصف بالعربية"    outlined dense dir="rtl" />
          <v-row class="mt-1">
            <v-col cols="6">
              <v-text-field v-model="form.icon"  label="أيقونة MDI"        outlined dense
                hint="مثال: mdi-translate" persistent-hint />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="form.color" label="اللون (hex)"       outlined dense
                hint="مثال: #6c63ff" persistent-hint />
            </v-col>
          </v-row>
          <!-- Colour / icon preview -->
          <div class="d-flex align-center mt-3">
            <v-avatar :color="form.color || '#6c63ff'" size="44" class="ml-3">
              <v-icon dark>{{ form.icon || 'mdi-tag' }}</v-icon>
            </v-avatar>
            <span class="font-weight-bold" :style="{ color: form.color || '#6c63ff' }">
              {{ form.nameAr || 'معاينة' }}
            </span>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn text @click="closeDialog">إلغاء</v-btn>
          <v-btn color="#6c63ff" dark depressed :loading="saving" @click="save">
            {{ editId ? 'حفظ التغييرات' : 'إنشاء' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-lg text-center pa-4">
        <v-icon size="56" color="red" class="mb-2">mdi-alert-circle</v-icon>
        <v-card-title class="justify-center">حذف التصنيف؟</v-card-title>
        <v-card-text>سيتم حذف «{{ deleteTarget ? getCatName(deleteTarget) : '' }}» نهائيًا.</v-card-text>
        <v-card-actions class="justify-center">
          <v-btn text @click="deleteDialog = false">إلغاء</v-btn>
          <v-btn color="red" dark depressed :loading="deleting" @click="doDelete">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snack.show" :color="snack.color" top right timeout="3000">
      {{ snack.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'admin',
  head() { return { title: 'التصنيفات — لوحة التحكم' }; },

  data() {
    return {
      categories:    [],
      loading:       true,
      dialog:        false,
      deleteDialog:  false,
      saving:        false,
      deleting:      false,
      editId:        null,
      deleteTarget:  null,
      form: { nameAr: '', nameEn: '', slug: '', descAr: '', icon: '', color: '' },
      snack: { show: false, text: '', color: 'success' },
      headers: [
        { text: '',           value: 'icon',      sortable: false, width: 60  },
        { text: 'الاسم',      value: 'name',      align: 'right'              },
        { text: 'عدد الاختبارات', value: 'quizCount', align: 'center'        },
        { text: 'الحالة',     value: 'isActive',  align: 'center'             },
        { text: 'الإجراءات',  value: 'actions',   sortable: false, align: 'center' },
      ],
    };
  },

  async mounted() {
    await this.fetchCategories();
  },

  methods: {
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await this.$axios.get('/categories');
        this.categories = res.data?.data?.categories || [];
      } catch (e) {
        this.showSnack('فشل تحميل التصنيفات', 'error');
      } finally {
        this.loading = false;
      }
    },

    openCreate() {
      this.editId = null;
      this.form   = { nameAr: '', nameEn: '', slug: '', descAr: '', icon: 'mdi-tag', color: '#363999' };
      this.dialog = true;
    },

    openEdit(cat) {
      this.editId = cat._id;
      this.form = {
        nameAr: typeof cat.name === 'object' ? (cat.name.ar || '') : cat.name,
        nameEn: typeof cat.name === 'object' ? (cat.name.en || '') : '',
        slug:   cat.slug,
        descAr: typeof cat.description === 'object' ? (cat.description.ar || '') : (cat.description || ''),
        icon:   cat.icon  || 'mdi-tag',
        color:  cat.color || '#363999',
      };
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.editId = null;
    },

    async save() {
      if (!this.form.nameAr || !this.form.slug) {
        return this.showSnack('الاسم بالعربية والمعرّف مطلوبان', 'error');
      }
      this.saving = true;
      const payload = {
        name:        { ar: this.form.nameAr, en: this.form.nameEn },
        slug:        this.form.slug,
        description: { ar: this.form.descAr },
        icon:        this.form.icon,
        color:       this.form.color,
      };
      try {
        if (this.editId) {
          await this.$axios.put(`/categories/${this.editId}`, payload);
          this.showSnack('تم تعديل التصنيف بنجاح');
        } else {
          await this.$axios.post('/categories', payload);
          this.showSnack('تم إنشاء التصنيف بنجاح');
        }
        this.closeDialog();
        await this.fetchCategories();
      } catch (e) {
        this.showSnack(e.response?.data?.message || 'حدث خطأ', 'error');
      } finally {
        this.saving = false;
      }
    },

    confirmDelete(cat) {
      this.deleteTarget = cat;
      this.deleteDialog = true;
    },

    async doDelete() {
      this.deleting = true;
      try {
        await this.$axios.delete(`/categories/${this.deleteTarget._id}`);
        this.showSnack('تم حذف التصنيف');
        this.deleteDialog = false;
        await this.fetchCategories();
      } catch (e) {
        this.showSnack(e.response?.data?.message || 'فشل الحذف', 'error');
      } finally {
        this.deleting = false;
      }
    },

    getCatName(cat) {
      if (!cat?.name) return '';
      if (typeof cat.name === 'string') return cat.name;
      return cat.name.ar || cat.name.en || '';
    },

    showSnack(text, color = 'success') {
      this.snack = { show: true, text, color };
    },
  },
};
</script>

<style scoped>
.page-title  { font-size: 24px; color: #1e1b4b; font-family: 'Cairo'; font-weight: 700; }
.dialog-title { font-size: 18px; color: #1e1b4b; font-family: 'Cairo'; font-weight: 700; }
</style>
