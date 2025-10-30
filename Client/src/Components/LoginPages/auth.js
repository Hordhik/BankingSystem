// The URL of your backend server
const BASE_URL = 'http://localhost:4000/api/auth'

// The key for storing the login token
const TOKEN_KEY = 'banking_token'

/**
 * Saves the login token (JWT) to localStorage.
 */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Retrieves the login token from localStorage.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Clears the login token from localStorage (logs the user out).
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Decodes the JWT to get user info (like email and ID)
 */
export function getUserFromToken() {
  const token = getToken()
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch (e) {
    console.error('Error decoding token:', e)
    return null
  }
}

/**
 * Calls the backend to register a new user.
 */
export async function register(userData) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Failed to register')
  }

  return res.json()
}

/**
 * Step 1 of login: Calls the backend to send an OTP to the user's email.
 */
export async function requestLoginOTP(email) {
  const res = await fetch(`${BASE_URL}/login-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Failed to request OTP')
  }
  
  return res.json()
}

/**
 * Step 2 of login: Sends the email and OTP to the backend for verification.
 */
export async function verifyLoginOTP(email, otp) {
  const res = await fetch(`${BASE_URL}/login-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Invalid OTP or email')
  }

  const { token } = await res.json()
  saveToken(token) // Save the token to localStorage
  return true
}