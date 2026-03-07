/**
 * seed.js – Database seeder for eQuization
 * Run: node config/seed.js
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const path     = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Category    = require('../models/Category.model');
const User        = require('../models/User.model');
const Quiz        = require('../models/Quiz.model');
const Question    = require('../models/Question.model');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/equization';

// ── Category data ─────────────────────────────────────────────────────────────
const categories = [
  { slug: 'general-info',    icon: 'mdi-earth',         color: '#4CAF50',
    name: { ar: 'معلومات عامة',   en: 'General Knowledge', fr: 'Culture Générale', tr: 'Genel Bilgi' },
    description: { ar: 'أسئلة عامة متنوعة', en: 'Diverse general questions' } },

  { slug: 'science',         icon: 'mdi-flask',         color: '#2196F3',
    name: { ar: 'علوم',           en: 'Science',           fr: 'Sciences',         tr: 'Bilim' },
    description: { ar: 'أسئلة في مجال العلوم', en: 'Science questions' } },

  { slug: 'mathematics',     icon: 'mdi-calculator',    color: '#9C27B0',
    name: { ar: 'رياضيات',        en: 'Mathematics',       fr: 'Mathématiques',    tr: 'Matematik' },
    description: { ar: 'أسئلة رياضيات', en: 'Math questions' } },

  { slug: 'history',         icon: 'mdi-book-open',     color: '#FF9800',
    name: { ar: 'تاريخ',          en: 'History',           fr: 'Histoire',         tr: 'Tarih' },
    description: { ar: 'أسئلة تاريخية', en: 'Historical questions' } },

  { slug: 'languages',       icon: 'mdi-translate',     color: '#00BCD4',
    name: { ar: 'لغات أجنبية',    en: 'Foreign Languages', fr: 'Langues',          tr: 'Diller' },
    description: { ar: 'أسئلة في اللغات', en: 'Language questions' } },

  { slug: 'physics',         icon: 'mdi-atom',          color: '#F44336',
    name: { ar: 'فيزياء',         en: 'Physics',           fr: 'Physique',         tr: 'Fizik' },
    description: { ar: 'أسئلة فيزيائية', en: 'Physics questions' } },

  { slug: 'chemistry',       icon: 'mdi-test-tube',     color: '#8BC34A',
    name: { ar: 'كيمياء',         en: 'Chemistry',         fr: 'Chimie',           tr: 'Kimya' },
    description: { ar: 'أسئلة كيميائية', en: 'Chemistry questions' } },

  { slug: 'education',       icon: 'mdi-school',        color: '#3F51B5',
    name: { ar: 'تعليم',          en: 'Education',         fr: 'Éducation',        tr: 'Eğitim' },
    description: { ar: 'أسئلة تعليمية', en: 'Educational questions' } },

  { slug: 'arts',            icon: 'mdi-palette',       color: '#FF5722',
    name: { ar: 'فنون',           en: 'Arts',              fr: 'Arts',             tr: 'Sanat' },
    description: { ar: 'أسئلة فنية', en: 'Arts questions' } },

  { slug: 'sports',          icon: 'mdi-soccer',        color: '#009688',
    name: { ar: 'رياضة',          en: 'Sports',            fr: 'Sports',           tr: 'Spor' },
    description: { ar: 'أسئلة رياضية', en: 'Sports questions' } },

  { slug: 'technology',      icon: 'mdi-laptop',        color: '#607D8B',
    name: { ar: 'تكنولوجيا',      en: 'Technology',        fr: 'Technologie',      tr: 'Teknoloji' },
    description: { ar: 'أسئلة تكنولوجيا', en: 'Tech questions' } }
];

// ── Sample quiz & questions ───────────────────────────────────────────────────
async function seedDatabase() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Category.deleteMany({}),
    User.deleteMany({}),
    Quiz.deleteMany({}),
    Question.deleteMany({})
  ]);
  console.log('🗑️  Cleared existing data');

  // Insert categories
  const insertedCats = await Category.insertMany(categories);
  console.log(`✅ ${insertedCats.length} categories inserted`);

  // Create admin user
  const admin = await User.create({
    username:   'admin',
    email:      'admin@equization.com',
    password:   'Admin@123456',
    firstName:  'Admin',
    lastName:   'eQuization',
    role:       'admin',
    isVerified: true
  });
  console.log(`✅ Admin user created (admin@equization.com / Admin@123456)`);

  // Create demo user
  const demo = await User.create({
    username:   'demo_user',
    email:      'demo@equization.com',
    password:   'Demo@123456',
    firstName:  'Demo',
    lastName:   'User',
    isVerified: true
  });

  // Create sample quiz
  const generalCat = insertedCats.find(c => c.slug === 'general-info');
  const scienceCat = insertedCats.find(c => c.slug === 'science');

  const quiz = await Quiz.create({
    title:       'اختبار المعلومات العامة',
    description: 'اختبار شامل في المعلومات العامة والعلوم',
    categories:  [generalCat._id, scienceCat._id],
    creator:     demo._id,
    difficulty:  'easy',
    language:    'ar',
    isPublic:    true,
    timeLimit:   30
  });

  // Create sample questions
  const questionsData = [
    {
      quiz:         quiz._id,
      questionText: 'ما هي عاصمة المملكة العربية السعودية؟',
      questionType: 'multiple-choice',
      answers: [
        { text: 'الرياض',  isCorrect: true  },
        { text: 'جدة',     isCorrect: false },
        { text: 'مكة',     isCorrect: false },
        { text: 'المدينة', isCorrect: false }
      ],
      points:    100,
      timeLimit: 30,
      order:     0
    },
    {
      quiz:         quiz._id,
      questionText: 'كم عدد أيام السنة الكبيسة؟',
      questionType: 'multiple-choice',
      answers: [
        { text: '365', isCorrect: false },
        { text: '366', isCorrect: true  },
        { text: '364', isCorrect: false },
        { text: '367', isCorrect: false }
      ],
      points:    100,
      timeLimit: 20,
      order:     1
    },
    {
      quiz:         quiz._id,
      questionText: 'الشمس نجم.',
      questionType: 'true-false',
      answers: [
        { text: 'صحيح',   isCorrect: true  },
        { text: 'خاطئ',   isCorrect: false }
      ],
      points:    100,
      timeLimit: 15,
      order:     2
    },
    {
      quiz:         quiz._id,
      questionText: 'أيٌّ من التالي دول عربية؟',
      questionType: 'checkbox',
      answers: [
        { text: 'مصر',    isCorrect: true  },
        { text: 'ألمانيا',isCorrect: false },
        { text: 'الأردن', isCorrect: true  },
        { text: 'البرازيل', isCorrect: false }
      ],
      points:    150,
      timeLimit: 30,
      order:     3
    },
    {
      quiz:         quiz._id,
      questionText: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
      questionType: 'multiple-choice',
      answers: [
        { text: 'المشتري', isCorrect: true  },
        { text: 'زحل',     isCorrect: false },
        { text: 'الأرض',   isCorrect: false },
        { text: 'أورانوس', isCorrect: false }
      ],
      points:    100,
      timeLimit: 25,
      order:     4
    }
  ];

  const insertedQuestions = await Question.insertMany(questionsData);
  quiz.questions = insertedQuestions.map(q => q._id);
  await quiz.save();

  // Update stats
  await User.findByIdAndUpdate(demo._id, {
    $push: { quizzes: quiz._id },
    $inc:  { 'statistics.quizzesCreated': 1 }
  });
  await Category.updateMany(
    { _id: { $in: [generalCat._id, scienceCat._id] } },
    { $inc: { quizCount: 1 } }
  );

  console.log(`✅ Sample quiz created with ${insertedQuestions.length} questions`);
  console.log(`\n🎉 Database seeded successfully!\n`);
  console.log('──────────────────────────────────────');
  console.log('Login Credentials:');
  console.log('  Admin: admin@equization.com / Admin@123456');
  console.log('  Demo:  demo@equization.com  / Demo@123456');
  console.log('──────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
