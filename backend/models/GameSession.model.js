const mongoose = require('mongoose');

// ── Per-player answer record ─────────────────────────────────────────────────
const PlayerAnswerSchema = new mongoose.Schema({
  question:        { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  selectedAnswers: [{ type: mongoose.Schema.Types.ObjectId }],
  isCorrect:       Boolean,
  timeSpent:       Number,   // milliseconds
  points:          { type: Number, default: 0 },
  answeredAt:      { type: Date, default: Date.now }
}, { _id: false });

// ── Player record inside a game session ─────────────────────────────────────
const PlayerSchema = new mongoose.Schema({
  socketId: { type: String },
  name:     { type: String, required: true, trim: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  score:    { type: Number, default: 0 },
  answers:  { type: [PlayerAnswerSchema], default: [] },
  joinedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  rank:     { type: Number, default: 0 }
}, { _id: true });

// ── Game session ─────────────────────────────────────────────────────────────
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
    unique: true,
    uppercase: true,
    default: () => {
      let code = '';
      for (let i = 0; i < 6; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
      return code;
    }
  },
  players:              { type: [PlayerSchema], default: [] },
  currentQuestionIndex: { type: Number, default: -1 },
  questionStartedAt:    { type: Date },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'question-active', 'showing-results', 'completed'],
    default: 'waiting'
  },
  startedAt:   { type: Date },
  completedAt: { type: Date },
  settings: {
    maxPlayers:    { type: Number, default: 250 },
    allowLateJoin: { type: Boolean, default: false }
  }
}, { timestamps: true });

// ── Auto-generate session code ───────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateCode(len = 6) {
  let code = '';
  for (let i = 0; i < len; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

GameSessionSchema.pre('save', async function (next) {
  if (!this.sessionCode) {
    let code;
    let exists = true;
    while (exists) {
      code   = generateCode(6);
      exists = !!(await this.constructor.findOne({ sessionCode: code }));
    }
    this.sessionCode = code;
  }
  next();
});
GameSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
GameSessionSchema.index({ sessionCode: 1 });
GameSessionSchema.index({ host: 1, status: 1 });

module.exports = mongoose.model('GameSession', GameSessionSchema);
