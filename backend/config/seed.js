/**
 * seed.js – Complete seed data for eQuization
 * Run: node config/seed.js
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const User        = require('../models/User.model');
const Category    = require('../models/Category.model');
const Quiz        = require('../models/Quiz.model');
const Question    = require('../models/Question.model');
const PlayHistory = require('../models/PlayHistory.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/equization';

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: { ar: 'معلومات عامة',   en: 'General Knowledge' }, slug: 'general-knowledge',  color: '#3a3798', icon: 'mdi-brain',         quizCount: 0 },
  { name: { ar: 'تاريخ',          en: 'History'           }, slug: 'history',            color: '#8B4513', icon: 'mdi-book-open',     quizCount: 0 },
  { name: { ar: 'علوم',           en: 'Science'           }, slug: 'science',            color: '#2E8B57', icon: 'mdi-flask',         quizCount: 0 },
  { name: { ar: 'رياضيات',        en: 'Mathematics'       }, slug: 'mathematics',        color: '#DC143C', icon: 'mdi-calculator',   quizCount: 0 },
  { name: { ar: 'جغرافيا',        en: 'Geography'         }, slug: 'geography',          color: '#1E90FF', icon: 'mdi-earth',         quizCount: 0 },
  { name: { ar: 'لغة عربية',      en: 'Arabic Language'   }, slug: 'arabic-language',    color: '#8B008B', icon: 'mdi-abjad-arabic', quizCount: 0 },
  { name: { ar: 'لغات أجنبية',   en: 'Foreign Languages' }, slug: 'foreign-languages',  color: '#FF8C00', icon: 'mdi-translate',    quizCount: 0 },
  { name: { ar: 'كيمياء',         en: 'Chemistry'         }, slug: 'chemistry',          color: '#00CED1', icon: 'mdi-atom',          quizCount: 0 },
  { name: { ar: 'فيزياء',         en: 'Physics'           }, slug: 'physics',            color: '#9400D3', icon: 'mdi-lightning-bolt', quizCount: 0 },
  { name: { ar: 'أحياء',          en: 'Biology'           }, slug: 'biology',            color: '#228B22', icon: 'mdi-dna',           quizCount: 0 },
  { name: { ar: 'دراسات إسلامية', en: 'Islamic Studies'   }, slug: 'islamic-studies',    color: '#B8860B', icon: 'mdi-star-crescent', quizCount: 0 },
];

// ─── USERS ───────────────────────────────────────────────────────────────────
const USERS = [
  {
    username: 'admin',
    email: 'admin@equization.com',
    password: 'Admin@123456',
    firstName: 'مدير',
    lastName: 'النظام',
    role: 'admin',
    isVerified: true,
    bio: 'مدير منصة eQuization',
    statistics: { quizzesCreated: 3, quizzesPlayed: 10, totalScore: 1250 }
  },
  {
    username: 'ahmed_teacher',
    email: 'demo@equization.com',
    password: 'Demo@123456',
    firstName: 'أحمد',
    lastName: 'المعلم',
    role: 'user',
    isVerified: true,
    bio: 'مدرّس رياضيات ومهتم بالتعليم التفاعلي',
    statistics: { quizzesCreated: 5, quizzesPlayed: 23, totalScore: 2840 }
  },
  {
    username: 'sara_student',
    email: 'sara@equization.com',
    password: 'Sara@123456',
    firstName: 'سارة',
    lastName: 'الطالبة',
    role: 'user',
    isVerified: true,
    bio: 'طالبة جامعية تحب التعلم',
    statistics: { quizzesCreated: 2, quizzesPlayed: 45, totalScore: 5320 }
  },
  {
    username: 'omar_quiz',
    email: 'omar@equization.com',
    password: 'Omar@123456',
    firstName: 'عمر',
    lastName: 'منشئ الكويزات',
    role: 'user',
    isVerified: true,
    bio: 'متحمس لإنشاء اختبارات تفاعلية',
    statistics: { quizzesCreated: 8, quizzesPlayed: 18, totalScore: 3150 }
  },
];

// ─── QUIZZES & QUESTIONS ─────────────────────────────────────────────────────
const QUIZZES_DATA = [
  {
    title: 'اختبار المعلومات العامة الشامل',
    description: 'اختبر معلوماتك العامة في مختلف المجالات',
    detailedDescription: 'اختبار شامل يغطي مواضيع متنوعة من الجغرافيا والتاريخ والعلوم',
    difficulty: 'medium',
    educationLevel: 'general',
    language: 'ar',
    isPublic: true,
    timeLimit: 30,
    pointsPerQuestion: 100,
    categorySlug: 'general-knowledge',
    statistics: { totalPlays: 245, totalPlayers: 1823, averageScore: 72 },
    questions: [
      {
        questionText: 'ما هي عاصمة المملكة العربية السعودية؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'الرياض', isCorrect: true },
          { text: 'جدة', isCorrect: false },
          { text: 'مكة المكرمة', isCorrect: false },
          { text: 'الدمام', isCorrect: false },
        ],
        explanation: 'الرياض هي عاصمة المملكة العربية السعودية منذ عام 1932',
        points: 100, timeLimit: 30, order: 1
      },
      {
        questionText: 'كم عدد القارات في العالم؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '7', isCorrect: true },
          { text: '8', isCorrect: false },
        ],
        explanation: 'يوجد 7 قارات: آسيا، أفريقيا، أمريكا الشمالية، أمريكا الجنوبية، أنتاركتيكا، أوروبا، أستراليا',
        points: 100, timeLimit: 30, order: 2
      },
      {
        questionText: 'أي دولة تقع في أمريكا الجنوبية؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'المكسيك', isCorrect: false },
          { text: 'البرازيل', isCorrect: true },
          { text: 'كندا', isCorrect: false },
          { text: 'الولايات المتحدة', isCorrect: false },
        ],
        explanation: 'البرازيل أكبر دولة في أمريكا الجنوبية',
        points: 100, timeLimit: 30, order: 3
      },
      {
        questionText: 'نهر النيل هو أطول نهر في العالم',
        questionType: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true },
          { text: 'خطأ', isCorrect: false },
        ],
        explanation: 'نهر النيل بطول 6650 كم يُعد أطول نهر في العالم',
        points: 100, timeLimit: 20, order: 4
      },
      {
        questionText: 'ما هو أكبر محيط في العالم؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'المحيط الأطلسي', isCorrect: false },
          { text: 'المحيط الهندي', isCorrect: false },
          { text: 'المحيط الهادئ', isCorrect: true },
          { text: 'المحيط المتجمد الشمالي', isCorrect: false },
        ],
        explanation: 'المحيط الهادئ هو الأكبر ويغطي نحو 46% من أسطح المياه على الأرض',
        points: 100, timeLimit: 30, order: 5
      },
    ]
  },

  {
    title: 'اختبار تاريخ الحضارة الإسلامية',
    description: 'رحلة عبر تاريخ الحضارة الإسلامية العريقة',
    detailedDescription: 'اختبار يختبر معرفتك بالتاريخ الإسلامي والحضارة العربية',
    difficulty: 'hard',
    educationLevel: 'university',
    language: 'ar',
    isPublic: true,
    timeLimit: 45,
    pointsPerQuestion: 150,
    categorySlug: 'history',
    statistics: { totalPlays: 189, totalPlayers: 1205, averageScore: 65 },
    questions: [
      {
        questionText: 'في أي سنة هجرية بُنيت الكعبة المشرفة وفق الروايات الإسلامية؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'قبل الإسلام بزمن طويل', isCorrect: true },
          { text: 'السنة الأولى للهجرة', isCorrect: false },
          { text: 'السنة العاشرة للهجرة', isCorrect: false },
          { text: 'السنة الخامسة للهجرة', isCorrect: false },
        ],
        explanation: 'بُنيت الكعبة المشرفة من قِبَل إبراهيم وإسماعيل عليهما السلام قبل الإسلام',
        points: 150, timeLimit: 45, order: 1
      },
      {
        questionText: 'من هو أول خليفة للمسلمين بعد وفاة النبي محمد ﷺ؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'عمر بن الخطاب', isCorrect: false },
          { text: 'أبو بكر الصديق', isCorrect: true },
          { text: 'علي بن أبي طالب', isCorrect: false },
          { text: 'عثمان بن عفان', isCorrect: false },
        ],
        explanation: 'أبو بكر الصديق رضي الله عنه هو أول الخلفاء الراشدين',
        points: 150, timeLimit: 45, order: 2
      },
      {
        questionText: 'ما هو اسم العاصمة التي أسسها المعتصم العباسي؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'بغداد', isCorrect: false },
          { text: 'الفسطاط', isCorrect: false },
          { text: 'سامراء', isCorrect: true },
          { text: 'قرطبة', isCorrect: false },
        ],
        explanation: 'أسس الخليفة المعتصم مدينة سامراء عام 221 هـ',
        points: 150, timeLimit: 45, order: 3
      },
      {
        questionText: 'كانت بغداد عاصمة الخلافة العباسية',
        questionType: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true },
          { text: 'خطأ', isCorrect: false },
        ],
        explanation: 'بغداد أسسها الخليفة المنصور عام 762م لتكون عاصمة الخلافة العباسية',
        points: 150, timeLimit: 30, order: 4
      },
      {
        questionText: 'من مؤلف كتاب "القانون في الطب"؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'الرازي', isCorrect: false },
          { text: 'ابن سينا', isCorrect: true },
          { text: 'ابن الهيثم', isCorrect: false },
          { text: 'الخوارزمي', isCorrect: false },
        ],
        explanation: 'ابن سينا (أبو علي الحسين بن عبد الله) كتب القانون في الطب وهو مرجع طبي شهير',
        points: 150, timeLimit: 45, order: 5
      },
    ]
  },

  {
    title: 'اختبار العلوم - الفيزياء والكيمياء',
    description: 'اختبر معلوماتك في الفيزياء والكيمياء',
    detailedDescription: 'اختبار يشمل المفاهيم الأساسية في الفيزياء والكيمياء للمرحلة الثانوية',
    difficulty: 'medium',
    educationLevel: 'high',
    language: 'ar',
    isPublic: true,
    timeLimit: 40,
    pointsPerQuestion: 100,
    categorySlug: 'science',
    statistics: { totalPlays: 312, totalPlayers: 2150, averageScore: 68 },
    questions: [
      {
        questionText: 'ما هو الرمز الكيميائي للذهب؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'Go', isCorrect: false },
          { text: 'Gd', isCorrect: false },
          { text: 'Au', isCorrect: true },
          { text: 'Ag', isCorrect: false },
        ],
        explanation: 'رمز الذهب Au مشتق من اللاتينية Aurum',
        points: 100, timeLimit: 30, order: 1
      },
      {
        questionText: 'ما هي سرعة الضوء في الفراغ تقريباً؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '300,000 كم/ث', isCorrect: true },
          { text: '150,000 كم/ث', isCorrect: false },
          { text: '450,000 كم/ث', isCorrect: false },
          { text: '100,000 كم/ث', isCorrect: false },
        ],
        explanation: 'سرعة الضوء في الفراغ ≈ 299,792,458 م/ث أي نحو 300,000 كم/ث',
        points: 100, timeLimit: 30, order: 2
      },
      {
        questionText: 'كم عدد بروتونات ذرة الكربون؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '4', isCorrect: false },
          { text: '6', isCorrect: true },
          { text: '8', isCorrect: false },
          { text: '12', isCorrect: false },
        ],
        explanation: 'الكربون العنصر رقم 6 في الجدول الدوري، لذا يحتوي على 6 بروتونات',
        points: 100, timeLimit: 30, order: 3
      },
      {
        questionText: 'الصيغة الكيميائية للماء هي H2O',
        questionType: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true },
          { text: 'خطأ', isCorrect: false },
        ],
        explanation: 'الماء يتكون من ذرتين هيدروجين وذرة أكسجين (H₂O)',
        points: 100, timeLimit: 20, order: 4
      },
      {
        questionText: 'ما هو قانون نيوتن الثاني للحركة؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'القوة = الكتلة × التسارع', isCorrect: true },
          { text: 'الطاقة = الكتلة × التسارع²', isCorrect: false },
          { text: 'الضغط = القوة ÷ المساحة', isCorrect: false },
          { text: 'العمل = القوة × الزمن', isCorrect: false },
        ],
        explanation: 'قانون نيوتن الثاني: القوة المحصلة على جسم = كتلة الجسم × تسارعه (F = ma)',
        points: 100, timeLimit: 40, order: 5
      },
    ]
  },

  {
    title: 'اختبار الرياضيات الأساسية',
    description: 'اختبر مهاراتك الرياضية الأساسية',
    detailedDescription: 'مسائل رياضية تشمل الجبر والهندسة والحساب للمرحلة الإعدادية',
    difficulty: 'easy',
    educationLevel: 'middle',
    language: 'ar',
    isPublic: true,
    timeLimit: 60,
    pointsPerQuestion: 80,
    categorySlug: 'mathematics',
    statistics: { totalPlays: 421, totalPlayers: 3180, averageScore: 78 },
    questions: [
      {
        questionText: 'ما هو حاصل ضرب 7 × 8؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '54', isCorrect: false },
          { text: '56', isCorrect: true },
          { text: '48', isCorrect: false },
          { text: '63', isCorrect: false },
        ],
        explanation: '7 × 8 = 56',
        points: 80, timeLimit: 20, order: 1
      },
      {
        questionText: 'ما هي قيمة √144؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '10', isCorrect: false },
          { text: '14', isCorrect: false },
          { text: '12', isCorrect: true },
          { text: '16', isCorrect: false },
        ],
        explanation: '12 × 12 = 144، إذن √144 = 12',
        points: 80, timeLimit: 30, order: 2
      },
      {
        questionText: 'مجموع زوايا المثلث يساوي 180 درجة',
        questionType: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true },
          { text: 'خطأ', isCorrect: false },
        ],
        explanation: 'مجموع زوايا المثلث دائماً يساوي 180 درجة',
        points: 80, timeLimit: 20, order: 3
      },
      {
        questionText: 'ما هو حاصل 15² - 10²؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '25', isCorrect: false },
          { text: '125', isCorrect: true },
          { text: '225', isCorrect: false },
          { text: '50', isCorrect: false },
        ],
        explanation: '15² - 10² = 225 - 100 = 125',
        points: 80, timeLimit: 40, order: 4
      },
      {
        questionText: 'كم يساوي 2⁴ × 3²؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '72', isCorrect: false },
          { text: '144', isCorrect: true },
          { text: '108', isCorrect: false },
          { text: '96', isCorrect: false },
        ],
        explanation: '2⁴ = 16 و 3² = 9، إذن 16 × 9 = 144',
        points: 80, timeLimit: 40, order: 5
      },
    ]
  },

  {
    title: 'اختبار اللغة العربية والنحو',
    description: 'اختبر معلوماتك في قواعد اللغة العربية',
    detailedDescription: 'اختبار شامل في النحو والصرف والبلاغة العربية',
    difficulty: 'medium',
    educationLevel: 'high',
    language: 'ar',
    isPublic: true,
    timeLimit: 45,
    pointsPerQuestion: 120,
    categorySlug: 'arabic-language',
    statistics: { totalPlays: 278, totalPlayers: 1920, averageScore: 62 },
    questions: [
      {
        questionText: 'ما إعراب كلمة "الطالبُ" في جملة: "حضر الطالبُ"؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'مبتدأ مرفوع', isCorrect: false },
          { text: 'فاعل مرفوع', isCorrect: true },
          { text: 'خبر مرفوع', isCorrect: false },
          { text: 'مفعول به منصوب', isCorrect: false },
        ],
        explanation: 'الطالب فاعل للفعل "حضر" مرفوع وعلامة رفعه الضمة الظاهرة',
        points: 120, timeLimit: 45, order: 1
      },
      {
        questionText: 'ما جمع كلمة "كتاب"؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'أكتب', isCorrect: false },
          { text: 'كتابات', isCorrect: false },
          { text: 'كتب', isCorrect: true },
          { text: 'كاتبون', isCorrect: false },
        ],
        explanation: 'جمع كتاب هو كُتُب، وهو جمع تكسير',
        points: 120, timeLimit: 30, order: 2
      },
      {
        questionText: 'الفعل "ذهب" فعل لازم يتعدى إلى مفعول به',
        questionType: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: false },
          { text: 'خطأ', isCorrect: true },
        ],
        explanation: 'الفعل "ذهب" فعل لازم لا يحتاج إلى مفعول به',
        points: 120, timeLimit: 30, order: 3
      },
      {
        questionText: 'ما الضمير المستتر في الفعل "يكتبُ"؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'أنا', isCorrect: false },
          { text: 'هو', isCorrect: true },
          { text: 'نحن', isCorrect: false },
          { text: 'أنت', isCorrect: false },
        ],
        explanation: 'الفعل المضارع مع الواو للمفرد المذكر يحمل ضميراً مستتراً تقديره "هو"',
        points: 120, timeLimit: 30, order: 4
      },
      {
        questionText: 'أيّ من التالي مثال على أسلوب الشرط؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'جاء الطالب', isCorrect: false },
          { text: 'إن تجتهد تنجح', isCorrect: true },
          { text: 'الكتاب مفيد', isCorrect: false },
          { text: 'كيف حالك؟', isCorrect: false },
        ],
        explanation: 'أسلوب الشرط يتكون من أداة الشرط وفعل الشرط وجوابه، مثل "إن تجتهد تنجح"',
        points: 120, timeLimit: 45, order: 5
      },
    ]
  },

  {
    title: 'اختبار الجغرافيا العربية والعالمية',
    description: 'جولة جغرافية حول العالم',
    detailedDescription: 'اختبار الجغرافيا البشرية والطبيعية للوطن العربي والعالم',
    difficulty: 'medium',
    educationLevel: 'general',
    language: 'ar',
    isPublic: true,
    timeLimit: 35,
    pointsPerQuestion: 100,
    categorySlug: 'geography',
    statistics: { totalPlays: 198, totalPlayers: 1450, averageScore: 70 },
    questions: [
      {
        questionText: 'ما هي أكبر دولة في العالم من حيث المساحة؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'الصين', isCorrect: false },
          { text: 'الولايات المتحدة', isCorrect: false },
          { text: 'روسيا', isCorrect: true },
          { text: 'كندا', isCorrect: false },
        ],
        explanation: 'روسيا أكبر دولة في العالم بمساحة تبلغ 17.1 مليون كم²',
        points: 100, timeLimit: 30, order: 1
      },
      {
        questionText: 'أي نهر يشكل الحد الفاصل بين المغرب والجزائر؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'نهر تافيلالت', isCorrect: false },
          { text: 'نهر ملوية', isCorrect: false },
          { text: 'نهر Kiss', isCorrect: true },
          { text: 'وادي درعة', isCorrect: false },
        ],
        explanation: 'نهر Kiss (كيس) يشكّل جزءاً من الحدود بين المغرب والجزائر في الشمال',
        points: 100, timeLimit: 35, order: 2
      },
      {
        questionText: 'ما هي عاصمة استراليا؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'سيدني', isCorrect: false },
          { text: 'ملبورن', isCorrect: false },
          { text: 'كانبيرا', isCorrect: true },
          { text: 'بريزبان', isCorrect: false },
        ],
        explanation: 'كانبيرا هي عاصمة أستراليا، وليس سيدني كما يعتقد كثيرون',
        points: 100, timeLimit: 30, order: 3
      },
      {
        questionText: 'القاهرة هي أكبر مدينة عربية من حيث السكان',
        questionType: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true },
          { text: 'خطأ', isCorrect: false },
        ],
        explanation: 'القاهرة الكبرى تعد أكبر مدينة عربية بعدد سكان يتجاوز 20 مليون نسمة',
        points: 100, timeLimit: 20, order: 4
      },
      {
        questionText: 'ما هي أطول سلسلة جبال في العالم؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'جبال الهيمالايا', isCorrect: false },
          { text: 'جبال الأنديز', isCorrect: true },
          { text: 'جبال الروكي', isCorrect: false },
          { text: 'جبال الألب', isCorrect: false },
        ],
        explanation: 'جبال الأنديز في أمريكا الجنوبية هي أطول سلسلة جبال في العالم بطول ~7,000 كم',
        points: 100, timeLimit: 35, order: 5
      },
    ]
  },

  {
    title: 'اختبار الدراسات الإسلامية',
    description: 'اختبر معلوماتك الإسلامية والشرعية',
    detailedDescription: 'اختبار في الفقه والحديث والسيرة النبوية',
    difficulty: 'easy',
    educationLevel: 'general',
    language: 'ar',
    isPublic: true,
    timeLimit: 30,
    pointsPerQuestion: 100,
    categorySlug: 'islamic-studies',
    statistics: { totalPlays: 356, totalPlayers: 2780, averageScore: 82 },
    questions: [
      {
        questionText: 'كم عدد أركان الإسلام؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: false },
          { text: '5', isCorrect: true },
          { text: '6', isCorrect: false },
        ],
        explanation: 'أركان الإسلام الخمسة: الشهادتان، الصلاة، الزكاة، الصوم، الحج',
        points: 100, timeLimit: 20, order: 1
      },
      {
        questionText: 'ما عدد سور القرآن الكريم؟',
        questionType: 'multiple-choice',
        answers: [
          { text: '100', isCorrect: false },
          { text: '114', isCorrect: true },
          { text: '112', isCorrect: false },
          { text: '120', isCorrect: false },
        ],
        explanation: 'القرآن الكريم يتكون من 114 سورة',
        points: 100, timeLimit: 20, order: 2
      },
      {
        questionText: 'صلاة الفجر ركعتان',
        questionType: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true },
          { text: 'خطأ', isCorrect: false },
        ],
        explanation: 'صلاة الفجر ركعتان فريضة',
        points: 100, timeLimit: 20, order: 3
      },
      {
        questionText: 'في أي شهر أُنزل القرآن الكريم؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'محرم', isCorrect: false },
          { text: 'رجب', isCorrect: false },
          { text: 'رمضان', isCorrect: true },
          { text: 'شعبان', isCorrect: false },
        ],
        explanation: 'قال تعالى: "شهر رمضان الذي أنزل فيه القرآن"',
        points: 100, timeLimit: 25, order: 4
      },
      {
        questionText: 'ما هو أول مسجد بُني في الإسلام؟',
        questionType: 'multiple-choice',
        answers: [
          { text: 'المسجد الحرام', isCorrect: false },
          { text: 'المسجد النبوي', isCorrect: false },
          { text: 'مسجد قباء', isCorrect: true },
          { text: 'المسجد الأقصى', isCorrect: false },
        ],
        explanation: 'مسجد قباء هو أول مسجد بُني في الإسلام وكان ذلك في السنة الأولى للهجرة',
        points: 100, timeLimit: 30, order: 5
      },
    ]
  },

  {
    title: 'اختبار اللغة الإنجليزية - المستوى المتوسط',
    description: 'Test your English language skills at intermediate level',
    detailedDescription: 'اختبار شامل في اللغة الإنجليزية يشمل القواعد والمفردات',
    difficulty: 'medium',
    educationLevel: 'high',
    language: 'en',
    isPublic: true,
    timeLimit: 30,
    pointsPerQuestion: 100,
    categorySlug: 'foreign-languages',
    statistics: { totalPlays: 298, totalPlayers: 2156, averageScore: 63 },
    questions: [
      {
        questionText: 'Which tense is used in: "She has been working for 3 hours"?',
        questionType: 'multiple-choice',
        answers: [
          { text: 'Present Perfect', isCorrect: false },
          { text: 'Present Perfect Continuous', isCorrect: true },
          { text: 'Past Continuous', isCorrect: false },
          { text: 'Past Perfect', isCorrect: false },
        ],
        explanation: 'Present Perfect Continuous = has/have been + verb-ing, showing an action that started in the past and is still ongoing',
        points: 100, timeLimit: 30, order: 1
      },
      {
        questionText: 'What is the plural of "child"?',
        questionType: 'multiple-choice',
        answers: [
          { text: 'childs', isCorrect: false },
          { text: 'childrens', isCorrect: false },
          { text: 'children', isCorrect: true },
          { text: 'childer', isCorrect: false },
        ],
        explanation: '"Child" has an irregular plural: children',
        points: 100, timeLimit: 20, order: 2
      },
      {
        questionText: '"Quickly" is an adverb.',
        questionType: 'true-false',
        answers: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
        ],
        explanation: '"Quickly" is formed from the adjective "quick" by adding -ly, making it an adverb',
        points: 100, timeLimit: 20, order: 3
      },
      {
        questionText: 'Choose the correct sentence:',
        questionType: 'multiple-choice',
        answers: [
          { text: 'He don\'t like coffee', isCorrect: false },
          { text: 'He doesn\'t likes coffee', isCorrect: false },
          { text: 'He doesn\'t like coffee', isCorrect: true },
          { text: 'He not like coffee', isCorrect: false },
        ],
        explanation: 'With third-person singular (he/she/it), we use "doesn\'t" followed by the base form of the verb',
        points: 100, timeLimit: 30, order: 4
      },
      {
        questionText: 'What is the synonym of "happy"?',
        questionType: 'multiple-choice',
        answers: [
          { text: 'sad', isCorrect: false },
          { text: 'angry', isCorrect: false },
          { text: 'joyful', isCorrect: true },
          { text: 'tired', isCorrect: false },
        ],
        explanation: '"Joyful" means feeling or expressing great happiness, making it a synonym of "happy"',
        points: 100, timeLimit: 25, order: 5
      },
    ]
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── Clear existing data ──────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Quiz.deleteMany({}),
      Question.deleteMany({}),
      PlayHistory.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Create categories ────────────────────────────────────────────────────
    const createdCategories = await Category.insertMany(CATEGORIES);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });
    console.log(`📂 Created ${createdCategories.length} categories`);

    // ── Create users (password will be hashed by pre-save hook) ──────────────
    const createdUsers = [];
    for (const u of USERS) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`👥 Created ${createdUsers.length} users`);

    // ── Create quizzes and questions ─────────────────────────────────────────
    let totalQuizzes   = 0;
    let totalQuestions = 0;
    const createdQuizzes = [];

    for (let i = 0; i < QUIZZES_DATA.length; i++) {
      const qData    = QUIZZES_DATA[i];
      const creator  = createdUsers[i % createdUsers.length];
      const catId    = catMap[qData.categorySlug];

      if (!catId) {
        console.warn(`⚠️  Category not found: ${qData.categorySlug}`);
        continue;
      }

      // Create quiz (without questions first)
      const quiz = await Quiz.create({
        title:            qData.title,
        description:      qData.description,
        detailedDescription: qData.detailedDescription,
        creator:          creator._id,
        categories:       [catId],
        difficulty:       qData.difficulty,
        educationLevel:   qData.educationLevel,
        language:         qData.language,
        isPublic:         qData.isPublic,
        isActive:         true,
        timeLimit:        qData.timeLimit,
        pointsPerQuestion: qData.pointsPerQuestion,
        statistics:       qData.statistics,
        settings: {
          showAnswers:        true,
          randomizeQuestions: false,
          randomizeAnswers:   false,
          allowMultipleTakes: true,
          autoNext:           false,
          showTimer:          true,
        }
      });

      // Create questions
      const questionIds = [];
      for (const qItem of qData.questions) {
        const question = await Question.create({
          quiz:         quiz._id,
          questionText: qItem.questionText,
          questionType: qItem.questionType,
          answers:      qItem.answers,
          explanation:  qItem.explanation,
          points:       qItem.points,
          timeLimit:    qItem.timeLimit,
          order:        qItem.order,
        });
        questionIds.push(question._id);
        totalQuestions++;
      }

      // Link questions to quiz
      quiz.questions = questionIds;
      await quiz.save();

      // Update category quiz count
      await Category.findByIdAndUpdate(catId, { $inc: { quizCount: 1 } });

      // Update creator's quizzes list
      await User.findByIdAndUpdate(creator._id, {
        $push: { quizzes: quiz._id }
      });

      createdQuizzes.push(quiz);
      totalQuizzes++;
      console.log(`  ✅ Quiz: "${quiz.title}" (${qData.questions.length} questions)`);
    }

    // ── Create play history records ──────────────────────────────────────────
    let totalHistory = 0;
    const historyRecords = [
      {
        quiz: createdQuizzes[0]?._id,
        player: createdUsers[2]?._id,
        playerName: 'سارة الطالبة',
        mode: 'individual',
        score: 450, totalQuestions: 5, correctAnswers: 4, wrongAnswers: 1,
        timeSpent: 95000,
        answers: [
          { questionIndex: 0, isCorrect: true, timeSpent: 15000, points: 100 },
          { questionIndex: 1, isCorrect: true, timeSpent: 20000, points: 100 },
          { questionIndex: 2, isCorrect: true, timeSpent: 18000, points: 100 },
          { questionIndex: 3, isCorrect: true, timeSpent: 10000, points: 100 },
          { questionIndex: 4, isCorrect: false, timeSpent: 32000, points: 0 },
        ]
      },
      {
        quiz: createdQuizzes[0]?._id,
        player: createdUsers[1]?._id,
        playerName: 'أحمد المعلم',
        mode: 'individual',
        score: 500, totalQuestions: 5, correctAnswers: 5, wrongAnswers: 0,
        timeSpent: 80000,
        answers: [
          { questionIndex: 0, isCorrect: true, timeSpent: 12000, points: 100 },
          { questionIndex: 1, isCorrect: true, timeSpent: 15000, points: 100 },
          { questionIndex: 2, isCorrect: true, timeSpent: 18000, points: 100 },
          { questionIndex: 3, isCorrect: true, timeSpent: 8000, points: 100 },
          { questionIndex: 4, isCorrect: true, timeSpent: 27000, points: 100 },
        ]
      },
      {
        quiz: createdQuizzes[3]?._id,
        player: createdUsers[2]?._id,
        playerName: 'سارة الطالبة',
        mode: 'individual',
        score: 320, totalQuestions: 5, correctAnswers: 4, wrongAnswers: 1,
        timeSpent: 120000,
      },
      {
        quiz: createdQuizzes[1]?._id,
        player: createdUsers[3]?._id,
        playerName: 'عمر منشئ الكويزات',
        mode: 'individual',
        score: 600, totalQuestions: 5, correctAnswers: 4, wrongAnswers: 1,
        timeSpent: 100000,
      },
      {
        quiz: createdQuizzes[6]?._id,
        player: createdUsers[0]?._id,
        playerName: 'مدير النظام',
        mode: 'individual',
        score: 500, totalQuestions: 5, correctAnswers: 5, wrongAnswers: 0,
        timeSpent: 60000,
      },
      {
        quiz: createdQuizzes[2]?._id,
        player: createdUsers[1]?._id,
        playerName: 'أحمد المعلم',
        mode: 'individual',
        score: 350, totalQuestions: 5, correctAnswers: 3, wrongAnswers: 2,
        timeSpent: 110000,
      },
    ];

    for (const h of historyRecords) {
      if (!h.quiz) continue;
      await PlayHistory.create(h);
      totalHistory++;
    }

    console.log(`\n🎉 Seed completed successfully!`);
    console.log(`   📂 Categories : ${createdCategories.length}`);
    console.log(`   👥 Users      : ${createdUsers.length}`);
    console.log(`   📝 Quizzes    : ${totalQuizzes}`);
    console.log(`   ❓ Questions  : ${totalQuestions}`);
    console.log(`   🏆 History    : ${totalHistory}`);
    console.log(`\n📋 Test Accounts:`);
    console.log(`   Admin  : admin@equization.com  /  Admin@123456`);
    console.log(`   Demo   : demo@equization.com   /  Demo@123456`);
    console.log(`   Sara   : sara@equization.com   /  Sara@123456`);
    console.log(`   Omar   : omar@equization.com   /  Omar@123456`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error(err.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
