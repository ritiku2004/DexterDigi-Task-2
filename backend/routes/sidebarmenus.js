// routes/sidebarmenus.js
const express = require('express');
const router = express.Router();
const SideBarMenu = require('../models/SideBarMenu');

// GET /api/sidebarmenus
router.get('/', async (req, res) => {
  try {
    // Fetch all items
    const items = await SideBarMenu.find({}).lean();

    // Sort menu-titles by module_priority
    const titles = items
      .filter(i => i.type === 'menu-title')
      .sort((a, b) => (a.module_priority || 0) - (b.module_priority || 0));

    // For each title, collect its children sorted by module_menu_priority
    const result = titles.map(title => {
      const children = items
        .filter(
          i =>
            i.type !== 'menu-title' &&
            i.parent_module_id === title.module_id
        )
        .sort(
          (a, b) =>
            (a.module_menu_priority || 0) - (b.module_menu_priority || 0)
        );
      return { ...title, children };
    });

    // Flatten so frontend can iterate in one array:
    const flattened = [];
    result.forEach(group => {
      // push the title itself
      flattened.push({
        ...group,
        // keep type = 'menu-title'
      });
      // then each child, preserving their original type
      group.children.forEach(child => {
        flattened.push(child);
      });
    });
    res.json(flattened);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
