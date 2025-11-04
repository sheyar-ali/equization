const User = require('../models/User.model');
const Quiz = require('../models/Quiz.model');
const PlayHistory = require('../models/PlayHistory.model');
const { successResponse, errorResponse } = require('../utils/response.util');

// @desc    Get user profile
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -resetPasswordToken')
      .populate({
        path: 'quizzes',
        match: { isPublic: true },
        select: 'title description coverImage statistics createdAt'
      });

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    successResponse(res, 200, 'User profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user avatar
// @route   PUT /api/v1/users/avatar
// @access  Private
exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    successResponse(res, 200, 'Avatar updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/v1/users/statistics
// @access  Private
exports.getUserStatistics = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Get additional statistics
    const totalQuizzes = await Quiz.countDocuments({ creator: req.user.id });
    const totalPlays = await PlayHistory.countDocuments({ player: req.user.id });
    
    // Get recent play history
    const recentPlays = await PlayHistory.find({ player: req.user.id })
      .populate('quiz', 'title coverImage')
      .sort({ completedAt: -1 })
      .limit(5);

    // Calculate average score
    const playStats = await PlayHistory.aggregate([
      { $match: { player: user._id } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          avgAccuracy: { $avg: { $multiply: [{ $divide: ['$correctAnswers', '$totalQuestions'] }, 100] } },
          totalScore: { $sum: '$score' }
        }
      }
    ]);

    const statistics = {
      ...user.statistics.toObject(),
      quizzesCreated: totalQuizzes,
      quizzesPlayed: totalPlays,
      averageScore: playStats[0]?.avgScore || 0,
      averageAccuracy: playStats[0]?.avgAccuracy || 0,
      totalScore: playStats[0]?.totalScore || 0,
      recentPlays
    };

    successResponse(res, 200, 'User statistics retrieved successfully', { statistics });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's created quizzes
// @route   GET /api/v1/users/:id/quizzes
// @access  Public
exports.getUserQuizzes = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const userId = req.params.id;

    const skip = (page - 1) * limit;

    // Only show public quizzes unless it's the user's own profile
    const query = {
      creator: userId,
      isActive: true
    };

    if (!req.user || req.user.id !== userId) {
      query.isPublic = true;
    }

    const total = await Quiz.countDocuments(query);

    const quizzes = await Quiz.find(query)
      .populate('categories', 'name slug icon color')
      .select('-questions')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    successResponse(res, 200, 'User quizzes retrieved successfully', {
      quizzes,
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

// @desc    Search users
// @route   GET /api/v1/users/search
// @access  Public
exports.searchUsers = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return errorResponse(res, 400, 'Search query is required');
    }

    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } }
      ]
    };

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('username firstName lastName avatar statistics')
      .sort({ 'statistics.quizzesCreated': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    successResponse(res, 200, 'Users retrieved successfully', {
      users,
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

// @desc    Get top creators
// @route   GET /api/v1/users/top-creators
// @access  Public
exports.getTopCreators = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topCreators = await User.find()
      .select('username firstName lastName avatar statistics')
      .sort({ 'statistics.quizzesCreated': -1 })
      .limit(limit);

    successResponse(res, 200, 'Top creators retrieved successfully', {
      creators: topCreators
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/v1/users/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Delete all user's quizzes and associated questions
    const userQuizzes = await Quiz.find({ creator: req.user.id });
    for (const quiz of userQuizzes) {
      await Question.deleteMany({ quiz: quiz._id });
      await quiz.deleteOne();
    }

    // Delete user's play history
    await PlayHistory.deleteMany({ player: req.user.id });

    // Delete user account
    await user.deleteOne();

    successResponse(res, 200, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};
