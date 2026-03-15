<!-- Start Of The Signup Page -->
<template>
  <section>
    <PageTitle :titleText="$t('createAccountPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row class="align-center justify-space-between flex-sm-column-reverse flex-md-row">
          <v-col cols="12" md="6" class="form-container wow fadeIn">

            <!-- Error Alert -->
            <v-alert v-if="errorMsg" type="error" dismissible @input="errorMsg = ''">
              {{ errorMsg }}
            </v-alert>

            <!-- Success Alert -->
            <v-alert v-if="successMsg" type="success">
              {{ successMsg }}
            </v-alert>

            <!-- Signup Form -->
            <v-form class="forms" ref="form" v-model="valid" @submit.prevent="handleSignup">

              <!-- Username Input -->
              <v-text-field
                outlined
                v-model="username"
                :label="$t('createAccountPage.inputText')"
                :rules="[
                  v => !!v || $t('errorNameText') + ' ' + $t('createAccountPage.inputText'),
                  v => (v && v.length >= 3) || $t('createAccountPage.inputText') + ' ' + $t('minLengthError') + ' 3 ' + $t('characters'),
                  v => /^\S+$/.test(v) || $t('createAccountPage.inputText') + ' ' + $t('emailRulesError'),
                ]"
                required
                prepend-inner-icon="mdi-account"
              ></v-text-field>

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

              <!-- Password Input -->
              <v-text-field
                outlined
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                :rules="[
                  v => !!v || $t('errorNameText') + ' ' + $t('loginPage.passwordInputText'),
                  v => (v && v.length >= 8) || $t('loginPage.passwordInputText') + ' ' + $t('minLengthError') + ' 8 ' + $t('characters'),
                ]"
                :label="$t('loginPage.passwordInputText')"
                required
                prepend-inner-icon="mdi-lock"
                @click:append="show1 = !show1"
              ></v-text-field>

              <!-- Confirm Password Input -->
              <v-text-field
                v-model="passwordConfirmation"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                outlined
                :type="show2 ? 'text' : 'password'"
                :rules="[
                  v => !!v || $t('passwordErrorText'),
                  v => v === password || $t('matchPassword'),
                ]"
                :label="$t('createAccountPage.confirmPasswordText')"
                required
                prepend-inner-icon="mdi-lock"
                @click:append="show2 = !show2"
              ></v-text-field>

              <!-- Checkbox -->
              <v-checkbox
                class="check-btn"
                v-model="checkbox"
                :rules="[v => !!v || '']"
                :label="$t('createAccountPage.checkBoxText')"
                required
              ></v-checkbox>

              <!-- Submit Button -->
              <v-btn
                class="white--text d-block mx-auto title"
                width="30%"
                height="auto"
                color="primary"
                type="submit"
                :disabled="!valid || loading"
                :loading="loading"
                @click="handleSignup"
              >
                {{ $t("createAccountPage.buttonText") }}
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
import PageTitle   from "@/components/Shared-Components/PageTitle";
import FormDivider from "@/components/Shared-Components/FormDivider";
import FormContent from "@/components/Shared-Components/FormContent";

export default {
  name: "Create-Account",
  layout: "form",
  components: { PageTitle, FormDivider, FormContent },

  head() {
    return { title: this.$t("createAccountPage.pageTitle") };
  },

  data() {
    return {
      valid:                false,
      loading:              false,
      show1:                false,
      show2:                false,
      username:             "",
      email:                "",
      password:             "",
      passwordConfirmation: "",
      checkbox:             false,
      errorMsg:             "",
      successMsg:           "",
    };
  },

  methods: {
    async handleSignup() {
      if (!this.$refs.form.validate()) return;

      this.loading  = true;
      this.errorMsg = "";

      try {
        const res = await this.$axios.post("/auth/register", {
          username: this.username,
          email:    this.email,
          password: this.password,
        });

        if (res.data && res.data.success) {
          this.successMsg =
            "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.";
          // تحويل لصفحة تسجيل الدخول بعد ثانيتين
          setTimeout(() => {
            this.$router.push(this.localePath("/signin"));
          }, 2000);
        }
      } catch (err) {
        const msg = err.response?.data?.message;
        if (msg && msg.includes("duplicate") || msg && msg.includes("already")) {
          this.errorMsg = "هذا البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل";
        } else {
          this.errorMsg = msg || "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
label {
  margin-left: 10px;
}
</style>
