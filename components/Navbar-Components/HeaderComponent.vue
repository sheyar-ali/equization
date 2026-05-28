<!-- Component For The Navbar -->
<template>
  <!-- Start Of The Navbar -->
  <nav id="nav" class="top-navbar navbar position-fixed w-100">
    <div class="container-fluid position-relative">
      <div class="nav-icon d-flex align-center justify-center text-right">
        <button
          type="button"
          class="hamburger-btn"
          :aria-label="$t('nav.openMenu') || 'فتح القائمة'"
          @click="showMenu"
        >
          <i class="fas fa-bars" aria-hidden="true"></i>
        </button>
        <div class="my-account overflow-hidden">
          <nuxt-link :to="localePath('/signin')" class="d-flex align-center">
            <i class="far fa-user-circle"></i>
            <span>{{ $t("loginPage.formContentTitle") }}</span>
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
        <langswitcher />
      </div>
    </div>
  </nav>
  <!-- End Of The Navbar -->
</template>

<script>
import LangSwitcher from "../../components/LangSwitcher";

export default {
  name: "HeaderComponent",
  components: {
    langswitcher: LangSwitcher,
  },
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
};
</script>

<style scoped>
.top-navbar {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  -ms-box-shadow: none;
  -o-box-shadow: none;
  box-shadow: none;
}

.top-navbar .logo {
  display: none;
}

.scroll-navbar .logo {
  display: block;
}

.scroll-navbar {
  background-color: #fff !important;
  -webkit-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -ms-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -o-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
}

.top-navbar .my-account {
  background-color: transparent !important;
  /* border: 2px solid #ffc961; */
}

.top-navbar .my-account a span {
  font-size: 18px !important;
}

.top-navbar .my-account a i {
  font-size: 30px !important;
}

.scroll-navbar .my-account {
  border-color: transparent !important;
}

.hamburger-btn {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  line-height: 1;
}
</style>
