// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

export default function Sidebar({ collapsed }) {
  const [menuData, setMenuData] = useState([]);
  const [openCollapsibles, setOpenCollapsibles] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/sidebarmenus')
      .then(res => {
        // Normalize into an array no matter what shape comes back
        let data = res.data;
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        } else if (Array.isArray(data.menus)) {
          list = data.menus;
        } else {
          console.warn('Sidebar: unexpected payload, defaulting to []', data);
          list = [];
        }

        setMenuData(list);
      })
      .catch(err => {
        console.error('Failed to load sidebar menus:', err);
        setMenuData([]); // fallback to empty
      });
  }, []);

  // Build map of menu-title → its children
  const titleMap = {};
  menuData.forEach(item => {
    if (item.type === 'menu-title') {
      titleMap[item.module_id] = { titleItem: item, children: [] };
    }
  });
  menuData.forEach(item => {
    if (item.type !== 'menu-title') {
      const pid = item.parent_module_id;
      if (titleMap[pid]) {
        titleMap[pid].children.push(item);
      }
    }
  });

  // Sort groups by module_priority, then their children by module_menu_priority
  const groups = Object.values(titleMap)
    .sort(
      (a, b) =>
        (a.titleItem.module_priority || 0) -
        (b.titleItem.module_priority || 0)
    )
    .map(group => ({
      titleItem: group.titleItem,
      children: group.children.sort(
        (a, b) =>
          (a.module_menu_priority || 0) -
          (b.module_menu_priority || 0)
      )
    }));

  return (
    <aside
  className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
    collapsed ? 'w-16' : 'w-64'
  } h-full`}
>
  <nav className="px-4 py-4 space-y-2">
    {/* Static Dashboard Link */}
<NavLink
  to="/dashboard"
  className="flex items-center justify-center px-3 py-2"
>
  <span
    className={`font-bold text-xl text-gray-800 transition-all duration-300 ${
      collapsed ? 'text-center w-full' : ''
    }`}
  >
    {collapsed ? 'D' : 'Dexterdigi'}
  </span>
</NavLink>
    {/* Dynamic Sections */}
    {groups.map(({ titleItem, children }) => (
      <div key={titleItem.module_id} className="space-y-1">
        {/* Section Title */}
        {!collapsed && (
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
            {titleItem.title}
          </div>
        )}

        {/* Section Items */}
        {children.map(item => {
          // COLLAPSIBLE
          if (item.type === 'collapsible') {
            const isOpen = openCollapsibles[item._id] || false;
            return (
              <div key={item._id} className="space-y-1">
                <button
                  onClick={() =>
                    setOpenCollapsibles(prev => ({
                      ...prev,
                      [item._id]: !isOpen
                    }))
                  }
                  className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 gap-3 transition"
                >
                  <span
                    className="text-gray-500"
                    dangerouslySetInnerHTML={{ __html: item.iconStyle || '' }}
                  /> 
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.title}</span>
                      <svg
                        className={`h-4 w-4 transform transition-transform text-gray-400 ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>

                {!collapsed &&
                  isOpen &&
                  item.content.map(sub => (
                    <NavLink
                      key={sub.to}
                      to={`/dashboard/${sub.to}`}
                      className={({ isActive }) =>
                        `block ml-7 text-sm px-2 py-1.5 rounded-md transition ${
                          isActive
                            ? 'bg-gray-100 text-gray-900 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`
                      }
                    >   
                      {sub.title}
                    </NavLink>
                  ))}
              </div>
            );
          }

          // ROUTE ITEM
          if (item.type === 'route') {
            return (
              <NavLink
                key={item._id}
                to={`${item.to}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-sm transition ${
                    isActive ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700'
                  }`
                }
              >
                <span
                  className="text-gray-500"
                  dangerouslySetInnerHTML={{ __html: item.iconStyle || '' }}
                />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          }

          return null;
        })}
      </div>
    ))}
  </nav>
</aside>


  );
}
