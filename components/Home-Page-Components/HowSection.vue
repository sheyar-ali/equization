<template>
  <!-- How It Works Section-->
  <section class="d-flex how">
    <div class="container">
      <SectionTitle :TitleText="$t('howSection.howTitle')" />
      <div class="how-header wow zoomIn">
        <!-- Departments Menu -->
        <ul class="parts-menu list-unstyled d-flex mx-auto">
          <li
            class="active first-link font-weight-bold"
            @click="activeFirstPart"
          >
            {{ $t("howSection.partsMenu.firstPart") }}
          </li>
          <li class="second-link font-weight-bold" @click="activeSecondPart">
            {{ $t("howSection.partsMenu.secondPart") }}
          </li>
        </ul>
        <!-- First Department -->
        <div
          class="first-department departments active-department how-content w-100 choose d-flex"
        >
          <v-col lg="3" md="11" cols="12" class="create-box">
            <div
              class="create d-flex w-100 create-active"
              id="make-account-btn"
              @click="setActive('make-account')"
            >
              <p class="create-number text-white d-flex font-weight-bold">1</p>
              <p class="create-text text-center font-weight-bold">
                {{
                  $t("howSection.firstDepartment.firstDepartmentMenu.firstLink")
                }}
              </p>
            </div>
            <div class="separate"></div>
            <div
              class="create d-flex w-100"
              @click="setActive('create-quiz')"
              id="create-quiz-btn"
            >
              <p class="create-number text-white d-flex font-weight-bold">2</p>
              <p class="create-text text-center font-weight-bold">
                {{
                  $t(
                    "howSection.firstDepartment.firstDepartmentMenu.secondLink"
                  )
                }}
              </p>
            </div>
            <div class="separate"></div>
            <div
              class="create d-flex w-100"
              @click="setActive('share-quiz')"
              id="share-quiz-btn"
            >
              <p class="create-number text-white d-flex font-weight-bold">3</p>
              <p class="create-text text-center font-weight-bold">
                {{
                  $t("howSection.firstDepartment.firstDepartmentMenu.lastLink")
                }}
              </p>
            </div>
          </v-col>
          <v-col lg="9" md="12" cols="12" class="create-account">
            <!-- Create Account -->
            <v-row class="w-100 active-box" id="make-account">
              <v-col lg="9" cols="12" class="account-content text-center">
                <h4 class="text-muted text-justify">
                  {{
                    $t(
                      "howSection.firstDepartment.firstDepartmentBoxes.firstBox.boxTitle"
                    )
                  }}
                </h4>
                <nuxt-link :to="localePath('/signup')">{{
                  $t(
                    "howSection.firstDepartment.firstDepartmentBoxes.firstBox.boxLink"
                  )
                }}</nuxt-link>
              </v-col>
              <v-col lg="3" cols="12" md="7" class="account-img">
                <img
                  :src="
                    require('@/assets/images/Home-Page-Images/register.png')
                  "
                  class="d-block w-100"
                  alt="account-img"
                />
              </v-col>
            </v-row>
            <!-- Create Quiz -->
            <v-row class="w-100" id="create-quiz">
              <v-col lg="9" cols="12" class="account-content text-center">
                <h4 class="text-muted text-justify">
                  {{
                    $t(
                      "howSection.firstDepartment.firstDepartmentBoxes.secondBox.boxTitle"
                    )
                  }}
                  <ul class="text-right">
                    <li>
                      {{
                        $t(
                          "howSection.firstDepartment.firstDepartmentBoxes.secondBox.firstBoxLink"
                        )
                      }}
                    </li>
                    <li>
                      {{
                        $t(
                          "howSection.firstDepartment.firstDepartmentBoxes.secondBox.secondBoxLink"
                        )
                      }}
                    </li>
                    <li>
                      {{
                        $t(
                          "howSection.firstDepartment.firstDepartmentBoxes.secondBox.lastBoxLink"
                        )
                      }}
                    </li>
                  </ul>
                </h4>
                <nuxt-link :to="localePath('/quizes/add')">{{
                  $t(
                    "howSection.firstDepartment.firstDepartmentBoxes.secondBox.boxLink"
                  )
                }}</nuxt-link>
              </v-col>
              <v-col lg="3" md="7" cols="12" class="account-img">
                <img
                  :src="require('@/assets/images/Home-Page-Images/1-2.png')"
                  class="d-block w-100"
                  alt="account-img"
                />
              </v-col>
            </v-row>
            <!-- Share Quiz -->
            <v-row class="w-100" id="share-quiz">
              <v-col lg="9" cols="12" class="account-content text-center">
                <h4 class="text-muted text-justify last">
                  {{
                    $t(
                      "howSection.firstDepartment.firstDepartmentBoxes.thirdBox.boxTitle"
                    )
                  }}
                </h4>
                <nuxt-link :to="localePath('/quizes/add')">{{
                  $t(
                    "howSection.firstDepartment.firstDepartmentBoxes.thirdBox.boxLink"
                  )
                }}</nuxt-link>
              </v-col>
              <v-col lg="3" md="7" cols="12" class="account-img">
                <img
                  :src="require('@/assets/images/Home-Page-Images/1-3.png')"
                  class="d-block w-100"
                  alt="account-img"
                />
              </v-col>
            </v-row>
          </v-col>
        </div>
        <!-- Second Department -->
        <div
          class="second-department departments how-content w-100 choose d-flex"
        >
          <v-col lg="3" md="11" cols="12" class="create-box">
            <div
              class="create d-flex w-100 second-create-active"
              id="choose-style-btn"
              @click="setSecondActive('choose-style')"
            >
              <p class="create-number text-white d-flex font-weight-bold">1</p>
              <p class="create-text text-center font-weight-bold">
                {{
                  $t(
                    "howSection.secondDepartment.secondDepartmentMenu.firstLink"
                  )
                }}
              </p>
            </div>
            <div class="separate"></div>
            <div
              class="create d-flex w-100"
              @click="setSecondActive('quiz-contact')"
              id="quiz-contact-btn"
            >
              <p class="create-number text-white d-flex font-weight-bold">2</p>
              <p class="create-text text-center font-weight-bold">
                {{
                  $t(
                    "howSection.secondDepartment.secondDepartmentMenu.secondLink"
                  )
                }}
              </p>
            </div>
            <div class="separate"></div>
            <div
              class="create d-flex w-100"
              @click="setSecondActive('start')"
              id="start-btn"
            >
              <p class="create-number text-white d-flex font-weight-bold">3</p>
              <p class="create-text text-center font-weight-bold">
                {{
                  $t(
                    "howSection.secondDepartment.secondDepartmentMenu.lastLink"
                  )
                }}
              </p>
            </div>
          </v-col>
          <v-col lg="9" md="12" class="create-account">
            <!-- Create Account -->
            <v-row class="w-100 active-box" id="choose-style">
              <v-col lg="9" cols="12" class="account-content text-center">
                <h4 class="text-muted text-justify">
                  {{
                    $t(
                      "howSection.secondDepartment.secondDepartmentBoxes.firstBox.boxTitle"
                    )
                  }}
                  <ul class="text-justify">
                    <li>
                      {{
                        $t(
                          "howSection.secondDepartment.secondDepartmentBoxes.firstBox.firstBoxLink"
                        )
                      }}
                    </li>
                    <li>
                      {{
                        $t(
                          "howSection.secondDepartment.secondDepartmentBoxes.firstBox.secondBoxLink"
                        )
                      }}
                    </li>
                  </ul>
                </h4>
              </v-col>
              <v-col lg="3" cols="12" md="7" class="account-img">
                <img
                  :src="require('@/assets/images/Home-Page-Images/2-1.png')"
                  class="d-block w-100"
                  alt="account-img"
                />
              </v-col>
            </v-row>
            <!-- Create Quiz -->
            <v-row class="w-100" id="quiz-contact">
              <v-col cols="12" lg="9" class="account-content text-center">
                <h4 class="text-muted text-justify">
                  {{
                    $t(
                      "howSection.secondDepartment.secondDepartmentBoxes.secondBox.boxTitle"
                    )
                  }}
                  <ul class="text-right">
                    <li>
                      {{
                        $t(
                          "howSection.secondDepartment.secondDepartmentBoxes.secondBox.firstBoxLink"
                        )
                      }}
                    </li>
                    <li>
                      {{
                        $t(
                          "howSection.secondDepartment.secondDepartmentBoxes.secondBox.secondBoxLink"
                        )
                      }}
                    </li>
                    <li>
                      {{
                        $t(
                          "howSection.secondDepartment.secondDepartmentBoxes.secondBox.lastBoxLink"
                        )
                      }}
                    </li>
                  </ul>
                </h4>
              </v-col>
              <v-col lg="3" md="7" cols="12" class="account-img">
                <img
                  :src="require('@/assets/images/Home-Page-Images/2-2.png')"
                  class="d-block w-100"
                  alt="account-img"
                />
              </v-col>
            </v-row>
            <!-- Share Quiz -->
            <v-row class="w-100" id="start">
              <v-col lg="9" cols="12" class="account-content text-center">
                <h4 class="text-muted text-justify">
                  {{
                    $t(
                      "howSection.secondDepartment.secondDepartmentBoxes.thirdBox.boxTitle"
                    )
                  }}
                  <ul class="text-justify">
                    <li>
                      {{
                        $t(
                          "howSection.secondDepartment.secondDepartmentBoxes.thirdBox.firstBoxLink"
                        )
                      }}
                    </li>
                    <li>
                      {{
                        $t(
                          "howSection.secondDepartment.secondDepartmentBoxes.thirdBox.secondBoxLink"
                        )
                      }}
                    </li>
                    <li>
                      {{
                        $t(
                          "howSection.secondDepartment.secondDepartmentBoxes.thirdBox.lastBoxLink"
                        )
                      }}
                    </li>
                  </ul>
                </h4>
                <nuxt-link :to="localePath('/play-sub-domain')">{{
                  $t(
                    "howSection.secondDepartment.secondDepartmentBoxes.thirdBox.boxLink"
                  )
                }}</nuxt-link>
              </v-col>
              <div class="account-img col-lg-3 col-md-7 col-12">
                <img
                  :src="require('@/assets/images/Home-Page-Images/2-3.png')"
                  class="d-block w-100"
                  alt="account-img"
                />
              </div>
            </v-row>
          </v-col>
        </div>
      </div>
    </div>
  </section>
  <!-- End How-It-Works Section -->
