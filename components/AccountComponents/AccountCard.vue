<template>
  <div class="account-card d-flex align-center">
    <div class="account-img">
      <img
        src="@/assets/images/account-images/profile.png"
        class="d-block w-100"
      />
    </div>
    <div class="account-info">
      <p class="account-name ma-0 font-weight-bold">
        {{ $t("AccountPage.AccountCard.AccountName") }}
      </p>
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
export default {
  name: "AccountCard",
};
</script>

<style scoped>
.account-card {
  background-color: #f6f5fa;
  padding: 5px;
  border-radius: 10px;
  margin-bottom: 23px;
}

.account-img {
  width: 30%;
}

.account-info {
  max-width: 70%;
}

.account-img,
.account-info {
  padding: 5px;
}

.account-name {
  color: #3a3798;
  font-size: 20px;
  text-align: right !important;
}

.account-name,
.account-settings a {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.account-settings {
  margin-top: 3px !important;
  font-family: "Almarai" !important;
  font-size: 18px;
}

.account-settings a {
  color: #acabba;
}

.account-settings span {
  padding: 0 5px;
}

@media only screen and (max-width: 600px) {
  .account-card {
    margin-bottom: 0 !important;
  }
}

@media only screen and (max-width: 960px) {
  .account-name {
    margin-bottom: 5px !important;
  }

  .account-info {
    padding: 5px 10px !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 960px) {
  .account-img {
    width: 20%;
  }

  .account-info {
    max-width: 80% !important;
    width: 80%;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1310px) {
  a {
    font-size: 15px !important;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1264px) {
  .account-card {
    flex-direction: column;
  }

  .account-name,
  .account-settings span {
    display: none;
  }

  .account-img {
    width: 65% !important;
  }

  .account-info {
    max-width: 100% !important;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  i {
    font-size: 23px;
  }
}

/* Ltr Direction Style */
.ltr .account-name {
  text-align: left !important;
}

.ltr .account-settings {
  font-size: 15px !important;
}
</style>
