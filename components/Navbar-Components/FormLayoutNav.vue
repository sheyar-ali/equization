<template>
  <nav id="nav" class="form-navbar navbar position-fixed w-100">
    <div class="container-fluid position-relative">
      <div class="nav-icon d-flex align-center justify-center text-right">
        <i class="fas fa-bars" @click="showMenu"></i>
        <div class="my-account overflow-hidden">
          <nuxt-link :to="localePath('/signin')" class="d-flex align-center">
            <i class="far fa-user-circle"></i>
            <span>{{ this.$t("loginPage.formContentTitle") }}</span>
          </nuxt-link>
        </div>
      </div>
      <div class="logo position-absolute">
        <nuxt-link :to="localePath('/')" class="d-block w-100">
          <img
            src="@/assets/images/Home-Page-Images/logo.png"
            class="d-block w-100"
            alt="logo-img"
          />
        </nuxt-link>
      </div>
      <div class="langs">
        <LangSwitcher />
      </div>
    </div>
  </nav>
</template>

<script>
import LangSwitcher from "@/components/LangSwitcher";
export default {
  name: "formLayoutNav",
  methods: {
    showMenu: function() {
      document.querySelector(".nav-icon").style.visibility = "hidden";
      setTimeout(function() {
        document.querySelector(".menu-links").style.display = "block";
      }, 60);
    },
    setLocale: function(event) {
      this.$i18n.locale = event.target.value;
      if (event.target.value == "ar") {
        document.querySelector("body").classList.remove("ltr");
        this.$vuetify.ltr = false;
        this.$vuetify.rtl = true;
      } else {
        document.querySelector("body").classList.add("ltr");
        this.$vuetify.rtl = false;
        this.$vuetify.ltr = true;
      }
    },
  },
  components: {
    LangSwitcher,
  },
};
</script>

<style scoped>
.navbar {
  background-color: #fff !important;
  -webkit-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -ms-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -o-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
}
</style>
