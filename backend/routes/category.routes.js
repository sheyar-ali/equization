const express     = require('express');
const { body }    = require('express-validator');
const router      = express.Router();

const {
  getAllCategories, getPopularCategories, getCategoryByIdentifier,
  createCategory, updateCategory, deleteCategory
} = require('../controllers/category.controller');

const { protect, authorize }  = require('../middleware/auth.middleware');
const { validate }             = require('../middleware/validation.middleware');

// ── Validation rules ─────────────────────────────────────────────────────────
const createCategoryRules = [
  body('name').trim().notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('slug').trim().notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase alphanumeric with hyphens'),
  body('description').optional().trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('icon').optional().trim(),
  body('color').optional().trim()
    .matches(/^#[0-9A-Fa-f]{3,6}$/).withMessage('Color must be a valid hex code (e.g. #FF5733)')
];

const updateCategoryRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('slug').optional().trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase alphanumeric with hyphens'),
  body('description').optional().trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('color').optional().trim()
    .matches(/^#[0-9A-Fa-f]{3,6}$/).withMessage('Color must be a valid hex code (e.g. #FF5733)')
];

router.get ('/popular',        getPopularCategories);
router.get ('/:identifier',    getCategoryByIdentifier);

router.route('/')
  .get(getAllCategories)
  .post(protect, authorize('admin'), createCategoryRules, validate, createCategory);

router.route('/:id')
  .put(protect,    authorize('admin'), updateCategoryRules, validate, updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
