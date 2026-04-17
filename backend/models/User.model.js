const mongoose = require('mongoose');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3,  'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  firstName: { type: String, trim: true },
  lastName:  { type: String, trim: true },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/dpmvrlnsv/image/upload/v1614245383/defaults/default-avatar.png'
  },
  bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
  isVerified: { type: Boolean, default: false },
  verificationToken:       String,  // stored as SHA-256 hash
  verificationTokenExpire: Date,
  resetPasswordToken:      String,  // stored as SHA-256 hash
  resetPasswordExpire:     Date,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  statistics: {
    quizzesCreated: { type: Number, default: 0 },
    quizzesPlayed:  { type: Number, default: 0 },
    totalScore:     { type: Number, default: 0 }
  }
}, { timestamps: true });

// ── Encrypt password before saving ──────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12); // increased from 10 to 12
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance methods ─────────────────────────────────────────────────────────
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Secure token generation using crypto ─────────────────────────────────────
// Returns the RAW token (sent to user via email).
// Stores the SHA-256 HASH in the DB so a DB leak doesn't expose valid tokens.

UserSchema.methods.getVerificationToken = function () {
  // 6-digit OTP for UX compatibility, but generated with crypto for true randomness
  const rawToken = crypto.randomInt(100000, 999999).toString();

  this.verificationToken       = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return rawToken; // send this to the user
};

UserSchema.methods.getResetPasswordToken = function () {
  // 6-digit OTP for UX compatibility, generated with crypto
  const rawToken = crypto.randomInt(100000, 999999).toString();

  this.resetPasswordToken  = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
  return rawToken; // send this to the user
};

module.exports = mongoose.model('User', UserSchema);
