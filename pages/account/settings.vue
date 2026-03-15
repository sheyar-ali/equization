<!-- Account Settings Page -->
<template>
  <section class="d-flex align-center justify-center page-section">
    <section class="account-section d-flex align-center mx-auto w-100">
      <v-container fluid>
        <v-row>
          <SideMenu activeLink="account-settings" />
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100">
              <div class="account-header">
                <div class="account-header-content d-flex justify-space-between align-center">
                  <h2 class="font-weight-bold">{{ headerContent.headerText }}</h2>
                  <v-btn text @click="deleteDialog = true">
                    <v-icon>mdi-trash-can-outline</v-icon>
                    <span>{{ $t("profilePage.backText") }}</span>
                  </v-btn>
                </div>
                <v-divider horizontal class="rounded"></v-divider>
              </div>

              <!-- Alerts -->
              <v-alert v-if="successMsg" type="success" dismissible @input="successMsg=''">{{ successMsg }}</v-alert>
              <v-alert v-if="errorMsg" type="error" dismissible @input="errorMsg=''">{{ errorMsg }}</v-alert>

              <!-- Settings Form -->
              <v-form class="forms" ref="form" v-model="valid">
                <v-row>
                  <v-col md="7" cols="12">
                    <!-- Username -->
                    <v-text-field
                      outlined
                      v-model="form.username"
                      :label="$t('createAccountPage.inputText')"
                      :rules="[v => !!v || $t('errorNameText')]"
                      prepend-inner-icon="mdi-account"
                    ></v-text-field>
                    <!-- Email -->
                    <v-text-field
                      outlined
                      type="email"
                      v-model="form.email"
                      :label="$t('loginPage.emailInputText')"
                      :rules="[v => !!v || $t('errorNameText'), v => /.@./.test(v) || $t('emailRulesError')]"
                      prepend-inner-icon="mdi-email"
                    ></v-text-field>
                    <!-- Current Password -->
                    <v-text-field
                      outlined
                      v-model="form.currentPassword"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      :label="$t('profilePage.currentPassword')"
                      prepend-inner-icon="mdi-lock"
                      @click:append="show1 = !show1"
                    ></v-text-field>
                    <!-- New Password -->
                    <v-text-field
                      outlined
                      v-model="form.newPassword"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      :label="$t('profilePage.newPassword')"
                      :rules="form.newPassword ? [v => v.length >= 8 || $t('passwordLength')] : []"
                      prepend-inner-icon="mdi-lock"
                      @click:append="show2 = !show2"
                    ></v-text-field>
                    <!-- Confirm New Password -->
                    <v-text-field
                      outlined
                      v-model="form.confirmPassword"
                      :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show3 ? 'text' : 'password'"
                      :label="$t('profilePage.confirmNewPassword')"
                      :rules="form.newPassword ? [v => v === form.newPassword || $t('matchPassword')] : []"
                      prepend-inner-icon="mdi-lock"
                      @click:append="show3 = !show3"
                    ></v-text-field>
                  </v-col>

                  <v-col md="5" cols="12">
                    <div class="quiz-creation-img w-100 d-flex align-center justify-center overflow-hidden">
                      <img class="added-img" v-if="imageUrl || form.avatar" :src="imageUrl || form.avatar" />
                      <img class="temporay-img" v-else src="@/assets/images/account-images/profile-img.png" />
                    </div>
                    <v-file-input
                      v-model="file"
                      class="file-input"
                      @change="onFileChange"
                      @click:clear="clear"
                      :show-size="1000"
                      :label="$t('addQuizPage.chooseImg')"
                      accept="image/*"
                      outlined
                      hide-details="auto"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                    />
                  </v-col>

                  <v-col cols="12" md="7" class="w-100 d-flex justify-content-end sub-btn-content">
                    <v-btn
                      class="white--text d-block title sub-btn"
                      width="30%"
                      height="auto"
                      color="primary"
                      :loading="saving"
                      @click="saveSettings"
                    >
                      {{ $t("profilePage.subBtn") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>

            <!-- Delete Account Dialog -->
            <v-dialog v-model="deleteDialog" max-width="550px">
              <v-card>
                <v-card-title class="text-center font-weight-bold d-block">
                  {{ $t("profilePage.backText") }}
                </v-card-title>
                <v-divider></v-divider>
                <p class="text-center mt-5 h5">{{ $t("profilePage.deleteDialogText") }}</p>
                <v-row class="px-10 pt-2 pb-5">
                  <v-col class="pa-2 d-flex align-center justify-center">
                    <v-btn
                      outlined color="white" class="w-100"
                      style="height:50px;min-width:150px!important;background-color:#ff5e94;border:none!important;font-size:18px;border-radius:10px;"
                      :loading="deleting"
                      @click="deleteAccount"
                    >
                      <v-icon class="mx-2">mdi-trash-can-outline</v-icon>
                      <span style="font-family:'Almarai'">{{ $t("profilePage.backText") }}</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import SideMenu from "@/components/AccountComponents/SideMenu";

export default {
  layout: "account",
  components: { SideMenu },
  head() {
    return { title: this.$t("profilePage.pageTitle") };
  },
  data() {
    return {
      valid: false,
      saving: false,
      deleting: false,
      show1: false, show2: false, show3: false,
      deleteDialog: false,
      file: null,
      imageUrl: null,
      successMsg: '',
      errorMsg: '',
      form: {
        username: '',
        email: '',
        avatar: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    };
  },
  computed: {
    ...mapGetters(['user']),
    headerContent() {
      return {
        headerText: this.$t("profilePage.pageTitle"),
        backLink: "/",
        backText: this.$t("profilePage.backText"),
        isActive: true,
      };
    },
  },
  mounted() {
    // تعبئة النموذج ببيانات المستخدم الحالي
    if (this.user) {
      this.form.username = this.user.username || '';
      this.form.email    = this.user.email    || '';
      this.form.avatar   = this.user.avatar   || '';
    }
  },
  methods: {
    onFileChange() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = () => { this.imageUrl = reader.result; };
        reader.readAsDataURL(this.file);
      }
    },
    clear() {
      this.file = null;
      this.imageUrl = '';
    },
    async saveSettings() {
      this.saving = true;
      this.errorMsg = '';
      this.successMsg = '';
      try {
        // تحديث بيانات الملف الشخصي
        const updateData = {
          username: this.form.username,
          email: this.form.email,
        };
        const res = await this.$axios.put('/auth/update-details', updateData);
        if (res.data && res.data.success) {
          // تغيير كلمة المرور إذا أُدخلت
          if (this.form.currentPassword && this.form.newPassword) {
            await this.$axios.put('/auth/update-password', {
              currentPassword: this.form.currentPassword,
              newPassword: this.form.newPassword,
            });
          }
          // تحديث الـ store بالبيانات الجديدة
          const updatedUser = { ...this.user, ...updateData };
          this.$store.dispatch('updateUser', updatedUser);
          this.successMsg = 'تم حفظ التغييرات بنجاح';
          this.form.currentPassword = '';
          this.form.newPassword = '';
          this.form.confirmPassword = '';
        }
      } catch (err) {
        this.errorMsg = err.response?.data?.message || 'حدث خطأ أثناء الحفظ';
      } finally {
        this.saving = false;
      }
    },
    async deleteAccount() {
      this.deleting = true;
      try {
        await this.$axios.delete('/users/account');
        this.$store.dispatch('logout');
        this.$router.push(this.localePath('/'));
      } catch (err) {
        this.errorMsg = err.response?.data?.message || 'حدث خطأ أثناء حذف الحساب';
        this.deleteDialog = false;
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>

<style scoped>
.account-section-content .sub-btn-content { margin-top: -2px !important; }
.account-section-content .quiz-creation-img { height: 314px !important; }
.temporay-img, .added-img { height: 280px; width: 280px; object-fit: contain; border-radius: 100%; }
.account-header-content h2 { color: #a4abbb; }
.account-header-content button { padding: 20px 10px !important; background-color: #ffeff4 !important; color: #ff5e94 !important; font-family: "Almarai" !important; font-weight: 600; letter-spacing: 0 !important; border-radius: 20px; }
.account-header-content button i { color: #ff5e94 !important; font-size: 20px !important; }
@media only screen and (max-width: 600px) {
  .account-header-content { flex-wrap: wrap !important; }
  .account-header-content h2 { font-size: 25px !important; }
  .account-header-content button, .account-header-content h2 { margin-top: 10px; }
}
</style>
