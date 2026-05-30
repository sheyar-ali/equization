<!-- Start Of The Menu Component -->
<template>
  <div
    class="top-menu-links menu-links position-fixed"
    id="menu-links"
    @click="hideMenuLinks"
  >
    <i class="fas fa-times close-icon" @click="showNavbar"></i>
    <ul class="list-unstyled text-right d-flex">
      <!-- MenuComponentContent Component -->
      <MenuComponentContent
        v-for="menuLink in menuLinks"
        :key="menuLink.id"
        :linkPath="menuLink.linkPath"
        :iconClass="menuLink.iconClass"
        :linkContent="menuLink.linkContent"
        @click="showNavIcon"
      />
      <!-- Langs Container -->
      <div
        class="langs"
        @click="
          showNavIcon();
          stoppingPropgation($event);
        "
      >
      <!-- LangSwitcher Component -->
        <LangSwitcher />
      </div>
    </ul>
  </div>
</template>
<!-- End Of The Menu Component -->

<script>
import MenuComponentContent from "@/components/Navbar-Components/MenuComponentContent";
import LangSwitcher from "@/components/LangSwitcher";
// Hiding The Menu When Clicking On The Esc Key In The Keyboard
if (process.browser) {
  document.onkeydown = function(event) {
    if (event.keyCode == 27) {
      document.querySelector(".menu-links").style.display = "none";
      setTimeout(function() {
        document.querySelector(".nav-icon").style.visibility = "visible";
      }, 60);
    }
  };
}
export default {
  name: "MenuComponent",
  components: {
    MenuComponentContent,
    LangSwitcher,
  },
  computed: {
    // Data For The Menu Links
    menuLinks() {
      return [
        // Home Page
        {
          id: 1,
          linkPath: "/",
          iconClass: "fas fa-home",
          linkContent: this.$t("menu.menuLinks.firstLink"),
        },
        // Explore Page
        {
          id: 2,
          linkPath: "/explore",
          iconClass: "fas fa-file-alt",
          linkContent: this.$t("menu.menuLinks.secondLink"),
        },
        // Signup Page
        {
          id: 3,
          linkPath: "/signup",
          iconClass: "fas fa-user-plus",
          linkContent: this.$t("menu.menuLinks.thirdLink"),
        },
        // Signin Page
        {
          id: 4,
          linkPath: "/signin",
          iconClass: "fas fa-sign-in-alt",
          linkContent: this.$t("menu.menuLinks.forthLink"),
        },
        // About Page
        {
          id: 5,
          linkPath: "/about",
          iconClass: "fas fa-info-circle",
          linkContent: this.$t("menu.menuLinks.fifthLink"),
        },
        // Platform Features Page
        {
          id: 6,
          linkPath: "/features",
          iconClass: "far fa-star",
          linkContent: this.$t("menu.menuLinks.sixthLink"),
        },
        // How it Works Page
        {
          id: 7,
          linkPath: "/howitworks",
          iconClass: "fas fa-cogs",
          linkContent: this.$t("menu.menuLinks.seventhLink"),
        },
        // Use Cases Page
        {
          id: 8,
          linkPath: "/use-cases",
          iconClass: "fas fa-list-ul",
          linkContent: this.$t("menu.menuLinks.useCases"),
        },
        // Contact Page
        {
          id: 9,
          linkPath: "/contact",
          iconClass: "fas fa-envelope",
          linkContent: this.$t("menu.menuLinks.lastLink"),
        },
      ];
    },
  },
  methods: {
    showNavbar: function() {
      document.querySelector(".menu-links").style.display = "none";
      setTimeout(function() {
        document.querySelector(".nav-icon").style.visibility = "visible";
      }, 60);
    },
    // Showing The Bars Icon
    showNavIcon: function() {
      document.querySelector(".menu-links").style.display = "none";
      setTimeout(function() {
        document.querySelector(".nav-icon").style.visibility = "visible";
      }, 60);
    },
    // Hidding Menu Links When Cliking On The Close Icon
    hideMenuLinks: function() {
      document.querySelector(".menu-links").style.display = "none";
      setTimeout(function() {
        document.querySelector(".nav-icon").style.visibility = "visible";
      }, 60);
    },
    // Donnot Hide The Menu On Cliking On The Langs Untill Seleting Specified Language
    stoppingPropgation: function(event) {
      event.stopPropagation();
    },
    // Changing The Language
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
/* ── Close button ── */
.close-icon {
  position: fixed;
  top: 14px;
  right: 30px;
  color: #ff5e94;
  font-size: 38px;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease, text-shadow 0.3s ease;
  z-index: 99999999;
}
.close-icon:hover {
  color: #ffc961;
  transform: rotate(90deg) scale(1.1);
  text-shadow: 0 0 18px rgba(255, 196, 97, 0.6);
}

.top-menu-links i.close-icon {
  color: #ffc961 !important;
}

/* ── Full-screen overlay menu ── */
.menu-links {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 18px 65px 18px 20px;
  background: linear-gradient(135deg,
    rgba(30, 27, 75, 0.72) 0%,
    rgba(54, 57, 153, 0.68) 50%,
    rgba(108, 99, 255, 0.62) 100%);
  z-index: 9999999;
  display: none;
}

.langs {
  margin-right: 10px;
  color: #ff5e94 !important;
  display: none;
}

@media only screen and (max-width: 600px) {
  .menu-links { padding: 70px 65px 18px 20px !important; overflow: scroll; }
  .menu-links .langs { display: block !important; }
  .close-icon { right: 15px !important; }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .menu-links { padding: 20px 65px 18px 20px !important; }
  .menu-links .langs { display: block !important; }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  .close-icon { right: 30px !important; }
}

/* LTR */
.ltr .close-icon { right: auto !important; left: 33px !important; }

body.ltr .menu-links {
  background: linear-gradient(225deg,
    rgba(30, 27, 75, 0.92) 0%,
    rgba(54, 57, 153, 0.88) 50%,
    rgba(108, 99, 255, 0.82) 100%) !important;
  right: 0 !important;
  left: auto !important;
}

.ltr .menu-links ul { text-align: left !important; }

@media only screen and (max-width: 600px) {
  body.ltr .menu-links ul { margin-top: 0 !important; }
  .ltr .close-icon { left: 23px !important; }
  .ltr .menu-links ul { margin-top: 55px !important; }
  .ltr .menu-links ul li { margin-left: 0 !important; }
}
</style>
