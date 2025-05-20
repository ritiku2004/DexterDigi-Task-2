import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ collapsed }) {
  const [prodOpen, setProdOpen] = useState(false);

  return (
    <aside
      className={`bg-white border-r shadow-md transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } h-full`}
    >
      <nav className="p-4 space-y-4">
        {/* Dashboard Link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center p-2 rounded hover:bg-gray-100 transition ${
              isActive ? 'bg-gray-100 font-semibold' : ''
            }`
          }
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
          </svg>
          {!collapsed && <span className="ml-3">Dashboard</span>}
        </NavLink>

        {/* Product Management Section */}
        <div>
          <button
            onClick={() => setProdOpen(!prodOpen)}
            className="flex items-center w-full p-2 hover:bg-gray-100 rounded transition"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
            </svg>
            {!collapsed && (
              <>
                <span className="ml-3 flex-1 text-left">Product Management</span>
                <svg
                  className={`h-4 w-4 transform transition-transform ${
                    prodOpen ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {prodOpen && !collapsed && (
            <div className="ml-6 mt-2 space-y-1">
              <NavLink
                to="/dashboard/add-new"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-100 transition ${
                    isActive ? 'bg-gray-100 font-semibold' : ''
                  }`
                }
              >
                Add New
              </NavLink>
              <NavLink
                to="/dashboard/list"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-100 transition ${
                    isActive ? 'bg-gray-100 font-semibold' : ''
                  }`
                }
              >
                List
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
