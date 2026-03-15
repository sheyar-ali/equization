<template>
  <section>
    <PageTitle :titleText="$t('quizPage.pageTitle')" />

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height:60vh">
      <v-progress-circular indeterminate color="primary" size="70"></v-progress-circular>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <v-icon size="80" color="grey">mdi-alert-circle-outline</v-icon>
      <p class="title mt-4 grey--text">{{ error }}</p>
      <v-btn color="primary" @click="$router.push(localePath('/explore'))">العودة للاختبارات</v-btn>
    </div>

    <!-- Quiz Details -->
    <section v-else-if="quiz" class="quiz-page d-flex mx-auto wow fadeIn">
      <v-container class="rounded overflow-hidden">
        <v-row class="flex-column">
          <v-col cols="12" class="d-flex quiz-header justify-space-between align-center">
            <!-- Back -->
            <span @click="$router.push(localePath('/explore'))" class="d-flex align-center font-weight-bold back-link">
              <i class="fas fa-angle-right back-icon"></i>
              <span class="back-text">{{ $t("quizPage.backLink") }}</span>
            </span>
            <!-- Actions -->
            <div class="popup-icons">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon color="pink accent-1" v-bind="attrs" v-on="on">
                    <i class="fas fa-heart"></i>
                  </v-btn>
                </template>
                <span>{{ $t("quizPage.addToFavorite") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon color="pink accent-1" @click="share = true" v-bind="attrs" v-on="on">
                    <i class="fas fa-share-alt"></i>
                  </v-btn>
                </template>
                <span>{{ $t("quizPage.shareQuiz") }}</span>
              </v-tooltip>
            </div>
            <!-- Start -->
            <v-btn @click="startQuiz = true" class="white--text start-quiz title" text>
              {{ $t("quizPage.startBtn") }}
            </v-btn>
          </v-col>

          <v-divider Horizontal class="rounded"></v-divider>

          <v-col cols="12" class="d-flex justify-space-between quiz-container">
            <v-row>
              <v-col md="6" cols="12">
                <div class="quiz-content">
                  <h1 class="quiz-title font-weight-bold text-justify">{{ quiz.title }}</h1>
                  <p class="title-line rounded"></p>
                  <div class="quiz-description overflow-hidden">
                    <p class="font-weight-bold">{{ quiz.description }}</p>
                    <p class="full-desc" id="fullDesc">{{ quiz.detailedDescription }}</p>
                    <p @click="showDesc = true" class="read-more hidden" id="read-more">
                      {{ $t("quizPage.showMore") }}
                    </p>
                  </div>
                  <v-row class="d-flex w-100 player-details justify-space-between">
                    <PlayersDetails
                      v-for="detail in playersDetails"
                      :key="detail.id"
                      :iconClass="detail.icon"
                      :text="detail.text"
                    />
                  </v-row>
                </div>
              </v-col>
              <v-col md="6" cols="12">
                <div class="quiz-img h-100">
                  <img
                    :src="quiz.coverImage || require('@/assets/images/Home-Page-Images/EQUIZATION.png')"
                    class="d-block w-100 h-100"
                    alt="quiz-img"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-row class="quiz-info justify-space-between">
            <v-col md="6" cols="12" class="quiz-info-content">
              <v-row class="justify-space-between ma-0">
                <QuizInfo
                  v-for="info in quizInfo"
                  :key="info.id"
                  :title="info.infoTitle"
                  :number="info.infoNumber"
                  :imgSrc="info.infoImgSrc"
                />
              </v-row>
            </v-col>
            <v-col class="quiz-categories-content" v-if="quiz.categories && quiz.categories.length">
              <h2 class="w-100 text-right">{{ $t("quizPage.quizCategoriesTitle") }}</h2>
              <v-divider Horizontal class="rounded"></v-divider>
              <div class="d-flex ma-0 quiz-page-categories align-center">
                <Categories
                  v-for="(cat, i) in quiz.categories"
                  :key="i"
                  :catLink="`/quizes-cat?cat=${cat.slug || cat._id}`"
                  :catImgSrc="getCategoryImage(cat.slug)"
                  :catTitle="typeof cat.name === 'object' ? (cat.name.ar || cat.name.en || '') : (cat.name || '')"
                />
              </div>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </section>

    <!-- Share Dialog -->
    <v-dialog v-model="share" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">{{ $t("quizPage.shareQuiz") }}</v-card-title>
        <v-divider></v-divider>
        <ShareNetwork
          v-for="network in networks" :network="network.network" :key="network.network"
          :url="shareURL" :title="quiz ? quiz.title : ''" :quote="quiz ? quiz.title : ''"
        >
          <v-icon class="pa-2" style="font-size: 48px" :color="network.color">{{ network.icon }}</v-icon>
        </ShareNetwork>
      </v-card>
    </v-dialog>

    <!-- Description Dialog -->
    <v-dialog v-model="showDesc" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">{{ $t("quizPage.descriptionTitle") }}</v-card-title>
        <v-divider></v-divider>
        <p class="full-desc pa-5">{{ quiz ? quiz.detailedDescription : '' }}</p>
      </v-card>
    </v-dialog>

    <!-- Start Dialog -->
    <v-dialog v-model="startQuiz" max-width="550px">
      <v-card>
        <v-card-title class="text-center font-weight-bold d-block">{{ $t("quizPage.startBtn") }}</v-card-title>
        <v-divider></v-divider>
        <p class="text-center mt-5 h5">{{ $t("dialog.dialogTitle") }}</p>
        <v-row class="px-10 pt-2 pb-5">
          <v-col class="pa-2">
            <v-btn outlined @click="startIndividual" color="primary" class="w-100" style="height:50px">
              <v-icon class="mx-2">mdi-account-outline</v-icon>
              <span style="font-family:'Almarai'" class="font-weight-bold">{{ $t("dialog.individualPlayer") }}</span>
            </v-btn>
          </v-col>
          <v-col class="pa-2">
            <v-btn @click="startMultiplayer" outlined color="primary" class="w-100" style="height:50px">
              <v-icon class="mx-2">mdi-account-group-outline</v-icon>
              <span style="font-family:'Almarai'" class="font-weight-bold">{{ $t("dialog.multiPlayers") }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import PageTitle     from "@/components/Shared-Components/PageTitle";
import PlayersDetails from "@/components/Quiz-Page-Components/PlayerDetails";
import QuizInfo      from "@/components/Quiz-Page-Components/QuizInfo";
import Categories    from "@/components/Quiz-Page-Components/Categories";

const CATEGORY_IMAGES = {
  'general-knowledge': require('@/assets/images/categories-img/global.png'),
  'foreign-languages': require('@/assets/images/categories-img/languages.png'),
  'arabic-language':   require('@/assets/images/categories-img/languages.png'),
  'history':           require('@/assets/images/categories-img/global.png'),
  'science':           require('@/assets/images/categories-img/global.png'),
  'mathematics':       require('@/assets/images/categories-img/global.png'),
  'geography':         require('@/assets/images/categories-img/global.png'),
  'islamic-studies':   require('@/assets/images/categories-img/global.png'),
  'default':           require('@/assets/images/categories-img/global.png'),
};

export default {
  layout: "form",
  head() {
    return { title: this.quiz ? this.quiz.title : this.$t("quizPage.quizDetails.title") };
  },
  data() {
    return {
      loading:   true,
      error:     null,
      quiz:      null,
      showDesc:  false,
      share:     false,
      startQuiz: false,
      shareURL:  '',
      networks: [
        { network: 'facebook',  icon: 'mdi-facebook',                   color: '#1877f2' },
        { network: 'whatsapp',  icon: 'mdi-whatsapp',                   color: '#25d366' },
        { network: 'telegram',  icon: 'mdi-telegram',                   color: '#0088cc' },
        { network: 'twitter',   icon: 'mdi-twitter',                    color: '#1da1f2' },
        { network: 'email',     icon: 'mdi-email-outline',               color: '#333333' },
      ],
    };
  },
  computed: {
    playersDetails() {
      if (!this.quiz) return [];
      const creator    = this.quiz.creator;
      const creatorName = creator ? (creator.firstName ? `${creator.firstName} ${creator.lastName || ''}`.trim() : creator.username) : '';
      const date = this.quiz.createdAt ? new Date(this.quiz.createdAt).toLocaleDateString('ar-EG') : '';
      return [
        { id: 1, icon: 'far fa-user',           text: creatorName || this.$t("quizPage.playerName") },
        { id: 2, icon: 'far fa-calendar-alt',   text: date        || this.$t("quizPage.dateText")   },
      ];
    },
    quizInfo() {
      if (!this.quiz) return [];
      return [
        {
          id: 1,
          infoTitle:  this.$t("quizPage.questionInfoTitle"),
          infoNumber: String(this.quiz.questions ? this.quiz.questions.length : this.quiz.questionCount || 0),
          infoImgSrc: require("@/assets/images/Home-Page-Images/question.png"),
        },
        {
          id: 2,
          infoTitle:  this.$t("quizPage.playersInfoTitle"),
          infoNumber: String(this.quiz.statistics ? this.quiz.statistics.totalPlayers : 0),
          infoImgSrc: require("@/assets/images/Home-Page-Images/group.png"),
        },
      ];
    },
  },
  async mounted() {
    const id   = this.$route.query.id;
    const code = this.$route.query.code;
    if (id) {
      await this.fetchQuizById(id);
    } else if (code) {
      await this.fetchQuizByCode(code);
    } else {
      this.error   = 'لم يتم تحديد اختبار';
      this.loading = false;
    }
    // Build share URL
    const locale = this.$i18n.locale;
    const quizId = this.quiz ? this.quiz._id : '';
    this.shareURL = locale === 'ar'
      ? `${window.location.origin}/quiz?id=${quizId}`
      : `${window.location.origin}/${locale}/quiz?id=${quizId}`;
    // Show "read more" if description is long
    this.$nextTick(() => {
      const el = document.getElementById('fullDesc');
      if (el && el.innerHTML.length > 150) {
        const rm = document.getElementById('read-more');
        if (rm) rm.classList.remove('hidden');
      }
    });
  },
  methods: {
    async fetchQuizById(id) {
      try {
        this.loading = true;
        const res = await this.$axios.get(`/quizzes/${id}`);
        this.quiz  = res.data?.data;
      } catch (e) {
        this.error = e.response?.data?.message || 'حدث خطأ في تحميل الاختبار';
      } finally {
        this.loading = false;
      }
    },
    async fetchQuizByCode(code) {
      try {
        this.loading = true;
        const res = await this.$axios.get(`/quizzes/code/${code}`);
        this.quiz  = res.data?.data;
      } catch (e) {
        this.error = 'كود الاختبار غير صحيح';
      } finally {
        this.loading = false;
      }
    },
    getCategoryImage(slug) {
      return CATEGORY_IMAGES[slug] || CATEGORY_IMAGES['default'];
    },
    startIndividual() {
      this.startQuiz = false;
      // Store quiz id in session/store then navigate
      if (process.client) sessionStorage.setItem('currentQuizId', this.quiz._id);
      this.$router.push(this.localePath('/play/options'));
    },
    startMultiplayer() {
      this.startQuiz = false;
      if (process.client) sessionStorage.setItem('currentQuizId', this.quiz._id);
      this.$router.push(this.localePath('/host/options'));
    },
  },
  components: { PageTitle, PlayersDetails, QuizInfo, Categories },
};
</script>

<style scoped>
.quiz-page { margin-top: 50px; }
.container { padding: 10px 25px !important; }
.quiz-header { padding: 17px 10px !important; }
.back-link, .start-quiz { width: 15% !important; cursor: pointer; }
.back-icon { font-size: 28px; margin-left: 7px; }
.back-text { font-size: 20px; }
.back-text, .back-icon { color: #ff5e94; }
.popup-icons i { font-size: 25px; color: #d3d6db; margin: 0 13px; cursor: pointer; transition: color 0.2s ease-in-out; }
.start-quiz { height: auto !important; padding: 5px 30px !important; background-color: #ff5e94; font-family: "Cairo" !important; border-radius: 10px !important; }
hr { margin: 0 0 0.2rem !important; }
.quiz-title { font-size: 35px; color: #3a3798; }
.title-line { width: 80%; height: 3px; margin: 20px 0 15px; background-color: #ffc961; }
.quiz-description p { font-family: "Almarai"; color: #a8a6d4; font-size: 20px; margin-bottom: 20px; text-align: right; line-height: 35px; }
.quiz-description p.full-desc { height: 100px; overflow: hidden; color: #a9aac5; margin-bottom: 35px; text-align: justify; }
.quiz-description p.read-more { text-align: center; margin-top: -100px; background-image: linear-gradient(0deg, #fff, rgba(255,255,255,0)); position: relative; padding-top: 42px; color: #ff5e94; cursor: pointer; margin-bottom: 25px; }
.quiz-description p.read-more.hidden { display: none; }
.quiz-img img { object-fit: cover; }
.quiz-info { padding: 12px; }
.quiz-info-content { flex: 0 0 48.5% !important; padding: 0; }
.quiz-categories-content { flex: 0 0 48.5% !important; padding: 0; }
.quiz-categories-content hr { margin-bottom: 10px !important; }
.quiz-categories-content h2 { color: #3a3798; margin-bottom: 7px; }
.v-dialog .v-card { overflow: hidden !important; text-align: center; min-height: 200px; }
.v-dialog .v-card p.full-desc { padding: 20px; font-size: 20px; color: #a9aac5; text-align: justify; }
@media only screen and (max-width: 600px) {
  .back-link, .start-quiz { width: 32% !important; }
  .quiz-container { flex-direction: column-reverse !important; }
  .quiz-info-content, .quiz-categories-content { flex: 0 0 100% !important; }
}
.ltr .back-icon { margin-left: 0 !important; margin-right: 7px !important; }
.ltr .quiz-categories-content h2 { text-align: left !important; }
</style>
