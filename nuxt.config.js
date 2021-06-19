import colors from "vuetify/es5/util/colors";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import tr from "./locales/tr.json";

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  router: {
    // base: process.env.NODE_ENV === "dev" ? "/" : "/demo/equization/",
    scrollBehavior() {
      return { x: 0, y: 0 };
    },
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - eQuization",
    title: "eQuization",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "eQuization" },
      {
        hid: "description",
        name: "description",
        content:
          "أول منصة عربية لإنشاء اختبارات تفاعلية و التعلم عن طريق اللعب",
      },
      { hid: "twitteCard", name: "twitter:card", content: "summary" },
      { hid: "twitterTitle", name: "twitter:title", content: "eQuization" },
      {
        hid: "twitterDesc",
        name: "twitter:description",
        content:
          "أول منصة عربية لإنشاء اختبارات تفاعلية و التعلم عن طريق اللعب",
      },
      // image must be an absolute path
      {
        hid: "twitterImg",
        name: "twitter:image",
        content:
          "https://res.cloudinary.com/dpmvrlnsv/image/upload/v1614245383/defaults/EQUIZATION.png",
      },
      // Facebook OpenGraph
      { hid: "ogTitle", property: "og:title", content: "eQuization" },
      { hid: "ogSiteName", property: "og:site_name", content: "eQuization" },
      {
        hid: "ogDesc",
        property: "og:description",
        content:
          "أول منصة عربية لإنشاء اختبارات تفاعلية و التعلم عن طريق اللعب",
      },
      { hid: "ogType", property: "og:type", content: "website" },
      { hid: "ogUrl", property: "og:url", content: `https://equization.com` },
      {
        hid: "ogImg",
        property: "og:image",
        content:
          "https://res.cloudinary.com/dpmvrlnsv/image/upload/v1614245383/defaults/EQUIZATION.png",
      },
    ],
    // FavIcon Of The Website
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      // Fonts Type
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
      },
      // Fonts Type
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&family=Cairo:wght@400;600;700&display=swap",
      },
      // Calling Of The Fot Awesome Library
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.12.1/css/all.css",
      },
      // Calling Of The Bootstrap Library
      {
        rel: "stylesheet",
        type: "text/css",
        href:
          "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["assets/css/style.css", "assets/css/animate.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "plugins/vue-wow.js", ssr: false },
    { src: "~/plugins/TiptapVuetify", ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "nuxt-i18n",
    "vue-social-sharing/nuxt",
  ],

  i18n: {
    locales: [
      {
        code: "ar",
        name: "العربية",
        file: ar,
      },
      {
        code: "en",
        name: "English",
        file: en,
      },
      {
        code: "fr",
        name: "Français",
        file: fr,
      },
      {
        code: "tr",
        name: "Turkçe",
        file: tr,
      },
    ],
    defaultLocale: "ar",
    detectBrowserLanguage: false,
    vueI18n: {
      fallbackLocale: "ar",
      silentTranslationWarn: true,
      messages: { ar, en, fr, tr },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#363999",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: "#363999",
          error: "#d24747",
        },
      },
    },
    rtl: true,
  },

  loading: {
    color: "#ff5e94",
    height: "5px",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vuetify/lib", "tiptap-vuetify"],
  },
};
