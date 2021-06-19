<template>
  <v-select
    hide-details
    v-model="selectedValue"
    @click="stoppingPropgation"
    @change="onChange(selectedValue)"
    :items="availableNames"
  >
  </v-select>
</template>

<script>
export default {
  name: "LangSwitcher",
  data() {
    return {
      selectedValue: this.$i18n.locale,
    };
  },
  computed: {
    // Data Of The LangSwitcher
    availableNames() {
      return this.$i18n.locales.map((i) => {
        if (i.name !== this.$i18n.locale) {
          return { text: i.name, value: i.code };
        }
      });
    },
  },
  watch: {
    // Changing The Body Direction When Changing The Language
    selectedValue: function(newLocale, oldLocale) {
      if (newLocale === "ar") {
        this.$vuetify.rtl = true;
        document.querySelector("body").classList.remove("ltr");
      } else {
        this.$vuetify.rtl = false;
        document.querySelector("body").classList.add("ltr");
      }
    },
  },
  methods: {
    // Change the Language To The Selected Language Make The Bars Icon In The Navbar Visible When Changing The Website Language
    onChange(event) {
      this.$router.replace(this.switchLocalePath(event));
      document.querySelector(".nav-icon").style.visibility = "visible";
      document.getElementById("menu-links").style.display = "none";
    },
    // Donnot Hidding The MenuLinks When Cliking On The Langs Select
    stoppingPropgation(event) {
      event.stopPropagation();
    },
  },
};
</script>

<style>
.v-select__selections {
  justify-content: flex-end !important;
}

@media only screen and (max-width: 600px) {
  .v-select__selections {
    justify-content: flex-start !important;
  }
}

.v-select__selections input {
  display: none;
}

.v-text-field > .v-input__control > .v-input__slot:before,
.v-text-field > .v-input__control > .v-input__slot:after {
  display: none !important;
}

.theme--light.v-select .v-select__selection--comma {
  color: #ffc961;
  font-size: x-large;
}
.v-select__selection--comma {
  margin: 0 !important;
  overflow: unset !important;
  text-overflow: unset !important;
}

.v-text-field {
  padding: 0 !important;
  margin: 0 !important;
}

.v-input.v-input--is-focused i,
.v-input.v-input--is-focused label {
  color: inherit !important;
}
</style>
