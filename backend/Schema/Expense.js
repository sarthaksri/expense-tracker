const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['food', 'transport', 'misc', 'rent', 'custom'],
  },
  customCategory: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: String, // Format: 'YYYY-MM-DD'
    required: true,
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

// Update the updatedAt timestamp before saving
expenseSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Expense', expenseSchema);
