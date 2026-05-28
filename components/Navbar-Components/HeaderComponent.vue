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
  box-shadow: none;
  background: transparent;
}

/* Logo hidden on home (transparent state), visible once scrolled */
.top-navbar .logo {
  display: none;
}

.scroll-navbar .logo {
  display: block;
}

/* Glassmorphism scroll state — also overridden in global style.css */
.scroll-navbar {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 4px 32px rgba(54, 57, 153, 0.12) !important;
  border-bottom: 1px solid rgba(108, 99, 255, 0.10) !important;
}

/* Logo glow on scroll state */
.scroll-navbar .logo a img {
  filter: drop-shadow(0 2px 12px rgba(54, 57, 153, 0.25));
  transition: filter 0.3s ease;
}

.top-navbar .my-account {
  background-color: transparent !important;
}
.top-navbar .my-account a span { font-size: 18px !important; }
.top-navbar .my-account a i   { font-size: 30px !important; }
.scroll-navbar .my-account { border-color: transparent !important; }

/* Hamburger button */
.hamburger-btn {
  background: transparent;
  border: none;
  padding: 6px;
  cursor: pointer;
  line-height: 1;
  border-radius: 10px;
  transition: background 0.25s ease;
}
.hamburger-btn:hover {
  background: rgba(255, 94, 148, 0.1);
}
</style>
