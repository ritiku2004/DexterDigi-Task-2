import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'

import Home from './pages/Home'
import Signup from './pages/Signup'
import OTPVerify from './pages/OTPVerify'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // try auto-login if we have a rememberToken
  useEffect(() => {
    const tryAuto = async () => {
      const rm = localStorage.getItem('rememberToken')
      const at = localStorage.getItem('accessToken')
      if (!at && rm) {
        try {
          const { data } = await axios.get(
            'http://localhost:5000/api/auth/auto-login',
            { headers: { rememberToken: rm } }
          )
          localStorage.setItem('accessToken', data.accessToken)
          setIsLoggedIn(true)
          return
        } catch {
          localStorage.clear()
        }
      }
      if (at) setIsLoggedIn(true)
    }
    tryAuto()
  }, [])

  const handleAuth = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verify" element={<OTPVerify onAuth={handleAuth} />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
