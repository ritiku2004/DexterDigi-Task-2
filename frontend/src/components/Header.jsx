import React from 'react'
import { useState } from 'react';

export default function Header({ onToggle, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const Toggle = () => {
    setIsOpen(prev => !prev);
    onToggle();
  };
  return (
    <header className="flex items-center justify-between bg-white px-4 h-16 shadow-sm">
      <div className="flex items-center">
        <button onClick={Toggle} className=" mr-4 focus:outline-none">
          {/* Icon for toggle */}
          <svg
            className={`
              w-8 h-8 
              transform transition-transform 
              duration-500 ease-in-out 
              ${!isOpen ? 'rotate-180' : 'rotate-0'}
            `}
            viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            {/* Custom double-chevron arrow */}
            <path
              d="M9.17 16.17L13.34 12L9.17 7.83M14.83 16.17L19 12L14.83 7.83"
              stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-xl font-semibold">My Enterprise</span>
      </div>
      <button
        onClick={onLogout}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        <i class="fa fa-sign-out"></i>
         &nbsp; Logout
      </button>
    </header>
  )
}
