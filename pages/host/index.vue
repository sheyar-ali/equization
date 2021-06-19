<template>
  <section class="play-page players-numbers">
    <v-container fluid>
      <div class="play-page-container">
        <PlayHeader
          :headerText="`${$t('settings.playersNumbers')}: ${playersNumbers}`"
          :playerCode="quizCode"
          :link="link"
        />

        <div class="link-container d-flex align-center justify-content-start">
          <div class="link">
            <span>
              {{ $t("settings.goToLink") }}
            </span>
            <span>
              {{ this.quizLink }}
            </span>
          </div>

          <div class="link">
            <span>
              {{ $t("settings.enterNumber") }}
            </span>
            <span>
              {{ this.quizCode }}
            </span>
          </div>
        </div>

        <v-divider horizontal></v-divider>

        <div class="players-names d-flex align-center justify-center flex-wrap">
          <div
            class="name text-white text-center"
            v-for="name in names"
            :key="name.id"
          >
            <span> {{ name.text }} </span>
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
      link: "/host/standby",
      playersNumbers: "5",
      quizCode: "856521",
      quizLink: `https://play.equization.com/${this.$i18n.locale}`,
      names: [
        {
          id: 1,
          text: "محمد الإسكندراني",
        },
        {
          id: 2,
          text: "اسم لاعب مختلف",
        },
        {
          id: 3,
          text: "اسم لاعب",
        },
        {
          id: 4,
          text: "اسم لاعب آخر",
        },
        {
          id: 5,
          text: "اسم لاعب مختلف",
        },
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

.player-header-content {
  margin-right: 0 !important;
}

.link {
  margin-top: 15px;
  margin-bottom: 30px;
  color: #898999 !important;
}

.link:first-of-type {
  margin-left: 15px;
}

.link span:first-of-type {
  margin-left: 10px;
}

.link span:first-of-type {
  font-size: 27px;
  font-weight: 600;
}

.link span:last-of-type {
  font-size: 23px;
  padding: 1px 15px;
  border-radius: 10px;
  background-color: #e8e8f4;
}

.link-container + hr {
  height: 2px !important;
  max-height: 2px;
  background-color: rgba(0, 0, 0, 0.12) !important;
}

.name {
  width: 22%;
  background-color: #3a3798;
  margin: 15px;
  padding: 10px 5px;
  font-size: 22px;
  border-radius: 10px;
}

@media only screen and (max-width: 600px) {
  .link-container {
    flex-wrap: wrap;
  }

  .link:first-of-type {
    margin-left: 0 !important;
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    margin-bottom: 15px;
  }

  .link span:first-of-type {
    margin-bottom: 10px !important;
  }

  .link span:last-of-type {
    font-size: 22px;
    padding: 10px 15px !important;
  }

  .name {
    width: 100% !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .link-container {
    flex-wrap: wrap !important;
  }

  .link {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px !important;
  }

  .link span {
    margin-bottom: 10px;
  }

  .link:first-of-type {
    margin-left: 0 !important;
  }

  .name {
    width: 80% !important;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  .link-container {
    flex-wrap: wrap;
  }

  .link {
    margin-bottom: 15px !important;
  }

  .name {
    width: 40% !important;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  .link-container {
    flex-wrap: wrap !important;
  }

  .name {
    width: 29% !important;
  }
}

/* Ltr Direction Style */
.ltr .link:first-of-type {
  margin-left: 0 !important;
  margin-right: 15px !important;
}

.ltr .link span:first-of-type {
  margin-left: 0 !important;
  margin-right: 10px;
}
</style>
