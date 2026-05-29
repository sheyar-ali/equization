<template>
  <li>
    <nuxt-link
      :to="localePath(linkPath)"
      class="font-weight-bold d-flex w-100"
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
  margin-bottom: 9px;
}

a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 10px;
  transition: background 0.25s ease, transform 0.25s ease;
}

a:hover {
  background: rgba(255,255,255,0.07);
  transform: translateX(-4px);
}

i {
  color: #ffc961;
  font-size: 14px;
  transition: color 0.3s ease, transform 0.3s ease;
}

a:hover i {
  color: #ff5e94 !important;
  transform: translateX(-3px);
}

a:hover span {
  color: #ffc961 !important;
}

span {
  font-family: "Almarai";
  font-size: 15px;
  color: rgba(255,255,255,0.8);
  transition: color 0.3s ease;
}

@media only screen and (max-width: 600px) {
  li { margin-bottom: 16px !important; }
  span { font-size: 17px; }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  li { margin-bottom: 16px; }
  span { font-size: 17px; }
}

/* LTR */
.ltr i { margin-left: 0 !important; margin-right: 5px; transform: rotate(180deg) !important; }
.ltr a:hover { transform: translateX(4px); }
.ltr a:hover i { transform: translateX(3px) rotate(180deg); }
</style>
