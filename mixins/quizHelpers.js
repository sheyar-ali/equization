/**
 * quizHelpers mixin
 *
 * Shared utility methods used across multiple quiz-listing pages
 * (index, explore, my-quizzes, quizes-cat).
 */
export default {
  methods: {
    /**
     * Normalise the categories array returned by the API into the shape
     * expected by QuizComponent: [{ categoryName, categoryLink }].
     *
     * Handles both plain-string names and i18n objects { ar, en }.
     */
    formatCategories(categories) {
      if (!categories || !categories.length) return [];
      return categories.map((cat) => ({
        categoryName:
          typeof cat.name === "object"
            ? cat.name[this.$i18n.locale] || cat.name.ar || cat.name.en || ""
            : cat.name || "",
        categoryLink: `/quizes-cat?cat=${cat.slug || cat._id}`,
      }));
    },

    /**
     * Return a CSS animation delay string for a given list index.
     * Cycles through a set of delays so large lists stay snappy.
     */
    getWowDelay(idx) {
      const delays = ["0s", "0.1s", "0.2s", "0.3s", "0.4s", "0.5s", "0.6s", "0.7s"];
      return delays[idx % delays.length];
    },
  },
};
