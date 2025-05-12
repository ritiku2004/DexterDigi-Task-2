import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard({ onLogout }) {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await axios.get(
          'http://localhost:5000/api/dashboard',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setMessage(res.data.message || 'You are logged in!')
      } catch {
        handleLogout()
      }
    }
    fetchProtected()
  }, [])

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken')
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch {}
    finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('rememberToken')
      onLogout()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800">You are logged in!</h1>
        <p className="text-gray-500 mt-2">Welcome to your dashboard.</p>
        <button
          onClick={handleLogout}
          className="mt-6 w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}
