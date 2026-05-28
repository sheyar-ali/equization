<template>
  <li>
    <nuxt-link
      class="menu-link d-inline-flex align-center"
      :to="localePath(linkPath)"
    >
      <i :class="`d-flex ${iconClass}`"></i>
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
a.menu-link {
  width: 265px;
  padding: 10px 60px 10px 16px;
  margin-bottom: 20px;
  border-radius: 20px;
  position: relative;
  display: block !important;
  background: #fff;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
  text-decoration: none;
}

a.menu-link:hover {
  transform: translateX(-10px);
  box-shadow: 0 8px 30px rgba(255, 94, 148, 0.3);
}

/* Icon — absolute, flush to the right edge, slightly outside the pill */
i {
  position: absolute;
  top: 50%;
  right: -3px;
  transform: translateY(-50%);
  font-size: 22px;
  color: #fff;
  background: linear-gradient(135deg, #ff5e94, #ff3d7f);
  box-shadow: 0 4px 14px rgba(255, 94, 148, 0.5);
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

a.menu-link:hover i {
  box-shadow: 0 6px 22px rgba(255, 94, 148, 0.75);
  transform: translateY(-50%) scale(1.1);
}

span {
  font-size: 18px;
  color: #2d2a8e;
  font-weight: 700;
  font-family: 'Almarai', sans-serif;
  display: block;
  transition: color 0.3s ease;
}

a.menu-link:hover span { color: #ff3d7f; }

/* Staircase offset — RTL */
li:first-of-type  { margin-right: 160px; }
li:nth-of-type(2) { margin-right: 130px; }
li:nth-of-type(3) { margin-right: 100px; }
li:nth-of-type(4) { margin-right: 70px;  }
li:nth-of-type(5) { margin-right: 40px;  }
li:nth-of-type(6) { margin-right: 20px;  }
li:nth-of-type(7) { margin-right: 10px;  }
li:last-of-type   { margin-right: 0;     }

/* Mobile — no staircase */
@media only screen and (max-width: 600px) {
  li { margin-right: 0 !important; }
  a.menu-link { width: 100% !important; margin-bottom: 10px; }
}

/* Tablet */
@media only screen and (min-width: 600px) and (max-width: 992px) {
  li:first-of-type  { margin-right: 80px !important; }
  li:nth-of-type(2) { margin-right: 65px !important; }
  li:nth-of-type(3) { margin-right: 50px !important; }
  li:nth-of-type(4) { margin-right: 35px !important; }
  li:nth-of-type(5) { margin-right: 20px !important; }
  li:nth-of-type(6) { margin-right: 10px !important; }
  li:nth-of-type(7) { margin-right: 5px  !important; }
  li:last-of-type   { margin-right: 0    !important; }
}

/* LTR direction */
.ltr li { margin-right: 0 !important; }
.ltr li:first-of-type  { margin-left: 160px; }
.ltr li:nth-of-type(2) { margin-left: 130px; }
.ltr li:nth-of-type(3) { margin-left: 100px; }
.ltr li:nth-of-type(4) { margin-left: 70px;  }
.ltr li:nth-of-type(5) { margin-left: 40px;  }
.ltr li:nth-of-type(6) { margin-left: 20px;  }
.ltr li:nth-of-type(7) { margin-left: 10px;  }
.ltr li:last-of-type   { margin-left: 0;     }

.ltr a.menu-link:hover { transform: translateX(8px) !important; }

/* Flip icon order for LTR */
.ltr a.menu-link { flex-direction: row-reverse; }

@media only screen and (max-width: 600px) {
  .ltr li { margin-left: 0 !important; }
}
</style>
