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
footer {
  margin-top: 70px;
  padding: 70px 0 10px;
  background-color: #3a3798;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}

.register {
  margin-bottom: 50px;
}

.social {
  padding-left: 0;
}

h3 {
  color: #f9c88e !important;
  margin-bottom: 55px;
}

input {
  padding: 10px;
  border-radius: 12px;
  font-size: 20px;
  border: none;
  border: 1px solid;
}

input[type="email"] {
  border-color: #000;
  margin-bottom: 10px;
}

input[type="submit"] {
  background-color: rgba(255, 94, 148, 0.8);
  border-color: transparent;
}

input[type="submit"]:hover {
  background-color: rgba(255, 94, 148, 0.9);
}

.social-media ul {
  padding: 13px 7px;
  background-color: rgba(255, 255, 255, 0.05);
  justify-content: space-around;
  border-radius: 10px;
}

.social-media i {
  font-size: 29px;
}

.social-media li:first-of-type i:hover {
  color: #fd1d1d;
}

.social-media li:nth-of-type(2) i:hover {
  color: #2867b2;
}

.social-media li:nth-of-type(3) i:hover {
  color: #1da1f2;
}

.social-media li:last-of-type i:hover {
  color: #6699ff;
}

.social-media i {
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

.footer-logo {
  padding: 0;
}

img {
  margin-bottom: 15px;
}

p {
  font-size: 15px;
  font-family: "Almarai";
  line-height: 25px;
  margin-bottom: 25px;
  word-spacing: 2px;
}

.copy-right {
  border-top: 2px solid rgba(255, 255, 255, 0.09);
  padding: 15px 0 0px;
  margin: 0 !important;
  margin-top: 20px !important;
}

.copy-right h4 {
  font-family: "Almarai";
  font-size: 18px;
}

@media only screen and (max-width: 600px) {
  footer {
    margin-top: 40px !important;
  }

  .footer-menu {
    justify-content: center !important;
  }

  .social {
    margin: 45px auto 0;
    padding-left: 15px !important;
  }

  .social-media ul {
    justify-content: space-around !important;
  }

  footer h3 {
    font-size: 25px !important;
    margin-bottom: 35px !important;
  }

  .footer-logo {
    margin: 0 auto 45px !important;
    padding: 0 15px !important;
  }

  .footer-logo img {
    width: 80% !important;
    margin: 0 auto 15px;
  }

  /* Ltr Direction Style */
  .ltr footer .row {
    margin-right: 0 !important;
    margin-left: 3px !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  footer .row {
    margin-right: 0 !important;
  }

  .footer-menu {
    justify-content: center !important;
  }

  .social-media ul {
    justify-content: space-around !important;
  }

  .social {
    margin: 45px auto 0;
  }

  footer h3 {
    margin-bottom: 35px;
  }

  .footer-logo {
    margin: 0 auto 45px !important;
  }

  .footer-logo img {
    width: 85% !important;
    margin: 0 auto 15px;
  }
}

@media only screen and (min-width: 767px) and (max-width: 992px) {
  footer h3 {
    margin-bottom: 30px !important;
  }

  .feature-row {
    justify-content: space-between !important;
  }

  .footer-logo {
    margin: 10px auto 50px !important;
  }

  .social,
  .footer-logo {
    padding: 0 45px !important;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  footer h3 {
    font-size: 25px;
    margin-bottom: 45px !important;
  }

  footer p {
    font-size: 11px !important;
  }

  .footer-logo {
    margin: auto !important;
  }
}

/* Ltr Direction Style */
.ltr .footer-menu ul {
  text-align: left !important;
  padding-left: 0 !important;
}
</style>
