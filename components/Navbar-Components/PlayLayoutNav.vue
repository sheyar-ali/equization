<template>
  <nav id="nav" class="play-navbar navbar position-fixed w-100 py-2">
    <div class="container-fluid">
      <div class="exit">
        <nuxt-link :to="localePath('/')" class="d-flex align-center w-100">
          <i class="fas fa-angle-right"></i>
          <span class="font-weight-bold">
            {{ $t("playNavbar.exitText") }}
          </span>
        </nuxt-link>
      </div>
      <div class="logo">
        <nuxt-link :to="localePath('/')" class="d-block w-100">
          <img
            src="@/assets/images/Home-Page-Images/logo.png"
            class="d-block mx-auto"
            alt="logo-img"
          />
        </nuxt-link>
      </div>
      <div class="langs">
        <PlayLangSwitcher />
      </div>
    </div>
  </nav>
</template>

<script>
import PlayLangSwitcher from "@/components/PlayComponents/PlayLangSwitcher";
export default {
  name: "playLayoutNav",
  methods: {
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
    sayHello() {
      console.log("Hello");
    },
  },
  components: {
    PlayLangSwitcher,
  },
};
</script>

<style scoped>
.navbar {
  background-color: #fff !important;
  -webkit-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -ms-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  -o-box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
  box-shadow: 1.5px 1.5px 15px rgba(0, 0, 0, 0.15);
}

i {
  font-size: 37px;
  cursor: pointer;
  z-index: 999999;
}

.exit span {
  padding: 0 10px;
  font-size: 20px;
}

@media only screen and (max-width: 992px) {
  .logo {
    position: static !important;
  }

  .langs {
    display: inline !important;
  }

  .exit {
    display: flex;
    align-items: center;
  }

  .exit a {
    width: fit-content !important;
  }

  .play-navbar .exit .v-select__selections {
    justify-content: flex-start !important;
  }

  .exit span {
    display: none;
  }
}

@media only screen and (max-width: 600px) {
  .exit {
    display: flex;
    align-items: center;
  }

  .ltr .langs, .langs {
    display: inline-block !important;
    width: fit-content !important;
  }

  .logo {
    width: 50% !important;
  }

  .logo img{
    width: 85%;
    padding-right: 10px;
  }

  .v-application .py-2 {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }
}
</style>
