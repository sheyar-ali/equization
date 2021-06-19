<!-- Start Of The Contact Us Page -->
<template>
  <section>
    <PageTitle :titleText="$t('passwordSettedPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row
          class="align-center justify-space-between flex-sm-column-reverse flex-md-row"
        >
          <v-col cols="12" md="6" class="form-container wow fadeIn">
            <v-alert type="error">
              {{ $t("errorAlertText") }}
            </v-alert>
            <v-form class="forms" v-model="valid">
              <v-text-field
                outlined
                v-model="password"
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
              <v-text-field
                outlined
                v-model="passwordConfirmation"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                :label="$t('createAccountPage.confirmPasswordText')"
                :rules="passwordRules"
                required
                prepend-inner-icon="mdi-lock"
                @click:append="show2 = !show2"
              >
              </v-text-field>
              <v-btn
                class="white--text d-block mx-auto title"
                width="50%"
                height="auto"
                :disabled="!valid"
              >
                {{ $t("setPasswordPage.buttonText") }}
              </v-btn>
              <FormDivider
                :DividerText="$t('createAccountPage.formDividerText')"
                :DividerLink="localePath('/signin')"
                :DividerLinkText="$t('createAccountPage.formDividerLink')"
              />
            </v-form>
          </v-col>
          <v-divider vertical></v-divider>
          <FormContent
            :formTitle="$t('passwordSettedPage.formContentTitle')"
            :imgSrc="require('@/assets/images/forms-img/My password-pana.png')"
            :imgAlt="'reset-password-img'"
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
  name: "Set-Password",
  layout: "form",
  head() {
    return {
      title: this.$t("passwordSettedPage.pageTitle"),
    };
  },
  data() {
    return {
      valid: false,
      show1: false,
      show2: false,
      password: "",
      passwordConfirmation: "",
      passwordRules: [
        // Check if password in input
        (password) => !!password || this.$t("passwordErrorText"),
        // Make sure name is less than 10 char
        (password) => password.length >= 8 || this.$t("passwordLength"),
        (passwordConfirmation) =>
          passwordConfirmation === this.password || this.$t("matchPassword"),
      ],
      required(errorName) {
        return (v) =>
          (v && v.length > 0) || `${this.$t("errorNameText")} ${errorName}`;
      },
      minLength(errorName, minNum) {
        return (v) =>
          (v && v.length >= minNum) ||
          `${errorName} ${this.$t("minLengthError")} ${minNum} ${this.$t(
            "characters"
          )}`;
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

button {
  margin: 30px 0 50px;
}
</style>
