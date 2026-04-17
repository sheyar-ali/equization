<!-- Start Of Add Quiz Page -->
<template>
  <section class="d-flex align-center justify-center page-section">
    <section class="account-section d-flex align-center mx-auto w-100">
      <v-container fluid>
        <v-row>
          <!-- Side Menu -->
          <SideMenu activeLink="create-quiz" />
          <!-- Account Quizes Content -->
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100">
              <!-- AccountHeader Component -->
              <AccountHeader
                :headerText="headerContent.headerText"
                :isActive="headerContent.isActive"
              />
              <!-- Alerts -->
              <v-alert v-if="successMsg" type="success" dismissible class="mx-4">{{ successMsg }}</v-alert>
              <v-alert v-if="errorMsg" type="error" dismissible class="mx-4">{{ errorMsg }}</v-alert>
              <!-- Add Quiz Form -->
              <v-form class="forms" v-model="valid" @submit.prevent="submitForm">
                <v-row>
                  <v-col md="7" cols="12">
                    <!-- Quiz Title Input -->
                    <v-text-field
                      outlined
                      type="text"
                      v-model="quizTitle"
                      :label="this.$t('addQuizPage.quizTitle')"
                      :rules="[
                        required($t('addQuizPage.quizTitle')),
                        minLength($t('addQuizPage.quizTitle'), 8),
                      ]"
                      prepend-inner-icon="mdi-format-text"
                    ></v-text-field>
                    <!-- Quiz Type Input -->
                    <v-select
                      class="multi-selections"
                      v-model="selectedCategories"
                      :items="categoryItems"
                      item-text="label"
                      item-value="value"
                      multiple
                      :rules="[
                        selected(this.$t('addQuizPage.categoriesError')),
                      ]"
                      :label="this.$t('addQuizPage.categoriesLabel')"
                      outlined
                      prepend-inner-icon="mdi-tag-text-outline"
                      :loading="loadingCategories"
                      required
                    ></v-select>
                    <!-- Quiz Explanation Input -->
                    <v-text-field
                      outlined
                      type="text"
                      v-model="quizDescription"
                      :label="this.$t('addQuizPage.breifExplanation')"
                      :rules="[
                        required($t('addQuizPage.breifExplanationError')),
                        minLength($t('addQuizPage.breifExplanationError'), 10),
                      ]"
                      prepend-inner-icon="mdi-text-short"
                      required
                    ></v-text-field>
                    <!-- Quiz Detailed Explanation -->
                    <v-textarea
                      outlined
                      v-model="quizFullDescription"
                      :label="this.$t('addQuizPage.detailedExplanation')"
                      prepend-inner-icon="mdi-text-subject"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col md="5" cols="12">
                    <div
                      class="quiz-creation-img w-100 d-flex align-center justify-center overflow-hidden position-relative"
                    >
                      <!-- Quiz Image -->
                      <img
                        class="w-100 h-100 added-img"
                        v-if="imageUrl"
                        :src="imageUrl"
                      />
                      <!-- Quiz Temporary Image -->
                      <i class="far fa-image" v-else></i>
                      <!-- Delete Quiz Image Icon -->
                      <span
                        v-if="imageUrl"
                        class="clear-img position-absolute d-flex align-center justify-center"
                        @click="clear"
                        style="bottom: 10px; left: 10px;"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </span>
                    </div>
                    <!-- Choose Image for the Quiz Input -->
                    <v-file-input
                      v-model="file"
                      class="file-input"
                      @change="onFileChange"
                      @click:clear="clear"
                      :show-size="1000"
                      :label="this.$t('addQuizPage.chooseImg')"
                      accept="image/*"
                      outlined
                      hide-details="auto"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                    />
                    <!-- Quiz Language Select -->
                    <v-select
                      :items="languageItems"
                      item-text="label"
                      item-value="value"
                      v-model="lang"
                      :rules="[
                        selected(this.$t('addQuizPage.selectErrorText')),
                      ]"
                      :label="this.$t('addQuizPage.quizLang')"
                      outlined
                      prepend-inner-icon="mdi-translate"
                      required
                    ></v-select>
                    <!-- Difficulty -->
                    <v-select
                      :items="difficultyItems"
                      item-text="label"
                      item-value="value"
                      v-model="difficulty"
                      label="مستوى الصعوبة"
                      outlined
                      prepend-inner-icon="mdi-signal"
                    ></v-select>
                    <!-- Choose Quiz Privacy -->
                    <v-radio-group v-model="visible" row class="radios-box">
                      <label class="ma-0 radios-label">
                        {{ $t("addQuizPage.privacyLabel") }}
                      </label>
                      <v-radio
                        :label="this.$t('addQuizPage.publicRadio')"
                        class="radio-label"
                        :value="true"
                      ></v-radio>
                      <v-radio
                        :label="this.$t('addQuizPage.privateRadio')"
                        class="radio-label"
                        :value="false"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col
                    cols="12"
                    md="7"
                    class="w-100 d-flex justify-content-end sub-btn-content"
                  >
                    <!-- Submit Button -->
                    <v-btn
                      class="white--text d-block title sub-btn"
                      width="30%"
                      height="auto"
                      :disabled="!valid"
                      :loading="saving"
                      type="submit"
                      color="primary"
                    >
                      {{ $t("addQuizPage.subBtn") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import SideMenu from "@/components/AccountComponents/SideMenu";
import AccountHeader from "@/components/AccountComponents/AccountHeader";
export default {
  layout: "account",
  head() {
    return {
      title: this.$t("addQuizPage.pageTitle"),
    };
  },
  data() {
    return {
      valid: false,
      saving: false,
      loadingCategories: false,
      file: null,
      imageUrl: null,
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
      // Required Validation
      required(errorName) {
        return (v) =>
          (v && v.length > 0) || `${this.$t("errorNameText")} ${errorName}`;
      },
      // Minlength Validation
      minLength(errorName, minNum) {
        return (v) =>
          (v && v.length >= minNum) ||
          `${errorName} ${this.$t("minLengthError")} ${minNum} ${this.$t(
            "characters"
          )}`;
      },
      // Email Validation that Check if Email Contains (@(Letter))
      emailRules(errorName) {
        return (v) =>
          /.@+./.test(v) || `${errorName} ${this.$t("emailRulesError")}`;
      },
      // Selected Validation For Select Only
      selected(errorName) {
        return (v) => (v && v.length > 0) || `${errorName}`;
      },
    };
  },
  computed: {
    // Header Content
    headerContent() {
      return {
        headerText: this.$t("addQuizPage.pageTitle"),
        isActive: true,
      };
    },
  },
  async mounted() {
    await this.fetchCategories();
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
    onFileChange() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = () => { this.imageUrl = reader.result; };
        reader.readAsDataURL(this.file);
      }
    },
    clear() {
      this.file = null;
      this.imageUrl = '';
    },
    async submitForm() {
      if (!this.valid) return;
      this.saving = true;
      this.successMsg = '';
      this.errorMsg = '';
      try {
        const payload = {
          title:               this.quizTitle,
          description:         this.quizDescription,
          detailedDescription: this.quizFullDescription,
          categories:          this.selectedCategories,
          language:            this.lang,
          difficulty:          this.difficulty,
          isPublic:            this.visible,
        };
        const res = await this.$axios.post('/quizzes', payload);
        const quiz = res.data?.data?.quiz || res.data?.data;
        this.successMsg = 'تم إنشاء الاختبار بنجاح!';
        if (quiz && quiz._id) {
          if (process.client) sessionStorage.setItem('currentQuizId', quiz._id);
          setTimeout(() => {
            this.$router.push(this.localePath(`/quizes/questions/add?quizId=${quiz._id}`));
          }, 1000);
        }
      } catch (e) {
        this.errorMsg = e.response?.data?.message || 'فشل في إنشاء الاختبار';
        console.error('Create quiz error:', e);
      } finally {
        this.saving = false;
      }
    },
  },
  components: {
    SideMenu,
    AccountHeader,
  },
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
img {
  height: 100% !important;
  width: 100% !important;
  object-fit: cover !important;
}
</style>
