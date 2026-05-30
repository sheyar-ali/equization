const User        = require('../models/User.model');
const Quiz        = require('../models/Quiz.model');
const PlayHistory = require('../models/PlayHistory.model');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

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

    return paginatedResponse(res, 200, 'Quizzes retrieved', quizzes, page, limit, total);
  } catch (err) { next(err); }
};

// ── Search users ──────────────────────────────────────────────────────────────
// GET /api/v1/users/search?q=...
exports.searchUsers = async (req, res, next) => {
  try {
    const { q = '', limit = 10 } = req.query;

    // Require at least 2 characters to prevent full user list enumeration
    if (!q || q.trim().length < 2) {
      return successResponse(res, 200, 'Users found', { users: [] });
    }

    // Cap limit to max 20 to prevent large data dumps
    const safeLimit = Math.min(parseInt(limit) || 10, 20);

    const users = await User.find({
      $or: [
        { username:  { $regex: q.trim(), $options: 'i' } },
        { firstName: { $regex: q.trim(), $options: 'i' } },
        { lastName:  { $regex: q.trim(), $options: 'i' } }
      ]
    })
      .select('username firstName lastName avatar statistics.quizzesCreated')
      .limit(safeLimit);

    return successResponse(res, 200, 'Users found', { users });
  } catch (err) { next(err); }
};

// ── Top quiz creators ─────────────────────────────────────────────────────────
// GET /api/v1/users/top-creators
exports.getTopCreators = async (req, res, next) => {
  try {
    // Cap limit to 50 to prevent unbounded data dumps
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
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

    // Validate URL format to prevent XSS or non-URL values being stored
    try {
      const parsed = new URL(avatarUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return errorResponse(res, 400, 'Avatar URL must use http or https');
      }
    } catch {
      return errorResponse(res, 400, 'Please provide a valid URL for the avatar');
    }

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

// ── List all users (Admin) ────────────────────────────────────────────────────
// GET /api/v1/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email:    { $regex: search, $options: 'i' } },
      ];
    }
    const skip  = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    return paginatedResponse(res, 200, 'Users retrieved successfully', { users }, page, limit, total);
  } catch (err) { next(err); }
};

// ── Update user role (Admin) ──────────────────────────────────────────────────
// PUT /api/v1/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role))
      return errorResponse(res, 400, 'Invalid role. Must be "user" or "admin"');

    // Prevent admin from removing their own admin role
    if (req.params.id === req.user.id)
      return errorResponse(res, 400, 'Cannot change your own role');

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, 'User role updated successfully', { user });
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
