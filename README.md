# 🔐 OTP Authentication App

A full-stack authentication system using React (Vite), Node.js, Express, and MongoDB with OTP verification on signup.

## 🚀 Features

- Signup with username, email, and password
- OTP verification (6-digit)
- Resend OTP with timer
- Login after verification
- Protected dashboard with logout
- Toast + SweetAlert2 notifications
- Tailwind CSS styling

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Others**: Axios, React Router, React Toastify, SweetAlert2

## 🧪 API Endpoints

- `POST /api/auth/register` – Register user and send OTP
- `POST /api/auth/verify-otp` – Verify OTP
- `POST /api/auth/login` – Login after verification
