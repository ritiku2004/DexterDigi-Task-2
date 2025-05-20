// File: server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// ——— MongoDB Connection ———
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/authApp';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ——— Auth Routes ———
app.use('/api/auth', authRoutes);

// ——— Protected Route ———
app.get('/api/dashboard', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'replace-with-your-secret');
    return res.json({ message: `Welcome, user ${payload.userId}!` });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
});

// ——— Start Server ———
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
