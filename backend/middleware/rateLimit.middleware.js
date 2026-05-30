const rateLimit = require('express-rate-limit');

// In test mode, bypass all rate limiting so tests don't hit 429 errors
const passThrough = (_req, _res, next) => next();
const isTest = process.env.NODE_ENV === 'test';

// ── General API limiter ───────────────────────────────────────────────────────
exports.generalLimiter = isTest ? passThrough : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false
});

// ── Auth endpoints limiter (stricter) ─────────────────────────────────────────
exports.authLimiter = isTest ? passThrough : rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false
});

// ── Email sending limiter ─────────────────────────────────────────────────────
exports.emailLimiter = isTest ? passThrough : rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      5,
  message: { success: false, message: 'Too many email requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false
});
