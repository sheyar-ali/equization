<!-- Start Of The Contact Us Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('contactSucceededPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row
          class="align-center justify-space-between flex-sm-column-reverse flex-md-row"
        >
          <v-col cols="12" md="6" class="form-container wow fadeIn">
            <!-- InValid Data Alert -->
            <v-alert type="error">
              {{ $t("errorAlertText") }}
            </v-alert>
            <!-- Contact Us Form -->
            <v-form class="forms" v-model="valid">
              <!-- Name Input -->
              <v-text-field
                outlined
                :label="$t('contactUsPage.nameInputText')"
                :rules="[
                  required($t('contactUsPage.nameInputText')),
                  minLength($t('contactUsPage.nameInputText'), 8),
                ]"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
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
                prepend-inner-icon="mdi-email"
                required
              ></v-text-field>
              <!-- Subject Input -->
              <v-text-field
                outlined
                type="text"
                :label="$t('contactUsPage.subjectInputText')"
                :rules="[
                  required($t('contactUsPage.subjectInputText')),
                  minLength($t('contactUsPage.subjectInputText'), 8),
                ]"
                prepend-inner-icon="mdi-text-subject"
                required
              ></v-text-field>
              <!-- Message Input -->
              <v-textarea
                outlined
                :label="$t('contactUsPage.messageInputText')"
                :rules="[
                  required($t('contactUsPage.messageInputText')),
                  minLength($t('contactUsPage.messageInputText'), 10),
                ]"
                prepend-inner-icon="mdi-android-messages"
                required
              >
              </v-textarea>
              <!-- Submit Button -->
              <v-btn
                :disabled="!valid"
                class="white--text d-block mx-auto title"
                width="30%"
                height="auto"
              >
                {{ $t("contactUsPage.buttonText") }}
              </v-btn>
            </v-form>
          </v-col>
          <v-divider vertical></v-divider>
          <!-- FormContent Component -->
          <FormContent
            :formTitle="$t('contactSucceededPage.formContentTitle')"
            :formDescription="$t('contactUsPage.formContentDescription')"
            :imgSrc="
              require('@/assets/images/forms-img/Email campaign-rafiki.png')
            "
            :imgAlt="'contact-us-img'"
          />
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import FormContent from "@/components/Shared-Components/FormContent";
export default {
  name: "Contact-Us",
  layout: "form",
  head() {
    return {
      title: this.$t("contactSucceededPage.pageTitle"),
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
      // Name Valodation That Check if the Username Is Valid (Don’t Contains Spaces)
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
    FormContent,
  },
};
</script>
