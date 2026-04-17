const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.Mixed,  // { ar, en, fr, tr }
    required: [true, 'Category name is required']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: mongoose.Schema.Types.Mixed,  // { ar, en }
    default: {}
  },
  icon:      { type: String, default: 'mdi-folder' },
  color:     { type: String, default: '#363999' },
  quizCount: { type: Number, default: 0 },
  isActive:  { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
