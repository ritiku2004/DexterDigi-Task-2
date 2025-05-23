// seed.js
const mongoose = require('mongoose');
const SideBarMenu = require('./SideBarMenu');

// replace with your MongoDB URI
const MONGO_URI = 'mongodb://localhost:27017/authApp';

const sampleData = [
  {
    title: 'Main Menu',
    type: 'menu-title',
    module_id: '1',
    module_priority: 1
  },
  {
    title: 'Dashboard',
    type: 'route',
    to: 'dashboard',
    iconStyle: "<i class='fa fa-home'></i>",
    parent_module_id: '1',
    module_menu_priority: 1
  },
  {
    title: 'Portfolio Management',
    type: 'menu-title',
    module_id: '2',
    module_priority: 2
  },
  {
    title: 'Projects',
    type: 'collapsible',
    iconStyle: "<i class='fa fa-folder'></i>",
    parent_module_id: '2',
    module_menu_priority: 1,
    content: [
      { title: 'Add New', to: 'projects/add' },
      { title: 'List', to: 'projects/list' }
    ]
  },
  {
    title: 'Prices',
    type: 'route',
    to: 'prices',
    iconStyle: "<i class='fa fa-cogs'></i>",
    parent_module_id: '2',
    module_menu_priority: 2
  },
  {
    title: 'Services',
    type: 'route',
    to: 'services',
    iconStyle: "<i class='fa fa-cogs'></i>",
    parent_module_id: '2',
    module_menu_priority: 3
  },
  {
    title: 'Team Management',
    type: 'menu-title',
    module_id: '3',
    module_priority: 3
  },
  {
    title: 'Team',
    type: 'route',
    to: 'team',
    iconStyle: "<i class='fa fa-users'></i>",
    parent_module_id: '3',
    module_menu_priority: 1
  },
  {
    title: 'Employee Management',
    type: 'menu-title',
    module_id: '4',
    module_priority: 4
  },
  {
    title: 'Employee Role',
    type: 'route',
    to: 'employee-role',
    iconStyle: "<i class='fa fa-user-tag'></i>",
    parent_module_id: '4',
    module_menu_priority: 1
  },
  {
    title: 'Employees',
    type: 'route',
    to: 'employees',
    iconStyle: "<i class='fa fa-user-friends'></i>",
    parent_module_id: '4',
    module_menu_priority: 2
  },
  {
    title: 'Business Settings',
    type: 'menu-title',
    module_id: '5',
    module_priority: 5
  },
  {
    title: 'Settings',
    type: 'route',
    to: 'settings',
    iconStyle: "<i class='fa fa-cog'></i>",
    parent_module_id: '5',
    module_menu_priority: 1
  }
];


async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await SideBarMenu.deleteMany({});
  console.log('Cleared old sidebar data');

  // Insert sample
  await SideBarMenu.insertMany(sampleData);
  console.log('Seeded sample sidebar data');

  await mongoose.disconnect();
  console.log('Disconnected');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