</template>

<script>
import SectionTitle from "../Home-Page-Components/SectionTitle";
export default {
  name: "HowSection",
  methods: {
    setActive: function(ID) {
      // First Department
      document
        .querySelectorAll(".first-department .create-account .row")
        .forEach(function(row) {
          row.classList.remove("active-box");
        });
      document.querySelectorAll(".create").forEach(function(row) {
        row.classList.remove("create-active");
      });
      document.getElementById(ID).classList.add("active-box");
      document.getElementById(ID + "-btn").classList.add("create-active");
    },
    setSecondActive: function(ID) {
      // Second Department
      document
        .querySelectorAll(".second-department .create-account .row")
        .forEach(function(row) {
          row.classList.remove("active-box");
        });
      document.querySelectorAll(".create").forEach(function(row) {
        row.classList.remove("second-create-active");
      });
      document.getElementById(ID).classList.add("active-box");
      document
        .getElementById(ID + "-btn")
        .classList.add("second-create-active");
    },
    activeFirstPart: function() {
      document
        .querySelector(".first-department")
        .classList.add("active-department");
      document
        .querySelector(".second-department")
        .classList.remove("active-department");
      document.querySelector(".first-link").classList.add("active");
      document.querySelector(".second-link").classList.remove("active");
    },
    activeSecondPart: function() {
      document
        .querySelector(".second-department")
        .classList.add("active-department");
      document
        .querySelector(".first-department")
        .classList.remove("active-department");
      document.querySelector(".second-link").classList.add("active");
      document.querySelector(".first-link").classList.remove("active");
    },
  },
  components: {
    SectionTitle,
  },
};
</script>

