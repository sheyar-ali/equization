const express = require('express');
const router  = express.Router();

const {
  createQuiz, getAllQuizzes, getQuizById, getQuizByCode,
  updateQuiz, deleteQuiz, getMyQuizzes, getFeaturedQuizzes,
  duplicateQuiz, getQuizStatistics
} = require('../controllers/quiz.controller');

const { protect, optionalAuth } = require('../middleware/auth.middleware');

router.get ('/featured',              getFeaturedQuizzes);
router.get ('/code/:code',            optionalAuth, getQuizByCode);
router.get ('/user/my-quizzes',       protect, getMyQuizzes);

router.route('/')
  .get(optionalAuth, getAllQuizzes)
  .post(protect,     createQuiz);

router.route('/:id')
  .get(optionalAuth, getQuizById)
  .put(protect,       updateQuiz)
  .delete(protect,    deleteQuiz);

router.post('/:id/duplicate',   protect, duplicateQuiz);
router.get ('/:id/statistics',  protect, getQuizStatistics);

module.exports = router;
