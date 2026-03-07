const express = require('express');
const router  = express.Router();

const {
  getUserProfile, getUserQuizzes, searchUsers,
  getTopCreators, updateAvatar, getMyStatistics, deleteAccount
} = require('../controllers/user.controller');

const { protect } = require('../middleware/auth.middleware');

router.get ('/top-creators',    getTopCreators);
router.get ('/search',          searchUsers);
router.get ('/me/statistics',   protect, getMyStatistics);
router.put ('/avatar',          protect, updateAvatar);
router.delete('/account',       protect, deleteAccount);
router.get ('/:id',             getUserProfile);
router.get ('/:id/quizzes',     getUserQuizzes);

module.exports = router;
