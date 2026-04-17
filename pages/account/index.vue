<!-- Start Of The Account Page -->
<template>
  <section class="d-flex align-center justify-center page-section">
    <section class="account-section d-flex align-center mx-auto w-100">
      <v-container fluid>
        <v-row>

          <!-- Side Menu -->
          <SideMenu activeLink="account" />

          <!-- Account Page Content -->
          <v-col cols="12" md="10" lg="9" class="account-section-container">

            <div class="account-section-content h-100">

              <!-- Account Header Component -->
              <AccountHeader
                :headerText="headerContent.headerText"
                :backLink="headerContent.backLink"
                :backText="headerContent.backText"
                :isActive="headerContent.isActive"
              />

              <AccountCard />

              <div class="welcome text-center">
                {{ $t("AccountPage.welcomeText") }} <strong>{{ displayName }}</strong>
              </div>

              <v-row class="pa-0">

                <!-- Account Cards Component -->
                <AccountInfoCards
                  v-for="accountInfoCard in accountInfoCards"
                  :key="accountInfoCard.id"
                  :cardTitle="accountInfoCard.cardTitle"
                  :cardDescription="accountInfoCard.cardDescription"
                  :cardLink="accountInfoCard.cardLink"
                  :cardLinkText="accountInfoCard.cardLinkText"
                />

              </v-row>

            </div>
            
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import MenuComponent from "@/components/Navbar-Components/MenuComponent";
import SideMenu from "@/components/AccountComponents/SideMenu";
import AccountHeader from "@/components/AccountComponents/AccountHeader";
import AccountCard from "@/components/AccountComponents/AccountCard";
import AccountInfoCards from "@/components/AccountComponents/AccountInfoCards";
import { mapGetters } from 'vuex';
export default {
  layout: "account",
  head() {
    return {
      title: this.$t("AccountPage.pageTitle"),
    };
  },
  computed: {
    ...mapGetters(['user']),
    // اسم المستخدم الديناميكي
    displayName() {
      if (!this.user) return '';
      if (this.user.firstName) return `${this.user.firstName} ${this.user.lastName || ''}`.trim();
      return this.user.username || '';
    },
    // Header Content
    headerContent() {
      return {
        headerText: this.$t("AccountPage.AccountHeader.headerText"),
        backLink: "/",
        backText: this.$t("AccountPage.AccountHeader.backText"),
        isActive: false,
      };
    },
    // Data Of The Cards Component
    accountInfoCards() {
      return [
        {
          id: 1,
          cardTitle: this.$t(
            "AccountPage.AccountInfoCards.firstCard.cardTitle"
          ),
          cardDescription: this.$t(
            "AccountPage.AccountInfoCards.firstCard.cardDescription"
          ),
          cardLink: "/explore",
          cardLinkText: this.$t(
            "AccountPage.AccountInfoCards.firstCard.cardLinkText"
          ),
        },
        {
          id: 2,
          cardTitle: this.$t(
            "AccountPage.AccountInfoCards.secondCard.cardTitle"
          ),
          cardDescription: this.$t(
            "AccountPage.AccountInfoCards.secondCard.cardDescription"
          ),
          cardLink: "/quizes/add",
          cardLinkText: this.$t(
            "AccountPage.AccountInfoCards.secondCard.cardLinkText"
          ),
        },
      ];
    },
  },
  components: {
    MenuComponent,
    SideMenu,
    AccountHeader,
    AccountCard,
    AccountInfoCards,
  },
};
</script>

<style scoped>
.account-section-content .account-card {
  display: none !important;
}

.welcome {
  background-color: #daf4f3;
  color: #3a3798;
  padding: 20px 0;
  font-size: 25px;
  margin: 23px 0;
  border-radius: 10px;
  font-weight: 600;
}

@media only screen and (max-width: 600px) {
  .account-section-content .account-card {
    display: flex !important;
  }

  .welcome {
    font-size: 21px !important;
    margin: 15px 0 !important;
  }
}
</style>
