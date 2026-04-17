const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();

const {
  register, login, verifyEmail, resendVerification,
  forgotPassword, resetPassword, getMe, updateDetails, updatePassword
} = require('../controllers/auth.controller');
const { protect }   = require('../middleware/auth.middleware');
const { validate }  = require('../middleware/validation.middleware');
const { authLimiter, emailLimiter } = require('../middleware/rateLimit.middleware');

// ── Validation rules ─────────────────────────────────────────────────────────
const registerRules = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 chars'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
];
const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/register',              authLimiter, registerRules, validate, register);
router.post('/login',                 authLimiter, loginRules,    validate, login);
router.post('/verify-email',          verifyEmail);
router.post('/forgot-password',       emailLimiter, forgotPassword);
router.post('/reset-password',        resetPassword);

// ── Protected routes ──────────────────────────────────────────────────────────
router.get ('/me',                    protect, getMe);
router.put ('/update-details',        protect, updateDetails);
router.put ('/update-password',       protect, updatePassword);
router.post('/resend-verification',   protect, emailLimiter, resendVerification);

module.exports = router;
