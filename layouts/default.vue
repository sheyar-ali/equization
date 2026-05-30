<template>
  <v-app class="default-layout-container">
    <HeaderComponent />
    <transition name="fade">
      <Nuxt />
    </transition>
    <Footer />
  </v-app>
</template>

<script>
import HeaderComponent from "@/components/Navbar-Components/HeaderComponent.vue";
import Footer from "@/components/Shared-Components/Footer";
export default {
  components: {
    HeaderComponent,
    Footer,
  },
  created() {
    // Changing The Direction Of The Website
    if (process.browser) {
      if (this.$i18n.locale === "ar") {
        this.$vuetify.rtl = true;
        document.querySelector("body").classList.remove("ltr");
      } else {
        this.$vuetify.rtl = false;
        document.querySelector("body").classList.add("ltr");
      }
    }
  },
  watch: {
    $route: {
      handler: function () {
        if (process.browser) {
          // Calling Wow js Plugin
          this.$nextTick(() => {
            new this.$wow({
              live: false,
              offset: 0,
            }).init();
          });
          // Toggling Between Top Navbar and Scroll Navbar When Scrolling
          var navbar = document.getElementById("nav");
          var menuLinks = document.querySelector(".menu-links");
          var homeSectionImg = document.querySelector(".home-content img");

          if (!homeSectionImg) {
            // Not on the home page — always show white navbar with logo
            if (navbar) navbar.classList.add("scroll-navbar");
            if (menuLinks) menuLinks.classList.remove("top-menu-links");
            window.onscroll = null;
            return;
          }

          // Home page — reset to transparent then set up scroll toggle
          navbar.classList.remove("scroll-navbar");
          menuLinks.classList.add("top-menu-links");
          homeSectionImg.style.visibility = "visible";

          window.onscroll = function () {
            try {
              var nav = document.getElementById("nav"),
                img = document.querySelector(".home-content img"),
                links = document.querySelector(".menu-links");
              if (window.scrollY >= img.offsetTop + nav.offsetTop) {
                nav.classList.add("scroll-navbar");
                links.classList.remove("top-menu-links");
                img.style.visibility = "hidden";
              } else {
                nav.classList.remove("scroll-navbar");
                links.classList.add("top-menu-links");
                img.style.visibility = "visible";
              }
            } catch (error) {}
          };
        }
      },
      immediate: true,
    },
  },
};
</script>
