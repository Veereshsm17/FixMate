const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword, 
  verifyOtp,      // <-- Added
  resetPassword   // <-- Added
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);        // <-- Added
router.post('/reset-password', resetPassword); // <-- Added

module.exports = router;
