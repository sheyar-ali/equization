<template>
  <li>
    <nuxt-link
      :to="localePath(linkPath)"
      class="font-weight-bold d-d-flex w-100"
    >
      <i class="fas fa-angle-left"></i>
      <span class="text-white">{{ linkContent }}</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "FooterContent",
  props: ["linkPath", "linkContent"],
};
</script>

<style scoped>
li {
  margin-bottom: 7px;
}

i {
  color: #f9c88e;
}

a:hover span {
  color: #f9c88e !important;
}

a:hover i {
  color: #fff !important;
}

span {
  font-family: "Almarai";
  font-size: 16px;
}

i {
  font-size: 16px;
  margin-left: 5px;
  font-size: 15px;
}

span,
i {
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

@media only screen and (max-width: 600px) {
  ul {
    padding-left: 0 !important;
  }

  li {
    margin-bottom: 18px !important;
  }

  span {
    font-size: 18px;
  }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  li {
    margin-bottom: 18px;
  }

  span {
    font-size: 18px;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  li {
    margin-bottom: 15px !important;
  }

  span {
    font-size: 18px;
  }
}

/* Ltr Direction Style */
.ltr i {
  margin-left: 0 !important;
  margin-right: 5px;
  transform: rotate(180deg) !important;
}
</style>
