const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: Object,
    required: [true, 'Please provide category names'],
    ar: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    },
    fr: {
      type: String
    },
    tr: {
      type: String
    }
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: Object,
    ar: String,
    en: String,
    fr: String,
    tr: String
  },
  icon: {
    type: String,
    default: 'mdi-folder'
  },
  color: {
    type: String,
    default: '#363999'
  },
  quizCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
