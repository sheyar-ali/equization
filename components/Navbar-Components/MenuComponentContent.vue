<template>
  <li>
    <nuxt-link
      class="text-center bg-white d-inline-block"
      :to="localePath(linkPath)"
    >
      <i :class="`d-flex text-white ${iconClass}`"></i>
      <span class="font-weight-bold">{{ linkContent }}</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "MenuComponentContent",
  props: ["linkPath", "iconClass", "linkContent"],
};
</script>

<style scoped>
a {
  width: 265px;
  padding: 10px;
  margin-bottom: 25px;
  border-radius: 20px;
  position: relative;
  transition: transform 0.2s ease-in-out;
  -webkit-transition: transform 0.2s ease-in-out;
  -moz-transition: transform 0.2s ease-in-out;
  -ms-transition: transform 0.2s ease-in-out;
  -o-transition: transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
}

a:hover {
  transform: translateX(-10px);
}

i {
  position: absolute;
  top: -2px;
  right: -3px;
  font-size: 28px;
  background-color: #ff5e94;
  width: 50px;
  height: 50px;
  justify-content: center;
  border-radius: 50%;
}

span {
  font-size: 18px;
  margin-right: 15px;
  color: rgba(58, 55, 152, 0.9);
}

.top-menu-links i.close-icon {
  color: #ffc961 !important;
}

li:first-of-type {
  margin-right: 160px;
}

li:nth-of-type(2) {
  margin-right: 140px;
}

li:nth-of-type(3) {
  margin-right: 120px;
}

li:nth-of-type(4) {
  margin-right: 100px;
}

li:nth-of-type(5) {
  margin-right: 80px;
}

li:nth-of-type(6) {
  margin-right: 60px;
}

li:nth-of-type(7) {
  margin-right: 40px;
}

li:nth-of-type(8) {
  margin-right: 20px;
}

li:last-of-type {
  margin-right: 0px;
}

@media only screen and (max-width: 600px) {
  li {
    margin-right: 7px !important;
  }

  li a {
    margin-bottom: 10px;
  }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  li:first-of-type {
    margin-right: 80px !important;
  }

  li:nth-of-type(2) {
    margin-right: 70px !important;
  }

  li:nth-of-type(3) {
    margin-right: 60px !important;
  }

  li:nth-of-type(4) {
    margin-right: 50px !important;
  }

  li:nth-of-type(5) {
    margin-right: 40px !important;
  }

  li:nth-of-type(6) {
    margin-right: 30px !important;
  }

  li:nth-of-type(7) {
    margin-right: 20px !important;
  }

  li:nth-of-type(8) {
    margin-right: 10px !important;
  }

  li:last-of-type {
    margin-right: 0px !important;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  li:first-of-type {
    margin-right: 80px !important;
  }

  li:nth-of-type(2) {
    margin-right: 70px !important;
  }

  li:nth-of-type(3) {
    margin-right: 60px !important;
  }

  li:nth-of-type(4) {
    margin-right: 50px !important;
  }

  li:nth-of-type(5) {
    margin-right: 40px !important;
  }

  li:nth-of-type(6) {
    margin-right: 30px !important;
  }

  li:nth-of-type(7) {
    margin-right: 20px !important;
  }

  li:nth-of-type(8) {
    margin-right: 10px !important;
  }

  li:last-of-type {
    margin-right: 0px !important;
  }
}

/* Ltr Direction Style */
.ltr li:first-of-type {
  margin-left: 160px;
}

.ltr li:nth-of-type(2) {
  margin-left: 140px;
}

.ltr li:nth-of-type(3) {
  margin-left: 120px;
}

.ltr li:nth-of-type(4) {
  margin-left: 100px;
}

.ltr li:nth-of-type(5) {
  margin-left: 80px;
}

.ltr li:nth-of-type(6) {
  margin-left: 60px;
}

.ltr li:nth-of-type(7) {
  margin-left: 40px;
}

.ltr li:nth-of-type(8) {
  margin-left: 20px;
}

.ltr li:last-of-type {
  margin-left: 0px;
}

.ltr a:hover {
  transform: translateX(10px) !important;
}

.ltr li {
  margin-right: 0 !important;
}

.ltr i {
  right: auto !important;
  left: -3px !important;
}

.ltr span {
  margin-right: 0 !important;
  margin-left: 15px !important;
}

@media only screen and (max-width: 600px) {
  .ltr li {
    margin-left: 0 !important;
  }
}
</style>
