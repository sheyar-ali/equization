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
              <!-- Add Quiz Form -->
              <v-form class="forms" v-model="valid">
                <v-row>
                  <v-col md="7" cols="12">
                    <!-- Quiz Title Input -->
                    <v-text-field
                      outlined
                      type="text"
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
                      :items="categories"
                      multiple
                      :rules="[
                        selected(this.$t('addQuizPage.categoriesError')),
                      ]"
                      :label="this.$t('addQuizPage.categoriesLabel')"
                      outlined
                      prepend-inner-icon="mdi-tag-text-outline"
                      required
                    ></v-select>
                    <!-- Quiz Explanation Input -->
                    <v-text-field
                      outlined
                      type="text"
                      :label="this.$t('addQuizPage.breifExplanation')"
                      :rules="[
                        required($t('addQuizPage.breifExplanationError')),
                        minLength($t('addQuizPage.breifExplanationError'), 30),
                      ]"
                      prepend-inner-icon="mdi-text-short"
                      required
                    ></v-text-field>
                    <!-- Quiz Detailed Explanation -->
                    <v-textarea
                      outlined
                      :label="this.$t('addQuizPage.detailedExplanation')"
                      prepend-inner-icon="mdi-text-subject"
                    >
                    </v-textarea>
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
                      :items="items"
                      :rules="[
                        selected(this.$t('addQuizPage.selectErrorText')),
                      ]"
                      :label="this.$t('addQuizPage.quizLang')"
                      outlined
                      prepend-inner-icon="mdi-translate"
                      required
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
      show1: false,
      file: null,
      imageUrl: null,
      // Quiz Languages 
      items: ["العربية", "English", "Français", "Turkçe"],
      // Categories Data For The Quiz Type Input
      categories: [
        this.$t("categoriesNames.publicInfoCategory"),
        this.$t("categoriesNames.languagesCategory"),
        this.$t("categoriesNames.educationCategory"),
        this.$t("categoriesNames.scienceCategory"),
        this.$t("categoriesNames.historyCategory"),
        this.$t("categoriesNames.physicsCategory"),
        this.$t("categoriesNames.artsCategory"),
        this.$t("categoriesNames.chemistryCategory"),
        this.$t("categoriesNames.mathematicsCategory"),
        this.$t("categoriesNames.sportCategory"),
        this.$t("categoriesNames.informationCategory"),
      ],
      visible: true,
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
  methods: {
    // Change Quiz Image Function
    onFileChange() {
      if (this.file) {
        let reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result;
        };
        reader.readAsDataURL(this.file);
      }
    },
    // Remove Quiz Image Function
    clear() {
      this.file = null;
      this.imageUrl = "";
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
