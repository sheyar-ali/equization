const express = require('express');
const router  = express.Router();

const {
  getAllCategories, getPopularCategories, getCategoryByIdentifier,
  createCategory, updateCategory, deleteCategory
} = require('../controllers/category.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

router.get ('/popular',        getPopularCategories);
router.get ('/:identifier',    getCategoryByIdentifier);

router.route('/')
  .get(getAllCategories)
  .post(protect, authorize('admin'), createCategory);

router.route('/:id')
  .put(protect,    authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
