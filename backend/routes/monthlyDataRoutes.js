const express = require('express');
const router = express.Router();
const {
  getMonthlyIncome,
  updateMonthlyIncome,
  getMonthlyRent,
  updateMonthlyRent,
} = require('../controller/monthlyDataController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

// Income routes
router.route('/income/:month')
  .get(getMonthlyIncome)
  .put(updateMonthlyIncome);

// Rent routes
router.route('/rent/:month')
  .get(getMonthlyRent)
  .put(updateMonthlyRent);

module.exports = router;
