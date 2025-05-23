// File: server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const sidebarmenusRoute = require('./routes/sidebarmenus');

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

app.use('/api/sidebarmenus', sidebarmenusRoute);

// ——— Start Server ———
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
