const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  text:      { type: String, trim: true },
  image:     { type: String },
  isCorrect: { type: Boolean, default: false }
}, { _id: true });

const QuestionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  questionText: {
    type: String,
    required: [true, 'Please provide question text'],
    trim: true
  },
  questionImage: { type: String },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'checkbox', 'no-answer'],
    default: 'multiple-choice'
  },
  answers: {
    type: [AnswerSchema],
    validate: {
      validator: function (answers) {
        if (!answers || answers.length < 2) return false;
        if (this.questionType === 'no-answer') return true;
        const correct = answers.filter(a => a.isCorrect);
        if (correct.length === 0) return false;
        if (this.questionType !== 'checkbox' && correct.length > 1) return false;
        return true;
      },
      message: 'Invalid answers configuration'
    }
  },
  points:     { type: Number, default: 100 },
  timeLimit:  { type: Number, default: 30 }, // seconds
  explanation:{ type: String, maxlength: [1000, 'Explanation too long'] },
  source:     { type: String, maxlength: [200, 'Source too long'] },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  order:      { type: Number, default: 0 },
  statistics: {
    totalAttempts:   { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    averageTime:     { type: Number, default: 0 }
  }
}, { timestamps: true });

QuestionSchema.index({ quiz: 1, order: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
