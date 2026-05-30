<!-- Start Of The Footer Component -->
<template>
  <footer class="d-flex">
    <v-container class="d-flex footer-container">
      <v-row class="footer-content w-100">
        <v-col lg="3" md="5" cols="12" class="wow zoomIn">
          <div class="footer-menu d-flex w-100">
            <ul class="list-unstyled text-right">
              <!-- FooterContent Component -->
              <FooterContent
                v-for="footerMenuLink in footerMenuLinks"
                :key="footerMenuLink.id"
                :linkPath="footerMenuLink.linkPath"
                :linkContent="footerMenuLink.linkContent"
              />
            </ul>
          </div>
        </v-col>
        <v-col lg="4" md="7" cols="12" class="wow zoomIn social">
          <div class="register w-100">
            <!-- Subscribe Form -->
            <form method="POST" class="form-inline w-100">
              <h3 class="font-weight-bold text-center w-100">
                {{ $t("footer.register.registerTitle") }}
              </h3>
              <!-- Email Input -->
              <input
                type="email"
                class="bg-white d-block w-100 text-center"
                :placeholder="$t('footer.register.EmailInputText')"
                required
              />
              <!-- Submit Button -->
              <input
                type="submit"
                :value="$t('footer.register.registerBtn')"
                class="text-white d-block w-100"
              />
            </form>
          </div>
        </v-col>
        <v-col lg="3" md="7" cols="12" class="wow zoomIn footer-logo">
          <!-- Footer Image -->
          <img
            src="@/assets/images/Home-Page-Images/Eouization.png"
            class="d-block w-100"
          />
          <p class="text-center text-white font-weight-bold">
            {{ $t("footer.footerLogoText") }}
          </p>
          <div class="social-media w-100">
            <!-- Social Media Links -->
            <ul class="list-unstyled d-flex mx-auto">
              <li>
                <!-- Instagram Link -->
                <nuxt-link :to="localePath('/')" class="text-white">
                  <i class="fab fa-instagram"></i>
                </nuxt-link>
              </li>
              <li>
                <!-- Linkedin Link -->
                <nuxt-link :to="localePath('/')" class="text-white">
                  <i class="fab fa-linkedin"></i>
                </nuxt-link>
              </li>
              <li>
                <!-- Twitter Link -->
                <nuxt-link :to="localePath('/')" class="text-white">
                  <i class="fab fa-twitter"></i>
                </nuxt-link>
              </li>
              <li>
                <!-- Facebook Link -->
                <nuxt-link :to="localePath('/')" class="text-white">
                  <i class="fab fa-facebook"></i>
                </nuxt-link>
              </li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-row cols="12" class="wow fadeIn copy-right w-100">
      <div class="container">
        <!-- Copy-Right -->
        <h4 class="text-white text-center w-100 font-weight-bold">
          {{ $t("footer.copyRight") }}
        </h4>
      </div>
    </v-row>
  </footer>
</template>

<script>
import FooterContent from "@/components/Shared-Components/FooterContent";
export default {
  name: "Footer",
  computed: {
    footerMenuLinks() {
      return [
        // Home Page
        {
          id: 1,
          linkPath: "/",
          linkContent: this.$t("footer.footerLinks.firstLink"),
        },
        // Explore Page
        {
          d: 2,
          linkPath: "/explore",
          linkContent: this.$t("footer.footerLinks.secondLink"),
        },
        // About Page
        {
          d: 3,
          linkPath: "/about",
          linkContent: this.$t("footer.footerLinks.thirdLink"),
        },
        // Features Page
        {
          d: 4,
          linkPath: "/features",
          linkContent: this.$t("footer.footerLinks.forthLink"),
        },
        // How it Works Page
        {
          d: 5,
          linkPath: "/howitworks",
          linkContent: this.$t("footer.footerLinks.fifthLink"),
        },
        // Use cases Page
        {
          d: 6,
          linkPath: "/use-cases",
          linkContent: this.$t("menu.menuLinks.useCases"),
        },
        // Contact Us Page
        {
          d: 7,
          linkPath: "/contact",
          linkContent: this.$t("footer.footerLinks.lastLink"),
        },
      ];
    },
  },
  components: {
    FooterContent,
  },
};
</script>

<style scoped>
/* ═══════════════════════════
   Footer – Premium Redesign
   ═══════════════════════════ */
