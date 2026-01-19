const mongoose = require('mongoose');

const monthlyIncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: String, // Format: 'YYYY-MM'
    required: true,
  },
  salary: {
    type: Number,
    default: 0,
    min: 0,
  },
  otherIncome: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one record per user per month
monthlyIncomeSchema.index({ userId: 1, month: 1 }, { unique: true });

monthlyIncomeSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('MonthlyIncome', monthlyIncomeSchema);
