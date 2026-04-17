const Category = require('../models/Category.model');
const { successResponse, errorResponse } = require('../utils/response.util');

// ── Get all categories ────────────────────────────────────────────────────────
// GET /api/v1/categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ quizCount: -1 });
    return successResponse(res, 200, 'Categories retrieved successfully', { categories });
  } catch (err) { next(err); }
};

// ── Get popular categories ────────────────────────────────────────────────────
// GET /api/v1/categories/popular
exports.getPopularCategories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const categories = await Category.find({ isActive: true, quizCount: { $gt: 0 } })
      .sort({ quizCount: -1 })
      .limit(limit);
    return successResponse(res, 200, 'Popular categories retrieved', { categories });
  } catch (err) { next(err); }
};

// ── Get category by ID or slug ────────────────────────────────────────────────
// GET /api/v1/categories/:identifier
exports.getCategoryByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const category = isObjectId
      ? await Category.findById(identifier)
      : await Category.findOne({ slug: identifier });

    if (!category) return errorResponse(res, 404, 'Category not found');
    return successResponse(res, 200, 'Category retrieved', { category });
  } catch (err) { next(err); }
};

// ── Create category (Admin) ───────────────────────────────────────────────────
// POST /api/v1/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, color } = req.body;

    const existing = await Category.findOne({ slug: slug.toLowerCase() });
    if (existing) return errorResponse(res, 400, 'Category with this slug already exists');

    const category = await Category.create({ name, slug, description, icon, color });
    return successResponse(res, 201, 'Category created successfully', { category });
  } catch (err) { next(err); }
};

// ── Update category (Admin) ───────────────────────────────────────────────────
// PUT /api/v1/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!category) return errorResponse(res, 404, 'Category not found');
    return successResponse(res, 200, 'Category updated successfully', { category });
  } catch (err) { next(err); }
};

// ── Delete category (Admin) ───────────────────────────────────────────────────
// DELETE /api/v1/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 404, 'Category not found');
    await category.deleteOne();
    return successResponse(res, 200, 'Category deleted successfully');
  } catch (err) { next(err); }
};
