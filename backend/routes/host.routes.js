const express = require('express');
const {
  createGameSession,
  getSessionDetails,
  getHostSessions,
  getSessionStatistics,
  endGameSession,
  deleteSession
} = require('../controllers/host.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Protected routes
router.post('/create-session', protect, createGameSession);
router.get('/my-sessions', protect, getHostSessions);
router.get('/session/:sessionCode/stats', protect, getSessionStatistics);
router.post('/session/:sessionCode/end', protect, endGameSession);
router.delete('/session/:sessionCode', protect, deleteSession);

// Public/Optional auth routes
router.get('/session/:sessionCode', optionalAuth, getSessionDetails);

module.exports = router;
