export default function Dashboard({ onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl">
        You are <span className="font-bold text-green-600">logged in</span>
      </h1>
      <p className="text-center max-w-md">
        Welcome to your dashboard!
      </p>
      <button
        onClick={onLogout}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Log Out
      </button>
    </div>
  );
}
