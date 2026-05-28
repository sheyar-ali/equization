const Question = require('../models/Question.model');
const Quiz     = require('../models/Quiz.model');
const { successResponse, errorResponse } = require('../utils/response.util');

// ── Create question ───────────────────────────────────────────────────────────
// POST /api/v1/questions
exports.createQuestion = async (req, res, next) => {
  try {
    const { quizId, questionText, questionImage, questionType,
            answers, points, timeLimit, explanation, source, difficulty, order } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return errorResponse(res, 404, 'Quiz not found');

    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin')
      return errorResponse(res, 403, 'Not authorized to add questions to this quiz');

    const question = await Question.create({
      quiz: quizId, questionText, questionImage, questionType,
      answers, points, timeLimit, explanation, source, difficulty,
      order: order ?? quiz.questions.length
    });

    quiz.questions.push(question._id);
    await quiz.save();

    return successResponse(res, 201, 'Question created successfully', { question });
  } catch (err) { next(err); }
};

// ── Get all questions for a quiz ──────────────────────────────────────────────
// GET /api/v1/questions/quiz/:quizId
exports.getQuizQuestions = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return errorResponse(res, 404, 'Quiz not found');

    if (!quiz.isPublic && (!req.user || quiz.creator.toString() !== req.user.id))
      return errorResponse(res, 403, 'Access denied');

    const questions = await Question.find({ quiz: req.params.quizId })
      .sort({ order: 1 });

    // If not the creator, hide correct answers
    let result = questions;
    if (!req.user || quiz.creator.toString() !== req.user.id) {
      result = questions.map(q => {
        const obj = q.toObject();
        obj.answers = obj.answers.map(a => ({ _id: a._id, text: a.text, image: a.image }));
        return obj;
      });
    }

    return successResponse(res, 200, 'Questions retrieved successfully', { questions: result });
  } catch (err) { next(err); }
};

// ── Get single question ───────────────────────────────────────────────────────
// GET /api/v1/questions/:id
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('quiz', 'creator isPublic');
    if (!question) return errorResponse(res, 404, 'Question not found');

    const quiz = question.quiz;
    if (!quiz.isPublic && (!req.user || quiz.creator.toString() !== req.user.id))
      return errorResponse(res, 403, 'Access denied');

    return successResponse(res, 200, 'Question retrieved', { question });
  } catch (err) { next(err); }
};

// ── Update question ───────────────────────────────────────────────────────────
// PUT /api/v1/questions/:id
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id).populate('quiz', 'creator');
    if (!question) return errorResponse(res, 404, 'Question not found');

    if (question.quiz.creator.toString() !== req.user.id && req.user.role !== 'admin')
      return errorResponse(res, 403, 'Not authorized');

    // Whitelist allowed fields — prevent Mass Assignment (e.g. overwriting quiz, statistics)
    const {
      questionText, questionImage, questionType,
      answers, points, timeLimit, explanation, source, difficulty, order
    } = req.body;

    const allowedUpdate = {
      ...(questionText  !== undefined && { questionText }),
      ...(questionImage !== undefined && { questionImage }),
      ...(questionType  !== undefined && { questionType }),
      ...(answers       !== undefined && { answers }),
      ...(points        !== undefined && { points }),
      ...(timeLimit     !== undefined && { timeLimit }),
      ...(explanation   !== undefined && { explanation }),
      ...(source        !== undefined && { source }),
      ...(difficulty    !== undefined && { difficulty }),
      ...(order         !== undefined && { order })
    };

    question = await Question.findByIdAndUpdate(req.params.id, allowedUpdate, {
      new: true, runValidators: true
    });

    return successResponse(res, 200, 'Question updated successfully', { question });
  } catch (err) { next(err); }
};

// ── Delete question ───────────────────────────────────────────────────────────
// DELETE /api/v1/questions/:id
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('quiz', 'creator');
    if (!question) return errorResponse(res, 404, 'Question not found');

    if (question.quiz.creator.toString() !== req.user.id && req.user.role !== 'admin')
      return errorResponse(res, 403, 'Not authorized');

    const quiz = await Quiz.findById(question.quiz._id);
    quiz.questions = quiz.questions.filter(q => q.toString() !== question._id.toString());
    await quiz.save();

    await question.deleteOne();
    return successResponse(res, 200, 'Question deleted successfully');
  } catch (err) { next(err); }
};

// ── Bulk create questions ─────────────────────────────────────────────────────
// POST /api/v1/questions/bulk
exports.bulkCreateQuestions = async (req, res, next) => {
  try {
    const { quizId, questions } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return errorResponse(res, 404, 'Quiz not found');

    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin')
      return errorResponse(res, 403, 'Not authorized');

    const startOrder = quiz.questions.length;
    const questionsData = questions.map((q, i) => ({
      ...q, quiz: quizId, order: q.order ?? (startOrder + i)
    }));

    const createdQuestions = await Question.insertMany(questionsData);
    quiz.questions.push(...createdQuestions.map(q => q._id));
    await quiz.save();

    return successResponse(res, 201, 'Questions created successfully', {
      questions: createdQuestions,
      count: createdQuestions.length
    });
  } catch (err) { next(err); }
};

// ── Reorder questions ─────────────────────────────────────────────────────────
// PUT /api/v1/questions/reorder
exports.reorderQuestions = async (req, res, next) => {
  try {
    const { quizId, orderedIds } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return errorResponse(res, 404, 'Quiz not found');

    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin')
      return errorResponse(res, 403, 'Not authorized');

    const updates = orderedIds.map((id, index) =>
      Question.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(updates);

    // Update quiz questions order
    quiz.questions = orderedIds;
    await quiz.save();

    return successResponse(res, 200, 'Questions reordered successfully');
  } catch (err) { next(err); }
};
