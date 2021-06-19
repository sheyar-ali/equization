<template>
  <v-app class="play-layout-container">
    <PlayLayoutNav />
    <transition name="fade">
      <Nuxt />
    </transition>
  </v-app>
</template>

<script>
import PlayLayoutNav from "@/components/Navbar-Components/PlayLayoutNav";
export default {
  components: {
    PlayLayoutNav,
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
        }
      },
      immediate: true,
    },
  },
};
</script>
