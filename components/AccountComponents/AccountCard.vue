<template>
  <div class="account-card d-flex align-center">
    <div class="account-img">
      <img
        :src="userAvatar"
        class="d-block w-100"
        alt="profile-img"
      />
    </div>
    <div class="account-info">
      <p class="account-name ma-0 font-weight-bold">
        {{ userName }}
      </p>
      <p class="account-email ma-0 grey--text" v-if="userEmail">{{ userEmail }}</p>
      <p class="account-settings ma-0 font-weight-bold d-flex align-center">
        <nuxt-link :to="localePath('/account/settings')">
          <i class="fas fa-sliders-h"></i>
          <span>{{ $t("AccountPage.AccountCard.AccountSettings") }}</span>
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "AccountCard",
  computed: {
    ...mapGetters(['user']),
    userName() {
      if (!this.user) return this.$t("AccountPage.AccountCard.AccountName");
      if (this.user.firstName) return `${this.user.firstName} ${this.user.lastName || ''}`.trim();
      return this.user.username || this.$t("AccountPage.AccountCard.AccountName");
    },
    userEmail() {
      return this.user ? this.user.email : '';
    },
    userAvatar() {
      if (this.user && this.user.avatar) return this.user.avatar;
      return require('@/assets/images/account-images/profile.png');
    },
  },
};
</script>

<style scoped>
.account-card { background-color: #f6f5fa; padding: 5px; border-radius: 10px; margin-bottom: 23px; }
.account-img { width: 30%; }
.account-info { max-width: 70%; }
.account-img, .account-info { padding: 5px; }
.account-name { color: #3a3798; font-size: 20px; text-align: right !important; }
.account-email { font-size: 14px; margin-bottom: 3px !important; }
.account-name, .account-settings a { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.account-settings { margin-top: 3px !important; font-family: "Almarai" !important; font-size: 18px; }
.account-settings a { color: #acabba; }
.account-settings span { padding: 0 5px; }
@media only screen and (max-width: 600px) { .account-card { margin-bottom: 0 !important; } }
@media only screen and (min-width: 960px) and (max-width: 1264px) {
  .account-card { flex-direction: column; }
  .account-name, .account-settings span, .account-email { display: none; }
  .account-img { width: 65% !important; }
  .account-info { max-width: 100% !important; width: 100%; display: flex; justify-content: center; }
  i { font-size: 23px; }
}
.ltr .account-name { text-align: left !important; }
</style>
