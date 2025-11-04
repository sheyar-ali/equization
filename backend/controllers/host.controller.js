const GameSession = require('../models/GameSession.model');
const Quiz = require('../models/Quiz.model');
const PlayHistory = require('../models/PlayHistory.model');
const { successResponse, errorResponse } = require('../utils/response.util');

// @desc    Create game session
// @route   POST /api/v1/host/create-session
// @access  Private
exports.createGameSession = async (req, res, next) => {
  try {
    const { quizId, settings } = req.body;

    // Verify quiz exists and user has access
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    if (quiz.creator.toString() !== req.user.id && !quiz.isPublic) {
      return errorResponse(res, 403, 'You do not have permission to host this quiz');
    }

    // Create session
    const session = await GameSession.create({
      quiz: quizId,
      host: req.user.id,
      settings: settings || {}
    });

    const populatedSession = await GameSession.findById(session._id)
      .populate('quiz', 'title description coverImage questions')
      .populate('host', 'username avatar');

    successResponse(res, 201, 'Game session created successfully', {
      session: populatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session details
// @route   GET /api/v1/host/session/:sessionCode
// @access  Public (for joining)
exports.getSessionDetails = async (req, res, next) => {
  try {
    const session = await GameSession.findOne({
      sessionCode: req.params.sessionCode.toUpperCase()
    })
      .populate('quiz', 'title description coverImage')
      .populate('host', 'username avatar');

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    // Return limited info for non-host users
    const response = {
      sessionCode: session.sessionCode,
      quiz: session.quiz,
      host: session.host,
      status: session.status,
      playerCount: session.players.length,
      maxPlayers: session.settings.maxPlayers
    };

    // If user is the host, include more details
    if (req.user && session.host._id.toString() === req.user.id) {
      response.players = session.players;
      response.currentQuestionIndex = session.currentQuestionIndex;
    }

    successResponse(res, 200, 'Session retrieved successfully', { session: response });
  } catch (error) {
    next(error);
  }
};

// @desc    Get host's active sessions
// @route   GET /api/v1/host/my-sessions
// @access  Private
exports.getHostSessions = async (req, res, next) => {
  try {
    const sessions = await GameSession.find({
      host: req.user.id,
      status: { $in: ['waiting', 'in-progress', 'question-active', 'showing-results'] }
    })
      .populate('quiz', 'title coverImage')
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Active sessions retrieved successfully', { sessions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session statistics
// @route   GET /api/v1/host/session/:sessionCode/stats
// @access  Private (Host only)
exports.getSessionStatistics = async (req, res, next) => {
  try {
    const session = await GameSession.findOne({
      sessionCode: req.params.sessionCode.toUpperCase()
    })
      .populate('quiz', 'title')
      .populate({
        path: 'quiz',
        populate: { path: 'questions' }
      });

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    // Check if user is the host
    if (session.host.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to view these statistics');
    }

    // Calculate statistics
    const stats = {
      sessionCode: session.sessionCode,
      quizTitle: session.quiz.title,
      status: session.status,
      totalPlayers: session.players.length,
      activePlayers: session.players.filter(p => p.isActive).length,
      currentQuestion: session.currentQuestionIndex + 1,
      totalQuestions: session.quiz.questions.length,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      players: session.players.map(p => ({
        name: p.name,
        score: p.score,
        answersCount: p.answers.length,
        correctAnswers: p.answers.filter(a => a.isCorrect).length,
        isActive: p.isActive
      })).sort((a, b) => b.score - a.score),
      questionStats: []
    };

    // Question-level statistics
    if (session.quiz.questions) {
      stats.questionStats = session.quiz.questions.map((question, index) => {
        const answersForQuestion = session.players.flatMap(p =>
          p.answers.filter(a => a.question.toString() === question._id.toString())
        );

        const correctCount = answersForQuestion.filter(a => a.isCorrect).length;
        const totalAnswers = answersForQuestion.length;

        return {
          questionIndex: index,
          questionText: question.questionText,
          totalAnswers,
          correctCount,
          accuracy: totalAnswers > 0 ? (correctCount / totalAnswers * 100).toFixed(2) : 0,
          averageTime: totalAnswers > 0
            ? answersForQuestion.reduce((sum, a) => sum + a.timeSpent, 0) / totalAnswers
            : 0
        };
      });
    }

    successResponse(res, 200, 'Session statistics retrieved successfully', { stats });
  } catch (error) {
    next(error);
  }
};

// @desc    End game session and save results
// @route   POST /api/v1/host/session/:sessionCode/end
// @access  Private (Host only)
exports.endGameSession = async (req, res, next) => {
  try {
    const session = await GameSession.findOne({
      sessionCode: req.params.sessionCode.toUpperCase()
    });

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    // Check if user is the host
    if (session.host.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to end this session');
    }

    // Update session status
    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    // Save play history for each player
    const historyPromises = session.players.map(player => {
      const correctAnswers = player.answers.filter(a => a.isCorrect).length;
      const wrongAnswers = player.answers.length - correctAnswers;
      const timeSpent = player.answers.reduce((sum, a) => sum + a.timeSpent, 0);

      return PlayHistory.create({
        quiz: session.quiz,
        player: player.user || null,
        playerName: player.name,
        session: session._id,
        mode: 'group',
        score: player.score,
        totalQuestions: player.answers.length,
        correctAnswers,
        wrongAnswers,
        timeSpent,
        answers: player.answers
      });
    });

    await Promise.all(historyPromises);

    // Update quiz statistics
    await Quiz.findByIdAndUpdate(session.quiz, {
      $inc: {
        'statistics.totalPlays': 1,
        'statistics.totalPlayers': session.players.length
      }
    });

    successResponse(res, 200, 'Session ended successfully', {
      finalResults: session.players
        .map(p => ({
          name: p.name,
          score: p.score,
          correctAnswers: p.answers.filter(a => a.isCorrect).length,
          totalQuestions: p.answers.length
        }))
        .sort((a, b) => b.score - a.score)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Cancel session
// @route   DELETE /api/v1/host/session/:sessionCode
// @access  Private (Host only)
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await GameSession.findOne({
      sessionCode: req.params.sessionCode.toUpperCase()
    });

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    // Check if user is the host
    if (session.host.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to delete this session');
    }

    await session.deleteOne();

    successResponse(res, 200, 'Session deleted successfully');
  } catch (error) {
    next(error);
  }
};
