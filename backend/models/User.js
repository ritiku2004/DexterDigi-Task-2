const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
