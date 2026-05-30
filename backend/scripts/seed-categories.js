/**
 * scripts/seed-categories.js
 *
 * Seeds the Category collection with the standard quiz categories used by
 * eQuization.  Safe to re-run: uses upsert so existing categories are
 * updated, not duplicated.
 *
 * Usage:
 *   node backend/scripts/seed-categories.js
 *   (run from the project root, or from inside backend/)
 */

const path    = require('path');
const dotenv  = require('dotenv');
const mongoose = require('mongoose');

// Load .env from backend/
dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category.model');

const CATEGORIES = [
  {
    slug: 'general-knowledge',
    name: { ar: 'المعرفة العامة', en: 'General Knowledge' },
    description: { ar: 'أسئلة متنوعة في المعرفة العامة', en: 'Mixed general knowledge questions' },
    icon: 'mdi-earth',
    color: '#363999',
  },
  {
    slug: 'foreign-languages',
    name: { ar: 'اللغات الأجنبية', en: 'Foreign Languages' },
    description: { ar: 'اختبارات اللغات الأجنبية', en: 'Foreign language quizzes' },
    icon: 'mdi-translate',
    color: '#6c63ff',
  },
  {
    slug: 'arabic-language',
    name: { ar: 'اللغة العربية', en: 'Arabic Language' },
    description: { ar: 'قواعد وأدب اللغة العربية', en: 'Arabic grammar and literature' },
    icon: 'mdi-abjad-arabic',
    color: '#ff5e94',
  },
  {
    slug: 'mathematics',
    name: { ar: 'الرياضيات', en: 'Mathematics' },
    description: { ar: 'الجبر والهندسة والحساب', en: 'Algebra, geometry, and arithmetic' },
    icon: 'mdi-calculator-variant',
    color: '#f7941d',
  },
  {
    slug: 'science',
    name: { ar: 'العلوم', en: 'Science' },
    description: { ar: 'الفيزياء والكيمياء والأحياء', en: 'Physics, chemistry, and biology' },
    icon: 'mdi-flask',
    color: '#00bcd4',
  },
  {
    slug: 'history',
    name: { ar: 'التاريخ', en: 'History' },
    description: { ar: 'تاريخ العالم والحضارات', en: 'World history and civilizations' },
    icon: 'mdi-book-open-page-variant',
    color: '#8d6e63',
  },
  {
    slug: 'geography',
    name: { ar: 'الجغرافيا', en: 'Geography' },
    description: { ar: 'دول وعواصم ومدن العالم', en: 'Countries, capitals, and world geography' },
    icon: 'mdi-map-marker',
    color: '#43a047',
  },
  {
    slug: 'islamic-studies',
    name: { ar: 'الدراسات الإسلامية', en: 'Islamic Studies' },
    description: { ar: 'القرآن والسيرة النبوية والفقه', en: 'Quran, Seerah, and Islamic jurisprudence' },
    icon: 'mdi-star-crescent',
    color: '#1b5e20',
  },
  {
    slug: 'technology',
    name: { ar: 'التكنولوجيا', en: 'Technology' },
    description: { ar: 'البرمجة والذكاء الاصطناعي والتقنية', en: 'Programming, AI, and tech' },
    icon: 'mdi-laptop',
    color: '#0288d1',
  },
  {
    slug: 'arts-culture',
    name: { ar: 'الفنون والثقافة', en: 'Arts & Culture' },
    description: { ar: 'الموسيقى والرسم والأدب', en: 'Music, visual arts, and literature' },
    icon: 'mdi-palette',
    color: '#e91e63',
  },
  {
    slug: 'sports',
    name: { ar: 'الرياضة', en: 'Sports' },
    description: { ar: 'كرة القدم والرياضات العالمية', en: 'Football and world sports' },
    icon: 'mdi-soccer',
    color: '#ff7043',
  },
  {
    slug: 'health-medicine',
    name: { ar: 'الصحة والطب', en: 'Health & Medicine' },
    description: { ar: 'التغذية والصحة والطب', en: 'Nutrition, health, and medicine' },
    icon: 'mdi-heart-pulse',
    color: '#d32f2f',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅  Connected to MongoDB');

  let created = 0;
  let updated = 0;

  for (const cat of CATEGORIES) {
    const result = await Category.findOneAndUpdate(
      { slug: cat.slug },
      cat,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result.__v === 0 && result.quizCount === 0) {
      created++;
      console.log(`   ✚ Created: ${cat.slug}`);
    } else {
      updated++;
      console.log(`   ↺ Updated: ${cat.slug}`);
    }
  }

  console.log(`\n🎉  Done — ${created} created, ${updated} updated`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