<style scoped>
/* Start Of How It Works Section */
.how {
  background-color: #effbfb;
  border-bottom-left-radius: 280px;
}

.departments {
  display: none !important;
  background-color: #fff;
}

.active-department {
  display: flex !important;
}

.parts-menu {
  justify-content: center;
  padding-left: 0 !important;
}

.parts-menu li {
  margin: 0 3px;
  padding: 5px 15px;
  color: #3a3798;
  font-size: 18px;
  border: 2px solid #3a3798;
  border-bottom-width: 0;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  cursor: pointer;
}

.parts-menu li.active,
.parts-menu li:hover {
  background-color: #36399a;
  color: #fff;
}

.how-content {
  padding: 30px 20px;
  border: 2px solid #efedff;
  border-radius: 10px;
  -webkit-box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
  -moz-box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
  -ms-box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
  -o-box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
  box-shadow: 12px 12px 55px rgba(60, 55, 152, 0.07);
}

.create-box {
  padding: 10px;
  border-left: 2px solid #efedff;
}

.create {
  padding: 7px 10px;
  margin: 1px 0;
  border-radius: 10px;
  cursor: pointer;
}

.create-active,
.second-create-active {
  background-color: rgba(255, 230, 230, 0.5);
}

.create,
.create-number,
.create-account .row {
  -webkit-transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
    display 0.2s ease-in-out;
  -moz-transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
    display 0.2s ease-in-out;
  -ms-transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
    display 0.2s ease-in-out;
  -o-transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
    display 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
    display 0.2s ease-in-out;
}

