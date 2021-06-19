<template>
  <section class="play-page">
    <v-container fluid>
      <div class="play-page-container">

        <PlayHeader :headerText="headerText" :link="link" />

        <div class="settings-container d-flex flex-column">
          <div class="settings-content" v-for="i in 5" :key="i">

            <v-checkbox
              :label="labels[i - 1]"
              v-model="checkbox[i - 1]"
            ></v-checkbox>
            
          </div>
        </div>

      </div>
    </v-container>
  </section>
</template>

<script>
import PlayHeader from "@/components/PlayComponents/PlayHeader";
export default {
  layout: "play",
  head() {
    return {
      title: this.$t("host.options.title"),
    };
  },
  data() {
    return {
      // Play Header Component Text
      headerText: this.$t("settingsPage.headerText"),
      link: "/host",
      // Checkbox  Check Values
      checkbox: [true, true, true, false, false],
      // Labels Text
      labels: [
        this.$t("settingsPage.labels.first"),
        this.$t("settingsPage.labels.second"),
        this.$t("settingsPage.labels.third"),
        this.$t("settingsPage.labels.forth"),
        this.$t("settingsPage.labels.last"),
      ],
    };
  },
  components: {
    PlayHeader,
  },
};
</script>

<style scoped>
.settings-container {
  padding: 30px;
}

.settings-content {
  width: fit-content !important;
  margin-bottom: 10px;
}
</style>
