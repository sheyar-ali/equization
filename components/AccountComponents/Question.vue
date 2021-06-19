<template>
  <v-col md="6" cols="12" class="question-col overflow-hidden">
    <div class="question-container d-flex w-100 h-100 justify-space-between">
      <div
        class="question-img h-100 overflow-hidden d-flex align-center justify-center"
      >
        <img
          v-if="imgSrc"
          class="w-100 h-100"
          style="width: 36%; background-color: #8688c1; border-radius: 10px; object-fit: cover;"
          :src="imgSrc"
          alt="question-img"
        />
        <div
          class="default-img d-flex align-center"
          style="margin: 20px; min-height: 100%"
          v-else
        >
          <img
            src="@/assets/images/Home-Page-Images/question.png"
            style="width: 65px; filter:invert(1)"
          />
        </div>
      </div>
      <div class="question-content h-100">
        <h3 class="question-title">
          {{ questionTitle }}
        </h3>
        <p
          class="question-description d-flex align-center justify-content-start"
        >
          <span>{{
            ` ${$t("questionPage.questionTimeTitle")} ${questionTime} ${$t(
              "questionPage.second"
            )}`
          }}</span>
          <!-- <span> - </span> -->
          <span>
            <span class="dash">-</span>
            {{ $t("questionPage.answersNumberTitle") }}
            {{ answersNumber }}</span
          >
        </p>
        <div class="question-icons d-flex">
          <!-- edit -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="pink accent-1"
                @click="$router.push(localePath('/quizes/questions/edit'))"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("questionPage.icons.edit") }}</span>
          </v-tooltip>

          <!-- delete -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="pink accent-1"
                v-on="on"
                v-bind="attrs"
                @click="deleteQuestion = true"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("questionPage.icons.delete") }}</span>
          </v-tooltip>

          <!-- copy -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="pink accent-1"
                v-bind="attrs"
                v-on="on"
                @click="copyQuestion = true"
              >
                <v-icon class="special-icon">
                  mdi-content-copy
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("questionPage.icons.copy") }}</span>
          </v-tooltip>

          <!-- move -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="pink accent-1"
                v-bind="attrs"
                v-on="on"
                @click="moveQuestion = true"
              >
                <v-icon>
                  mdi-file-move
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("questionPage.icons.move") }}</span>
          </v-tooltip>
        </div>
      </div>
    </div>

    <!-- delete dialog -->
    <v-dialog v-model="deleteQuestion" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">
          {{ $t("questionPage.deleteDialog.title") }}
        </v-card-title>
        <v-divider></v-divider>
        <p class="text-center mt-5 h5">
          {{ $t("questionPage.deleteDialog.question") }}
        </p>
        <v-row class="px-10 pt-2 pb-5">
          <v-col class="pa-2">
            <v-btn
              outlined
              color="white"
              class="w-100"
              style="height: 50px; min-width: 150px !important; width: auto !important; background-color: #ff5e94; border: none !important; font-size: 18px;"
            >
              <v-icon class="mx-2 text-white" style="color: #fff !important">
                mdi-trash-can-outline
              </v-icon>
              <span style="font-family: 'Almarai'">
                {{ $t("questionPage.deleteDialog.title") }}
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- copy dialog -->
    <v-dialog v-model="copyQuestion" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">
          {{ $t("questionPage.copyDialog.title") }}
        </v-card-title>
        <v-divider></v-divider>
        <v-select
          class="questions-select"
          :items="items"
          :label="$t('questionPage.copyDialog.title')"
          solo
        ></v-select>
        <v-row class="px-10 pt-2 pb-5">
          <v-col class="pa-2">
            <v-btn outlined color="primary" class="w-100" style="height: 50px;">
              <span style="font-family: 'Almarai'" class="font-weight-bold">{{
                $t("questionPage.copyDialog.title")
              }}</span>
            </v-btn>
          </v-col>
          <v-col class="pa-2">
            <v-btn outlined @click="copyQuestion = false" color="primary" class="w-100" style="height: 50px;">
              <span style="font-family: 'Almarai'" class="font-weight-bold">{{
                $t("questionPage.copyDialog.close")
              }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- move dialog -->
    <v-dialog v-model="moveQuestion" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">
          {{ $t("questionPage.moveDialog.title") }}
        </v-card-title>
        <v-divider></v-divider>
        <v-select
          class="questions-select"
          :items="items"
          :label="$t('questionPage.moveDialog.title')"
          solo
        ></v-select>
        <v-row class="px-10 pt-2 pb-5">
          <v-col class="pa-2">
            <v-btn outlined color="primary" class="w-100" style="height: 50px;">
              <span style="font-family: 'Almarai'" class="font-weight-bold">{{
                $t("questionPage.moveDialog.title")
              }}</span>
            </v-btn>
          </v-col>
          <v-col class="pa-2">
            <v-btn outlined @click="moveQuestion = false" color="primary" class="w-100" style="height: 50px;">
              <span style="font-family: 'Almarai'" class="font-weight-bold">{{
                $t("questionPage.copyDialog.close")
              }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  name: "Question",
  data() {
    return {
      items: ["تجرية إختبار عنوان تجريبي"],
      editQuestion: false,
      deleteQuestion: false,
      copyQuestion: false,
      moveQuestion: false,
    };
  },
  props: ["imgSrc", "questionTitle", "questionTime", "answersNumber"],
};
</script>

<style scoped>
.question-col {
  padding-bottom: 0 !important;
}

.question-col:nth-of-type(odd) {
  padding-left: 7px !important;
}

.question-col:nth-of-type(even) {
  padding-right: 7px !important;
}

.question-container {
  padding: 15px 14px;
  background-color: #efeff7;
  border-radius: 10px;
}

.question-img {
  width: 38%;
  background-color: #8688c1;
  border-radius: 10px;
}

.question-content {
  padding: 3px 0;
  width: 60%;
  margin-right: 2.5%;
}

h3 {
  font-size: 25.5px;
  line-height: 32px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right !important;
  color: #3a3798;
}

h3,
.question-description {
  text-align: right !important;
}

.question-description {
  margin: 10px 0 5px !important;
  color: #a4abbb;
  font-size: 17.5px;
  max-width: 100%;
  flex-wrap: wrap;
}

.dash {
  margin: 0 5px 0 1px !important;
}

.v-btn--icon.v-size--default {
  height: 33px !important;
  width: 33px !important;
}

.v-application .pink--text.text--accent-1 {
  color: rgba(0, 0, 0, 0.54) !important;
}

i {
  color: #5f5393 !important;
  font-size: 19px !important;
}

.v-dialog {
  overflow: hidden !important;
}

.v-input {
  max-width: 90% !important;
  margin: auto !important;
  margin-bottom: -20px !important;
}

.v-dialog .v-card {
  overflow: hidden !important;
  text-align: center;
  min-height: 200px;
}

.questions-select
  .v-select__slot
  .v-select__selections
  .theme--light.v-select
  .v-select__selection--comma {
  color: #000 !important;
  font-size: 18px !important;
}

@media only screen and (max-width: 600px) {
  .question-container {
    flex-direction: column !important;
  }

  .question-container,
  .question-icons {
    justify-content: center !important;
    align-items: center !important;
  }

  .question-img {
    width: 100%;
    margin-bottom: 20px;
  }

  .default-img img {
    height: 100px !important;
    object-fit: contain;
  }

  h3,
  .question-description {
    text-align: center !important;
  }

  .question-content,
  .ltr .question-content {
    width: 100%;
    margin-right: 0 !important;
  }

  .dash {
    display: none !important;
  }

  .question-description {
    flex-direction: column !important;
    justify-content: center !important;
    font-size: 20px !important;
    margin: 15px 0 !important;
  }

  .question-icons button {
    margin: 0 5px !important;
  }

  .question-icons i {
    font-size: 23px !important;
  }
}

@media only screen and (min-width: 710px) and (max-width: 960px) {
  .dash {
    display: inline !important;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1200px) {
  .question-container {
    flex-direction: column !important;
  }

  .question-container,
  .question-icons {
    justify-content: center !important;
    align-items: center !important;
  }

  .question-img {
    width: 70%;
    margin-bottom: 10px;
  }

  .question-content,
  .ltr .question-content {
    width: 100%;
    margin-right: 0 !important;
  }

  h3,
  .question-description,
  .ltr h3,
  .ltr .question-description {
    text-align: center !important;
  }

  .question-description {
    justify-content: center !important;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1500px) {
  .dash {
    display: none !important;
  }
}

/* Ltr Direction Style */
.ltr .question-col:nth-of-type(odd) {
  padding-right: 7px !important;
  padding-left: 12px !important;
}

.ltr .question-col:nth-of-type(even) {
  padding-left: 7px !important;
  padding-right: 12px !important;
}

.ltr h3,
.ltr .question-description {
  text-align: left !important;
}

.ltr .dash {
  margin: 0 1px 0 5px !important;
  display: none !important;
}

.ltr .question-content {
  margin-right: 0;
  margin-left: 2.5%;
}

@media only screen and (max-width: 600px) {
  .ltr h3,
  .ltr .question-description {
    text-align: center !important;
  }

  .ltr .dash {
    display: none !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 960px) {
  .ltr .dash {
    display: inline !important;
  }

  .question-col:nth-of-type(odd),
  .question-col:nth-of-type(even) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .ltr .question-description {
    align-items: flex-start !important;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1200px) {
  .ltr h3 {
    text-align: center !important;
  }
}

@media only screen and (min-width: 600px) and (max-width: 1200px) {
  .ltr .question-description {
    flex-direction: column !important;
    justify-content: flex-start !important;
    text-align: left !important;
  }

  .ltr .dash {
    display: none !important;
  }
}
</style>
