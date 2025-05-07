// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// routes/auth.js
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  // Look for any existing user with this email
  let user = await User.findOne({ email });

  if (user) {
    if (user.isVerified) {
      // Already signed up & verified → true duplicate
      return res.status(400).send('Email already in use');
    } else {
      // Found unverified user → treat as “resend OTP + update credentials”
      user.username = username;      // in case they changed it
      user.password = password;      // in case they changed it
      // fall through to regenerate OTP
    }
  } else {
    // No user at all → create brand new
    user = new User({ username, email, password, isVerified: false });
  }

  // Generate a fresh OTP & expiry
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);  // 5 min
  await user.save();

  return res.status(user.isNew ? 201 : 200).json({
    message: user.isNew
      ? 'Account created, OTP sent'
      : 'User exists but unverified—new OTP sent',
    email,
    otp
  });
});


// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');
  if (user.isVerified) return res.status(400).send('Already verified');

  // check expiration
  if (user.otpExpires < new Date()) {
    return res.status(400).send('OTP expired');
  }
  if (user.otp !== otp) {
    return res.status(400).send('Invalid OTP');
  }

  // mark verified
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.send('Signup verified');
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).send('Invalid credentials');
  if (!user.isVerified) return res.status(400).send('Please verify your email first');
  res.send('Login successful');
});


// POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found');

  const otp = generateOTP();
  user.otp = otp;
  await user.save();
  res.json({ otp });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).send('Invalid credentials');
  res.send('Login successful');
});

module.exports = router;
