require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');

// Import routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenseRoutes');
const savingsGoalRoutes = require('./routes/savingsGoalRoutes');
const monthlyDataRoutes = require('./routes/monthlyDataRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
app.use('/api/monthly-data', monthlyDataRoutes);
app.use('/api/custom-categories', categoryRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

app.get('/', (req, res) => {
  res.send("works")
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
