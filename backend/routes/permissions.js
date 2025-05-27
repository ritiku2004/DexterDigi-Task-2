const express = require('express');
const router = express.Router();
const Permission = require('../models/Permission');

// GET /api/permissions
router.get('/', async (req, res) => {
  try {
    const perms = await Permission.find().lean();
    res.json(perms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
