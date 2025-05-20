import React from 'react'
import Layout from '../components/Layout'

export default function Dashboard({ email, onLogout }) {
  return <Layout email={email} onLogout={onLogout} />
}