.create:hover {
  background-color: rgba(255, 230, 230, 0.5);
}

.create-active .create-number,
.second-create-active .create-number {
  background-color: #ff5e94;
  color: #fff;
}

.create-active .create-text,
.second-create-active .create-text {
  color: #ff5e94;
}

.create-number {
  width: 45px;
  height: 45px;
  background-color: #d4d0d1;
  border-radius: 50%;
  justify-content: center;
  font-size: 22px;
  color: #aaabab;
  margin-bottom: 0 !important;
}

.create-text {
  width: 75%;
  color: #d4d0d1;
  font-size: 22px;
  font-family: "Almarai";
  margin-bottom: 0 !important;
}

.separate {
  height: 60px;
  width: 2px;
  background-color: #efedff;
  border-radius: 20px;
  margin-right: 30px;
}

.account-content h4 {
  font-size: 23px;
  font-family: "Almarai";
  line-height: 40px;
  margin-bottom: 35px;
}

.account-content ul {
  padding-right: 23px;
}

.account-content h4 li {
  font-size: 18px;
  margin: 10px 0;
  line-height: 29px;
}

.account-content a {
  font-size: 20px;
  padding: 9px 20px;
  font-family: "Almarai";
  color: #ff5e94;
  background-color: transparent;
  border: 2px solid #ff5e94;
  border-radius: 10px;
}

