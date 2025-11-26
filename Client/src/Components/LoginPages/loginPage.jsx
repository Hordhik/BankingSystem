// Client/src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Mail, ArrowLeft, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react'
import API from '../../services/api'
import './loginPage.css'

import BackgroundAnimation from '../BackgroundAnimation/BackgroundAnimation';

const LoginPage = () => {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!identifier || !password) {
      setErrorMessage('Email/Username and password are required.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        identifier: identifier.trim(),
        password
      }

      const res = await API.post('/auth/login', payload)
      const data = res?.data ?? res

      const token = data?.token
      if (!token) {
        throw new Error('No token received from server')
      }

      localStorage.setItem('token', token)
      if (data?.userId) localStorage.setItem('userId', data.userId)
      if (data?.fullname) localStorage.setItem('fullname', data.fullname)
      if (data?.email) localStorage.setItem('email', data.email)
      if (data?.primaryAccountId) localStorage.setItem('primaryAccountId', data.primaryAccountId)
      if (data?.accountNumber) localStorage.setItem('accountNumber', data.accountNumber)
      if (data?.cardNumber) localStorage.setItem('cardNumber', data.cardNumber)
      if (data?.expiryDate) localStorage.setItem('expiryDate', data.expiryDate)
      if (data?.cvv) localStorage.setItem('cvv', data.cvv)
      if (data?.username) localStorage.setItem('username', data.username)
      if (data?.primaryAccountBalance) localStorage.setItem('primaryAccountBalance', data.primaryAccountBalance)

      API.defaults.headers.common['Authorization'] = `Bearer ${token}`

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
      <BackgroundAnimation />
      <div className="login-container">
        {/* Left Side - Visual Design */}
        <div className="login-visual">
          <div className="visual-content">
            <h2>Future of<br />Banking.</h2>
            <p>Experience the next generation of financial freedom with our secure, intuitive, and premium platform.</p>
            <div className="visual-shape-1"></div>
            <div className="visual-shape-2"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-section">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Zap size={20} fill="currentColor" />
            </div>
            FLUIT
          </div>

          <div className="login-card__header">
            <h1 className="login-card__title">Welcome Back</h1>
            <p className="login-card__subtitle">Securely access your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="input-group__icon" />
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input-group__control"
                required
              />
            </div>

            <div className="input-group">
              <Lock className="input-group__icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-group__control"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errorMessage && (
              <div className="form-error" role="alert">
                {errorMessage}
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <a className="login-link" href="/forgot-password">Forgot password?</a>
            <a className="login-link" href="/signup">Create account</a>
          </div>

          <button type="button" className="back-home-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Homepage
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
