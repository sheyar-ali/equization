<!-- Reset password page — reached via the link emailed by forgot-password -->
<template>
  <section>
    <PageTitle :titleText="$t('passwordSettedPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row class="align-center justify-space-between flex-sm-column-reverse flex-md-row">
          <v-col cols="12" md="6" class="form-container wow fadeIn">

            <v-alert v-if="errorMsg" type="error" dismissible @input="errorMsg = ''">
              {{ errorMsg }}
            </v-alert>

            <v-alert v-if="successMsg" type="success">
              {{ successMsg }}
            </v-alert>

            <v-alert v-if="!token" type="warning">
              رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.
              <nuxt-link :to="localePath('/forgot')">طلب رابط جديد</nuxt-link>
            </v-alert>

            <v-form v-if="token && !successMsg" class="forms" ref="form" v-model="valid" @submit.prevent="handleReset">
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

              <v-text-field
                outlined
                v-model="passwordConfirmation"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                :label="$t('createAccountPage.confirmPasswordText')"
                :rules="[
                  v => !!v || $t('passwordErrorText'),
                  v => (v && v.length >= 8) || $t('passwordLength'),
                  v => v === password || $t('matchPassword'),
                ]"
                required
                prepend-inner-icon="mdi-lock"
                @click:append="show2 = !show2"
              ></v-text-field>

              <v-btn
                class="white--text d-block mx-auto title"
                width="50%"
                height="auto"
                color="primary"
                type="submit"
                :disabled="!valid || loading"
                :loading="loading"
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
import PageTitle    from "@/components/Shared-Components/PageTitle";
import FormDivider  from "@/components/Shared-Components/FormDivider";
import FormContent  from "@/components/Shared-Components/FormContent";

export default {
  name: "Reset-Password",
  layout: "form",
  head() {
    return { title: this.$t("passwordSettedPage.pageTitle") };
  },
  data() {
    return {
      valid:                false,
      loading:              false,
      show1:                false,
      show2:                false,
      token:                '',
      password:             '',
      passwordConfirmation: '',
      errorMsg:             '',
      successMsg:           '',
    };
  },
  mounted() {
    this.token = this.$route.query.token || '';
  },
  methods: {
    async handleReset() {
      if (!this.$refs.form.validate()) return;
      if (!this.token) {
        this.errorMsg = 'رابط إعادة التعيين غير صالح.';
        return;
      }

      this.loading  = true;
      this.errorMsg = '';

      try {
        await this.$axios.post('/auth/reset-password', {
          token:    this.token,
          password: this.password,
        });

        this.successMsg = 'تم تغيير كلمة المرور بنجاح! جاري تحويلك لتسجيل الدخول...';
        setTimeout(() => this.$router.push(this.localePath('/signin')), 2000);
      } catch (err) {
        const msg = err.response?.data?.message;
        if (msg === 'Invalid or expired token') {
          this.errorMsg = 'انتهت صلاحية رابط إعادة التعيين. يرجى طلب رابط جديد.';
        } else {
          this.errorMsg = msg || 'حدث خطأ، حاول مرة أخرى.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
  components: { PageTitle, FormDivider, FormContent },
};
</script>

<style scoped>
button {
  margin: 30px 0 50px;
}
</style>
