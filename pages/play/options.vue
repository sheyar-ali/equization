<!-- Player: Join with session code -->
<template>
  <section class="play-page">
    <v-container fluid class="w-100 h-100">
      <div class="play-page-container w-100 h-100">
        <div class="play-page-content w-100 h-100 d-flex align-center justify-center flex-column">

          <!-- Error alert -->
          <v-alert v-if="error" type="error" class="mb-4" dismissible @input="error=''">
            {{ error }}
          </v-alert>

          <v-form class="d-flex align-center justify-center flex-column w-100" v-model="valid" @submit.prevent="joinSession">
            <p class="w-100 text-center">{{ $t("play.nameInput") }}</p>
            <v-text-field
              outlined
              v-model="sessionCode"
              type="number"
              min="0"
              :label="$t('play.numLabel')"
              :rules="[rules.required, rules.minLength7]"
              :disabled="loading"
              required
            ></v-text-field>
            <v-btn
              class="white--text d-block title sub-btn"
              height="auto"
              type="submit"
              :disabled="!valid || loading"
              :loading="loading"
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
  head() { return { title: this.$t("play.title") }; },
  data() {
    return {
      valid: false,
      sessionCode: '',
      loading: false,
      error: '',
      rules: {
        required: v => (v && String(v).length > 0) || `${this.$t('errorNameText')} ${this.$t('play.numLabel')}`,
        minLength7: v => (v && String(v).length >= 6) || `${this.$t('play.numLabel')} ${this.$t('minLengthError')} 6 ${this.$t('characters')}`,
      },
    };
  },
  methods: {
    joinSession() {
      if (process.client) {
        sessionStorage.setItem('joinSessionCode', this.sessionCode);
        this.$router.push(this.localePath('/play/name'));
      }
    },
  },
};
</script>

<style scoped>
p { font-size: 27px; color: #75769a; margin-bottom: 20px; }
.v-input { flex: 0; width: 315px; }
.play-page-container .play-page-content button { width: fit-content; background-color: #3a3798; padding: 3px 25px; border-radius: 10px; }
@media only screen and (max-width: 600px) { p { font-size: 25px; } }
</style>
