const express = require('express');
const router  = express.Router();

const {
  createGameSession, getSessionDetails, getHostSessions,
  getSessionStatistics, endGameSession, deleteSession
} = require('../controllers/host.controller');

const { protect } = require('../middleware/auth.middleware');

router.post('/create-session',              protect, createGameSession);
router.get ('/my-sessions',                 protect, getHostSessions);
router.get ('/session/:sessionCode',        getSessionDetails);
router.get ('/session/:sessionCode/stats',  protect, getSessionStatistics);
router.post('/session/:sessionCode/end',    protect, endGameSession);
router.delete('/session/:sessionCode',      protect, deleteSession);

module.exports = router;
