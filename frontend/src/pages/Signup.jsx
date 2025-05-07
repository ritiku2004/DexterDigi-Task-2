import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', form)
      await Swal.fire('OTP Sent!', 'Please enter the OTP to verify your account.', 'success')
      navigate('/otp-verify', { state: { email: data.email, otp: data.otp } })
    } catch (err) {
      toast.error(err.response?.data || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['username','email','password'].map(name => (
          <input
            key={name}
            name={name}
            type={name === 'email' ? 'email' : name === 'password' ? 'password' : 'text'}
            placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
        ))}
        <button
          type="submit"
          disabled={loading}
          className={`
            flex items-center justify-center w-full py-2 rounded-lg
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
            text-white transition
          `}
        >
          {loading && (
            <span className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}
