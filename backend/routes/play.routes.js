const express = require('express');
const {
  startIndividualQuiz,
  submitQuizAnswers,
  getQuizLeaderboard,
  getPlayHistory,
  getQuizResult
} = require('../controllers/play.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Public/Optional auth routes
router.post('/start', optionalAuth, startIndividualQuiz);
router.post('/submit', optionalAuth, submitQuizAnswers);
router.get('/leaderboard/:quizId', getQuizLeaderboard);
router.get('/result/:historyId', optionalAuth, getQuizResult);

// Protected routes
router.get('/history', protect, getPlayHistory);

module.exports = router;
