<!-- Start Of The Account Settings Page -->
<template>
  <section class="d-flex align-center justify-center page-section">
    <section class="account-section d-flex align-center mx-auto w-100">
      <v-container fluid>
        <v-row>
          <!-- Side Menu -->
          <SideMenu activeLink="account-settings" />
          <!-- Account Quizes Content -->
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100">
              <div class="account-header">
                <div
                  class="account-header-content d-flex justify-space-between align-center"
                >
                  <!-- Page Header -->
                  <h2 class="font-weight-bold">
                    {{ headerContent.headerText }}
                  </h2>
                  <!-- Delete The Accout Button -->
                  <v-btn text @click="deleteQuiz = true">
                    <v-icon>
                      mdi-trash-can-outline
                    </v-icon>
                    <span>
                      {{ headerContent.backText }}
                    </span>
                  </v-btn>
                </div>
                <v-divider horizontal class="rounded"></v-divider>
              </div>
              <!-- Account Settings Form -->
              <v-form class="forms" v-model="valid">
                <v-row>
                  <v-col md="7" cols="12">
                    <!-- Username Input -->
                    <v-text-field
                      outlined
                      :value="username"
                      :label="$t('createAccountPage.inputText')"
                      :rules="[
                        required($t('createAccountPage.inputText')),
                        minLength($t('createAccountPage.inputText'), 8),
                      ]"
                      required
                      prepend-inner-icon="mdi-account"
                    ></v-text-field>
                    <!-- Email Input -->
                    <v-text-field
                      outlined
                      type="email"
                      :value="email"
                      :label="$t('loginPage.emailInputText')"
                      :rules="[
                        required($t('loginPage.emailInputText')),
                        minLength($t('loginPage.emailInputText'), 8),
                        emailRules($t('loginPage.emailInputText')),
                      ]"
                      required
                      prepend-inner-icon="mdi-email"
                    ></v-text-field>
                    <!-- Current Password Input -->
                    <v-text-field
                      outlined
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      :rules="[
                        required($t('loginPage.passwordInputText')),
                        minLength($t('loginPage.passwordInputText'), 8),
                      ]"
                      :label="$t('profilePage.currentPassword')"
                      required
                      prepend-inner-icon="mdi-lock"
                      @click:append="show1 = !show1"
                    >
                    </v-text-field>
                    <!-- New Password Input -->
                    <v-text-field
                      outlined
                      v-model="password"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      :rules="[
                        required($t('loginPage.passwordInputText')),
                        minLength($t('loginPage.passwordInputText'), 8),
                      ]"
                      :label="$t('profilePage.newPassword')"
                      required
                      prepend-inner-icon="mdi-lock"
                      @click:append="show2 = !show2"
                    >
                    </v-text-field>
                    <!-- Confirm New Password Input -->
                    <v-text-field
                      v-model="passwordConfirmation"
                      :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                      outlined
                      :type="show3 ? 'text' : 'password'"
                      :rules="passwordRules"
                      :label="$t('profilePage.confirmNewPassword')"
                      required
                      prepend-inner-icon="mdi-lock"
                      @click:append="show3 = !show3"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col md="5" cols="12">
                    <div
                      class="quiz-creation-img w-100 d-flex align-center justify-center overflow-hidden"
                    >
                      <!-- User Profile Image -->
                      <img class="added-img" v-if="imageUrl" :src="imageUrl" />
                      <!-- Temporary Image If There is no Image For The User -->
                      <img
                        class="temporay-img"
                        v-else
                        src="@/assets/images/account-images/profile-img.png"
                      />
                    </div>
                    <!-- Choose Image Input File -->
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
                      {{ $t("profilePage.subBtn") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>

            <!-- delete dialog -->
            <v-dialog v-model="deleteQuiz" max-width="550px">
              <v-card>
                <v-card-title class="text-center font-weight-bold d-block">
                  {{ $t("profilePage.backText") }}
                </v-card-title>
                <v-divider></v-divider>
                <p class="text-center mt-5 h5">
                  {{ $t("profilePage.deleteDialogText") }}
                </p>
                <v-row class="px-10 pt-2 pb-5">
                  <v-col class="pa-2 d-flex align-center justify-center">
                    <!-- Confirm Delete Button In The Dialog -->
                    <v-btn
                      outlined
                      color="white"
                      class="w-100"
                      style="height: 50px; min-width: 150px !important; width: auto !important; background-color: #ff5e94; border: none !important; font-size: 18px; border-radius: 10px;"
                    >
                      <v-icon class="mx-2">
                        mdi-trash-can-outline
                      </v-icon>
                      <span style="font-family: 'Almarai'">
                        {{ $t("profilePage.backText") }}
                      </span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-dialog>
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
      title: this.$t("profilePage.pageTitle"),
    };
  },
  data() {
    return {
      valid: false,
      file: null,
      imageUrl: null,
      valid: false,
      show1: false,
      show2: false,
      show3: false,
      deleteQuiz: false,
      password: "",
      passwordConfirmation: "",
      // Password Validation
      passwordRules: [
        // Check if password in input
        (password) => !!password || this.$t("passwordErrorText"),
        // Make sure name is less than 10 char
        (password) => password.length >= 8 || this.$t("passwordLength"),
        (passwordConfirmation) =>
          passwordConfirmation === this.password || this.$t("matchPassword"),
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
      // Email Input Validation Check If Email Contains (@(Letter))
      emailRules(errorName) {
        return (v) =>
          /.@+./.test(v) || `${errorName} ${this.$t("emailRulesError")}`;
      },
      // Data For The User
      username: "محمد الإسكندراني",
      email: "mohamedAleskandrany@gmail.com",
    };
  },
  computed: {
    // Header Content
    headerContent() {
      return {
        headerText: this.$t("profilePage.pageTitle"),
        backLink: "/",
        backText: this.$t("profilePage.backText"),
        isActive: true,
      };
    },
  },
  methods: {
    // Uploading Image Function
    onFileChange() {
      if (this.file) {
        let reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result;
        };
        reader.readAsDataURL(this.file);
      }
    },
    // Delete The Image and Return to the Default Function
    clear() {
      this.file = null;
      this.imageUrl = "";
    },
  },
  components: {
    SideMenu,
  },
};
</script>

<style scoped>
.account-section-content .sub-btn-content {
  margin-top: -2px !important;
}

.account-section-content .quiz-creation-img {
  height: 314px !important;
}

.temporay-img,
.added-img {
  height: 280px;
  width: 280px;
  object-fit: contain;
  border-radius: 100%;
}

.account-header-content h2 {
  color: #a4abbb;
}

.account-header-content button {
  padding: 20px 10px !important;
  background-color: #ffeff4 !important;
  color: #ff5e94 !important;
  font-family: "Almarai" !important;
  font-weight: 600;
  letter-spacing: 0 !important;
  border-radius: 20px;
}

.account-header-content button i {
  color: #ff5e94 !important;
  font-size: 20px !important;
}

@media only screen and (max-width: 600px) {
  .account-header-content {
    flex-wrap: wrap !important;
  }

  .account-header-content h2 {
    font-size: 25px !important;
  }

  .account-header-content button,
  .account-header-content h2 {
    margin-top: 10px;
  }
}
</style>
