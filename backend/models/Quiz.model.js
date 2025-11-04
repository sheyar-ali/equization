const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a quiz title'],
    trim: true,
    minlength: [8, 'Title must be at least 8 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a brief description'],
    minlength: [30, 'Description must be at least 30 characters'],
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
    ref: 'Category',
    required: [true, 'Please select at least one category']
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
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  quizCode: {
    type: String,
    unique: true,
    sparse: true
  },
  timeLimit: {
    type: Number, // in seconds
    default: 30
  },
  pointsPerQuestion: {
    type: Number,
    default: 100
  },
  settings: {
    showAnswers: {
      type: Boolean,
      default: true
    },
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    randomizeAnswers: {
      type: Boolean,
      default: true
    },
    allowMultipleTakes: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    totalPlays: {
      type: Number,
      default: 0
    },
    totalPlayers: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  language: {
    type: String,
    enum: ['ar', 'en', 'fr', 'tr'],
    default: 'ar'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for question count
QuizSchema.virtual('questionCount').get(function() {
  return this.questions ? this.questions.length : 0;
});

// Generate unique quiz code
QuizSchema.methods.generateQuizCode = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Pre-save middleware to generate quiz code
QuizSchema.pre('save', async function(next) {
  if (!this.quizCode) {
    let code;
    let codeExists = true;
    
    while (codeExists) {
      code = this.generateQuizCode();
      const quiz = await this.constructor.findOne({ quizCode: code });
      if (!quiz) {
        codeExists = false;
      }
    }
    
    this.quizCode = code;
  }
  next();
});

// Index for better search performance
QuizSchema.index({ title: 'text', description: 'text', tags: 'text' });
QuizSchema.index({ creator: 1, isPublic: 1 });
QuizSchema.index({ categories: 1 });

module.exports = mongoose.model('Quiz', QuizSchema);
