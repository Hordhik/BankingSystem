// Client/src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api' // keep this path if your src/api.js is at src/api.js
import passwordIcon from '../assets/password.png'
import personIcon from '../assets/person.png'
import './loginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        email: email.trim().toLowerCase(), // normalize
        password
      }

      const res = await API.post('/auth/login', payload)
      const data = res?.data ?? res

      // token should be in data.token (adjust if backend differs)
      const token = data?.token
      if (!token) {
        throw new Error('No token received from server')
      }

      // persist token + user info
      localStorage.setItem('token', token)
      if (data?.fullname) localStorage.setItem('fullname', data.fullname)
      if (data?.email) localStorage.setItem('email', data.email)
      if (data?.primaryAccountId) localStorage.setItem('primaryAccountId', data.primaryAccountId)
      if (data?.accountNumber) localStorage.setItem('accountNumber', data.accountNumber)
      if (data?.username) localStorage.setItem('username', data.username)
      if (data?.primaryAccountBalance) localStorage.setItem('primaryAccountBalance', data.primaryAccountBalance)

      // set default Authorization header for future API calls
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // navigate to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Login failed'
      setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <img src={personIcon} alt="User" className="login-card__avatar" />
          <h1 className="login-card__title">Welcome Back</h1>
          <p className="login-card__subtitle">Login to your banking account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={personIcon} alt="Email" className="input-group__icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-group__control"
              required
            />
          </div>

          <div className="input-group">
            <img src={passwordIcon} alt="Password" className="input-group__icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-group__control"
              required
            />
          </div>

          {errorMessage && (
            <div className="form-error" role="alert" style={{ color: 'red', marginBottom: 8 }}>
              {errorMessage}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer" style={{ justifyContent: 'space-between' }}>
          <a className="login-link" href="/forgot-password">Forgot password?</a>
          <a className="login-link" href="/signup">Create account</a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
