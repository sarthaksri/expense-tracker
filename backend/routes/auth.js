const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authMiddleware, getMe);

module.exports = router;
