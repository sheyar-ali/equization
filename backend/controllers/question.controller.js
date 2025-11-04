const Question = require('../models/Question.model');
const Quiz = require('../models/Quiz.model');
const { successResponse, errorResponse } = require('../utils/response.util');

// @desc    Create new question
// @route   POST /api/v1/questions
// @access  Private
exports.createQuestion = async (req, res, next) => {
  try {
    const {
      quiz,
      questionText,
      questionImage,
      questionType,
      answers,
      points,
      timeLimit,
      explanation,
      difficulty,
      order
    } = req.body;

    // Verify quiz exists and user is creator
    const quizDoc = await Quiz.findById(quiz);

    if (!quizDoc) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    if (quizDoc.creator.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to add questions to this quiz');
    }

    // Create question
    const question = await Question.create({
      quiz,
      questionText,
      questionImage,
      questionType,
      answers,
      points: points || quizDoc.pointsPerQuestion,
      timeLimit: timeLimit || quizDoc.timeLimit,
      explanation,
      difficulty,
      order: order !== undefined ? order : quizDoc.questions.length
    });

    // Add question to quiz
    quizDoc.questions.push(question._id);
    await quizDoc.save();

    successResponse(res, 201, 'Question created successfully', { question });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all questions for a quiz
// @route   GET /api/v1/questions/quiz/:quizId
// @access  Public (if quiz is public) / Private (if quiz is private)
exports.getQuizQuestions = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    // Check permissions
    if (!quiz.isPublic && (!req.user || quiz.creator.toString() !== req.user.id)) {
      return errorResponse(res, 403, 'You do not have permission to view these questions');
    }

    const questions = await Question.find({ quiz: req.params.quizId })
      .sort({ order: 1 });

    // If not the creator, hide correct answers
    if (!req.user || quiz.creator.toString() !== req.user.id) {
      questions.forEach(question => {
        question.answers.forEach(answer => {
          answer.isCorrect = undefined;
        });
      });
    }

    successResponse(res, 200, 'Questions retrieved successfully', { questions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question by ID
// @route   GET /api/v1/questions/:id
// @access  Private
exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('quiz');

    if (!question) {
      return errorResponse(res, 404, 'Question not found');
    }

    // Check if user is quiz creator
    if (question.quiz.creator.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to view this question');
    }

    successResponse(res, 200, 'Question retrieved successfully', { question });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/v1/questions/:id
// @access  Private
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id).populate('quiz');

    if (!question) {
      return errorResponse(res, 404, 'Question not found');
    }

    // Check ownership
    if (question.quiz.creator.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to update this question');
    }

    // Update question
    question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    successResponse(res, 200, 'Question updated successfully', { question });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/v1/questions/:id
// @access  Private
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('quiz');

    if (!question) {
      return errorResponse(res, 404, 'Question not found');
    }

    // Check ownership
    if (question.quiz.creator.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to delete this question');
    }

    // Remove question from quiz
    await Quiz.findByIdAndUpdate(question.quiz._id, {
      $pull: { questions: question._id }
    });

    // Delete question
    await question.deleteOne();

    successResponse(res, 200, 'Question deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create questions
// @route   POST /api/v1/questions/bulk
// @access  Private
exports.bulkCreateQuestions = async (req, res, next) => {
  try {
    const { quizId, questions } = req.body;

    // Verify quiz exists and user is creator
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    if (quiz.creator.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to add questions to this quiz');
    }

    // Create questions with proper order
    const questionsToCreate = questions.map((q, index) => ({
      ...q,
      quiz: quizId,
      order: q.order !== undefined ? q.order : quiz.questions.length + index,
      points: q.points || quiz.pointsPerQuestion,
      timeLimit: q.timeLimit || quiz.timeLimit
    }));

    const createdQuestions = await Question.insertMany(questionsToCreate);

    // Add questions to quiz
    quiz.questions.push(...createdQuestions.map(q => q._id));
    await quiz.save();

    successResponse(res, 201, 'Questions created successfully', {
      questions: createdQuestions,
      count: createdQuestions.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder questions
// @route   PUT /api/v1/questions/reorder
// @access  Private
exports.reorderQuestions = async (req, res, next) => {
  try {
    const { quizId, questionOrders } = req.body;

    // Verify quiz and ownership
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    if (quiz.creator.toString() !== req.user.id) {
      return errorResponse(res, 403, 'You do not have permission to reorder questions');
    }

    // Update question orders
    const updatePromises = questionOrders.map(({ questionId, order }) =>
      Question.findByIdAndUpdate(questionId, { order })
    );

    await Promise.all(updatePromises);

    successResponse(res, 200, 'Questions reordered successfully');
  } catch (error) {
    next(error);
  }
};
