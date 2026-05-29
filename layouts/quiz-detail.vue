<template>
  <v-app class="quiz-detail-layout">
    <MenuComponent />
    <FormLayoutNav />
    <transition name="fade">
      <Nuxt />
    </transition>
  </v-app>
</template>

<script>
import MenuComponent from "@/components/Navbar-Components/MenuComponent";
import FormLayoutNav from "@/components/Navbar-Components/FormLayoutNav";
export default {
  components: { MenuComponent, FormLayoutNav },
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
};
</script>

<style>
.quiz-detail-layout { overflow: hidden !important; }
.quiz-detail-layout .v-application--wrap { overflow: hidden !important; }
</style>
