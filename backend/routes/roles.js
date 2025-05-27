const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// POST /api/roles
router.post('/', async (req, res) => {
  try {
    const { name, sidebarMenus, permissions } = req.body;
    const role = new Role({ name, sidebarMenus, permissions });
    await role.save();
    res.status(201).json({ message: 'Role created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find().populate('sidebarMenus').populate('permissions');
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
