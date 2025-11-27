import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../services/api'
import { Zap, User, Mail, Lock, Eye, EyeOff, CreditCard, ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import './loginPage.css'; // Reusing login styles
import BackgroundAnimation from '../BackgroundAnimation/BackgroundAnimation';

const SignupPage = () => {
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
  const [showPassword, setShowPassword] = useState(false)

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

      // Redirect to login page for user to sign in
      navigate('/login')
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
      <BackgroundAnimation />
      <div className="login-container">
        {/* Left Side - Visual Design */}
        <div className="login-visual">
          <div className="visual-content">
            <h2>Join the<br />Revolution.</h2>
            <p>Create your account today and start managing your finances with ease.</p>
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
            <h1 className="login-card__title">Create Account</h1>
            <p className="login-card__subtitle">Sign up to get started</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <User className="input-group__icon" />
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
                <User className="input-group__icon" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-group__control"
                />
              </div>
            </div>

            <div className="input-group">
              <Mail className="input-group__icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-group__control"
                required
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <CreditCard className="input-group__icon" />
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
                <FileText className="input-group__icon" />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="input-group__control"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </div>

            <div className="form-row">
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

              <div className="input-group">
                <Lock className="input-group__icon" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-group__control"
                  required
                />
              </div>
            </div>

            {error && <div className="form-error" role="alert">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="login-footer">
            <span className="login-link" style={{ color: '#666' }}>Already have an account?</span>
            <Link className="login-link" to="/login">Login</Link>
          </div>

          <button type="button" className="back-home-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Homepage
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
