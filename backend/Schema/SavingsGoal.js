const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a goal name'],
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  color: {
    type: String,
    default: '#10b981',
  },
  icon: {
    type: String,
    default: 'piggy-bank',
  },
  goalType: {
    type: String,
    enum: ['monthly', 'overall'],
    default: 'overall',
  },
  period: {
    type: String, // Format: 'YYYY-MM' for monthly goals
    trim: true,
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

savingsGoalSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
