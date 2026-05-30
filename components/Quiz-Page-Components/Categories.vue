<template>
  <v-col cols="6" sm="6" md="4" class="cat-content">
    <div class="cat-columns">
      <nuxt-link
        :to="localePath(catLink)"
        class="d-flex align-center justify-center"
      >
        <img :src="catImgSrc" class="d-block" />
        <h6 class="font-weight-bold text-center">{{ catTitle }}</h6>
      </nuxt-link>
    </div>
  </v-col>
</template>

<script>
export default {
  name: "Categories",
  props: ["catLink", "catImgSrc", "catTitle"],
};
</script>

<style scoped>
.cat-content {
  padding: 0 3px !important;
}

.cat-columns {
  padding: 7px 10px;
  background-color: #e7e7f1;
  border-radius: 10px;
  margin-left: 1.25%;
  margin-right: 0;
  margin-top: 10px;
}

img {
  width: 17%;
}

h6 {
  color: #3a3798;
  width: 77%;
  padding: 0 5px;
  font-size: 14px;
  max-width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

@media only screen and (max-width: 600px) {
  .cat-content {
    padding: 0 20px !important;
  }

  .cat-columns {
    margin: 15px auto 0 !important;
  }

  img {
    width: 10%;
  }

  h6 {
    max-width: 245px !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 959px) {
  .cat-columns { margin: 6px 2px 0 !important; padding: 5px 6px; }
  img { width: 18%; }
  h6  { font-size: 12px !important; }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  .cat-columns {
    padding: 7px 3px;
  }
}

/* Ltr Direction Style */
.ltr .cat-content {
  margin-right: .5%;
  margin-left: 0;
}
</style>
