import { Link } from 'react-router-dom'

export default function Home({ isLoggedIn }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl mb-6">
        You are <span className="font-bold">{isLoggedIn ? 'logged in' : 'not logged in'}</span>
      </h1>
      {!isLoggedIn && (
        <div className="space-x-4">
          <Link to="/login">
            <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              Sign Up
            </button>
          </Link>
        </div>
      )}
      {isLoggedIn && (
        <Link to="/dashboard">
          <button className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
            Go to Dashboard
          </button>
        </Link>
      )}
    </div>
  )
}
