const express = require('express');
const router = express.Router();
const {
  getCustomCategories,
  createCustomCategory,
} = require('../controller/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.route('/')
  .get(getCustomCategories)
  .post(createCustomCategory);

module.exports = router;
