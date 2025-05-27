import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'

import Home from './pages/Home'
import Signup from './pages/Signup'
import OTPVerify from './pages/OTPVerify'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EmployeeRoles from './pages/EmployeeRoles';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true) // <- loading state
  const navigate = useNavigate()

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
          localStorage.setItem('authEmail', data.email) // optional
          setIsLoggedIn(true)
        } catch {
          localStorage.clear()
        }
      } else if (at) {
        setIsLoggedIn(true)
      }
      setIsCheckingAuth(false) // <- done checking
    }
    tryAuto()
  }, [])

  const handleAuth = () => setIsLoggedIn(true)

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        await axios.post(
          'http://localhost:5000/api/auth/logout',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        console.error('Logout request failed:', err)
      }
    }
    localStorage.clear()
    setIsLoggedIn(false)
    navigate('/', { replace: true })
  }

  const email = localStorage.getItem('authEmail')

  //  wait until token check finishes before rendering anything
  if (isCheckingAuth) return <p>Loading...</p>

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
              <Dashboard email={email} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/roles/create"
          element={
            isLoggedIn
              ? <EmployeeRoles />
              : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
