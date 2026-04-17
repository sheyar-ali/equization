const express = require('express');
const router  = express.Router();

const {
  createQuestion, getQuizQuestions, getQuestion,
  updateQuestion, deleteQuestion, bulkCreateQuestions, reorderQuestions
} = require('../controllers/question.controller');

const { protect, optionalAuth } = require('../middleware/auth.middleware');

router.post ('/bulk',          protect, bulkCreateQuestions);
router.put  ('/reorder',       protect, reorderQuestions);
router.get  ('/quiz/:quizId',  optionalAuth, getQuizQuestions);

router.route('/')
  .post(protect, createQuestion);

router.route('/:id')
  .get(optionalAuth, getQuestion)
  .put(protect,      updateQuestion)
  .delete(protect,   deleteQuestion);

module.exports = router;
