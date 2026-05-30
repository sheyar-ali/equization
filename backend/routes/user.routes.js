const express = require('express');
const router  = express.Router();

const {
  getUserProfile, getUserQuizzes, searchUsers,
  getTopCreators, updateAvatar, getMyStatistics, deleteAccount,
  getAllUsers, updateUserRole
} = require('../controllers/user.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

router.get ('/top-creators',    getTopCreators);
router.get ('/search',          searchUsers);
router.get ('/me/statistics',   protect, getMyStatistics);
router.put ('/avatar',          protect, updateAvatar);
router.delete('/account',       protect, deleteAccount);

// Admin-only
router.get ('/',                protect, authorize('admin'), getAllUsers);
router.put ('/:id/role',        protect, authorize('admin'), updateUserRole);

router.get ('/:id',             getUserProfile);
router.get ('/:id/quizzes',     getUserQuizzes);

module.exports = router;
