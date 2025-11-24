// Client/src/pages/SignUpPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../services/api' // <-- keep this path if your api.js is at src/api.js
import emailIcon from '../assets/email.png'
import passwordIcon from '../assets/password.png'
import personIcon from '../assets/person.png'
import './loginPage.css'

const SignUpPage = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic client-side validation
    if (!fullName || !email || !password) {
      setError('Full name, email and password are required.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // Normalize email and prepare payload (match your RegisterRequest DTO)
      const normalizedEmail = email.trim().toLowerCase()
      const payload = {
        fullname: fullName,
        email: normalizedEmail,
        password: password,
        username: username || null,
        accountNumber: accountNumber || null,
        ifsc: ifsc || null
      }

      const res = await API.post('/auth/register', payload)
      // axios responses store data in res.data
      const data = res?.data ?? res

      // Safely store token and user info
      const token = data?.token
      if (token) localStorage.setItem('token', token)
      if (data?.fullname) localStorage.setItem('fullname', data.fullname)
      if (data?.email) localStorage.setItem('email', data.email)

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      // Prefer backend message, fallback to generic
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Registration failed'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Visual Design */}
        <div className="login-visual">
          <div className="visual-content">
            <h2>Join the<br/>Revolution.</h2>
            <p>Create your account today and start managing your finances with ease.</p>
            <div className="visual-shape-1"></div>
            <div className="visual-shape-2"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-section">
          <div className="login-card__header">
            <div className="avatar-container">
              <img src={personIcon} alt="User" className="login-card__avatar" />
            </div>
            <h1 className="login-card__title">Create Account</h1>
            <p className="login-card__subtitle">Sign up to get started</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <img src={personIcon} alt="Full name" className="input-group__icon" />
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-group__control"
                required
              />
            </div>

            <div className="input-group">
              <img src={personIcon} alt="Username" className="input-group__icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-group__control"
              />
            </div>

            <div className="input-group">
              <img src={emailIcon} alt="Email" className="input-group__icon" />
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
              <img src={personIcon} alt="Account Number" className="input-group__icon" />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="input-group__control"
                inputMode="numeric"
              />
            </div>

            <div className="input-group">
              <img src={personIcon} alt="IFSC Code" className="input-group__icon" />
              <input
                type="text"
                placeholder="IFSC Code"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="input-group__control"
                style={{ textTransform: 'uppercase' }}
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

            <div className="input-group">
              <img src={passwordIcon} alt="Confirm password" className="input-group__icon" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-group__control"
                required
              />
            </div>

            {error && <div className="form-error" role="alert">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="login-footer">
            <span className="login-link" style={{ color: '#64748b' }}>Already have an account?</span>
            <Link className="login-link" to="/login">Login</Link>
          </div>

          <button type="button" className="back-home-btn" onClick={() => navigate('/')}>
            ← Back to Homepage
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
