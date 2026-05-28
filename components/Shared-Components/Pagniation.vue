<template>
  <div class="text-center">
    <v-pagination
      v-model="currentPage"
      :length="pagesLength"
      :total-visible="totalVisible"
      class="font-weight-bold"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",

  props: {
    /** Total number of pages */
    pagesLength: {
      type: Number,
      required: true,
    },
    /** The currently active page (supports v-model via :value + @input) */
    value: {
      type: Number,
      default: 1,
    },
    /** Max page buttons to show before collapsing */
    totalVisible: {
      type: Number,
      default: 7,
    },
  },

  computed: {
    currentPage: {
      get() {
        return this.value;
      },
      set(page) {
        this.$emit("input", page);
      },
    },
  },
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
