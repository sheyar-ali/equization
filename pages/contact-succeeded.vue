<!-- Start Of The Contact Us Page -->
<template>
  <section>
    <!-- PageTitle Component -->
    <PageTitle :titleText="$t('contactSucceededPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">
      <v-container>
        <v-row
          class="align-center justify-space-between flex-sm-column-reverse flex-md-row"
        >
          <v-col cols="12" md="6" class="form-container">
            <!-- ContactAlert Component -->
            <ContactAlert
              :alertText="$t('contactSucceededPage.alertText')"
              :alertDescription="
                $t('contactSucceededPage.alertDescriptionText')
              "
              :link="localePath('/')"
              :linkText="$t('contactSucceededPage.alertButtonText')"
            />
          </v-col>
          <v-divider vertical></v-divider>
          <!-- FormContent Component -->
          <FormContent
            :formTitle="$t('contactSucceededPage.formContentTitle')"
            :imgSrc="
              require('@/assets/images/forms-img/Confirmed-pana (1).png')
            "
            :imgAlt="'contact-us-img'"
          />
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import PageTitle from "@/components/Shared-Components/PageTitle";
import ContactAlert from "@/components/Shared-Components/ContactAlert";
import FormContent from "@/components/Shared-Components/FormContent";
export default {
  name: "Contact-Us-Succeeded",
  layout: "form",
  head() {
    return {
      title: this.$t("contactSucceededPage.pageTitle"),
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
  ],
  components: {
    PageTitle,
    ContactAlert,
    FormContent,
  },
};
</script>
