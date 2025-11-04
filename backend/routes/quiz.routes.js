const express = require('express');
const { body } = require('express-validator');
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getQuizByCode,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes,
  getFeaturedQuizzes,
  duplicateQuiz,
  getQuizStatistics
} = require('../controllers/quiz.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// Validation rules
const quizValidation = [
  body('title')
    .trim()
    .isLength({ min: 8, max: 200 })
    .withMessage('Title must be between 8 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 30, max: 500 })
    .withMessage('Description must be between 30 and 500 characters'),
  body('categories')
    .isArray({ min: 1 })
    .withMessage('Please select at least one category')
];

// Public routes
router.get('/', getAllQuizzes);
router.get('/featured', getFeaturedQuizzes);
router.get('/code/:code', getQuizByCode);
router.get('/:id', optionalAuth, getQuizById);

// Protected routes
router.post('/', protect, quizValidation, validate, createQuiz);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);
router.get('/user/my-quizzes', protect, getMyQuizzes);
router.post('/:id/duplicate', protect, duplicateQuiz);
router.get('/:id/statistics', protect, getQuizStatistics);

module.exports = router;
