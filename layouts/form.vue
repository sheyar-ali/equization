<template>
  <v-app class="form-layout-container">
    <MenuComponent />
    <FormLayoutNav />
    <transition name="fade">
      <Nuxt />
    </transition>
    <Footer />
  </v-app>
</template>

<script>
import MenuComponent from "@/components/Navbar-Components/MenuComponent";
import FormLayoutNav from "@/components/Navbar-Components/FormLayoutNav";
import Footer from "@/components/Shared-Components/Footer";
export default {
  components: {
    MenuComponent,
    FormLayoutNav,
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
      handler: function(to, form) {
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
