<!-- Start Of The Contact Us Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('passwordSettedPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row
          class="align-center justify-space-between flex-sm-column-reverse flex-md-row"
        >
          <v-col cols="12" md="6" class="form-container">
            <!-- ContactAlert Component -->
            <ContactAlert
              :alertText="$t('passwordSettedPage.alertText')"
              :alertDescription="$t('passwordSettedPage.alertDescriptionText')"
              :link="localePath('/signin')"
              :linkText="$t('passwordSettedPage.alertButtonText')"
            />
            <!-- FormDivider Component -->
            <FormDivider
              :DividerText="$t('passwordSettedPage.formDividerText')"
              :DividerLink="localePath('/signin')"
              :DividerLinkText="$t('passwordSettedPage.formDividerLink')"
            />
          </v-col>
          <v-divider vertical></v-divider>
          <!-- FormContent -->
          <FormContent
            :formTitle="$t('passwordSettedPage.formContentTitle')"
            :imgSrc="require('@/assets/images/forms-img/My password-pana.png')"
            :imgAlt="'password-setted-img'"
          />
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import ContactAlert from "@/components/Shared-Components/ContactAlert";
import FormDivider from "@/components/Shared-Components/FormDivider";
import FormContent from "@/components/Shared-Components/FormContent";
export default {
  name: "Password-Setted",
  layout: "form",
  head() {
    return {
      title: this.$t("passwordSettedPage.pageTitle"),
    };
  },
  props: ["titleText", "formTitle", "formDescription", "imgSrc", "imgAlt"],
  components: {
    PageTitle,
    ContactAlert,
    FormDivider,
    FormContent,
  },
};
</script>

<style scoped>
.reset-btn a {
  color: #9292b1 !important;
  margin-top: 35px;
}

.reset-btn span {
  font-family: "Cairo" !important;
}

.alert-description {
  margin-top: 30px !important;
}
</style>
