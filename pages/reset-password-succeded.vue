<!-- Start Of The Reset Password Succeded Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('resetPasswordSucceededPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row
          class="align-center justify-space-between flex-sm-column-reverse flex-md-row"
        >
          <v-col cols="12" md="6" class="form-container">
            <!-- ContactAlert Component -->
            <ContactAlert
              :alertText="$t('resetPasswordSucceededPage.alertText')"
              :alertDescription="
                $t('resetPasswordSucceededPage.alertDescriptionText')
              "
              :link="localePath('/')"
              :linkText="$t('resetPasswordSucceededPage.alertButtonText')"
            />
            <!-- FormDivider Component -->
            <FormDivider
              :DividerText="$t('resetPasswordSucceededPage.formDividerText')"
              :DividerLink="localePath('/signin')"
              :DividerLinkText="
                $t('resetPasswordSucceededPage.formDividerLink')
              "
            />
          </v-col>
          <v-divider vertical></v-divider>
          <!-- FormContent Component -->
          <FormContent
            :formTitle="$t('resetPasswordSucceededPage.formContentTitle')"
            :imgSrc="
              require('@/assets/images/forms-img/Forgot password-bro.png')
            "
            :imgAlt="'reset-passord-succeeded-img'"
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
  name: "Contact-Us",
  layout: "form",
  head() {
    return {
      title: this.$t("resetPasswordSucceededPage.pageTitle"),
    };
  },
  props: [
    "titleText",
    "formTitle",
    "formDescription",
    "imgSrc",
    "imgAlt",
    "alertText",
    "alertDescription",
    "link",
    "linkText",
    "DividerText",
    "DividerLink",
    "DividerLinkText",
  ],
  components: {
    PageTitle,
    ContactAlert,
    FormDivider,
    FormContent,
  },
};
</script>
