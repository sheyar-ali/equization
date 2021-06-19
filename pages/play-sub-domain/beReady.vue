<template>
  <section class="play-page">
    <v-container fluid class="w-100 h-100">
      <div class="play-page-container w-100 h-100">
        <div
          class="play-page-content w-100 h-100 d-flex align-center justify-center flex-column"
        >
          <p class="w-100 text-center">
            <i class="fas fa-check-circle"></i>
          </p>
          <p class="w-100 text-center">
            {{ $t('beReady.excellent') }}
          </p>
          <p class="w-100 text-center">
            {{ $t('beReady.wait') }}
          </p>
          <p class="w-100 text-center d-flex align-center justify-center">
            <span>{{ $t('beReady.playersNumber') }}</span>
            <span>{{ this.playersNumbers }}</span>
          </p>
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
      title: this.$t('beReady.title'),
    }
  },
  data() {
    return {
      playersNumbers: 5,
    };
  },
};
</script>

<style scoped>
p {
  color: #75769a;
  font-size: 35px;
  margin-bottom: 0px !important;
}

i {
  font-size: 70px !important;
  color: #3f51b5;
}

span:last-of-type {
  background-color: #dcdbed;
  border-radius: 5px;
  padding: 10px;
  max-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 8px 10px 0;
  overflow: hidden;
}

p:first-of-type {
  margin-bottom: 20px !important;
}

p:nth-of-type(3) {
  margin-bottom: 40px !important;
}

@media only screen and (max-width: 600px) {
  p {
    font-size: 25px !important;
  }
}
</style>
