<template>
  <div class="text-center">
    <v-pagination
      v-model="page"
      :length="pagesLength"
      class="font-weight-bold"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  data() {
    return {
      page: 1,
    };
  },
  props: ["pagesLength"],
};
</script>

<style scoped>
.v-pagination__item {
  height: 40px !important;
  min-width: 40px !important;
}

.v-pagination__navigation {
  height: 38px !important;
  min-width: 38px !important;
  margin: 0.3rem 15px !important;
}

.v-pagination button {
  font-size: 20px !important;
}
</style>
