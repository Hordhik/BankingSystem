// Client/src/api.js
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6060/api'

// create axios instance
const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// helper: set token into default header and localStorage
export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`
    try { localStorage.setItem('token', token) } catch (e) { /* ignore */ }
  } else {
    delete API.defaults.headers.common['Authorization']
    try { localStorage.removeItem('token') } catch (e) { /* ignore */ }
  }
}

// attach token from localStorage automatically (on import)
try {
  const stored = localStorage.getItem('token')
  if (stored) API.defaults.headers.common['Authorization'] = `Bearer ${stored}`
} catch (e) {
  // localStorage not available in some environments — ignore
}

export default API
