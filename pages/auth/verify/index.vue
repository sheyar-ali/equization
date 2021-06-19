<!-- Start Of The Contact Us Page -->
<template>
  <section>
    <PageTitle :titleText="$t('confirmEmailPage.pageTitle')" />
    <section class="contact-us d-flex align-center form-section mx-auto">

      <v-container>

        <v-row
          class="align-center justify-space-between flex-sm-column-reverse flex-md-row"
        >
          <v-col cols="12" md="6" class="form-container">

            <ContactAlert
              :alertText="$t('confirmEmailPage.alertText')"
              :alertDescription="
                $t('confirmEmailPage.alertDescriptionText')
              "
              :link="localePath('/')"
              :linkText="$t('confirmEmailPage.alertButtonText')"
            />

          </v-col>

          <v-divider vertical></v-divider>

          <FormContent
            :formTitle="$t('confirmEmailPage.pageTitle')"
            :imgSrc="require('@/assets/images/forms-img/Confirmed-cuate.png')"
            :imgAlt="'confirm-email-img'"
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
  name: "Confirm-Email",
  layout: "form",
  head() {
    return {
      title: this.$t('confirmEmailPage.pageTitle')
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
    "DividerLinkText"
  ],
  components: {
    PageTitle,
    ContactAlert,
    FormDivider,
    FormContent,
  }
};
</script>
