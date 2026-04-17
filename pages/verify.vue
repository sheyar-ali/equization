<template>
  <section>
    <PageTitle :titleText="$t('emailConfirmedPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row class="align-center justify-space-between flex-sm-column-reverse flex-md-row">
          <v-col cols="12" md="6" class="form-container wow fadeIn">

            <!-- Success state: email verified -->
            <div v-if="verified" class="text-center">
              <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
              <h3 class="mb-3">{{ $t('emailConfirmedPage.alertText') }}</h3>
              <p>{{ $t('emailConfirmedPage.alertDescriptionText') }}</p>
              <v-btn
                class="white--text mt-4"
                color="primary"
                :to="localePath('/signin')"
                large
              >
                {{ $t('emailConfirmedPage.alertButtonText') }}
              </v-btn>
            </div>

            <!-- Verification form -->
            <div v-else>
              <p class="form-description text-center mb-6">
                أدخل الكود المُرسَل إلى بريدك الإلكتروني
              </p>

              <!-- Error Alert -->
              <v-alert v-if="errorMsg" type="error" dismissible @input="errorMsg = ''">
                {{ errorMsg }}
              </v-alert>

              <v-form ref="form" v-model="valid" @submit.prevent="handleVerify">
                <!-- OTP Code Input -->
                <v-text-field
                  outlined
                  v-model="token"
                  label="كود التحقق (6 أرقام)"
                  :rules="[
                    v => !!v || 'الرجاء إدخال كود التحقق',
                    v => /^\d{6}$/.test(v) || 'الكود يجب أن يكون 6 أرقام',
                  ]"
                  required
                  prepend-inner-icon="mdi-shield-key"
                  maxlength="6"
                  inputmode="numeric"
                  placeholder="مثال: 123456"
                ></v-text-field>

                <!-- Submit Button -->
                <v-btn
                  class="white--text d-block mx-auto title"
                  width="50%"
                  height="auto"
                  color="primary"
                  type="submit"
                  :disabled="!valid || loading"
                  :loading="loading"
                >
                  تحقق من البريد الإلكتروني
                </v-btn>

                <!-- Resend -->
                <div class="text-center mt-4">
                  <v-btn
                    text
                    small
                    color="primary"
                    :disabled="resendLoading || resendCooldown > 0"
                    :loading="resendLoading"
                    @click="handleResend"
                  >
                    {{ resendCooldown > 0 ? `إعادة الإرسال بعد ${resendCooldown} ث` : 'إعادة إرسال الكود' }}
                  </v-btn>
                </div>
              </v-form>
            </div>

          </v-col>
          <v-divider vertical></v-divider>
          <FormContent
            :formTitle="$t('emailConfirmedPage.pageTitle')"
            :imgSrc="require('@/assets/images/forms-img/Confirmed-cuate.png')"
            :imgAlt="'email-confirmed-img'"
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
  name: "Email-Verify",
  layout: "form",
  components: { PageTitle, FormContent },

  head() {
    return {
      title: this.$t("emailConfirmedPage.pageTitle"),
    };
  },

  data() {
    return {
      valid:         false,
      loading:       false,
      resendLoading: false,
      resendCooldown: 0,
      token:         "",
      errorMsg:      "",
      verified:      false,
      cooldownTimer: null,
    };
  },

  methods: {
    async handleVerify() {
      if (!this.$refs.form.validate()) return;

      this.loading  = true;
      this.errorMsg = "";

      try {
        const res = await this.$axios.post("/auth/verify-email", {
          token: this.token,
        });

        if (res.data && res.data.success) {
          this.verified = true;

          // Update user in store if logged in
          if (this.$store.state.user) {
            this.$store.dispatch('updateUser', {
              ...this.$store.state.user,
              isVerified: true
            });
          }
        }
      } catch (err) {
        const msg = err.response?.data?.message;
        if (msg && msg.includes('expired')) {
          this.errorMsg = "انتهت صلاحية الكود. يرجى طلب كود جديد.";
        } else if (msg && msg.includes('Invalid')) {
          this.errorMsg = "الكود غير صحيح. تحقق من البريد الإلكتروني وأعد المحاولة.";
        } else {
          this.errorMsg = msg || "حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.";
        }
      } finally {
        this.loading = false;
      }
    },

    async handleResend() {
      this.resendLoading = true;
      this.errorMsg = "";

      try {
        await this.$axios.post("/auth/resend-verification");
        this.startResendCooldown();
      } catch (err) {
        const msg = err.response?.data?.message;
        if (err.response?.status === 429) {
          this.errorMsg = "تم إرسال رسائل كثيرة. يرجى الانتظار قبل المحاولة مرة أخرى.";
        } else if (msg === 'Email already verified') {
          this.verified = true;
        } else {
          this.errorMsg = "تعذّر إرسال الكود. يرجى المحاولة لاحقاً.";
        }
      } finally {
        this.resendLoading = false;
      }
    },

    startResendCooldown() {
      this.resendCooldown = 60; // 60 seconds cooldown
      this.cooldownTimer = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown <= 0) {
          clearInterval(this.cooldownTimer);
        }
      }, 1000);
    },
  },

  beforeDestroy() {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  },
};
</script>

<style scoped>
.form-container {
  padding-bottom: 13px !important;
}
</style>