footer {
  margin-top: 70px;
  padding: 80px 0 10px;
  background: linear-gradient(160deg, #1a1760 0%, #2d2a99 40%, #1e1b4b 100%);
  border-top-right-radius: 28px;
  border-top-left-radius: 28px;
  position: relative;
  overflow: hidden;
}

/* Subtle mesh glow */
footer::before {
  content: '';
  position: absolute;
  top: -60px; left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 220px;
  background: radial-gradient(ellipse at center, rgba(108,99,255,0.18) 0%, transparent 70%);
  pointer-events: none;
}

.register {
  margin-bottom: 50px;
}

.social {
  padding-left: 0;
}

h3 {
  color: #ffc961 !important;
  margin-bottom: 48px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

/* ── Subscribe form ── */
input {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 18px;
  border: none;
  outline: none !important;
  width: 100%;
  font-family: "Cairo";
}

input[type="email"] {
  border: 1.5px solid rgba(255,255,255,0.15) !important;
  background: rgba(255,255,255,0.08) !important;
  color: #fff !important;
  margin-bottom: 12px;
  backdrop-filter: blur(8px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
input[type="email"]::placeholder { color: rgba(255,255,255,0.45); }
input[type="email"]:focus {
  border-color: #ffc961 !important;
  box-shadow: 0 0 0 3px rgba(255,196,97,0.2) !important;
}

input[type="submit"] {
  background: linear-gradient(135deg, #ff5e94, #ff3d7f) !important;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  border: none !important;
  box-shadow: 0 6px 24px rgba(255, 94, 148, 0.4);
  transition: all 0.35s ease;
  letter-spacing: 0.5px;
}
input[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(255, 94, 148, 0.6) !important;
}

/* ── Social icons ── */
.social-media ul {
  padding: 14px 10px;
  background: rgba(255,255,255,0.06);
  justify-content: space-around;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(8px);
  gap: 8px;
}

.social-media i {
  font-size: 28px;
  color: rgba(255,255,255,0.7);
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.social-media li:first-of-type i:hover {
  color: #f56040;
  text-shadow: 0 0 20px rgba(245, 96, 64, 0.7);
  transform: translateY(-4px) scale(1.2);
}
.social-media li:nth-of-type(2) i:hover {
  color: #0a66c2;
  text-shadow: 0 0 20px rgba(10, 102, 194, 0.7);
  transform: translateY(-4px) scale(1.2);
}
.social-media li:nth-of-type(3) i:hover {
  color: #1da1f2;
  text-shadow: 0 0 20px rgba(29, 161, 242, 0.7);
  transform: translateY(-4px) scale(1.2);
}
.social-media li:last-of-type i:hover {
  color: #4267b2;
  text-shadow: 0 0 20px rgba(66, 103, 178, 0.7);
  transform: translateY(-4px) scale(1.2);
}

.social-media li a {
  display: inline-block;
}

/* ── Logo column ── */
.footer-logo { padding: 0; }
img { margin-bottom: 15px; }

p {
  font-size: 15px;
  font-family: "Almarai";
  line-height: 26px;
  margin-bottom: 25px;
  word-spacing: 2px;
  color: rgba(255,255,255,0.65);
}

/* ── Copyright bar ── */
.copy-right {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 18px 0 6px;
  margin: 0 !important;
  margin-top: 24px !important;
  background: rgba(0,0,0,0.12);
}

.copy-right h4 {
  font-family: "Almarai";
  font-size: 16px;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.5px;
}

/* ════════════════════
   Responsive
   ════════════════════ */
@media only screen and (max-width: 600px) {
  footer { margin-top: 40px !important; }
  .footer-menu { justify-content: center !important; }
  .social { margin: 45px auto 0; padding-left: 15px !important; }
  .social-media ul { justify-content: space-around !important; }
  footer h3 { font-size: 22px !important; margin-bottom: 30px !important; }
  .footer-logo { margin: 0 auto 45px !important; padding: 0 15px !important; }
  .footer-logo img { width: 80% !important; margin: 0 auto 15px; }
  .ltr footer .row { margin-right: 0 !important; margin-left: 3px !important; }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  footer .row { margin-right: 0 !important; }
  .footer-menu { justify-content: center !important; }
  .social-media ul { justify-content: space-around !important; }
  .social { margin: 45px auto 0; }
  footer h3 { margin-bottom: 35px; }
  .footer-logo { margin: 0 auto 45px !important; }
  .footer-logo img { width: 85% !important; margin: 0 auto 15px; }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  footer h3 { margin-bottom: 30px !important; }
  .footer-logo { margin: 10px auto 50px !important; }
  .social, .footer-logo { padding: 0 45px !important; }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  footer h3 { font-size: 20px; margin-bottom: 40px !important; }
  footer p { font-size: 12px !important; }
  .footer-logo { margin: auto !important; }
}

/* LTR */
.ltr .footer-menu ul { text-align: left !important; padding-left: 0 !important; }
</style>
