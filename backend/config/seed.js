/**
 * seed.js - سكريبت لزرع بيانات تجريبية شاملة في قاعدة البيانات
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User        = require('../models/User.model');
const Category    = require('../models/Category.model');
const Quiz        = require('../models/Quiz.model');
const Question    = require('../models/Question.model');
const PlayHistory = require('../models/PlayHistory.model');

// ── 1. تعريف البيانات ────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: { ar: 'معلومات عامة', en: 'General Knowledge' }, slug: 'general-knowledge', icon: 'mdi-earth', color: '#363999', description: { ar: 'اختبارات معلومات عامة متنوعة', en: 'General knowledge quizzes' } },
  { name: { ar: 'تاريخ',       en: 'History'           }, slug: 'history',           icon: 'mdi-book-open-variant', color: '#8B4513', description: { ar: 'اختبارات تاريخية', en: 'History quizzes' } },
  { name: { ar: 'علوم',        en: 'Science'           }, slug: 'science',           icon: 'mdi-flask',             color: '#2E8B57', description: { ar: 'اختبارات علمية', en: 'Science quizzes' } },
  { name: { ar: 'رياضيات',     en: 'Mathematics'       }, slug: 'mathematics',       icon: 'mdi-calculator',        color: '#4B0082', description: { ar: 'اختبارات رياضية', en: 'Math quizzes' } },
  { name: { ar: 'جغرافيا',     en: 'Geography'         }, slug: 'geography',         icon: 'mdi-map-marker',        color: '#006400', description: { ar: 'اختبارات جغرافية', en: 'Geography quizzes' } },
  { name: { ar: 'لغة عربية',   en: 'Arabic Language'   }, slug: 'arabic-language',   icon: 'mdi-translate',         color: '#8B0000', description: { ar: 'اختبارات لغة عربية', en: 'Arabic language quizzes' } },
  { name: { ar: 'لغات أجنبية', en: 'Foreign Languages' }, slug: 'foreign-languages', icon: 'mdi-web',               color: '#00008B', description: { ar: 'اختبارات اللغات الأجنبية', en: 'Foreign language quizzes' } },
  { name: { ar: 'كيمياء',      en: 'Chemistry'         }, slug: 'chemistry',         icon: 'mdi-atom',              color: '#FF4500', description: { ar: 'اختبارات كيمياء', en: 'Chemistry quizzes' } },
  { name: { ar: 'فيزياء',      en: 'Physics'           }, slug: 'physics',           icon: 'mdi-lightning-bolt',    color: '#FFD700', description: { ar: 'اختبارات فيزياء', en: 'Physics quizzes' } },
  { name: { ar: 'أحياء',       en: 'Biology'           }, slug: 'biology',           icon: 'mdi-leaf',              color: '#228B22', description: { ar: 'اختبارات أحياء', en: 'Biology quizzes' } },
  { name: { ar: 'دين إسلامي',  en: 'Islamic Studies'   }, slug: 'islamic-studies',   icon: 'mdi-star-crescent',     color: '#006400', description: { ar: 'اختبارات دينية', en: 'Islamic studies quizzes' } },
];

// ── 2. تعريف الاختبارات والأسئلة ─────────────────────────────────────────────

const QUIZZES_DATA = [
  {
    title: 'اختبار المعلومات العامة الشامل',
    description: 'اختبر معلوماتك العامة في مختلف المجالات',
    detailedDescription: 'اختبار شامل يغطي مجالات متعددة من المعلومات العامة، التاريخ، الجغرافيا، والعلوم. مناسب لجميع الأعمار ويساعدك على قياس مستوى معرفتك العامة.',
    difficulty: 'medium',
    educationLevel: 'general',
    language: 'en',
    isPublic: true,
    timeLimit: 30,
    pointsPerQuestion: 100,
    totalPlays: 245,
    totalPlayers: 1823,
    averageScore: 72,
    categorySlug: 'general-knowledge',
    questions: [
      {
        text: 'ما هي عاصمة المملكة العربية السعودية؟',
        type: 'multiple-choice',
        answers: [
          { text: 'الرياض',  isCorrect: true  },
          { text: 'جدة',     isCorrect: false },
          { text: 'مكة المكرمة', isCorrect: false },
          { text: 'الدمام',  isCorrect: false },
        ],
        explanation: 'الرياض هي عاصمة المملكة العربية السعودية ومركزها السياسي والإداري.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'كم عدد قارات العالم؟',
        type: 'multiple-choice',
        answers: [
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '7', isCorrect: true  },
          { text: '8', isCorrect: false },
        ],
        explanation: 'يتكون العالم من سبع قارات: آسيا، أفريقيا، أمريكا الشمالية، أمريكا الجنوبية، أوروبا، أستراليا، القارة القطبية الجنوبية.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'أي من هذه الدول يقع في قارة أمريكا الجنوبية؟',
        type: 'multiple-choice',
        answers: [
          { text: 'المكسيك',  isCorrect: false },
          { text: 'البرازيل', isCorrect: true  },
          { text: 'كندا',     isCorrect: false },
          { text: 'كوبا',     isCorrect: false },
        ],
        explanation: 'البرازيل هي أكبر دولة في أمريكا الجنوبية من حيث المساحة والسكان.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'النيل هو أطول نهر في العالم.',
        type: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true  },
          { text: 'خطأ',  isCorrect: false },
        ],
        explanation: 'نعم، نهر النيل هو أطول أنهار العالم بطول يبلغ حوالي 6650 كيلومتراً.',
        timeLimit: 20,
        points: 80,
      },
      {
        text: 'ما هو أكبر محيط في العالم؟',
        type: 'multiple-choice',
        answers: [
          { text: 'المحيط الأطلسي', isCorrect: false },
          { text: 'المحيط الهندي',  isCorrect: false },
          { text: 'المحيط الهادئ',  isCorrect: true  },
          { text: 'المحيط المتجمد الشمالي', isCorrect: false },
        ],
        explanation: 'المحيط الهادئ هو أكبر وأعمق المحيطات على وجه الأرض.',
        timeLimit: 30,
        points: 100,
      },
    ],
  },
  {
    title: 'اختبار تاريخ الحضارة الإسلامية',
    description: 'رحلة عبر تاريخ الحضارة الإسلامية العريقة',
    detailedDescription: 'اختبار تاريخي شامل يغطي أبرز محطات الحضارة الإسلامية، من صدر الإسلام حتى الدولة العثمانية. يناسب طلاب التاريخ والمهتمين بالتراث الإسلامي.',
    difficulty: 'medium',
    educationLevel: 'high',
    language: 'en',
    isPublic: true,
    timeLimit: 40,
    pointsPerQuestion: 100,
    totalPlays: 189,
    totalPlayers: 1456,
    averageScore: 65,
    categorySlug: 'history',
    questions: [
      {
        text: 'في أي عام هاجر النبي محمد ﷺ من مكة إلى المدينة؟',
        type: 'multiple-choice',
        answers: [
          { text: '610 م', isCorrect: false },
          { text: '622 م', isCorrect: true  },
          { text: '630 م', isCorrect: false },
          { text: '632 م', isCorrect: false },
        ],
        explanation: 'كانت الهجرة النبوية عام 622 م، وهي بداية التقويم الهجري.',
        timeLimit: 40,
        points: 100,
      },
      {
        text: 'من هو أول الخلفاء الراشدين؟',
        type: 'multiple-choice',
        answers: [
          { text: 'عمر بن الخطاب', isCorrect: false },
          { text: 'أبو بكر الصديق', isCorrect: true },
          { text: 'علي بن أبي طالب', isCorrect: false },
          { text: 'عثمان بن عفان', isCorrect: false },
        ],
        explanation: 'أبو بكر الصديق رضي الله عنه هو أول الخلفاء الراشدين، خلف النبي ﷺ في قيادة المسلمين.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'ما هي أول عاصمة للدولة الإسلامية؟',
        type: 'multiple-choice',
        answers: [
          { text: 'مكة المكرمة', isCorrect: false },
          { text: 'دمشق',        isCorrect: false },
          { text: 'المدينة المنورة', isCorrect: true },
          { text: 'بغداد',       isCorrect: false },
        ],
        explanation: 'المدينة المنورة كانت أول عاصمة للدولة الإسلامية في عهد النبي ﷺ والخلفاء الراشدين.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'الدولة الأموية أسسها معاوية بن أبي سفيان.',
        type: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true  },
          { text: 'خطأ',  isCorrect: false },
        ],
        explanation: 'نعم، معاوية بن أبي سفيان رضي الله عنه هو مؤسس الدولة الأموية عام 661 م.',
        timeLimit: 20,
        points: 80,
      },
      {
        text: 'في أي عام فتحت القسطنطينية على يد السلطان محمد الفاتح؟',
        type: 'multiple-choice',
        answers: [
          { text: '1389 م', isCorrect: false },
          { text: '1453 م', isCorrect: true  },
          { text: '1517 م', isCorrect: false },
          { text: '1571 م', isCorrect: false },
        ],
        explanation: 'فتح السلطان محمد الفاتح القسطنطينية عام 1453 م، وأصبحت عاصمة للدولة العثمانية.',
        timeLimit: 40,
        points: 100,
      },
    ],
  },
  {
    title: 'اختبار العلوم - الفيزياء والكيمياء',
    description: 'اختبر معلوماتك في الفيزياء والكيمياء',
    detailedDescription: 'اختبار علمي متوسط المستوى يغطي أساسيات الفيزياء والكيمياء. يناسب طلاب المرحلة الثانوية والجامعية الراغبين في مراجعة المفاهيم العلمية.',
    difficulty: 'hard',
    educationLevel: 'university',
    language: 'en',
    isPublic: true,
    timeLimit: 45,
    pointsPerQuestion: 120,
    totalPlays: 312,
    totalPlayers: 2105,
    averageScore: 58,
    categorySlug: 'science',
    questions: [
      {
        text: 'ما هي وحدة قياس الشحنة الكهربائية؟',
        type: 'multiple-choice',
        answers: [
          { text: 'أمبير', isCorrect: false },
          { text: 'فولت',  isCorrect: false },
          { text: 'كولوم', isCorrect: true  },
          { text: 'واط',   isCorrect: false },
        ],
        explanation: 'الكولوم (C) هي وحدة قياس الشحنة الكهربائية في النظام الدولي للوحدات.',
        timeLimit: 45,
        points: 120,
      },
      {
        text: 'ما هو العنصر الأكثر شيوعاً في الغلاف الجوي للأرض؟',
        type: 'multiple-choice',
        answers: [
          { text: 'الأكسجين', isCorrect: false },
          { text: 'النيتروجين', isCorrect: true },
          { text: 'ثاني أكسيد الكربون', isCorrect: false },
          { text: 'الهيدروجين', isCorrect: false },
        ],
        explanation: 'النيتروجين يشكل حوالي 78% من الغلاف الجوي للأرض، بينما يشكل الأكسجين حوالي 21%.',
        timeLimit: 30,
        points: 120,
      },
      {
        text: 'سرعة الضوء في الفراغ تبلغ حوالي 300,000 كيلومتر في الثانية.',
        type: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true  },
          { text: 'خطأ',  isCorrect: false },
        ],
        explanation: 'نعم، سرعة الضوء في الفراغ تبلغ 299,792,458 متراً في الثانية، أي ما يقارب 300,000 كم/ث.',
        timeLimit: 20,
        points: 80,
      },
      {
        text: 'ما هو الرمز الكيميائي للذهب؟',
        type: 'multiple-choice',
        answers: [
          { text: 'Go', isCorrect: false },
          { text: 'Gd', isCorrect: false },
          { text: 'Au', isCorrect: true  },
          { text: 'Ag', isCorrect: false },
        ],
        explanation: 'الرمز الكيميائي للذهب هو Au، مشتق من الكلمة اللاتينية "Aurum".',
        timeLimit: 30,
        points: 120,
      },
      {
        text: 'أي قانون من قوانين نيوتن يقول: لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه؟',
        type: 'multiple-choice',
        answers: [
          { text: 'القانون الأول',  isCorrect: false },
          { text: 'القانون الثاني', isCorrect: false },
          { text: 'القانون الثالث', isCorrect: true  },
          { text: 'قانون الجاذبية', isCorrect: false },
        ],
        explanation: 'القانون الثالث لنيوتن ينص على أن لكل فعل رد فعل مساوٍ له في المقدار ومعاكس في الاتجاه.',
        timeLimit: 40,
        points: 120,
      },
    ],
  },
  {
    title: 'اختبار الرياضيات الأساسية',
    description: 'اختبر قدراتك في الرياضيات الأساسية',
    detailedDescription: 'اختبار يشمل مسائل رياضية متنوعة في الجبر، الهندسة والحساب. مناسب للمرحلة الإعدادية والثانوية.',
    difficulty: 'easy',
    educationLevel: 'middle',
    language: 'en',
    isPublic: true,
    timeLimit: 60,
    pointsPerQuestion: 100,
    totalPlays: 523,
    totalPlayers: 3782,
    averageScore: 81,
    categorySlug: 'mathematics',
    questions: [
      {
        text: 'ما هو ناتج: 15 × 8 ؟',
        type: 'multiple-choice',
        answers: [
          { text: '110', isCorrect: false },
          { text: '120', isCorrect: true  },
          { text: '130', isCorrect: false },
          { text: '140', isCorrect: false },
        ],
        explanation: '15 × 8 = 120',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'ما هو الجذر التربيعي للعدد 144؟',
        type: 'multiple-choice',
        answers: [
          { text: '10', isCorrect: false },
          { text: '11', isCorrect: false },
          { text: '12', isCorrect: true  },
          { text: '13', isCorrect: false },
        ],
        explanation: '√144 = 12، لأن 12 × 12 = 144.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'مجموع زوايا المثلث يساوي 180 درجة.',
        type: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true  },
          { text: 'خطأ',  isCorrect: false },
        ],
        explanation: 'نعم، مجموع زوايا أي مثلث يساوي دائماً 180 درجة.',
        timeLimit: 15,
        points: 80,
      },
      {
        text: 'ما هي قيمة π (باي) التقريبية؟',
        type: 'multiple-choice',
        answers: [
          { text: '3.14', isCorrect: true  },
          { text: '2.71', isCorrect: false },
          { text: '1.61', isCorrect: false },
          { text: '4.13', isCorrect: false },
        ],
        explanation: 'π ≈ 3.14159...، وهي نسبة محيط الدائرة إلى قطرها.',
        timeLimit: 20,
        points: 100,
      },
      {
        text: 'إذا كان س + 5 = 12، فما قيمة س؟',
        type: 'multiple-choice',
        answers: [
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '7', isCorrect: true  },
          { text: '8', isCorrect: false },
        ],
        explanation: 'س + 5 = 12، إذن س = 12 - 5 = 7.',
        timeLimit: 30,
        points: 100,
      },
    ],
  },
  {
    title: 'اختبار اللغة العربية والنحو',
    description: 'اختبر مهاراتك في اللغة العربية وقواعد النحو',
    detailedDescription: 'اختبار شامل في قواعد اللغة العربية يغطي النحو والصرف والبلاغة. مناسب لطلاب اللغة العربية والمهتمين بتطوير مهاراتهم اللغوية.',
    difficulty: 'medium',
    educationLevel: 'high',
    language: 'en',
    isPublic: true,
    timeLimit: 35,
    pointsPerQuestion: 100,
    totalPlays: 178,
    totalPlayers: 1234,
    averageScore: 69,
    categorySlug: 'arabic-language',
    questions: [
      {
        text: 'ما إعراب كلمة "محمدٌ" في جملة: "محمدٌ مجتهدٌ"؟',
        type: 'multiple-choice',
        answers: [
          { text: 'مبتدأ مرفوع', isCorrect: true  },
          { text: 'خبر مرفوع',   isCorrect: false },
          { text: 'فاعل مرفوع',  isCorrect: false },
          { text: 'مفعول به',    isCorrect: false },
        ],
        explanation: '"محمدٌ" مبتدأ مرفوع بالضمة الظاهرة على آخره.',
        timeLimit: 35,
        points: 100,
      },
      {
        text: 'كم عدد حروف الجر في اللغة العربية؟',
        type: 'multiple-choice',
        answers: [
          { text: '10', isCorrect: false },
          { text: '17', isCorrect: false },
          { text: '20', isCorrect: true  },
          { text: '25', isCorrect: false },
        ],
        explanation: 'عدد حروف الجر في اللغة العربية 20 حرفاً.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'الفعل المضارع يبدأ دائماً بأحد حروف "أنيت".',
        type: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true  },
          { text: 'خطأ',  isCorrect: false },
        ],
        explanation: 'نعم، يبدأ الفعل المضارع بأحد حروف "أنيت" (الهمزة، النون، الياء، التاء).',
        timeLimit: 20,
        points: 80,
      },
    ],
  },
  {
    title: 'اختبار الجغرافيا العربية والعالمية',
    description: 'اختبر معلوماتك الجغرافية عن الوطن العربي والعالم',
    detailedDescription: 'اختبار جغرافي شامل يغطي الدول العربية والقارات والمعالم الجغرافية الكبرى في العالم.',
    difficulty: 'easy',
    educationLevel: 'general',
    language: 'en',
    isPublic: true,
    timeLimit: 30,
    pointsPerQuestion: 100,
    totalPlays: 412,
    totalPlayers: 2987,
    averageScore: 77,
    categorySlug: 'geography',
    questions: [
      {
        text: 'ما هي أكبر دولة عربية من حيث المساحة؟',
        type: 'multiple-choice',
        answers: [
          { text: 'مصر',                    isCorrect: false },
          { text: 'السودان',                isCorrect: false },
          { text: 'الجزائر',               isCorrect: true  },
          { text: 'المملكة العربية السعودية', isCorrect: false },
        ],
        explanation: 'الجزائر هي أكبر الدول العربية والأفريقية مساحةً.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'يقع جبل إيفرست في قارة آسيا.',
        type: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true  },
          { text: 'خطأ',  isCorrect: false },
        ],
        explanation: 'نعم، جبل إيفرست يقع في سلسلة جبال الهيمالايا على الحدود بين نيبال والصين.',
        timeLimit: 20,
        points: 80,
      },
      {
        text: 'ما هو المضيق الفاصل بين المغرب وإسبانيا؟',
        type: 'multiple-choice',
        answers: [
          { text: 'مضيق هرمز',   isCorrect: false },
          { text: 'مضيق جبل طارق', isCorrect: true },
          { text: 'مضيق باب المندب', isCorrect: false },
          { text: 'مضيق دوفر',   isCorrect: false },
        ],
        explanation: 'مضيق جبل طارق يفصل بين أوروبا وأفريقيا، وبين المغرب وإسبانيا.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'ما هي أطول سلسلة جبلية في العالم؟',
        type: 'multiple-choice',
        answers: [
          { text: 'جبال الهيمالايا', isCorrect: false },
          { text: 'جبال الألب',      isCorrect: false },
          { text: 'جبال الأنديز',    isCorrect: true  },
          { text: 'جبال روكي',       isCorrect: false },
        ],
        explanation: 'جبال الأنديز في أمريكا الجنوبية هي أطول سلسلة جبلية في العالم بطول يتجاوز 7000 كيلومتر.',
        timeLimit: 35,
        points: 100,
      },
    ],
  },
  {
    title: 'اختبار الدراسات الإسلامية',
    description: 'اختبر معلوماتك في الدين الإسلامي والقرآن الكريم',
    detailedDescription: 'اختبار ديني شامل يغطي أحكام الإسلام، القرآن الكريم، السيرة النبوية، والفقه الإسلامي.',
    difficulty: 'medium',
    educationLevel: 'general',
    language: 'en',
    isPublic: true,
    timeLimit: 40,
    pointsPerQuestion: 100,
    totalPlays: 567,
    totalPlayers: 4123,
    averageScore: 74,
    categorySlug: 'islamic-studies',
    questions: [
      {
        text: 'كم عدد سور القرآن الكريم؟',
        type: 'multiple-choice',
        answers: [
          { text: '110', isCorrect: false },
          { text: '114', isCorrect: true  },
          { text: '120', isCorrect: false },
          { text: '124', isCorrect: false },
        ],
        explanation: 'القرآن الكريم يتكون من 114 سورة.',
        timeLimit: 20,
        points: 100,
      },
      {
        text: 'ما هو أركان الإسلام الخمسة؟ اختر الإجابة الصحيحة:',
        type: 'multiple-choice',
        answers: [
          { text: 'الشهادة، الصلاة، الصوم، الزكاة، الحج', isCorrect: true  },
          { text: 'الشهادة، الصلاة، الصوم، الحج، الجهاد', isCorrect: false },
          { text: 'الصلاة، الصوم، الزكاة، الحج، العمرة',  isCorrect: false },
          { text: 'الشهادة، الصلاة، الصوم، الزكاة، العمرة', isCorrect: false },
        ],
        explanation: 'أركان الإسلام الخمسة هي: الشهادتان، إقام الصلاة، إيتاء الزكاة، صوم رمضان، حج البيت.',
        timeLimit: 40,
        points: 100,
      },
      {
        text: 'المدينة المنورة تسمى أيضاً يثرب.',
        type: 'true-false',
        answers: [
          { text: 'صحيح', isCorrect: true  },
          { text: 'خطأ',  isCorrect: false },
        ],
        explanation: 'نعم، كان الاسم القديم للمدينة المنورة يثرب، وسميت لاحقاً بالمدينة المنورة.',
        timeLimit: 20,
        points: 80,
      },
      {
        text: 'في أي شهر هجري يكون صيام رمضان؟',
        type: 'multiple-choice',
        answers: [
          { text: 'الشهر الثامن',  isCorrect: false },
          { text: 'الشهر التاسع',  isCorrect: true  },
          { text: 'الشهر العاشر', isCorrect: false },
          { text: 'الشهر الثاني', isCorrect: false },
        ],
        explanation: 'رمضان هو الشهر التاسع في التقويم الهجري، وهو شهر الصيام المفروض.',
        timeLimit: 20,
        points: 100,
      },
    ],
  },
  {
    title: 'اختبار اللغة الإنجليزية - المستوى المتوسط',
    description: 'Test your English language skills at intermediate level',
    detailedDescription: 'اختبار يقيس مستواك في اللغة الإنجليزية، يشمل القواعد، المفردات، والفهم. مناسب للمستوى المتوسط.',
    difficulty: 'medium',
    educationLevel: 'high',
    language: 'en',
    isPublic: true,
    timeLimit: 40,
    pointsPerQuestion: 100,
    totalPlays: 298,
    totalPlayers: 2156,
    averageScore: 63,
    categorySlug: 'foreign-languages',
    questions: [
      {
        text: 'What is the plural of "child"?',
        type: 'multiple-choice',
        answers: [
          { text: 'childs',   isCorrect: false },
          { text: 'childes',  isCorrect: false },
          { text: 'children', isCorrect: true  },
          { text: 'childre',  isCorrect: false },
        ],
        explanation: 'The plural of "child" is "children" - it is an irregular plural form.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'Which sentence is grammatically correct?',
        type: 'multiple-choice',
        answers: [
          { text: 'She don\'t like coffee.',  isCorrect: false },
          { text: 'She doesn\'t like coffee.', isCorrect: true },
          { text: 'She not like coffee.',     isCorrect: false },
          { text: 'She no like coffee.',      isCorrect: false },
        ],
        explanation: 'With third person singular (she/he/it), we use "doesn\'t" in negative sentences.',
        timeLimit: 30,
        points: 100,
      },
      {
        text: 'The word "beautiful" is an adjective.',
        type: 'true-false',
        answers: [
          { text: 'True',  isCorrect: true  },
          { text: 'False', isCorrect: false },
        ],
        explanation: 'Yes, "beautiful" is an adjective that describes a noun.',
        timeLimit: 15,
        points: 80,
      },
    ],
  },
];

// ── 3. تنفيذ الـ seed ─────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // مسح البيانات القديمة
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Quiz.deleteMany({}),
      Question.deleteMany({}),
      PlayHistory.deleteMany({}),
    ]);
    console.log('🗑️  Old data cleared');

    // ── إنشاء التصنيفات ──────────────────────────────────────────────────────
    const createdCategories = await Category.insertMany(CATEGORIES);
    console.log(`✅ ${createdCategories.length} categories created`);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c; });

    // ── إنشاء المستخدمين ─────────────────────────────────────────────────────
    // ملاحظة: لا نشفر كلمة المرور هنا - الـ model يشفرها تلقائياً في pre-save hook

    const adminUser = await User.create({
      username:   'admin',
      email:      'admin@equization.com',
      password:   'Admin@123456',
      firstName:  'مدير',
      lastName:   'النظام',
      role:       'admin',
      isVerified: true,
      bio:        'مدير منصة eQuization',
      statistics: { quizzesCreated: 3, quizzesPlayed: 10, totalScore: 1250 },
    });

    const demoUser = await User.create({
      username:   'ahmed_teacher',
      email:      'demo@equization.com',
      password:   'Demo@123456',
      firstName:  'أحمد',
      lastName:   'المعلم',
      role:       'user',
      isVerified: true,
      bio:        'مدرّس رياضيات ومهتم بالتعليم التفاعلي',
      statistics: { quizzesCreated: 5, quizzesPlayed: 23, totalScore: 2840 },
    });

    const user2 = await User.create({
      username:   'sara_student',
      email:      'sara@equization.com',
      password:   'Sara@123456',
      firstName:  'سارة',
      lastName:   'الطالبة',
      role:       'user',
      isVerified: true,
      bio:        'طالبة جامعية ومحبة للاختبارات الإلكترونية',
      statistics: { quizzesCreated: 2, quizzesPlayed: 45, totalScore: 5320 },
    });

    const user3 = await User.create({
      username:   'omar_quiz',
      email:      'omar@equization.com',
      password:   'Omar@123456',
      firstName:  'عمر',
      lastName:   'منشئ الاختبارات',
      role:       'user',
      isVerified: true,
      bio:        'مهتم بإنشاء اختبارات تعليمية متنوعة',
      statistics: { quizzesCreated: 8, quizzesPlayed: 18, totalScore: 3150 },
    });

    const creators = [adminUser, demoUser, user2, user3];
    console.log(`✅ ${creators.length} users created`);

    // ── إنشاء الاختبارات والأسئلة ────────────────────────────────────────────
    let totalQuizzes = 0;
    let totalQuestions = 0;

    for (let i = 0; i < QUIZZES_DATA.length; i++) {
      const qData   = QUIZZES_DATA[i];
      const creator = creators[i % creators.length];
      const cat     = catMap[qData.categorySlug];

      if (!cat) {
        console.warn(`⚠️  Category not found: ${qData.categorySlug}`);
        continue;
      }

      // إنشاء الاختبار
      const quizDoc = new Quiz({
        title:               qData.title,
        description:         qData.description,
        detailedDescription: qData.detailedDescription,
        categories:          [cat._id],
        creator:             creator._id,
        difficulty:          qData.difficulty,
        educationLevel:      qData.educationLevel,
        language:            'en',          // MongoDB text index يدعم en فقط
        isPublic:            qData.isPublic,
        timeLimit:           qData.timeLimit,
        pointsPerQuestion:   qData.pointsPerQuestion,
        statistics: {
          totalPlays:   qData.totalPlays,
          totalPlayers: qData.totalPlayers,
          averageScore: qData.averageScore,
          views:        qData.totalPlays * 3,
        },
      });
      await quizDoc.save();
      totalQuizzes++;

      // إنشاء الأسئلة
      for (let j = 0; j < qData.questions.length; j++) {
        const qItem = qData.questions[j];
        const questionDoc = new Question({
          quiz:         quizDoc._id,
          questionText: qItem.text,
          questionType: qItem.type,
          answers:      qItem.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect })),
          explanation:  qItem.explanation,
          timeLimit:    qItem.timeLimit,
          points:       qItem.points,
          order:        j + 1,
        });
        await questionDoc.save();
        quizDoc.questions.push(questionDoc._id);
        totalQuestions++;
      }
      await quizDoc.save();

      // تحديث عدد الاختبارات في التصنيف
      await Category.findByIdAndUpdate(cat._id, { $inc: { quizCount: 1 } });

      // تحديث إحصائيات المنشئ
      await User.findByIdAndUpdate(creator._id, {
        $push: { quizzes: quizDoc._id },
        $inc:  { 'statistics.quizzesCreated': 0 },
      });
    }

    console.log(`✅ ${totalQuizzes} quizzes created with ${totalQuestions} questions`);

    // ── إنشاء سجلات لعب تجريبية ──────────────────────────────────────────────
    const allQuizzes = await Quiz.find({}).limit(4);
    const players    = [demoUser, user2, user3];
    let historyCount = 0;

    for (const quiz of allQuizzes) {
      const questions = await Question.find({ quiz: quiz._id });
      for (const player of players) {
        const answers = questions.map((q, idx) => ({
          question:    q._id,
          answer:      q.answers[0]._id,
          isCorrect:   idx % 3 !== 2,
          points:      idx % 3 !== 2 ? q.points : 0,
          timeSpent:   Math.floor(Math.random() * q.timeLimit * 1000),
        }));
        const correct = answers.filter(a => a.isCorrect).length;
        const score   = answers.reduce((s, a) => s + a.points, 0);

        await PlayHistory.create({
          quiz:           quiz._id,
          player:         player._id,
          playerName:     player.username,
          mode:           'individual',
          score,
          totalQuestions: questions.length,
          correctAnswers: correct,
          wrongAnswers:   questions.length - correct,
          totalTimeSpent: answers.reduce((s, a) => s + a.timeSpent, 0),
          answers,
          completedAt:    new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
        historyCount++;
      }
    }
    console.log(`✅ ${historyCount} play history records created`);

    // ── ملخص نهائي ───────────────────────────────────────────────────────────
    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Categories : ${createdCategories.length}`);
    console.log(`   Users      : ${creators.length}`);
    console.log(`   Quizzes    : ${totalQuizzes}`);
    console.log(`   Questions  : ${totalQuestions}`);
    console.log(`   Play History: ${historyCount}`);
    console.log('\n🔑 Test Accounts:');
    console.log('   Admin : admin@equization.com  / Admin@123456');
    console.log('   Demo  : demo@equization.com   / Demo@123456');
    console.log('   Sara  : sara@equization.com   / Sara@123456');
    console.log('   Omar  : omar@equization.com   / Omar@123456');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
