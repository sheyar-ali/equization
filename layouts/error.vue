<template>
  <v-app>
    <MenuComponent />
    <div
      class="error-page-content d-flex h-100 align-center justify-center flex-column font-weight-bold"
    >
      <img
        src="@/assets/images/Home-Page-Images/logo.png"
        style="max-width:500px"
        alt="logo-img"
      />
      <h1 v-if="error.statusCode === 404" class="font-weight-bold">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <transition name="fade">
        <NuxtLink :to="localePath('/')">
          {{ $t("errorPage.link") }}
        </NuxtLink>
      </transition>
    </div>
  </v-app>
</template>

<script>
import MenuComponent from "@/components/Navbar-Components/MenuComponent";
export default {
  layout: "form",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: this.$t("errorPage.pageNotFound"),
      otherError: this.$t("errorPage.pageTitle"),
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
  components: {
    MenuComponent,
  },
  watch: {
    $route: {
      handler: function(to, form) {
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

<style scoped>
h1 {
  font-size: 25px;
  margin: 17px 0 10px;
  font-weight: bold;
}

a {
  font-size: 20px;
}
</style>
