<!-- Start Of The Signin Page -->
<template>
  <section>
    <PageTitle :titleText="$t('loginPage.loginPageTitle')" />
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

            <!-- Signin Form -->
            <v-form class="forms" ref="form" v-model="valid" @submit.prevent="handleLogin">

              <!-- Email Input -->
              <v-text-field
                outlined
                type="email"
                :label="$t('loginPage.emailInputText')"
                v-model="email"
                :rules="[
                  v => !!v || $t('errorNameText') + ' ' + $t('loginPage.emailInputText'),
                  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || $t('loginPage.emailInputText') + ' ' + $t('emailRulesError'),
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
                :label="$t('loginPage.passwordInputText')"
                :rules="[
                  v => !!v || $t('errorNameText') + ' ' + $t('loginPage.passwordInputText'),
                  v => (v && v.length >= 8) || $t('loginPage.passwordInputText') + ' ' + $t('minLengthError') + ' 8 ' + $t('characters'),
                ]"
                required
                prepend-inner-icon="mdi-lock"
                @click:append="show1 = !show1"
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
                {{ $t("loginPage.buttonText") }}
              </v-btn>

              <div class="reset-btn d-flex w-100 justify-center">
                <nuxt-link :to="localePath('/forgot')" class="title text-center d-inline-block">
                  <span>{{ $t("loginPage.forgetPasswordText") }}</span>
                </nuxt-link>
              </div>

              <FormDivider
                :DividerText="$t('loginPage.formDividerText')"
                :DividerLink="localePath('/signup')"
                :DividerLinkText="$t('loginPage.formDividerLink')"
              />
            </v-form>
          </v-col>

          <v-divider vertical></v-divider>

          <FormContent
            :formTitle="$t('loginPage.loginPageTitle')"
            :imgSrc="require('@/assets/images/forms-img/Mobile login-amico.png')"
            :imgAlt="'Login-img'"
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
  name: "Login",
  layout: "form",
  components: { PageTitle, FormDivider, FormContent },

  head() {
    return { title: this.$t("loginPage.loginPageTitle") };
  },

  data() {
    return {
      valid:      false,
      loading:    false,
      show1:      false,
      email:      "",
      password:   "",
      errorMsg:   "",
      successMsg: "",
    };
  },

  methods: {
    async handleLogin() {
      if (!this.$refs.form.validate()) return;

      this.loading  = true;
      this.errorMsg = "";

      try {
        const res = await this.$axios.post("/auth/login", {
          email:    this.email,
          password: this.password,
        });

        if (res.data && res.data.success) {
          const { token, user } = res.data.data;

          // حفظ في Vuex + localStorage معاً
          this.$store.dispatch('login', { token, user });

          this.successMsg = this.$t("loginPage.successMsg");
          setTimeout(() => {
            this.$router.push(this.localePath("/account"));
          }, 800);
        }
      } catch (err) {
        const msg = err.response?.data?.message;
        if (msg === "Invalid credentials") {
          this.errorMsg = this.$t("loginPage.errorInvalidCredentials");
        } else if (msg === "Please verify your email first") {
          this.errorMsg = this.$t("loginPage.errorNotVerified");
        } else {
          this.errorMsg = msg || this.$t("loginPage.errorGeneric");
        }
      } finally {
        this.loading = false;
      }
    },
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
