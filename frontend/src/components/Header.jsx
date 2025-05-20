import React from 'react'

export default function Header({ onToggle, onLogout }) {
  return (
    <header className="flex items-center justify-between bg-white px-4 h-16 shadow-sm">
      <div className="flex items-center">
        <button onClick={onToggle} className="p-2 mr-4 focus:outline-none">
          {/* Icon for toggle */}
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="text-xl font-semibold">My Enterprise</span>
      </div>
      <button
        onClick={onLogout}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  )
}
