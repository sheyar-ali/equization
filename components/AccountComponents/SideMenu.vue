<template>
  <v-col cols="12" md="2" lg="3" class="account-menu">
    <div class="account-menu-content h-100">
      <AccountCard />
      <v-divider horizontal class="rounded ma-0"></v-divider>
      <SideMenuLinks :activeLink="activeLink" />
    </div>
  </v-col>
</template>

<script>
import AccountCard from "@/components/AccountComponents/AccountCard";
import SideMenuLinks from "@/components/AccountComponents/SideMenuLinks";
export default {
  name: "SideMenu",
  components: {
    AccountCard,
    SideMenuLinks,
  },
  props: ["activeLink"],
};
</script>

<style scoped>
.account-menu {
  border: 2px solid #ecebff;
  border-radius: 10px;
}

.account-menu-content {
  padding: 8px 10px;
}

ul {
  margin-top: 17px !important;
}

@media only screen and (max-width: 600px) {
  .account-menu {
    padding-bottom: 0 !important;
  }
}

@media only screen and (max-width: 960px) {
  .account-menu {
    border: none !important;
  }

  .v-divider {
    display: none !important;
  }
}
</style>
