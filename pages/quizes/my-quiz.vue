<!-- Quiz Detail Page - Dynamic from API -->
<template>
  <section class="d-flex align-center justify-center page-section">
    <section class="account-section d-flex align-center mx-auto w-100">
      <v-container fluid>
        <v-row>
          <!-- Side Menu -->
          <SideMenu activeLink="myQuizzes" />
          <!-- Account Page Content -->
          <v-col cols="12" md="10" lg="9" class="account-section-container">
            <div class="account-section-content h-100 w-100">

              <!-- Loading State -->
              <div v-if="loading" class="d-flex justify-center align-center" style="min-height:400px">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center pa-8">
                <v-icon size="64" color="red">mdi-alert-circle</v-icon>
                <p class="title mt-4">{{ error }}</p>
                <v-btn color="primary" @click="fetchQuiz">{{ $t('reload') || 'إعادة التحميل' }}</v-btn>
              </div>

              <!-- Quiz Content -->
              <section v-else-if="quiz" class="quiz-page d-flex mx-auto rounded">
                <v-container class="rounded overflow-hidden">
                  <v-row class="flex-column">
                    <v-col cols="12" class="d-flex quiz-header justify-space-between align-center">
                      <!-- back btn -->
                      <span
                        @click="$router.push(localePath('/my-quizzes'))"
                        class="d-flex align-center font-weight-bold back-link"
                      >
                        <i class="fas fa-angle-right back-icon"></i>
                        <span class="back-text">{{ $t("quizPage.backLink") }}</span>
                      </span>

                      <!-- actions -->
                      <div class="popup-icons">
                        <!-- favorite -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon color="pink accent-1" v-bind="attrs" v-on="on" @click="toggleFavorite">
                              <i :class="['fas', isFavorite ? 'fa-heart' : 'fa-heart']" :style="isFavorite ? 'color:#ff5e94' : ''"></i>
                            </v-btn>
                          </template>
                          <span>{{ $t("quizPage.addToFavorite") }}</span>
                        </v-tooltip>

                        <!-- share -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon color="pink accent-1" @click="share = true" v-bind="attrs" v-on="on">
                              <i class="fas fa-share-alt"></i>
                            </v-btn>
                          </template>
                          <span>{{ $t("quizPage.shareQuiz") }}</span>
                        </v-tooltip>

                        <!-- edit -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon color="pink accent-1"
                              @click="$router.push(localePath(`/quizes/edit?id=${quiz._id}`))"
                              v-bind="attrs" v-on="on">
                              <i class="far fa-edit"></i>
                            </v-btn>
                          </template>
                          <span>{{ $t("editQuizPage.pageTitle") }}</span>
                        </v-tooltip>

                        <!-- questions -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon color="pink accent-1"
                              @click="$router.push(localePath(`/quizes/questions?quizId=${quiz._id}`))"
                              v-bind="attrs" v-on="on">
                              <v-icon class="special-icon">mdi-crosshairs-question</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("questionPage.showQuestions") }}</span>
                        </v-tooltip>

                        <!-- delete -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon color="pink accent-1" @click="deleteQuiz = true" v-bind="attrs" v-on="on">
                              <i class="far fa-trash-alt"></i>
                            </v-btn>
                          </template>
                          <span>{{ $t("quizPage.deleteQuiz") }}</span>
                        </v-tooltip>
                      </div>

                      <div class="buttons d-flex align-center justify-space-between">
                        <!-- Add Question Button -->
                        <v-btn
                          @click="$router.push(localePath(`/quizes/questions/add?quizId=${quiz._id}`))"
                          class="white--text add-question title" text>
                          <i class="fas fa-plus-circle"></i>
                          <span>{{ $t("questionPage.addQuestion") }}</span>
                        </v-btn>

                        <!-- Start Quiz btn -->
                        <v-btn class="white--text start-quiz title" @click="startQuiz = true" text>
                          {{ $t("quizPage.startBtn") }}
                        </v-btn>
                      </div>
                    </v-col>

                    <v-divider Horizontal class="rounded"></v-divider>

                    <v-col cols="12" class="d-flex justify-space-between quiz-container">
                      <v-row>
                        <v-col md="6" cols="12">
                          <div class="quiz-content">
                            <!-- Quiz Title -->
                            <h1 class="quiz-title font-weight-bold text-justify">{{ quiz.title }}</h1>
                            <p class="title-line rounded"></p>
                            <!-- Quiz Code Badge -->
                            <div v-if="quiz.quizCode" class="quiz-code-badge d-flex align-center mb-3">
                              <v-chip color="primary" text-color="white" class="font-weight-bold" label>
                                <v-icon left small>mdi-key-variant</v-icon>
                                كود الكويز: {{ quiz.quizCode }}
                              </v-chip>
                              <v-btn icon x-small class="mx-2" @click="copyCode(quiz.quizCode)" title="نسخ الكود">
                                <v-icon small>mdi-content-copy</v-icon>
                              </v-btn>
                            </div>
                            <!-- Quiz Description -->
                            <div class="quiz-description overflow-hidden">
                              <p class="font-weight-bold">{{ quiz.description }}</p>
                              <p class="full-desc" id="fullDesc">{{ quiz.detailedDescription }}</p>
                              <p @click="showDesc = true" class="read-more hidden" id="read-more">
                                {{ $t("quizPage.showMore") }}
                              </p>
                            </div>
                            <v-row class="d-flex w-100 player-details justify-space-between">
                              <PlayerDetails iconClass="far fa-user" :text="quiz.creator ? quiz.creator.username : '---'" />
                              <PlayerDetails iconClass="far fa-calendar-alt" :text="formatDate(quiz.createdAt)" />
                            </v-row>
                          </div>
                        </v-col>
                        <v-col md="6" cols="12">
                          <!-- Quiz Image -->
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
                            :title="$t('quizPage.questionInfoTitle')"
                            :number="String(quiz.questionCount || 0)"
                            :imgSrc="require('@/assets/images/Home-Page-Images/question.png')"
                          />
                          <QuizInfo
                            :title="$t('quizPage.playersInfoTitle')"
                            :number="String(quiz.statistics ? quiz.statistics.totalPlayers : 0)"
                            :imgSrc="require('@/assets/images/Home-Page-Images/group.png')"
                          />
                        </v-row>
                      </v-col>
                      <v-col class="quiz-categories-content">
                        <h2 class="w-100 text-right">{{ $t("quizPage.quizCategoriesTitle") }}</h2>
                        <v-divider Horizontal class="rounded"></v-divider>
                        <div class="d-flex ma-0 quiz-page-categories align-center">
                          <Categories
                            v-for="(cat, idx) in quizCategories"
                            :key="idx"
                            :catLink="`/quizes-cat?category=${cat.slug}`"
                            :catImgSrc="require('@/assets/images/categories-img/global.png')"
                            :catTitle="cat.name && cat.name[$i18n.locale] ? cat.name[$i18n.locale] : (cat.name && cat.name.ar ? cat.name.ar : cat.name)"
                          />
                        </div>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-container>
              </section>

              <!-- share dialog -->
              <v-dialog v-model="share" max-width="550px">
                <v-card>
                  <v-card-title class="text-center font-weight-bold d-block">
                    {{ $t("quizPage.shareQuiz") }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <div class="pa-4 d-flex flex-wrap justify-center">
                    <ShareNetwork
                      v-for="network in networks"
                      :network="network.network"
                      :key="network.network"
                      :url="shareURL"
                      :title="$t('quizPage.shareMsg')"
                      :description="quiz ? quiz.description : ''"
                      :quote="$t('quizPage.shareMsg')"
                    >
                      <v-icon class="pa-2" style="font-size:48px" :color="network.color">{{ network.icon }}</v-icon>
                    </ShareNetwork>
                  </div>
                </v-card>
              </v-dialog>

              <!-- delete dialog -->
              <v-dialog v-model="deleteQuiz" max-width="400px">
                <v-card>
                  <v-card-title class="text-center font-weight-bold d-block">
                    {{ $t("deleteDialog.title") }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <p class="text-center mt-5 h5">{{ $t("deleteDialog.question") }}</p>
                  <v-row class="px-10 pt-2 pb-5">
                    <v-col class="pa-2">
                      <v-btn
                        color="#ff5e94" class="white--text w-100" height="50"
                        :loading="deleting" @click="confirmDelete"
                      >
                        <v-icon class="mx-2">mdi-trash-can-outline</v-icon>
                        <span style="font-family:'Almarai'">{{ $t("myQuizPage.deleteBtn") }}</span>
                      </v-btn>
                    </v-col>
                    <v-col class="pa-2">
                      <v-btn outlined class="w-100" height="50" @click="deleteQuiz = false">
                        {{ $t('cancel') || 'إلغاء' }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-dialog>

              <!-- description dialog -->
              <v-dialog v-model="showDesc" max-width="600px">
                <v-card>
                  <v-card-title class="text-center font-weight-bold d-block">
                    {{ $t("quizPage.descriptionTitle") }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <p class="full-desc pa-4">{{ quiz ? quiz.detailedDescription : '' }}</p>
                </v-card>
              </v-dialog>

              <!-- start dialog -->
              <v-dialog v-model="startQuiz" max-width="550px">
                <v-card>
                  <v-card-title class="text-center font-weight-bold d-block">
                    {{ $t("quizPage.startBtn") }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <p class="text-center mt-5 h5">{{ $t("dialog.dialogTitle") }}</p>
                  <v-row class="px-10 pt-2 pb-5">
                    <v-col class="pa-2">
                      <v-btn outlined @click="playIndividual" color="primary" class="w-100" style="height:50px">
                        <v-icon class="mx-2">mdi-account-outline</v-icon>
                        <span style="font-family:'Almarai'" class="font-weight-bold">{{ $t("dialog.individualPlayer") }}</span>
                      </v-btn>
                    </v-col>
                    <v-col class="pa-2">
                      <v-btn @click="playMultiplayer" outlined color="primary" class="w-100" style="height:50px">
                        <v-icon class="mx-2">mdi-account-group-outline</v-icon>
                        <span style="font-family:'Almarai'" class="font-weight-bold">{{ $t("dialog.multiPlayers") }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-dialog>

            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </section>
</template>

<script>
import SideMenu from "@/components/AccountComponents/SideMenu";
import PlayerDetails from "@/components/Quiz-Page-Components/PlayerDetails";
import QuizInfo from "@/components/Quiz-Page-Components/QuizInfo";
import Categories from "@/components/Quiz-Page-Components/Categories";

export default {
  middleware: ['auth'],
  layout: "account",
  head() {
    return {
      title: this.quiz ? this.quiz.title : this.$t("quizPage.playerName"),
    };
  },
  data() {
    return {
      loading: true,
      error: null,
      quiz: null,
      showDesc: false,
      share: false,
      startQuiz: false,
      deleteQuiz: false,
      deleting: false,
      isFavorite: false,
      networks: [
        { network: "facebook",  name: "Facebook",  icon: "mdi-facebook",                  color: "#1877f2" },
        { network: "whatsapp",  name: "Whatsapp",  icon: "mdi-whatsapp",                  color: "#25d366" },
        { network: "email",     name: "Email",     icon: "mdi-email-outline",              color: "#333333" },
        { network: "twitter",   name: "Twitter",   icon: "mdi-twitter",                   color: "#1da1f2" },
        { network: "linkedin",  name: "LinkedIn",  icon: "mdi-linkedin",                  color: "#007bb5" },
        { network: "telegram",  name: "Telegram",  icon: "mdi-telegram",                  color: "#0088cc" },
        { network: "reddit",    name: "Reddit",    icon: "mdi-reddit",                    color: "#ff4500" },
        { network: "whatsapp",  name: "WhatsApp",  icon: "mdi-whatsapp",                  color: "#25d366" },
      ],
    };
  },
  computed: {
    shareURL() {
      if (!this.quiz) return '';
      const base = process.client ? window.location.origin : 'https://equization.com';
      if (this.$i18n.locale === 'ar') return `${base}/quiz?id=${this.quiz._id}`;
      return `${base}/${this.$i18n.locale}/quiz?id=${this.quiz._id}`;
    },
    quizCategories() {
      if (!this.quiz || !this.quiz.categories) return [];
      return this.quiz.categories;
    },
  },
  async mounted() {
    await this.fetchQuiz();
  },
  methods: {
    copyCode(code) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          alert('تم نسخ الكود: ' + code);
        });
      } else {
        const el = document.createElement('input');
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('تم نسخ الكود: ' + code);
      }
    },
    async fetchQuiz() {
      this.loading = true;
      this.error = null;
      try {
        // Get quiz ID from route query or sessionStorage
        const quizId = this.$route.query.id
          || (process.client ? sessionStorage.getItem('currentQuizId') : null);

        if (!quizId) {
          this.error = 'لم يتم تحديد اختبار. يرجى اختيار اختبار من قائمة اختباراتي.';
          return;
        }

        const res = await this.$axios.get(`/quizzes/${quizId}`);
        this.quiz = res.data?.data?.quiz || res.data?.data || null;

        if (!this.quiz) {
          this.error = 'لم يتم العثور على الاختبار';
          return;
        }

        // Store quiz ID
        if (process.client) sessionStorage.setItem('currentQuizId', this.quiz._id);

        // Check full description length for read-more
        this.$nextTick(() => {
          const el = document.getElementById('fullDesc');
          if (el && el.innerHTML.length > 150) {
            const rm = document.getElementById('read-more');
            if (rm) rm.classList.remove('hidden');
          }
        });
      } catch (e) {
        this.error = e.response?.data?.message || 'فشل في تحميل بيانات الاختبار';
        console.error('Fetch quiz error:', e);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return '---';
      return new Date(date).toLocaleDateString(this.$i18n.locale === 'ar' ? 'ar-EG' : 'en-US');
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
    },
    playIndividual() {
      this.startQuiz = false;
      if (this.quiz && process.client) {
        sessionStorage.setItem('currentQuizId', this.quiz._id);
      }
      this.$router.push(this.localePath('/play/options'));
    },
    playMultiplayer() {
      this.startQuiz = false;
      if (this.quiz && process.client) {
        sessionStorage.setItem('currentQuizId', this.quiz._id);
      }
      this.$router.push(this.localePath('/host/options'));
    },
    async confirmDelete() {
      if (!this.quiz) return;
      this.deleting = true;
      try {
        await this.$axios.delete(`/quizzes/${this.quiz._id}`);
        this.deleteQuiz = false;
        this.$router.push(this.localePath('/my-quizzes'));
      } catch (e) {
        console.error('Delete error:', e);
        alert(e.response?.data?.message || 'فشل في حذف الاختبار');
      } finally {
        this.deleting = false;
      }
    },
  },
  components: {
    SideMenu,
    PlayerDetails,
    QuizInfo,
    Categories,
  },
};
</script>

<style scoped>
.account-section-content {
  padding: 0 !important;
}

.quiz-page .container {
  padding: 10px 25px !important;
  border: none !important;
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
}

.quiz-header {
  padding: 10px 0 !important;
  flex-wrap: wrap;
  gap: 10px;
}

.quiz-title {
  font-size: 28px;
}

.title-line {
  width: 60px;
  height: 4px;
  background-color: #3a3798;
  margin: 10px 0;
}

.quiz-img img {
  border-radius: 12px;
  object-fit: cover;
  min-height: 200px;
}

.full-desc {
  text-align: justify;
  line-height: 1.8;
}

.read-more {
  color: #3a3798;
  cursor: pointer;
  font-weight: bold;
}

.hidden {
  display: none !important;
}

.back-link {
  cursor: pointer;
  color: #3a3798;
  gap: 6px;
}

.back-icon {
  font-size: 20px;
}

.quiz-categories-content h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
