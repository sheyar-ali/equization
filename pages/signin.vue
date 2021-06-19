<!-- Start Of The Signin Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('loginPage.loginPageTitle')" />
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
            <!-- Signin Form -->
            <v-form class="forms" v-model="valid">
              <!-- Email Input -->
              <v-text-field
                outlined
                type="email"
                :label="$t('loginPage.emailInputText')"
                :rules="[
                  required($t('loginPage.emailInputText')),
                  emailRules($t('loginPage.emailInputText')),
                  minLength($t('loginPage.emailInputText'), 8),
                ]"
                required
                prepend-inner-icon="mdi-email"
              ></v-text-field>
              <!-- Email Password Input -->
              <v-text-field
                outlined
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                :label="$t('loginPage.passwordInputText')"
                :rules="[
                  required($t('loginPage.passwordInputText')),
                  minLength($t('loginPage.passwordInputText'), 8),
                ]"
                required
                prepend-inner-icon="mdi-lock"
                @click:append="show1 = !show1"
              >
              </v-text-field>
              <!-- Submit Button -->
              <v-btn
                class="white--text d-block mx-auto title"
                width="30%"
                height="auto"
                :disabled="!valid"
              >
                {{ $t("loginPage.buttonText") }}
              </v-btn>
              <div class="reset-btn d-flex w-100 justify-center">
                <!-- Forgot Page Link -->
                <nuxt-link
                  :to="localePath('/forgot')"
                  class="title text-center d-inline-block"
                >
                  <span>{{ $t("loginPage.forgetPasswordText") }}</span>
                </nuxt-link>
              </div>
              <!-- FormDivider Component -->
              <FormDivider
                :DividerText="$t('loginPage.formDividerText')"
                :DividerLink="localePath('/signup')"
                :DividerLinkText="$t('loginPage.formDividerLink')"
              />
            </v-form>
          </v-col>
          <v-divider vertical></v-divider>
          <!-- FormContent Component -->
          <FormContent
            :formTitle="$t('loginPage.loginPageTitle')"
            :imgSrc="
              require('@/assets/images/forms-img/Mobile login-amico.png')
            "
            :imgAlt="'Login-img'"
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
  name: "Login",
  layout: "form",
  head() {
    return {
      title: this.$t("loginPage.loginPageTitle"),
    };
  },
  data() {
    return {
      valid: false,
      show1: false,
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
.reset-btn a {
  color: #9292b1 !important;
  margin-top: 35px;
}

.reset-btn span {
  font-family: "Cairo" !important;
}
</style>
