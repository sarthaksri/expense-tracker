const CustomCategory = require('../Schema/CustomCategory');

// @desc    Get all custom categories for logged in user
// @route   GET /api/custom-categories
// @access  Private
const getCustomCategories = async (req, res) => {
  try {
    const categories = await CustomCategory.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get custom categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create new custom category
// @route   POST /api/custom-categories
// @access  Private
const createCustomCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name',
      });
    }

    // Check if category already exists for this user
    const existingCategory = await CustomCategory.findOne({
      userId: req.user.id,
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await CustomCategory.create({
      userId: req.user.id,
      name: name.trim(),
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Create custom category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getCustomCategories,
  createCustomCategory,
};
