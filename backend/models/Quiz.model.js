const mongoose = require('mongoose');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateCode(len = 6) {
  let code = '';
  for (let i = 0; i < len; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a quiz title'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a brief description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  detailedDescription: {
    type: String,
    maxlength: [2000, 'Detailed description cannot exceed 2000 characters']
  },
  coverImage: {
    type: String,
    default: 'https://res.cloudinary.com/dpmvrlnsv/image/upload/v1614245383/defaults/quiz-default.png'
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  educationLevel: {
    type: String,
    enum: ['elementary', 'middle', 'high', 'university', 'professional', 'general'],
    default: 'general'
  },
  isPublic:  { type: Boolean, default: true },
  isActive:  { type: Boolean, default: true },
  quizCode:  { type: String, unique: true, sparse: true },
  timeLimit: { type: Number, default: 30 }, // seconds per question default
  pointsPerQuestion: { type: Number, default: 100 },
  settings: {
    showAnswers:        { type: Boolean, default: true },
    randomizeQuestions: { type: Boolean, default: false },
    randomizeAnswers:   { type: Boolean, default: false },
    allowMultipleTakes: { type: Boolean, default: true },
    autoNext:           { type: Boolean, default: false }, // auto advance to next question
    showTimer:          { type: Boolean, default: true }
  },
  statistics: {
    totalPlays:   { type: Number, default: 0 },
    totalPlayers: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    views:        { type: Number, default: 0 }
  },
  tags:     [String],
  language: {
    type: String,
    enum: ['ar', 'en', 'fr', 'tr'],
    default: 'ar'
  }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true }
});

// virtual: count of questions
QuizSchema.virtual('questionCount').get(function () {
  return this.questions ? this.questions.length : 0;
});

// auto-generate unique quiz code
QuizSchema.pre('save', async function (next) {
  if (!this.quizCode) {
    let code;
    let exists = true;
    while (exists) {
      code  = generateCode(6);
      exists = !!(await this.constructor.findOne({ quizCode: code }));
    }
    this.quizCode = code;
  }
  next();
});

// Note: No text index – we use regex search to support all languages including Arabic
QuizSchema.index({ creator: 1, isPublic: 1 });
QuizSchema.index({ categories: 1 });
QuizSchema.index({ 'statistics.totalPlays': -1 });

module.exports = mongoose.model('Quiz', QuizSchema);
