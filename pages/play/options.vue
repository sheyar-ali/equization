<template>
  <section class="play-page">
    <v-container fluid>
      <div class="play-page-container">
        <!-- Play Header Component -->
        <PlayHeader :headerText="this.headerText" :link="link" />
        <div class="settings-container d-flex flex-column">
          <div class="settings-content" v-for="i in 3" :key="i">
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
      title: this.$t("settingsPage.title"),
    };
  },
  data() {
    return {
      // Play Header Component Text
      headerText: this.$t("settingsPage.headerText"),
      link: "/play/standby",
      // Checkbox  Check Values
      checkbox: [true, true, true, true],
      // Labels Text
      labels: [
        this.$t("settingsPage.labels.first"),
        this.$t("settingsPage.labels.second"),
        this.$t("settingsPage.labels.third"),
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
