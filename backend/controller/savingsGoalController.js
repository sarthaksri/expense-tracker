const SavingsGoal = require('../Schema/SavingsGoal');

// @desc    Get all savings goals for logged in user
// @route   GET /api/savings-goals
// @access  Private
const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error('Get savings goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create new savings goal
// @route   POST /api/savings-goals
// @access  Private
const createSavingsGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, color, icon } = req.body;

    if (!name || targetAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and target amount',
      });
    }

    const goal = await SavingsGoal.create({
      userId: req.user.id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      color: color || '#10b981',
      icon: icon || 'piggy-bank',
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error('Create savings goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update savings goal
// @route   PUT /api/savings-goals/:id
// @access  Private
const updateSavingsGoal = async (req, res) => {
  try {
    let goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found',
      });
    }

    // Make sure user owns the goal
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this goal',
      });
    }

    goal = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error('Update savings goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete savings goal
// @route   DELETE /api/savings-goals/:id
// @access  Private
const deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found',
      });
    }

    // Make sure user owns the goal
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this goal',
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete savings goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
};
