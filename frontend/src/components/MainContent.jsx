import React from 'react';

export default function MainContent({ email }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {email}!</h2>
      <p className="text-gray-700">
        This is your dashboard. Use the sidebar to navigate through your account.
      </p>
    </div>
  );
}
