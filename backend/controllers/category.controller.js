const Category = require('../models/Category.model');
const { successResponse, errorResponse } = require('../utils/response.util');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = async (req, res, next) => {
  try {
    const { isActive = true } = req.query;

    const query = isActive !== 'all' ? { isActive: isActive === 'true' } : {};

    const categories = await Category.find(query).sort({ 'name.en': 1 });

    successResponse(res, 200, 'Categories retrieved successfully', { categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID or slug
// @route   GET /api/v1/categories/:identifier
// @access  Public
exports.getCategoryByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by slug
    let category = await Category.findById(identifier);

    if (!category) {
      category = await Category.findOne({ slug: identifier });
    }

    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    successResponse(res, 200, 'Category retrieved successfully', { category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private (Admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, color } = req.body;

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      color
    });

    successResponse(res, 201, 'Category created successfully', { category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    successResponse(res, 200, 'Category updated successfully', { category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    await category.deleteOne();

    successResponse(res, 200, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular categories (with most quizzes)
// @route   GET /api/v1/categories/popular
// @access  Public
exports.getPopularCategories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const categories = await Category.find({ isActive: true })
      .sort({ quizCount: -1 })
      .limit(limit);

    successResponse(res, 200, 'Popular categories retrieved successfully', { categories });
  } catch (error) {
    next(error);
  }
};
