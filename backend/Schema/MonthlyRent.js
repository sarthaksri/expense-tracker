const mongoose = require('mongoose');

const monthlyRentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: String, // Format: 'YYYY-MM'
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isPaid: {
    type: Boolean,
    default: false,
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
monthlyRentSchema.index({ userId: 1, month: 1 }, { unique: true });

monthlyRentSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('MonthlyRent', monthlyRentSchema);
