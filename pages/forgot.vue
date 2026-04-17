<template>
  <section>
    <PageTitle :titleText="$t('resetPasswordSucceededPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row class="align-center justify-space-between flex-sm-column-reverse flex-md-row">
          <v-col cols="12" md="6" class="form-container wow fadeIn">
            <p class="form-description text-center">
              {{ $t("resetPasswordPage.titleDescription") }}
            </p>

            <!-- Error Alert -->
            <v-alert v-if="errorMsg" type="error" dismissible @input="errorMsg = ''">
              {{ errorMsg }}
            </v-alert>

            <!-- Success Alert -->
            <v-alert v-if="successMsg" type="success">
              {{ successMsg }}
            </v-alert>

            <!-- Forgot Form -->
            <v-form class="forms" ref="form" v-model="valid" @submit.prevent="handleForgotPassword">
              <!-- Email Input -->
              <v-text-field
                outlined
                type="email"
                v-model="email"
                :label="$t('loginPage.emailInputText')"
                :rules="[
                  v => !!v || $t('errorNameText') + ' ' + $t('loginPage.emailInputText'),
                  v => /.@+./.test(v) || $t('loginPage.emailInputText') + ' ' + $t('emailRulesError'),
                ]"
                required
                prepend-inner-icon="mdi-email"
              ></v-text-field>

              <!-- Submit Button -->
              <v-btn
                class="white--text d-block mx-auto title"
                width="30%"
                height="auto"
                color="primary"
                type="submit"
                :disabled="!valid || loading"
                :loading="loading"
              >
                {{ $t("resetPasswordPage.buttonText") }}
              </v-btn>
            </v-form>

            <FormDivider
              :DividerText="$t('resetPasswordSucceededPage.formDividerText')"
              :DividerLink="localePath('/signin')"
              :DividerLinkText="$t('resetPasswordSucceededPage.formDividerLink')"
            />
          </v-col>
          <v-divider vertical></v-divider>
          <FormContent
            :formTitle="$t('resetPasswordSucceededPage.formContentTitle')"
            :imgSrc="require('@/assets/images/forms-img/Forgot password-bro.png')"
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
  name: "Forgot-Password",
  layout: "form",
  components: { PageTitle, FormDivider, FormContent },

  head() {
    return {
      title: this.$t("resetPasswordSucceededPage.pageTitle"),
    };
  },

  data() {
    return {
      valid:      false,
      loading:    false,
      email:      "",
      errorMsg:   "",
      successMsg: "",
    };
  },

  methods: {
    async handleForgotPassword() {
      if (!this.$refs.form.validate()) return;

      this.loading  = true;
      this.errorMsg = "";
      this.successMsg = "";

      try {
        const res = await this.$axios.post("/auth/forgot-password", {
          email: this.email,
        });

        if (res.data && res.data.success) {
          // Always show a generic success message (backend protects against user enumeration)
          this.successMsg = "إذا كان هذا البريد الإلكتروني مسجلاً، ستتلقى رسالة بكود إعادة التعيين.";
          this.email = ""; // clear field
          this.$refs.form.reset();
        }
      } catch (err) {
        const msg = err.response?.data?.message;
        if (msg === "Email could not be sent") {
          this.errorMsg = "تعذّر إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً.";
        } else {
          this.errorMsg = "حدث خطأ. يرجى المحاولة مرة أخرى.";
        }
      } finally {
        this.loading = false;
      }
    },
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
