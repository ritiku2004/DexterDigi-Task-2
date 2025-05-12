import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        form
      )
      await Swal.fire('OTP Sent!', 'Check your email for the OTP.', 'success')
      // pass email and otp
      navigate('/otp-verify', { state: { email: data.email, otp: data.otp } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
      <h2 className="text-2xl font-semibold mb-6 text-center">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`
            flex items-center justify-center w-full py-2 rounded-lg
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}
            text-white transition
          `}
        >
          {loading && (
            <span className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    </div>
  )
}
