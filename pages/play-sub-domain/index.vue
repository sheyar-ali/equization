<!-- play-sub-domain/index.vue - Enter session code -->
<template>
  <section class="play-page">
    <v-container fluid class="w-100 h-100">
      <div class="play-page-container w-100 h-100">
        <div class="play-page-content w-100 h-100 d-flex align-center justify-center flex-column">
          <v-alert v-if="error" type="error" class="mb-4" dismissible @input="error=''">{{ error }}</v-alert>

          <v-form class="d-flex align-center justify-center flex-column w-100" v-model="valid" @submit.prevent="goToName">
            <p class="w-100 text-center">{{ $t("play.nameInput") }}</p>
            <v-text-field
              outlined
              v-model="sessionCode"
              type="number"
              min="0"
              :label="$t('play.numLabel')"
              :rules="[v => (v && String(v).length >= 6) || 'أدخل كود الجلسة']"
              required
            ></v-text-field>
            <v-btn
              class="white--text d-block title sub-btn"
              height="auto"
              type="submit"
              :disabled="!valid"
            >{{ $t("play.joinBtn") }}</v-btn>
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
      sessionCode: this.$route.query.code || '',
      error: '',
    };
  },
  mounted() {
    // Auto-fill from URL ?code=XXXXXX
    if (this.$route.query.code) {
      this.sessionCode = this.$route.query.code;
    }
  },
  methods: {
    goToName() {
      if (this.sessionCode && process.client) {
        sessionStorage.setItem('joinSessionCode', this.sessionCode);
        this.$router.push(this.localePath('/play-sub-domain/name'));
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