.account-content a,
.parts-menu li {
  -webkit-transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  -moz-transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  -ms-transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  -o-transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.account-content a:hover {
  background-color: #ff5e94;
  color: #effbfb;
}

.create-account {
  padding-left: 0;
  padding-right: 50px;
}

.create-account .row {
  display: none;
}

.active-box {
  display: flex !important;
}
/* End Of Section Hoe It Works */

@media only screen and (max-width: 600px) {
  .parts-menu li {
    margin: 0 1px !important;
    padding: 8px 17px !important;
    font-size: 13px !important;
  }

  .how .departments {
    flex-direction: column;
  }

  .create-box {
    display: flex;
    max-width: 100% !important;
    margin-bottom: 30px;
    flex-direction: column;
  }

  .how-content {
    padding: 30px 0px !important;
  }

  .create-number {
    width: 25px !important;
    height: 25px !important;
    font-size: 16px !important;
  }

  .create-text {
    width: 87% !important;
    text-align: right !important;
    margin-right: 3px !important;
  }

  .create {
    margin: 9px 0 !important;
  }

  .separate {
    display: none;
  }

  .create-account {
    padding: 0 10px !important;
  }

  .row.active-box {
    margin: -12px 0 !important;
  }

  .account-content h4 {
    font-size: 20px !important;
    line-height: 34px !important;
  }

  .account-content h4 li {
    font-size: 16px !important;
  }

  .account-content a,
  .create-text {
    font-size: 18px !important;
  }

  .account-img {
    margin: 15px auto 0;
  }

  .account-img img {
    width: 55% !important;
    margin: auto;
  }

  /* Ltr Direction Style */
}

@media only screen and (min-width: 600px) and (max-width: 992px) {
  .how .departments {
    flex-direction: column;
  }

  .create-box {
    display: flex;
    max-width: 95% !important;
    margin-bottom: 30px;
  }

  .create-box {
    border: 0 !important;
  }

  .create-number {
    width: 35px !important;
    height: 35px !important;
  }

  .create-text {
    width: 90% !important;
    font-size: 20px !important;
    margin-right: 6px;
  }

  .separate {
    display: none;
  }

  .account-img {
    margin: 40px auto 0;
  }

  .account-img img {
    width: 60% !important;
    margin: auto;
  }

  .account-content h4 {
    font-size: 20px !important;
  }

  .account-content a {
    font-size: 18px !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 767px) {
  .how-content {
    padding: 30px 0px !important;
  }

  .create-number {
    width: 25px !important;
    height: 25px !important;
    font-size: 16px !important;
  }

  .create-text {
    margin-right: 3px !important;
  }

  .account-content h4 {
    font-size: 18px !important;
    line-height: 34px !important;
  }

  .account-content h4 li {
    font-size: 16px !important;
  }

  .account-content a,
  .create-text {
    font-size: 16px !important;
  }

  .account-img img {
    width: 54% !important;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1200px) {
  .how .departments {
    flex-direction: column;
  }

  .create-box {
    display: flex;
    max-width: 100% !important;
    margin-bottom: 30px;
    border-left: none !important;
  }

  .account-img,
  .account-img img {
    margin: auto !important;
  }

  .account-img img {
    margin-top: 20px !important;
    width: 60% !important;
  }

  .account-content h4 {
    font-size: 20px !important;
    line-height: 33px !important;
  }

  .account-content a {
    font-size: 18px !important;
  }
}

/* Ltr Direction Style */
.ltr .create-text {
  font-size: 18px !important;
  border-left: 0 !important;
}

.ltr .create-account {
  padding-right: 0 !important;
  padding-left: 50px !important;
}

.ltr .account-content ul {
  padding-right: 0 !important;
  padding-left: 27px !important;
  text-align: left !important;
}

.ltr .create-box {
  border-left: none !important;
  border-right: 2px solid #efedff;
  margin-right: 13px;
}

.ltr .separate {
  margin-right: 0 !important;
  margin-left: 32px !important;
}

@media only screen and (max-width: 600px) {
  .ltr .parts-menu {
    padding-left: 0 !important;
  }

  .ltr .create-text {
    text-align: left !important;
  }

  body.ltr .create-account {
    padding: 0 10px !important;
  }
}
</style>
