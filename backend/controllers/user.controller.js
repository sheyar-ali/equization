const User        = require('../models/User.model');
const Quiz        = require('../models/Quiz.model');
const PlayHistory = require('../models/PlayHistory.model');
const { successResponse, errorResponse } = require('../utils/response.util');

// ── Get user public profile ───────────────────────────────────────────────────
// GET /api/v1/users/:id
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verificationToken -resetPasswordToken');
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, 'User profile retrieved', { user });
  } catch (err) { next(err); }
};

// ── Get user's public quizzes ─────────────────────────────────────────────────
// GET /api/v1/users/:id/quizzes
exports.getUserQuizzes = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip  = (page - 1) * limit;
    const query = { creator: req.params.id, isPublic: true, isActive: true };
    const total = await Quiz.countDocuments(query);

    const quizzes = await Quiz.find(query)
      .populate('categories', 'name slug')
      .select('-questions')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true, message: 'Quizzes retrieved',
      data: quizzes,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) { next(err); }
};

// ── Search users ──────────────────────────────────────────────────────────────
// GET /api/v1/users/search?q=...
exports.searchUsers = async (req, res, next) => {
  try {
    const { q = '', limit = 10 } = req.query;
    const users = await User.find({
      $or: [
        { username:  { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName:  { $regex: q, $options: 'i' } }
      ]
    })
      .select('username firstName lastName avatar statistics.quizzesCreated')
      .limit(parseInt(limit));

    return successResponse(res, 200, 'Users found', { users });
  } catch (err) { next(err); }
};

// ── Top quiz creators ─────────────────────────────────────────────────────────
// GET /api/v1/users/top-creators
exports.getTopCreators = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const creators = await User.find({ 'statistics.quizzesCreated': { $gt: 0 } })
      .select('username firstName lastName avatar statistics.quizzesCreated statistics.quizzesPlayed')
      .sort({ 'statistics.quizzesCreated': -1 })
      .limit(limit);

    return successResponse(res, 200, 'Top creators retrieved', { creators });
  } catch (err) { next(err); }
};

// ── Update avatar ─────────────────────────────────────────────────────────────
// PUT /api/v1/users/avatar
exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatarUrl } = req.body;
    if (!avatarUrl) return errorResponse(res, 400, 'Please provide an avatar URL');

    const user = await User.findByIdAndUpdate(
      req.user.id, { avatar: avatarUrl }, { new: true }
    ).select('-password');

    return successResponse(res, 200, 'Avatar updated successfully', { user });
  } catch (err) { next(err); }
};

// ── Get my statistics ─────────────────────────────────────────────────────────
// GET /api/v1/users/me/statistics
exports.getMyStatistics = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('statistics username');

    const recentHistory = await PlayHistory.find({ player: req.user.id })
      .populate('quiz', 'title coverImage')
      .sort({ completedAt: -1 })
      .limit(5);

    return successResponse(res, 200, 'Statistics retrieved', {
      statistics: user.statistics,
      recentActivity: recentHistory
    });
  } catch (err) { next(err); }
};

// ── Delete account ────────────────────────────────────────────────────────────
// DELETE /api/v1/users/account
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 404, 'User not found');

    // Deactivate user's quizzes instead of hard-delete
    await Quiz.updateMany({ creator: req.user.id }, { isActive: false });

    await user.deleteOne();
    return successResponse(res, 200, 'Account deleted successfully');
  } catch (err) { next(err); }
};
