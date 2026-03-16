<!-- Edit Quiz Page - Dynamic from API -->
<template>
  <section class="d-flex align-center justify-center page-section">
    <section class="account-section d-flex align-center mx-auto w-100">
      <v-container fluid>
        <v-row>
          <!-- Side Menu -->
          <SideMenu activeLink="myQuizzes" />
          <!-- Account Quizes Content -->
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100">

              <!-- Loading -->
              <div v-if="loading" class="d-flex justify-center align-center" style="min-height:300px">
                <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
              </div>

              <template v-else>
                <!-- AccountHeader Component -->
                <AccountHeader
                  :headerText="headerContent.headerText"
                  :backLink="headerContent.backLink"
                  :backText="headerContent.backText"
                  :isActive="headerContent.isActive"
                />

                <!-- Success alert -->
                <v-alert v-if="successMsg" type="success" dismissible class="mx-4">{{ successMsg }}</v-alert>
                <!-- Error alert -->
                <v-alert v-if="errorMsg" type="error" dismissible class="mx-4">{{ errorMsg }}</v-alert>

                <!-- Edit Quiz Form -->
                <v-form class="forms" v-model="valid" @submit.prevent="submitForm">
                  <v-row>
                    <v-col md="7" cols="12">
                      <!-- Quiz Title Input -->
                      <v-text-field
                        outlined
                        type="text"
                        v-model="quizTitle"
                        :label="$t('addQuizPage.quizTitle')"
                        :rules="[
                          required($t('addQuizPage.quizTitle')),
                          minLength($t('addQuizPage.quizTitle'), 8),
                        ]"
                        prepend-inner-icon="mdi-format-text"
                      ></v-text-field>

                      <!-- Categories Select -->
                      <v-select
                        class="multi-selections"
                        v-model="selectedCategories"
                        :items="categoryItems"
                        item-text="label"
                        item-value="value"
                        multiple
                        :rules="[selected($t('addQuizPage.categoriesError'))]"
                        :label="$t('addQuizPage.categoriesLabel')"
                        outlined
                        prepend-inner-icon="mdi-tag-text-outline"
                        :loading="loadingCategories"
                      ></v-select>

                      <!-- Quiz Description -->
                      <v-text-field
                        outlined
                        type="text"
                        v-model="quizDescription"
                        :label="$t('addQuizPage.breifExplanation')"
                        :rules="[
                          required($t('addQuizPage.breifExplanationError')),
                          minLength($t('addQuizPage.breifExplanationError'), 10),
                        ]"
                        prepend-inner-icon="mdi-text-short"
                      ></v-text-field>

                      <!-- Quiz Detailed Description -->
                      <v-textarea
                        outlined
                        v-model="quizFullDescription"
                        :label="$t('addQuizPage.detailedExplanation')"
                        prepend-inner-icon="mdi-text-subject"
                        rows="4"
                      ></v-textarea>
                    </v-col>

                    <v-col md="5" cols="12">
                      <div class="quiz-creation-img w-100 d-flex align-center justify-center position-relative overflow-hidden">
                        <!-- Quiz Image -->
                        <img class="w-100 h-100 added-img" v-if="imageUrl" :src="imageUrl" />
                        <!-- Placeholder -->
                        <i class="far fa-image" v-else></i>
                        <!-- Delete Image Icon -->
                        <span
                          v-if="imageUrl"
                          class="clear-img position-absolute d-flex align-center justify-center"
                          @click="clearImage"
                          style="bottom:10px; left:10px"
                        >
                          <i class="fas fa-trash-alt"></i>
                        </span>
                      </div>

                      <!-- File Input -->
                      <v-file-input
                        v-model="file"
                        class="file-input"
                        @change="onFileChange"
                        @click:clear="clearImage"
                        :show-size="1000"
                        :label="$t('addQuizPage.chooseImg')"
                        accept="image/*"
                        outlined
                        hide-details="auto"
                        prepend-icon=""
                        prepend-inner-icon="mdi-camera"
                      />

                      <!-- Language Select -->
                      <v-select
                        :items="languageItems"
                        item-text="label"
                        item-value="value"
                        v-model="lang"
                        :rules="[selected($t('addQuizPage.selectErrorText'))]"
                        :label="$t('addQuizPage.quizLang')"
                        outlined
                        prepend-inner-icon="mdi-translate"
                        class="mt-4"
                      ></v-select>

                      <!-- Difficulty Select -->
                      <v-select
                        :items="difficultyItems"
                        item-text="label"
                        item-value="value"
                        v-model="difficulty"
                        label="مستوى الصعوبة"
                        outlined
                        prepend-inner-icon="mdi-signal"
                      ></v-select>

                      <!-- Privacy Radio -->
                      <v-radio-group v-model="visible" row class="radios-box">
                        <label class="ma-0 radios-label">{{ $t("addQuizPage.privacyLabel") }}</label>
                        <v-radio :label="$t('addQuizPage.publicRadio')"  class="radio-label" :value="true"></v-radio>
                        <v-radio :label="$t('addQuizPage.privateRadio')" class="radio-label" :value="false"></v-radio>
                      </v-radio-group>
                    </v-col>

                    <v-col cols="12" md="7" class="w-100 d-flex justify-content-end sub-btn-content">
                      <v-btn
                        class="white--text d-block title sub-btn"
                        width="30%"
                        height="auto"
                        :disabled="!valid"
                        :loading="saving"
                        type="submit"
                        color="primary"
                      >
                        {{ $t("editQuizPage.pageTitle") }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </template>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import SideMenu from "@/components/AccountComponents/SideMenu";
export default {
  layout: "account",
  head() {
    return {
      title: this.$t("editQuizPage.pageTitle"),
    };
  },
  data() {
    return {
      loading: true,
      saving: false,
      loadingCategories: false,
      valid: false,
      file: null,
      imageUrl: '',
      quizTitle: '',
      quizDescription: '',
      quizFullDescription: '',
      lang: 'ar',
      difficulty: 'medium',
      visible: true,
      selectedCategories: [],
      categoryItems: [],
      successMsg: '',
      errorMsg: '',
      languageItems: [
        { label: 'العربية',  value: 'ar' },
        { label: 'English',  value: 'en' },
        { label: 'Français', value: 'fr' },
        { label: 'Turkçe',   value: 'tr' },
      ],
      difficultyItems: [
        { label: 'سهل',    value: 'easy'   },
        { label: 'متوسط',  value: 'medium' },
        { label: 'صعب',    value: 'hard'   },
      ],
      // Validation functions
      required(errorName) {
        return (v) => (v && v.length > 0) || `${errorName} مطلوب`;
      },
      minLength(errorName, minNum) {
        return (v) => (v && v.length >= minNum) || `${errorName} يجب أن يكون على الأقل ${minNum} أحرف`;
      },
      selected(errorName) {
        return (v) => (v && v.length > 0) || errorName;
      },
    };
  },
  computed: {
    headerContent() {
      return {
        headerText: this.$t("editQuizPage.pageTitle"),
        backLink: "/quizes/my-quiz",
        backText: this.$t("AccountPage.AccountHeader.backText"),
        isActive: false,
      };
    },
  },
  async mounted() {
    await Promise.all([this.fetchCategories(), this.fetchQuiz()]);
  },
  methods: {
    async fetchCategories() {
      this.loadingCategories = true;
      try {
        const res = await this.$axios.get('/categories');
        const cats = res.data?.data?.categories || res.data?.data || [];
        this.categoryItems = cats.map(c => ({
          label: c.name && c.name[this.$i18n.locale] ? c.name[this.$i18n.locale] : (c.name?.ar || c.name),
          value: c._id,
        }));
      } catch (e) {
        console.error('Load categories error:', e);
      } finally {
        this.loadingCategories = false;
      }
    },
    async fetchQuiz() {
      this.loading = true;
      try {
        const quizId = this.$route.query.id
          || (process.client ? sessionStorage.getItem('currentQuizId') : null);

        if (!quizId) {
          this.loading = false;
          return;
        }

        const res  = await this.$axios.get(`/quizzes/${quizId}`);
        const quiz = res.data?.data?.quiz || res.data?.data;

        if (quiz) {
          this.quizTitle           = quiz.title || '';
          this.quizDescription     = quiz.description || '';
          this.quizFullDescription = quiz.detailedDescription || '';
          this.lang                = quiz.language || 'ar';
          this.difficulty          = quiz.difficulty || 'medium';
          this.visible             = quiz.isPublic !== false;
          this.imageUrl            = quiz.coverImage || '';
          this.selectedCategories  = (quiz.categories || []).map(c => c._id || c);
        }
      } catch (e) {
        console.error('Fetch quiz error:', e);
        this.errorMsg = 'فشل في تحميل بيانات الاختبار';
      } finally {
        this.loading = false;
      }
    },
    onFileChange() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = () => { this.imageUrl = reader.result; };
        reader.readAsDataURL(this.file);
      }
    },
    clearImage() {
      this.file = null;
      this.imageUrl = '';
    },
    async submitForm() {
      if (!this.valid) return;
      this.saving = true;
      this.successMsg = '';
      this.errorMsg = '';
      try {
        const quizId = this.$route.query.id
          || (process.client ? sessionStorage.getItem('currentQuizId') : null);

        if (!quizId) throw new Error('معرّف الاختبار غير موجود');

        const payload = {
          title:               this.quizTitle,
          description:         this.quizDescription,
          detailedDescription: this.quizFullDescription,
          categories:          this.selectedCategories,
          language:            this.lang,
          difficulty:          this.difficulty,
          isPublic:            this.visible,
          ...(this.imageUrl ? { coverImage: this.imageUrl } : {}),
        };

        await this.$axios.put(`/quizzes/${quizId}`, payload);
        this.successMsg = 'تم تحديث الاختبار بنجاح';
        setTimeout(() => {
          this.$router.push(this.localePath(`/quizes/my-quiz?id=${quizId}`));
        }, 1200);
      } catch (e) {
        this.errorMsg = e.response?.data?.message || 'فشل في تحديث الاختبار';
        console.error('Update quiz error:', e);
      } finally {
        this.saving = false;
      }
    },
  },
  components: { SideMenu },
};
</script>

<style scoped>
.account-section-content .file-input {
  margin: 30px 0 20px !important;
}

.fa-image {
  font-size: 170px;
  color: #a4abbb !important;
}

.quiz-creation-img {
  min-height: 220px;
  border: 2px dashed #ccc;
  border-radius: 8px;
}

img.added-img {
  height: 100% !important;
  width: 100% !important;
  object-fit: cover !important;
  border-radius: 8px;
}

.sub-btn {
  border-radius: 10px;
  min-height: 48px !important;
}
</style>
