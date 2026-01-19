const MonthlyIncome = require('../Schema/MonthlyIncome');
const MonthlyRent = require('../Schema/MonthlyRent');

// @desc    Get monthly income for a specific month
// @route   GET /api/monthly-data/income/:month
// @access  Private
const getMonthlyIncome = async (req, res) => {
  try {
    const { month } = req.params;
    
    let income = await MonthlyIncome.findOne({ 
      userId: req.user.id, 
      month 
    });

    // Create default if doesn't exist
    if (!income) {
      income = await MonthlyIncome.create({
        userId: req.user.id,
        month,
        salary: 0,
        otherIncome: 0,
      });
    }

    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    console.error('Get monthly income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update monthly income for a specific month
// @route   PUT /api/monthly-data/income/:month
// @access  Private
const updateMonthlyIncome = async (req, res) => {
  try {
    const { month } = req.params;
    const { salary, otherIncome } = req.body;

    let income = await MonthlyIncome.findOne({ 
      userId: req.user.id, 
      month 
    });

    if (income) {
      // Update existing
      income.salary = salary !== undefined ? salary : income.salary;
      income.otherIncome = otherIncome !== undefined ? otherIncome : income.otherIncome;
      await income.save();
    } else {
      // Create new
      income = await MonthlyIncome.create({
        userId: req.user.id,
        month,
        salary: salary || 0,
        otherIncome: otherIncome || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    console.error('Update monthly income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get monthly rent for a specific month
// @route   GET /api/monthly-data/rent/:month
// @access  Private
const getMonthlyRent = async (req, res) => {
  try {
    const { month } = req.params;
    
    let rent = await MonthlyRent.findOne({ 
      userId: req.user.id, 
      month 
    });

    // Create default if doesn't exist
    if (!rent) {
      rent = await MonthlyRent.create({
        userId: req.user.id,
        month,
        amount: 0,
        isPaid: false,
      });
    }

    res.status(200).json({
      success: true,
      data: rent,
    });
  } catch (error) {
    console.error('Get monthly rent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update monthly rent for a specific month
// @route   PUT /api/monthly-data/rent/:month
// @access  Private
const updateMonthlyRent = async (req, res) => {
  try {
    const { month } = req.params;
    const { amount, isPaid } = req.body;

    let rent = await MonthlyRent.findOne({ 
      userId: req.user.id, 
      month 
    });

    if (rent) {
      // Update existing
      rent.amount = amount !== undefined ? amount : rent.amount;
      rent.isPaid = isPaid !== undefined ? isPaid : rent.isPaid;
      await rent.save();
    } else {
      // Create new
      rent = await MonthlyRent.create({
        userId: req.user.id,
        month,
        amount: amount || 0,
        isPaid: isPaid || false,
      });
    }

    res.status(200).json({
      success: true,
      data: rent,
    });
  } catch (error) {
    console.error('Update monthly rent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getMonthlyIncome,
  updateMonthlyIncome,
  getMonthlyRent,
  updateMonthlyRent,
};
