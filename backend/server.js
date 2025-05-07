const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/authApp");

app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
