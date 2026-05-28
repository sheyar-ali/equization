<template>
  <ul
    class="side-menu-component pa-0 list-unstyled d-flex justify-space-between flex-column"
  >
    <li
      v-for="menuLink in menuLinks"
      :key="menuLink.id"
      class="side-menu-link w-100 d-flex overflow-hidden"
    >
      <nuxt-link
        :to="localePath(menuLink.linkPath)"
        :class="`d-flex align-center w-100 ${menuLink.class}`"
      >
        <i :class="menuLink.linkIcon"></i>
        <span class="font-weight-bold">{{ menuLink.linkText }}</span>
      </nuxt-link>
    </li>
    <li
      class="side-menu-link w-100 d-flex overflow-hidden"
      @click="signOut = true"
    >
      <button type="button" class="d-flex align-center w-100">
        <i class="fas fa-sign-out-alt"></i>
        <span class="font-weight-bold">{{
          $t("AccountPage.sideMenuLinks.last")
        }}</span>
      </button>
    </li>

    <!-- signout dialog -->
    <v-dialog v-model="signOut" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">
          {{ $t("singOutDialog.title") }}
        </v-card-title>
        <v-divider></v-divider>
        <p class="text-center mt-5 h5">
          {{ $t("singOutDialog.question") }}
        </p>
        <v-row class="px-10 pt-2 pb-5">
          <v-col class="pa-2 d-flex align-center justify-center">
            <v-btn
              outlined
              color="white"
              class="w-100"
              style="height: 50px; min-width: 150px !important; width: auto !important; background-color: #ff5e94; border: none !important; font-size: 18px;"
              @click="handleSignOut"
            >
              <v-icon class="mx-2">
                mdi-logout
              </v-icon>
              <span style="font-family: 'Almarai'">
                {{ $t("singOutDialog.title") }}
              </span>
            </v-btn>
          </v-col>
          <v-col class="pa-2 d-flex align-center justify-center">
            <v-btn
              outlined
              color="grey"
              class="w-100"
              style="height: 50px;"
              @click="signOut = false"
            >
              {{ $t("singOutDialog.cancel") || $t("cancel") || "إلغاء" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </ul>
</template>

<script>
export default {
  name: "SideMenuContent",
  data() {
    return {
      signOut: false,
    };
  },
  methods: {
    handleSignOut() {
      this.$store.dispatch("logout");
      this.signOut = false;
      this.$router.push(this.localePath("/"));
    },
  },
  computed: {
    menuLinks() {
      return [
        {
          id: 1,
          linkText: this.$t("AccountPage.sideMenuLinks.first"),
          linkIcon: "fas fa-user",
          linkPath: "/account",
          class: this.activeLink == "account" ? "active" : "",
        },
        {
          id: 2,
          linkText: this.$t("AccountPage.sideMenuLinks.second"),
          linkIcon: "fas fa-tasks",
          linkPath: "/my-quizzes",
          class: this.activeLink == "myQuizzes" ? "active" : "",
        },
        {
          id: 3,
          linkText: this.$t("AccountPage.sideMenuLinks.third"),
          linkIcon: "far fa-plus-square",
          linkPath: "/quizes/add",
          class: this.activeLink == "create-quiz" ? "active" : "",
        },
        {
          id: 4,
          linkText: this.$t("AccountPage.sideMenuLinks.forth"),
          linkIcon: "fas fa-sliders-h",
          linkPath: "/account/settings",
          class: this.activeLink == "account-settings" ? "active" : "",
        },
      ];
    },
  },
  props: ["activeLink"],
};
</script>

<style scoped>
a,
button {
  padding: 15px;
  margin-bottom: 10px;
  color: #a4abbb !important;
  -webkit-transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  -moz-transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  -ms-transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  -o-transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  border-radius: 10px;
}

a.active {
  background-color: #efeff7;
}

a:hover,
button:hover {
  background-color: #f6f5fa;
}

li:last-of-type button {
  margin-bottom: 0 !important;
}

li:last-of-type button:hover {
  background-color: #f8e6ec !important;
  color: #ff5e94 !important;
}

i {
  margin-left: 15px;
  font-size: 25px;
}

span {
  font-size: 20px;
}

@media only screen and (max-width: 959px) {
  ul.side-menu-component {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100%;
    background-color: #fff;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    padding: 8px 15px !important;
    flex-direction: row !important;
    -webkit-box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
    -moz-box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
    -ms-box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
    -o-box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
    box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
  }

  ul.side-menu-component li {
    width: auto !important;
  }

  ul.side-menu-component a {
    margin-bottom: 0 !important;
    padding: 15px 30px !important;
  }

  ul.side-menu-component i {
    margin-left: 0 !important;
    font-size: 22px;
  }

  ul.side-menu-component span {
    display: none !important;
  }
}

@media only screen and (max-width: 600px) {
  ul.side-menu-component a {
    padding: 8px 20px !important;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1264px) {
  ul.side-menu-component a {
    justify-content: center !important;
  }

  li span {
    display: none;
  }

  li i {
    margin-left: 0 !important;
  }

  .side-menu-link:last-of-type button {
    justify-content: center !important;
  }
}

/* Ltr Direction Style */
.ltr ul.side-menu-component i {
  margin-left: 0 !important;
  margin-right: 15px !important;
}
</style>
