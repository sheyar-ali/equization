const express = require('express');
const { body } = require('express-validator');
const {
  createQuestion,
  getQuizQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  reorderQuestions
} = require('../controllers/question.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// Validation rules
const questionValidation = [
  body('questionText')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Question text must be at least 10 characters'),
  body('answers')
    .isArray({ min: 2 })
    .withMessage('Question must have at least 2 answers'),
  body('quiz')
    .notEmpty()
    .withMessage('Quiz ID is required')
];

// Routes
router.post('/', protect, questionValidation, validate, createQuestion);
router.post('/bulk', protect, bulkCreateQuestions);
router.put('/reorder', protect, reorderQuestions);
router.get('/quiz/:quizId', optionalAuth, getQuizQuestions);
router.get('/:id', protect, getQuestionById);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;
