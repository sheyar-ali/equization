<template>
  <v-col md="6" sm="6" cols="6" class="details-card">
    <div class="players-details-columns d-flex align-center">
      <i :class="iconClass"></i>
      <p class="details-text text-center w-100 ma-0">
        {{ text }}
      </p>
    </div>
  </v-col>
</template>

<script>
export default {
  name: "PlayersDetails",
  props: ["iconClass", "text"],
};
</script>

<style scoped>
.details-card {
  padding: 0 !important;
}

.players-details-columns {
  padding: 12px;
  background-color: #fdefb2;
  border-radius: 10px;
}

i,
p {
  font-size: 20px;
  color: #5a595e;
}

p {
  padding-right: 20px;
  font-family: "Almarai";
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

@media only screen and (max-width: 600px) {
  .details-card {
    margin: 0px auto 15px;
  }

  p.details-text {
    margin: auto !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .details-card { margin: 0 0 8px; padding: 0 4px !important; }
  .players-details-columns { padding: 8px; }
  i, p { font-size: 13px !important; }
  p { padding-right: 8px; max-width: 120px; }
  .ltr p { padding-right: 0 !important; padding-left: 8px !important; }
}

@media only screen and (min-width: 960px) and (max-width: 992px) {
  .details-card:first-of-type {
    padding-left: 8px !important;
  }

  .details-card:nth-of-type(2) {
    padding-right: 8px !important;
  }

  .ltr .details-card:first-of-type {
    padding-right: 8px !important;
    padding-left: 0 !important;
  }

  .ltr .details-card:nth-of-type(2) {
    padding-left: 8px !important;
    padding-right: 0 !important;
  }
}

@media only screen and (min-width: 992px) {
  .details-card:first-of-type {
    padding-left: 8px !important;
  }

  .details-card:nth-of-type(2) {
    padding-right: 8px !important;
  }

  .ltr .details-card:first-of-type {
    padding-right: 8px !important;
    padding-left: 0 !important;
  }

  .ltr .details-card:nth-of-type(2) {
    padding-left: 8px !important;
    padding-right: 0 !important;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  .details-text {
    font-size: 16px !important;
  }
}

/* Ltr Direction Style */
.ltr .details-text {
  padding-right: 0 !important;
  padding-left: 20px !important;
}
</style>
