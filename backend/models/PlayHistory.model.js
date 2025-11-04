const mongoose = require('mongoose');

const PlayHistorySchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  playerName: {
    type: String,
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameSession'
  },
  mode: {
    type: String,
    enum: ['individual', 'group'],
    default: 'individual'
  },
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // total time in seconds
    default: 0
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswers: [mongoose.Schema.Types.ObjectId],
    isCorrect: Boolean,
    timeSpent: Number,
    points: Number
  }],
  completedAt: {
    type: Date,
    default: Date.now
  },
  rank: {
    type: Number
  }
}, {
  timestamps: true
});

// Index for efficient queries
PlayHistorySchema.index({ quiz: 1, player: 1 });
PlayHistorySchema.index({ player: 1, completedAt: -1 });
PlayHistorySchema.index({ quiz: 1, score: -1 });

module.exports = mongoose.model('PlayHistory', PlayHistorySchema);
