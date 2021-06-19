<!-- Start Of The Signup Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('createAccountPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row
          class="align-center justify-space-between flex-sm-column-reverse flex-md-row"
        >
          <v-col cols="12" md="6" class="form-container wow fadeIn">
            <!-- Invalid Data Alert -->
            <v-alert type="error">
              {{ $t("errorAlertText") }}
            </v-alert>
            <!-- Signup Form -->
            <v-form class="forms" v-model="valid">
              <!-- Username Input -->
              <v-text-field
                outlined
                :label="$t('createAccountPage.inputText')"
                :rules="[
                  required($t('createAccountPage.inputText')),
                  minLength($t('createAccountPage.inputText'), 8),
                  nameRules($t('createAccountPage.inputText')),
                ]"
                required
                prepend-inner-icon="mdi-account"
              ></v-text-field>
              <!-- Email Input -->
              <v-text-field
                outlined
                type="email"
                :label="$t('loginPage.emailInputText')"
                :rules="[
                  required($t('loginPage.emailInputText')),
                  minLength($t('loginPage.emailInputText'), 8),
                  emailRules($t('loginPage.emailInputText')),
                ]"
                required
                prepend-inner-icon="mdi-email"
              ></v-text-field>
              <!-- Password Input -->
              <v-text-field
                outlined
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                :rules="[
                  required($t('loginPage.passwordInputText')),
                  minLength($t('loginPage.passwordInputText'), 8),
                ]"
                :label="$t('loginPage.passwordInputText')"
                required
                prepend-inner-icon="mdi-lock"
                @click:append="show1 = !show1"
              >
              </v-text-field>
              <!-- Confirm Password Input -->
              <v-text-field
                v-model="passwordConfirmation"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                outlined
                :type="show2 ? 'text' : 'password'"
                :rules="passwordRules"
                :label="$t('createAccountPage.confirmPasswordText')"
                required
                prepend-inner-icon="mdi-lock"
                @click:append="show2 = !show2"
              >
              </v-text-field>
              <!-- CheckBox -->
              <v-checkbox
                class="check-btn"
                v-model="checkbox"
                :rules="[(v) => !!v]"
                :label="$t('createAccountPage.checkBoxText')"
                required
              ></v-checkbox>
              <!-- Submit Button -->
              <v-btn
                class="white--text d-block mx-auto title"
                width="30%"
                height="auto"
                :disabled="!valid"
              >
                {{ $t("createAccountPage.buttonText") }}
              </v-btn>
              <!-- FormDivider Component -->
              <FormDivider
                :DividerText="$t('createAccountPage.formDividerText')"
                :DividerLink="localePath('/signin')"
                :DividerLinkText="$t('createAccountPage.formDividerLink')"
              />
            </v-form>
          </v-col>
          <v-divider vertical></v-divider>
          <!-- FormContent Component -->
          <FormContent
            :formTitle="$t('createAccountPage.formContentTitle')"
            :formDescription="$t('createAccountPage.formContentDescription')"
            :imgSrc="require('@/assets/images/forms-img/Add User-amico.png')"
            :imgAlt="'create-account-img'"
          />
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import FormDivider from "@/components/Shared-Components/FormDivider";
import FormContent from "@/components/Shared-Components/FormContent";
export default {
  name: "Create-Account",
  layout: "form",
  head() {
    return {
      title: this.$t("createAccountPage.pageTitle"),
    };
  },
  data() {
    return {
      valid: false,
      show1: false,
      show2: false,
      checkbox: false,
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
      // MinLength Validation
      minLength(errorName, minNum) {
        return (v) =>
          (v && v.length >= minNum) ||
          `${errorName} ${this.$t("minLengthError")} ${minNum} ${this.$t(
            "characters"
          )}`;
      },
      // Name Valodation That Check if the Name Is Valid (Don’t Contains Spaces)
      nameRules(errorName) {
        return (v) =>
          /. +./.test(v) == false ||
          `${errorName} ${this.$t("emailRulesError")}`;
      },
      // Email Valodation That Check if the Email Is Valid Containes (@g)
      emailRules(errorName) {
        return (v) =>
          /.@+./.test(v) || `${errorName} ${this.$t("emailRulesError")}`;
      },
    };
  },
  props: ["titleText", "formTitle", "formDescription", "imgSrc", "imgAlt"],
  components: {
    PageTitle,
    FormDivider,
    FormContent,
  },
};
</script>

<style scoped>
label {
  margin-left: 10px;
}
</style>
