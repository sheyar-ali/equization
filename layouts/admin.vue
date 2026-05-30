<template>
  <v-app class="admin-layout">
    <!-- Top bar -->
    <v-app-bar app color="#1e1b4b" dark elevation="2" height="60">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="font-weight-bold" style="font-family:'Cairo'">
        <span style="color:#ff5e94">e</span>Quization
        <span class="caption ml-2 grey--text text--lighten-1">Admin</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
    </v-app-bar>

    <!-- Side navigation -->
    <v-navigation-drawer v-model="drawer" app color="#16134a" dark width="230">
      <v-list-item class="pa-4">
        <v-list-item-content>
          <v-list-item-title class="title font-weight-bold white--text">لوحة التحكم</v-list-item-title>
          <v-list-item-subtitle class="grey--text text--lighten-1">{{ adminName }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider style="border-color:rgba(255,255,255,0.1)" />

      <v-list nav dense class="mt-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="localePath(item.to)"
          exact
          active-class="admin-active-item"
          class="mb-1"
        >
          <v-list-item-icon><v-icon>{{ item.icon }}</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="font-family:'Cairo'">{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Page content -->
    <v-main class="admin-main">
      <transition name="fade">
        <Nuxt />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      navItems: [
        { to: '/admin',            icon: 'mdi-view-dashboard',    label: 'نظرة عامة'      },
        { to: '/admin/categories', icon: 'mdi-tag-multiple',      label: 'التصنيفات'      },
        { to: '/admin/users',      icon: 'mdi-account-group',     label: 'المستخدمون'     },
        { to: '/admin/quizzes',    icon: 'mdi-help-box-multiple',  label: 'الاختبارات'     },
      ],
    };
  },
  computed: {
    adminName() {
      const u = this.$store.state.user;
      return u ? (u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.username) : 'Admin';
    },
  },
  created() {
    if (process.browser) {
      this.$vuetify.rtl = true;
      document.querySelector('body').classList.remove('ltr');
    }
  },
  methods: {
    logout() {
      this.$store.commit('LOGOUT');
      if (process.client) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      this.$router.push(this.localePath('/'));
    },
  },
};
</script>

<style>
.admin-layout .admin-main { background: #f0f2f8 !important; }
.admin-active-item { background: rgba(108,99,255,0.25) !important; border-radius: 8px; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter, .fade-leave-to { opacity: 0; }
</style>
