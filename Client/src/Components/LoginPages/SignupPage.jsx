// Client/src/pages/SignUpPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import emailIcon from '../assets/email.png'
import passwordIcon from '../assets/password.png'
import personIcon from '../assets/person.png'
import './loginPage.css'
import API from '../../api'   // <-- import API

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
      // Only send the fields the backend expects (fullname, email, password)
      const payload = {
        fullname: fullName,
        email: email,
        password: password,
      }

      const res = await API.post('/auth/register', payload)
      // response format from your backend: { token, fullname, email }
      localStorage.setItem('token', res.token || res.data?.token)
      localStorage.setItem('fullname', res.fullname || res.data?.fullname)
      localStorage.setItem('email', res.email || res.data?.email)

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      // friendly message: try to read backend message
      const msg = err?.response?.data?.message || err?.message || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <img src={personIcon} alt="User" className="login-card__avatar" />
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
              placeholder="Username (optional)"
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
              placeholder="Account Number (optional)"
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
              placeholder="IFSC Code (optional)"
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

          {error && <div className="form-error" role="alert" style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="login-footer" style={{ justifyContent: 'space-between' }}>
          <span className="login-link" style={{ color: '#475569' }}>Already have an account?</span>
          <Link className="login-link" to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage;