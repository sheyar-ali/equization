const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category.model');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected for seeding'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Initial categories data
const categories = [
  {
    name: {
      ar: 'معلومات عامة',
      en: 'General Knowledge',
      fr: 'Culture Générale',
      tr: 'Genel Bilgi'
    },
    slug: 'general-knowledge',
    description: {
      ar: 'أسئلة عامة في مختلف المجالات',
      en: 'General questions in various fields',
      fr: 'Questions générales dans divers domaines',
      tr: 'Çeşitli alanlarda genel sorular'
    },
    icon: 'mdi-brain',
    color: '#FF6B6B'
  },
  {
    name: {
      ar: 'علوم',
      en: 'Science',
      fr: 'Sciences',
      tr: 'Bilim'
    },
    slug: 'science',
    description: {
      ar: 'أسئلة في مجالات العلوم المختلفة',
      en: 'Questions in various science fields',
      fr: 'Questions dans divers domaines scientifiques',
      tr: 'Çeşitli bilim alanlarında sorular'
    },
    icon: 'mdi-flask',
    color: '#4ECDC4'
  },
  {
    name: {
      ar: 'رياضيات',
      en: 'Mathematics',
      fr: 'Mathématiques',
      tr: 'Matematik'
    },
    slug: 'mathematics',
    description: {
      ar: 'أسئلة رياضية ومسائل حسابية',
      en: 'Math questions and calculations',
      fr: 'Questions mathématiques et calculs',
      tr: 'Matematik soruları ve hesaplamalar'
    },
    icon: 'mdi-calculator',
    color: '#95E1D3'
  },
  {
    name: {
      ar: 'تاريخ',
      en: 'History',
      fr: 'Histoire',
      tr: 'Tarih'
    },
    slug: 'history',
    description: {
      ar: 'أسئلة عن الأحداث التاريخية',
      en: 'Questions about historical events',
      fr: 'Questions sur les événements historiques',
      tr: 'Tarihi olaylar hakkında sorular'
    },
    icon: 'mdi-book-open-variant',
    color: '#F38181'
  },
  {
    name: {
      ar: 'جغرافيا',
      en: 'Geography',
      fr: 'Géographie',
      tr: 'Coğrafya'
    },
    slug: 'geography',
    description: {
      ar: 'أسئلة عن البلدان والمدن والتضاريس',
      en: 'Questions about countries, cities, and terrain',
      fr: 'Questions sur les pays, les villes et le terrain',
      tr: 'Ülkeler, şehirler ve arazi hakkında sorular'
    },
    icon: 'mdi-earth',
    color: '#AA96DA'
  },
  {
    name: {
      ar: 'لغات',
      en: 'Languages',
      fr: 'Langues',
      tr: 'Diller'
    },
    slug: 'languages',
    description: {
      ar: 'أسئلة لغوية ونحوية',
      en: 'Language and grammar questions',
      fr: 'Questions de langue et de grammaire',
      tr: 'Dil ve dilbilgisi soruları'
    },
    icon: 'mdi-translate',
    color: '#FCBAD3'
  },
  {
    name: {
      ar: 'رياضة',
      en: 'Sports',
      fr: 'Sports',
      tr: 'Spor'
    },
    slug: 'sports',
    description: {
      ar: 'أسئلة عن الرياضات المختلفة',
      en: 'Questions about various sports',
      fr: 'Questions sur divers sports',
      tr: 'Çeşitli sporlar hakkında sorular'
    },
    icon: 'mdi-soccer',
    color: '#A8D8EA'
  },
  {
    name: {
      ar: 'فن وثقافة',
      en: 'Art & Culture',
      fr: 'Art et Culture',
      tr: 'Sanat ve Kültür'
    },
    slug: 'art-culture',
    description: {
      ar: 'أسئلة عن الفنون والثقافة',
      en: 'Questions about arts and culture',
      fr: 'Questions sur les arts et la culture',
      tr: 'Sanat ve kültür hakkında sorular'
    },
    icon: 'mdi-palette',
    color: '#FFFFD2'
  },
  {
    name: {
      ar: 'تكنولوجيا',
      en: 'Technology',
      fr: 'Technologie',
      tr: 'Teknoloji'
    },
    slug: 'technology',
    description: {
      ar: 'أسئلة عن التقنية والبرمجة',
      en: 'Questions about technology and programming',
      fr: 'Questions sur la technologie et la programmation',
      tr: 'Teknoloji ve programlama hakkında sorular'
    },
    icon: 'mdi-laptop',
    color: '#363999'
  },
  {
    name: {
      ar: 'صحة',
      en: 'Health',
      fr: 'Santé',
      tr: 'Sağlık'
    },
    slug: 'health',
    description: {
      ar: 'أسئلة عن الصحة والطب',
      en: 'Questions about health and medicine',
      fr: 'Questions sur la santé et la médecine',
      tr: 'Sağlık ve tıp hakkında sorular'
    },
    icon: 'mdi-heart-pulse',
    color: '#FF5E94'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Insert categories
    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully');

    console.log('\n📊 Seeding Summary:');
    console.log(`   - Categories: ${categories.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
