<!-- Start Of Why Us Component -->
<template>
  <v-col
    lg="4"
    md="6"
    cols="11"
    class="wow fadeIn feature bg-white feature-content"
    :data-wow-delay="wowDelay"
  >
    <div class="feature-header d-flex">
      <h3 class="font-weight-bold text-right" :featureTitle="featureTitle">
        {{ featureTitle }}
      </h3>
      <img :src="featureImg" :alt="featureImgAlt" />
    </div>
    <p class="feature-text text-justify" :featureText="featureText">
      {{ featureText }}
    </p>
  </v-col>
</template>

<script>
export default {
  name: "WhyUsComponent",
  props: [
    "featureTitle",
    "featureImg",
    "featureImgAlt",
    "featureText",
    "wowDelay",
  ],
};
</script>

<style scoped>
/* ── Feature card ── */
.feature {
  padding: 28px 24px;
  border-radius: 24px;
  margin: 12px 0;
  cursor: default;
  z-index: 2;
  position: relative;
  background: #fff;
  border: 1px solid rgba(108, 99, 255, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Glowing gradient background that reveals on hover */
.feature::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.04) 0%, rgba(255, 94, 148, 0.04) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: inherit;
}
.feature:hover::before { opacity: 1; }

/* Colorful left-edge accent bar */
.feature::after {
  content: '';
  position: absolute;
  top: 20%; bottom: 20%;
  right: 0;
  width: 4px;
  background: linear-gradient(180deg, #363999, #6c63ff, #ff5e94);
  border-radius: 4px 0 0 4px;
  opacity: 0;
  transition: opacity 0.4s ease, top 0.4s ease, bottom 0.4s ease;
}
.feature:hover::after { opacity: 1; top: 10%; bottom: 10%; }

.feature:hover {
  transform: translateY(-10px) scale(1.015);
  box-shadow: 0 20px 60px rgba(54, 57, 153, 0.18), 0 0 30px rgba(255, 94, 148, 0.1);
  border-color: rgba(108, 99, 255, 0.2);
}

/* ── Icon container ── */
.feature img {
  width: 22%;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 4px 10px rgba(255, 196, 97, 0.5));
}
.feature:hover img {
  transform: rotate(-12deg) scale(1.1);
  filter: drop-shadow(0 6px 18px rgba(255, 94, 148, 0.5));
}

.feature-header {
  margin-bottom: 16px;
  align-items: center;
  gap: 14px;
}

/* ── Title ── */
h3 {
  font-size: 22px;
  font-weight: 800;
  color: #1e1b4b;
  line-height: 32px;
  transition: color 0.3s ease;
}
.feature:hover h3 { color: #363999; }

/* ── Description ── */
p {
  font-size: 17px;
  line-height: 30px;
  color: #7c7bb5;
  font-family: "Almarai";
  position: relative;
  z-index: 1;
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  .feature-content {
    flex: 0 0 48.5% !important;
  }
  .feature-content:nth-of-type(even) { margin-right: 15px; }
  .ltr .feature-content:nth-of-type(even) { margin-right: 0; margin-left: 15px !important; }
}

@media only screen and (min-width: 992px) {
  .feature-content { flex: 0 0 32.333333% !important; }
}

.ltr .feature:hover img { transform: rotate(12deg) scale(1.1) !important; }
.ltr .feature::after { right: auto; left: 0; border-radius: 0 4px 4px 0; }
</style>
