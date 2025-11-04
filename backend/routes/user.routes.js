const express = require('express');
const {
  getUserProfile,
  updateAvatar,
  getUserStatistics,
  getUserQuizzes,
  searchUsers,
  getTopCreators,
  deleteAccount
} = require('../controllers/user.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/search', searchUsers);
router.get('/top-creators', getTopCreators);
router.get('/:id', getUserProfile);
router.get('/:id/quizzes', optionalAuth, getUserQuizzes);

// Protected routes
router.put('/avatar', protect, updateAvatar);
router.get('/me/statistics', protect, getUserStatistics);
router.delete('/account', protect, deleteAccount);

module.exports = router;
