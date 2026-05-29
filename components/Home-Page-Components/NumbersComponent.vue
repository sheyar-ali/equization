<!-- Start Numbers Section Component -->
<template>
  <v-col
    :class="wowClass"
    class="numbers-box"
    cols="11"
    sm="10"
    md="7"
    lg="4"
    data-wow-duration="1.2s"
  >
    <div class="num-content d-flex position-relative">
      <div class="num-img position-absolute">
        <img :src="numImgSrc" class="d-block w-100 mx-auto" :alt="numImgAlt" />
      </div>
      <h5 class="num-title font-weight-bold">
        {{ titleText }}
      </h5>
      <p class="num-value font-weight-bold">
        {{ numValue }}
      </p>
    </div>
  </v-col>
</template>

<script>
export default {
  name: "NumbersComponent",
  props: [
    "numImgSrc",
    "numImgAlt",
    "titleText",
    "numValue",
    "wowClass",
    "wowDelay",
  ],
};
</script>

<style scoped>
/* ── Numbers stat card ── */
.num-content {
  align-items: center;
  flex-direction: column;
  padding: 30px 20px 20px;
  border-radius: 32px;
  cursor: default;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(108, 99, 255, 0.12);
  position: relative;
  overflow: visible;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.num-content::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.05), rgba(255, 94, 148, 0.05));
  opacity: 0;
  transition: opacity 0.4s ease;
}
.num-content:hover::before { opacity: 1; }

.num-content:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 24px 60px rgba(54, 57, 153, 0.22), 0 0 40px rgba(255, 196, 97, 0.15);
  border-color: rgba(108, 99, 255, 0.25);
}

/* ── Icon diamond badge ── */
.num-img {
  top: -54px;
  width: 108px;
  height: 108px;
  background: linear-gradient(135deg, #ffc961, #ffb347, #fde4b4);
  padding: 20px;
  border-radius: 28px;
  transform: rotate(-45deg);
  border: none;
  box-shadow: 0 8px 28px rgba(255, 196, 97, 0.5);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.num-content:hover .num-img {
  transform: rotate(0deg);
  border-radius: 50%;
  box-shadow: 0 12px 40px rgba(255, 94, 148, 0.45);
  background: linear-gradient(135deg, #ff5e94, #ff3d7f);
}

.num-img img {
  transform: rotate(45deg);
  filter: invert(1) brightness(1.1);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.num-content:hover .num-img img { transform: rotate(0deg) scale(1.1); }

/* ── Label ── */
.num-title {
  color: #a0a0c0;
  margin: 54px 0 4px;
  font-size: 16px;
  letter-spacing: 0.5px;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

/* ── Big gradient number ── */
.num-value {
  background: linear-gradient(135deg, #1e1b4b, #363999, #6c63ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 72px;
  line-height: 1;
  font-weight: 900;
  position: relative;
  z-index: 1;
}
.num-content:hover .num-value {
  background: linear-gradient(135deg, #ff5e94, #ff3d7f, #ffc961);
  -webkit-background-clip: text;
  background-clip: text;
}

@media only screen and (max-width: 600px) {
  .numbers-box:nth-of-type(2) { margin: 80px 0 !important; }
  .num-value { font-size: 58px !important; }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .numbers-box:nth-of-type(2) { margin: 70px 0 !important; }
}

@media only screen and (min-width: 992px) and (max-width: 1264px) {
  .numbers-box:nth-of-type(2) { margin: 70px 0 !important; }
}
</style>
