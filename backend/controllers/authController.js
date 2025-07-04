// backend/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); // <-- Added for password hashing

// Registration controller
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    // Return user info and JWT token (UPDATED)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user), // <-- Pass user object, not just user._id
    });
  } catch (error) {
    next(error);
  }
};

//Login controller  
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};


// Forgot Password (OTP Generation) controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: 'No user with that email address.' });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER || 'smveeresh22@gmail.com',
        pass: process.env.MAIL_PASS || 'avuzqwxfrydxbisn  ',
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.MAIL_USER || 'smveeresh22@gmail.com',
      subject: 'Your Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    });

    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// OTP Verification controller
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ error: 'Invalid or expired OTP.' });

    // Optionally, clear OTP fields now or after password reset
    // user.resetPasswordOTP = undefined;
    // user.resetPasswordOTPExpires = undefined;
    // await user.save();

    res.json({ message: 'OTP verified. You may now reset your password.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Password Reset controller
exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });
    if (!user) {
      console.log('User not found or OTP expired');
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

     user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();
    console.log('Password updated for:', user.email); // <-- Add this line

    res.json({ message: 'Password has been reset. You can now log in.' });
  } catch (err) {
    console.error('Error resetting password:', err); // <-- Add this line
    res.status(500).json({ error: 'Server error' });
  }
};
