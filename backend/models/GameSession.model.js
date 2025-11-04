const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  socketId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  score: {
    type: Number,
    default: 0
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswers: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    isCorrect: Boolean,
    timeSpent: Number, // in milliseconds
    points: Number,
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const GameSessionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  players: [PlayerSchema],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'question-active', 'showing-results', 'completed'],
    default: 'waiting'
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  settings: {
    maxPlayers: {
      type: Number,
      default: 250
    },
    allowLateJoin: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Generate unique session code
GameSessionSchema.methods.generateSessionCode = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Pre-save middleware to generate session code
GameSessionSchema.pre('save', async function(next) {
  if (!this.sessionCode) {
    let code;
    let codeExists = true;
    
    while (codeExists) {
      code = this.generateSessionCode();
      const session = await this.constructor.findOne({ sessionCode: code });
      if (!session) {
        codeExists = false;
      }
    }
    
    this.sessionCode = code;
  }
  next();
});

// Clean up old sessions (older than 24 hours)
GameSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('GameSession', GameSessionSchema);
