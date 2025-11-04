const Quiz = require('../models/Quiz.model');
const Question = require('../models/Question.model');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

// @desc    Create new quiz
// @route   POST /api/v1/quizzes
// @access  Private
exports.createQuiz = async (req, res, next) => {
  try {
    const {
      title,
      description,
      detailedDescription,
      categories,
      difficulty,
      educationLevel,
      isPublic,
      timeLimit,
      pointsPerQuestion,
      settings,
      tags,
      language
    } = req.body;

    // Create quiz
    const quiz = await Quiz.create({
      title,
      description,
      detailedDescription,
      categories,
      creator: req.user.id,
      difficulty,
      educationLevel,
      isPublic,
      timeLimit,
      pointsPerQuestion,
      settings,
      tags,
      language
    });

    // Update user's quizzes array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { quizzes: quiz._id },
      $inc: { 'statistics.quizzesCreated': 1 }
    });

    // Update category quiz count
    if (categories && categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: categories } },
        { $inc: { quizCount: 1 } }
      );
    }

    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate('categories', 'name slug')
      .populate('creator', 'username avatar');

    successResponse(res, 201, 'Quiz created successfully', { quiz: populatedQuiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quizzes with filters
// @route   GET /api/v1/quizzes
// @access  Public
exports.getAllQuizzes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      difficulty,
      educationLevel,
      language,
      sortBy = 'createdAt',
      order = 'desc',
      isPublic = true
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (isPublic !== 'all') {
      query.isPublic = isPublic === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.categories = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (educationLevel) {
      query.educationLevel = educationLevel;
    }

    if (language) {
      query.language = language;
    }

    // Execute query
    const skip = (page - 1) * limit;
    const total = await Quiz.countDocuments(query);

    const quizzes = await Quiz.find(query)
      .populate('categories', 'name slug icon color')
      .populate('creator', 'username avatar')
      .select('-questions')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    paginatedResponse(
      res,
      200,
      'Quizzes retrieved successfully',
      quizzes,
      page,
      limit,
      total
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz by ID
// @route   GET /api/v1/quizzes/:id
// @access  Public
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('categories', 'name slug icon color')
      .populate('creator', 'username avatar bio')
      .populate({
        path: 'questions',
        select: 'questionText questionImage questionType timeLimit points order difficulty',
        options: { sort: { order: 1 } }
      });

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    // Check if quiz is private and user is not the creator
    if (!quiz.isPublic && (!req.user || quiz.creator._id.toString() !== req.user.id)) {
      return errorResponse(res, 403, 'You do not have permission to access this quiz');
    }

    // Increment views
    quiz.statistics.views += 1;
    await quiz.save();

    successResponse(res, 200, 'Quiz retrieved successfully', { quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz by code
// @route   GET /api/v1/quizzes/code/:code
// @access  Public
exports.getQuizByCode = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ quizCode: req.params.code.toUpperCase() })
      .populate('categories', 'name slug')
      .populate('creator', 'username avatar')
      .select('-questions');

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found with that code');
    }

    successResponse(res, 200, 'Quiz retrieved successfully', { quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/v1/quizzes/:id
// @access  Private
exports.updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    // Check ownership
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'You do not have permission to update this quiz');
    }

    // Update quiz
    quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('categories', 'name slug')
     .populate('creator', 'username avatar');

    successResponse(res, 200, 'Quiz updated successfully', { quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/v1/quizzes/:id
// @access  Private
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    // Check ownership
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'You do not have permission to delete this quiz');
    }

    // Delete all questions associated with quiz
    await Question.deleteMany({ quiz: quiz._id });

    // Remove quiz from user's quizzes array
    await User.findByIdAndUpdate(quiz.creator, {
      $pull: { quizzes: quiz._id },
      $inc: { 'statistics.quizzesCreated': -1 }
    });

    // Update category quiz count
    if (quiz.categories && quiz.categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: quiz.categories } },
        { $inc: { quizCount: -1 } }
      );
    }

    // Delete quiz
    await quiz.deleteOne();

    successResponse(res, 200, 'Quiz deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's quizzes
// @route   GET /api/v1/quizzes/my-quizzes
// @access  Private
exports.getMyQuizzes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const total = await Quiz.countDocuments({ creator: req.user.id });

    const quizzes = await Quiz.find({ creator: req.user.id })
      .populate('categories', 'name slug icon color')
      .select('-questions')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    paginatedResponse(
      res,
      200,
      'Your quizzes retrieved successfully',
      quizzes,
      page,
      limit,
      total
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured/popular quizzes
// @route   GET /api/v1/quizzes/featured
// @access  Public
exports.getFeaturedQuizzes = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const quizzes = await Quiz.find({
      isPublic: true,
      isActive: true
    })
      .populate('categories', 'name slug icon color')
      .populate('creator', 'username avatar')
      .select('-questions')
      .sort({ 'statistics.totalPlays': -1, 'statistics.views': -1 })
      .limit(limit);

    successResponse(res, 200, 'Featured quizzes retrieved successfully', { quizzes });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate quiz
// @route   POST /api/v1/quizzes/:id/duplicate
// @access  Private
exports.duplicateQuiz = async (req, res, next) => {
  try {
    const originalQuiz = await Quiz.findById(req.params.id).populate('questions');

    if (!originalQuiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    // Check if quiz is public or user is the owner
    if (!originalQuiz.isPublic && originalQuiz.creator.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to duplicate this quiz');
    }

    // Create new quiz
    const newQuizData = {
      ...originalQuiz.toObject(),
      _id: undefined,
      title: `${originalQuiz.title} (Copy)`,
      creator: req.user.id,
      questions: [],
      quizCode: undefined,
      statistics: {
        totalPlays: 0,
        totalPlayers: 0,
        averageScore: 0,
        views: 0
      }
    };

    const newQuiz = await Quiz.create(newQuizData);

    // Duplicate questions
    const questionPromises = originalQuiz.questions.map(async (oldQuestion) => {
      const newQuestionData = {
        ...oldQuestion.toObject(),
        _id: undefined,
        quiz: newQuiz._id,
        statistics: {
          totalAttempts: 0,
          correctAttempts: 0,
          averageTime: 0
        }
      };
      return Question.create(newQuestionData);
    });

    const newQuestions = await Promise.all(questionPromises);

    // Update quiz with questions
    newQuiz.questions = newQuestions.map(q => q._id);
    await newQuiz.save();

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { quizzes: newQuiz._id },
      $inc: { 'statistics.quizzesCreated': 1 }
    });

    const populatedQuiz = await Quiz.findById(newQuiz._id)
      .populate('categories', 'name slug')
      .populate('creator', 'username avatar')
      .populate('questions');

    successResponse(res, 201, 'Quiz duplicated successfully', { quiz: populatedQuiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz statistics
// @route   GET /api/v1/quizzes/:id/statistics
// @access  Private (Owner only)
exports.getQuizStatistics = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    // Check ownership
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'You do not have permission to view these statistics');
    }

    const statistics = {
      ...quiz.statistics.toObject(),
      questionCount: quiz.questions.length,
      categories: quiz.categories
    };

    successResponse(res, 200, 'Quiz statistics retrieved successfully', { statistics });
  } catch (error) {
    next(error);
  }
};
