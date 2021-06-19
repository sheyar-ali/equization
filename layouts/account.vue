<template>
  <v-app class="account-layout-container">
    <MenuComponent />
    <AccountLayoutNav />
    <transition name="fade">
      <Nuxt />
    </transition>
    <Footer />
  </v-app>
</template>

<script>
import MenuComponent from "@/components/Navbar-Components/MenuComponent";
import AccountLayoutNav from "@/components/Navbar-Components/AccountLayoutNav";
import Footer from "@/components/Shared-Components/Footer";
export default {
  components: {
    MenuComponent,
    AccountLayoutNav,
    Footer,
  },
  created() {
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
