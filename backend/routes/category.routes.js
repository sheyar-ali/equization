const express = require('express');
const {
  getAllCategories,
  getCategoryByIdentifier,
  createCategory,
  updateCategory,
  deleteCategory,
  getPopularCategories
} = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/popular', getPopularCategories);
router.get('/:identifier', getCategoryByIdentifier);

// Admin only routes
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
