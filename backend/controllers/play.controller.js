const Quiz = require('../models/Quiz.model');
const Question = require('../models/Question.model');
const PlayHistory = require('../models/PlayHistory.model');
const User = require('../models/User.model');
const { successResponse, errorResponse } = require('../utils/response.util');

// @desc    Start individual quiz session
// @route   POST /api/v1/play/start
// @access  Public
exports.startIndividualQuiz = async (req, res, next) => {
  try {
    const { quizId, playerName } = req.body;

    const quiz = await Quiz.findById(quizId)
      .populate({
        path: 'questions',
        select: 'questionText questionImage questionType answers timeLimit points order',
        options: { sort: { order: 1 } }
      });

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    if (!quiz.isPublic && !req.user) {
      return errorResponse(res, 403, 'This quiz is private');
    }

    // ✅ Fix #1: Do NOT include isCorrect — prevents cheating via DevTools
    // Correct answers are only revealed upon /play/submit
    const questions = quiz.questions.map(q => {
      const questionObj = q.toObject();
      questionObj.answers = questionObj.answers.map(a => ({
        _id:   a._id,
        text:  a.text,
        image: a.image,
        // isCorrect intentionally omitted
      }));
      return questionObj;
    });

    // Update quiz views
    quiz.statistics.views += 1;
    await quiz.save();

    successResponse(res, 200, 'Quiz started successfully', {
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        coverImage: quiz.coverImage,
        timeLimit: quiz.timeLimit,
        pointsPerQuestion: quiz.pointsPerQuestion,
        settings: quiz.settings
      },
      questions,
      totalQuestions: questions.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers
// @route   POST /api/v1/play/submit
// @access  Public
exports.submitQuizAnswers = async (req, res, next) => {
  try {
    const { quizId, playerName, answers, timeSpent } = req.body;

    const quiz = await Quiz.findById(quizId).populate('questions');

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    // Calculate score
    let totalScore = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    const processedAnswers = answers.map(answer => {
      const question = quiz.questions.find(
        q => q._id.toString() === answer.questionId
      );

      // ✅ Fix #9: If questionId not found in this quiz, skip it
      if (!question) {
        return { ...answer, isCorrect: false, points: 0 };
      }

      // ✅ Fix #7: Clamp timeSpent to valid range [0, timeLimit]
      const maxTimeMs = question.timeLimit * 1000;
      const clampedTimeSpent = Math.max(0, Math.min(answer.timeSpent || 0, maxTimeMs));

      // Check if answer is correct
      const correctAnswerIds = question.answers
        .filter(a => a.isCorrect)
        .map(a => a._id.toString());

      const selectedIds = answer.selectedAnswers.map(id => id.toString());
      
      const isCorrect = correctAnswerIds.length === selectedIds.length &&
        correctAnswerIds.every(id => selectedIds.includes(id));

      let points = 0;
      if (isCorrect) {
        // ✅ Fix #7: Use clamped timeSpent so sending 0 doesn't grant full points
        const timePercentage = clampedTimeSpent / maxTimeMs;
        points = Math.round(question.points * (1 - timePercentage * 0.5));
        totalScore += points;
        correctAnswers++;

        // Update question statistics
        question.statistics.correctAttempts += 1;
      } else {
        wrongAnswers++;
      }

      // Update question statistics
      question.statistics.totalAttempts += 1;
      const avgTime = question.statistics.averageTime || 0;
      question.statistics.averageTime = 
        (avgTime * (question.statistics.totalAttempts - 1) + answer.timeSpent) / 
        question.statistics.totalAttempts;

      return {
        question: question._id,
        selectedAnswers: answer.selectedAnswers,
        isCorrect,
        timeSpent: clampedTimeSpent,
        points
      };
    });

    // Save question statistics
    await Promise.all(quiz.questions.map(q => q.save()));

    // Update quiz statistics
    quiz.statistics.totalPlays += 1;
    quiz.statistics.totalPlayers += 1;
    const avgScore = quiz.statistics.averageScore || 0;
    quiz.statistics.averageScore = 
      (avgScore * (quiz.statistics.totalPlays - 1) + totalScore) / 
      quiz.statistics.totalPlays;
    await quiz.save();

    // Save play history
    const playHistory = await PlayHistory.create({
      quiz: quizId,
      player: req.user?.id || null,
      playerName: playerName || req.user?.username || 'Anonymous',
      mode: 'individual',
      score: totalScore,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      wrongAnswers,
      timeSpent,
      answers: processedAnswers
    });

    // Update user statistics if logged in
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: {
          'statistics.quizzesPlayed': 1,
          'statistics.totalScore': totalScore
        }
      });
    }

    // Get user's rank
    const higherScores = await PlayHistory.countDocuments({
      quiz: quizId,
      score: { $gt: totalScore }
    });
    const rank = higherScores + 1;

    successResponse(res, 200, 'Quiz submitted successfully', {
      result: {
        score: totalScore,
        correctAnswers,
        wrongAnswers,
        totalQuestions: quiz.questions.length,
        accuracy: (correctAnswers / quiz.questions.length * 100).toFixed(2),
        timeSpent,
        rank
      },
      answers: processedAnswers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz leaderboard
// @route   GET /api/v1/play/leaderboard/:quizId
// @access  Public
exports.getQuizLeaderboard = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { limit = 10, mode = 'all' } = req.query;

    const query = { quiz: quizId };
    if (mode !== 'all') {
      query.mode = mode;
    }

    const leaderboard = await PlayHistory.find(query)
      .sort({ score: -1, timeSpent: 1 })
      .limit(parseInt(limit))
      .populate('player', 'username avatar')
      .select('playerName score correctAnswers totalQuestions timeSpent completedAt player');

    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      rank: index + 1,
      playerName: entry.player?.username || entry.playerName,
      avatar: entry.player?.avatar,
      score: entry.score,
      correctAnswers: entry.correctAnswers,
      totalQuestions: entry.totalQuestions,
      accuracy: (entry.correctAnswers / entry.totalQuestions * 100).toFixed(2),
      timeSpent: entry.timeSpent,
      completedAt: entry.completedAt
    }));

    successResponse(res, 200, 'Leaderboard retrieved successfully', {
      leaderboard: leaderboardWithRank
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's play history
// @route   GET /api/v1/play/history
// @access  Private
exports.getPlayHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const total = await PlayHistory.countDocuments({ player: req.user.id });

    const history = await PlayHistory.find({ player: req.user.id })
      .populate('quiz', 'title coverImage')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    successResponse(res, 200, 'Play history retrieved successfully', {
      history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz result details
// @route   GET /api/v1/play/result/:historyId
// @access  Public (for the player)
exports.getQuizResult = async (req, res, next) => {
  try {
    const result = await PlayHistory.findById(req.params.historyId)
      .populate('quiz', 'title description coverImage')
      .populate({
        path: 'answers.question',
        select: 'questionText answers explanation'
      });

    if (!result) {
      return errorResponse(res, 404, 'Result not found');
    }

    // Results tied to a registered player require authentication (C1)
    if (result.player) {
      if (!req.user) return errorResponse(res, 401, 'Authentication required to view this result');
      if (result.player.toString() !== req.user.id) {
        return errorResponse(res, 403, 'You do not have permission to view this result');
      }
    }

    successResponse(res, 200, 'Result retrieved successfully', { result });
  } catch (error) {
    next(error);
  }
};
