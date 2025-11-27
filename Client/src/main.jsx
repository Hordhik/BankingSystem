// Client/src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { setAuthToken } from './services/api'   // <<< FIXED


// If you want to proactively set token from localStorage on app start:
try {
  const token = localStorage.getItem('token')
  if (token) setAuthToken(token)
} catch (e) {
  console.warn('Could not access localStorage for token', e)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
