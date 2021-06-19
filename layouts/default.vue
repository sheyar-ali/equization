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
          // Scrolling event
          window.onscroll = function () {
            try {
              // Toggling Between Top Navbar and Scroll Navbar When Scrolling
              var navbar = document.getElementById("nav"),
                homeSectionImg = document.querySelector(".home-content img"),
                menuLinks = document.querySelector(".menu-links");
              if (this.scrollY >= homeSectionImg.offsetTop + navbar.offsetTop) {
                navbar.classList.add("scroll-navbar");
                menuLinks.classList.remove("top-menu-links");
                homeSectionImg.style.visibility = "hidden";
              } else {
                navbar.classList.remove("scroll-navbar");
                menuLinks.classList.add("top-menu-links");
                homeSectionImg.style.visibility = "visible";
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
