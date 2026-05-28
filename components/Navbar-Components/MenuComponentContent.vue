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
  width: 280px;
  padding: 14px 20px 14px 18px;
  margin-bottom: 16px;
  border-radius: 50px;
  position: relative;
  display: flex !important;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), background 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
}

a.menu-link:hover {
  transform: translateX(-8px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(255, 94, 148, 0.3);
  border-color: rgba(255, 94, 148, 0.5);
}

/* Icon circle */
i {
  flex-shrink: 0;
  font-size: 20px;
  color: #fff;
  background: linear-gradient(135deg, #ff5e94, #ff3d7f);
  box-shadow: 0 4px 14px rgba(255, 94, 148, 0.5);
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

a.menu-link:hover i {
  box-shadow: 0 6px 20px rgba(255, 94, 148, 0.8);
  transform: scale(1.12);
}

span {
  font-size: 17px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.3);
  transition: color 0.3s ease;
}

a.menu-link:hover span { color: #ffc961; }

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
