const express = require('express');
const router = express.Router();

// Import controller functions
const {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/UserController.js');

// Import middleware
const { protect } = require('../middlewares/authMiddleware');

// PUBLIC ROUTES (no authentication needed)
router.post('/signup', signup);
router.post('/login', login);

// PRIVATE ROUTES (authentication required - use protect middleware)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

module.exports = router;