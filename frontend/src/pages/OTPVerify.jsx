import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export default function OTPVerify({ onAuth }) {
  const { state } = useLocation()    // { email, otp }
  const navigate = useNavigate()
  const [otpInput, setOtpInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer(t => t - 1), 1000)
      return () => clearTimeout(id)
    }
  }, [timer])

  const handleVerify = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email: state.email, otp: otpInput })
      await Swal.fire('Verified!', 'Your account is now active.', 'success')
      localStorage.setItem('auth', 'true')
      onAuth()
      navigate('/dashboard')
    } catch {
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/resend-otp', { email: state.email })
      toast.success('OTP resent!')
      state.otp = data.otp
      setTimer(60)
    } catch {
      toast.error('Resend failed.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Account</h2>
      <p className="text-center mb-6">
        <span className="font-medium">Your OTP:</span>{' '}
        <span className="text-indigo-600 font-semibold">{state.otp}</span>
      </p>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          maxLength={6}
          value={otpInput}
          onChange={e => setOtpInput(e.target.value)}
          placeholder="Enter 6-digit OTP"
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
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="flex items-center justify-center w-full mt-6">
  {timer > 0 ? (
    <span className="text-center text-sm">
      Resend OTP in <span className="font-mono">{timer}s</span>
    </span>
  ) : (
    <button
      onClick={handleResend}
      disabled={resending}
      className={`
        mx-auto                  /* centers the button within flex */
        flex items-center justify-center
        px-4 py-2                /* slightly less tall for aesthetics */
        rounded-lg
        ${resending
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-600'}
        text-white transition
      `}
    >
      {resending && (
        <span className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {resending ? 'Resending...' : 'Resend OTP'}
    </button>
  )}
</div>
    </div>
  )
}
