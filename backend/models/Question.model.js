const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Answer text is required'],
    trim: true
  },
  image: {
    type: String
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
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
    trim: true,
    minlength: [10, 'Question must be at least 10 characters']
  },
  questionImage: {
    type: String
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'checkbox'],
    default: 'multiple-choice'
  },
  answers: {
    type: [AnswerSchema],
    validate: {
      validator: function(answers) {
        // Must have at least 2 answers
        if (answers.length < 2) return false;
        
        // Must have at least one correct answer
        const correctAnswers = answers.filter(a => a.isCorrect);
        if (correctAnswers.length === 0) return false;
        
        // For multiple-choice and true-false, only one correct answer
        if (this.questionType !== 'checkbox' && correctAnswers.length > 1) {
          return false;
        }
        
        return true;
      },
      message: 'Invalid answers configuration'
    }
  },
  points: {
    type: Number,
    default: 100
  },
  timeLimit: {
    type: Number, // in seconds
    default: 30
  },
  explanation: {
    type: String,
    maxlength: [500, 'Explanation cannot exceed 500 characters']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  order: {
    type: Number,
    default: 0
  },
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    correctAttempts: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for quiz questions
QuestionSchema.index({ quiz: 1, order: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
