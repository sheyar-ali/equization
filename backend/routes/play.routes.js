const express = require('express');
const router  = express.Router();

const {
  startIndividualQuiz, submitQuizAnswers,
  getQuizLeaderboard, getPlayHistory, getQuizResult
} = require('../controllers/play.controller');

const { protect, optionalAuth } = require('../middleware/auth.middleware');

router.post('/start',              optionalAuth, startIndividualQuiz);
router.post('/submit',             optionalAuth, submitQuizAnswers);
router.get ('/leaderboard/:quizId',             getQuizLeaderboard);
router.get ('/history',            protect,      getPlayHistory);
router.get ('/result/:historyId',  optionalAuth, getQuizResult);

module.exports = router;
