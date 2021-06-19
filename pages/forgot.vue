<!-- Start Of The Contact Us Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('resetPasswordSucceededPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row
          class="align-center justify-space-between flex-sm-column-reverse flex-md-row"
        >
          <v-col cols="12" md="6" class="form-container wow fadeIn">
            <p class="form-description text-center">
              {{ $t("resetPasswordPage.titleDescription") }}
            </p>
            <!-- Alert -->
            <v-alert type="error">
              {{ $t("errorAlertText") }}
            </v-alert>
            <!-- Forgot Form -->
            <v-form class="forms" v-model="valid">
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
              <!-- Submit Button -->
              <v-btn
                class="white--text d-block mx-auto title"
                width="30%"
                height="auto"
                :disabled="!valid"
              >
                {{ $t("resetPasswordPage.buttonText") }}
              </v-btn>
            </v-form>
            <FormDivider
              :DividerText="$t('resetPasswordSucceededPage.formDividerText')"
              :DividerLink="localePath('/signin')"
              :DividerLinkText="
                $t('resetPasswordSucceededPage.formDividerLink')
              "
            />
          </v-col>
          <v-divider vertical></v-divider>
          <!-- FormContent Component -->
          <FormContent
            :formTitle="$t('resetPasswordSucceededPage.formContentTitle')"
            :imgSrc="
              require('@/assets/images/forms-img/Forgot password-bro.png')
            "
            :imgAlt="'forgot-password-img'"
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
  name: "Reset-Password",
  layout: "form",
  head() {
    return {
      title: this.$t("resetPasswordSucceededPage.pageTitle"),
    };
  },
  data() {
    return {
      valid: false,
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
      // Name Valodation That Check if the Email Is Valid Containes (@g)
      emailRules(errorName) {
        return (v) =>
          /.@+./.test(v) || `${errorName} ${this.$t("emailRulesError")}`;
      },
    };
  },
  props: [
    "titleText",
    "formTitle",
    "formDescription",
    "imgSrc",
    "imgAlt",
    "alertText",
    "alertDescription",
    "link",
    "linkText",
    "DividerText",
    "DividerLink",
    "DividerLinkText",
  ],
  components: {
    PageTitle,
    FormDivider,
    FormContent,
  },
};
</script>

<style scoped>
.form-container {
  padding-bottom: 13px !important;
}

button {
  margin-bottom: 70px !important;
}
</style>
