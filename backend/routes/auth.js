// File: routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-your-secret';
const ACCESS_TOKEN_EXPIRY = '15m';

// Helper: generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Inline token generators
function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

function generateRememberToken() {
  return crypto.randomBytes(32).toString('hex');
}

// 1. Register or resend OTP
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    if (!user) {
      user = new User({ username, email, password, isVerified: false });
    } else {
      // update credentials for unverified
      user.username = username;
      user.password = password;
    }

    // Generate OTP and expiry (5 minutes)
    user.otp = generateOTP();
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // TODO: send OTP via email/SMS
    return res.status(user.isNew ? 201 : 200).json({
      message: user.isNew ? 'Account created, OTP sent' : 'New OTP sent',
      email,
      otp: user.otp  // remove in production
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 2. Login (send OTP)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

    // Generate OTP for login verification
    user.otp = generateOTP();
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // TODO: send OTP via email/SMS
    res.json({ message: 'OTP sent', email, otp: user.otp });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 3. Verify OTP (Registration & Login)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP expired' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    // Mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const rememberToken = generateRememberToken();
    user.accessToken = accessToken;
    user.rememberToken = rememberToken;

    await user.save();
    res.json({ message: 'OTP verified', accessToken, rememberToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 4. Auto-Login using rememberToken
router.get('/auto-login', async (req, res) => {
  try {
    const rememberToken = req.header('remembertoken');
    if (!rememberToken) return res.status(401).json({ message: 'Missing rememberToken' });

    const user = await User.findOne({ rememberToken });
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    const newAccessToken = generateAccessToken(user._id);
    user.accessToken = newAccessToken;
    await user.save();

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing access token' });

    // Verify token to get userId
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Clear tokens in DB
    await User.findByIdAndUpdate(payload.userId, {
      accessToken: undefined,
      rememberToken: undefined
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
