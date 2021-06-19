<template>
  <section class="play-page">
    <v-container fluid class="w-100 h-100">
      <div class="play-page-container w-100 h-100">
        <div
          class="play-page-content w-100 h-100 d-flex align-center justify-center flex-column"
        >
          <v-form
            class="d-flex align-center justify-center flex-column w-100"
            v-model="valid"
          >
            <p class="w-100 text-center">{{ $t("play.nameInput") }}</p>
            <v-text-field
              outlined
              type="number"
              min="0"
              :label="this.$t('play.numLabel')"
              :rules="[
                required(`${$t('play.numLabel')}`),
                minLength(`${$t('play.numLabel')}`, 7),
              ]"
              required
            ></v-text-field>
            <v-btn
              class="white--text d-block title sub-btn"
              height="auto"
              :disabled="!valid"
            >
              {{ $t("play.joinBtn") }}
            </v-btn>
          </v-form>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script>
export default {
  layout: "play",
  head() {
    return {
      title: this.$t("play.title"),
    };
  },
  data() {
    return {
      valid: false,
      required(errorName) {
        return (v) =>
          (v && v.length > 0) || `${this.$t("errorNameText")} ${errorName}`;
      },
      minLength(errorName, minNum) {
        return (v) =>
          (v && v.length >= minNum) ||
          `${errorName} ${this.$t("minLengthError")} ${minNum} ${this.$t(
            "characters"
          )}`;
      },
    };
  },
};
</script>

<style scoped>
p {
  font-size: 27px;
  color: #75769a;
  margin-bottom: 20px !important;
}

.v-input {
  flex: 0 !important;
  width: 315px !important;
}

.v-input .v-label {
  min-height: 100% !important;
}

.play-page-container .play-page-content button {
  width: fit-content !important;
  background-color: #3a3798;
  padding: 3px 25px !important;
  border-radius: 10px;
}

@media only screen and (max-width: 600px) {
  p {
    font-size: 25px !important;
  }
}
</style>
