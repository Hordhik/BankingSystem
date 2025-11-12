// Client/src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import passwordIcon from '../assets/password.png'
import personIcon from '../assets/person.png'
import './loginPage.css'
import API from '../../api'   // <-- import API

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')            // changed to email
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Please fill email and password.')
      return
    }

    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      // backend returns token, fullname, email
      const token = res.token || res.data?.token
      const fullname = res.fullname || res.data?.fullname
      const emailResp = res.email || res.data?.email

      localStorage.setItem('token', token)
      if (fullname) localStorage.setItem('fullname', fullname)
      if (emailResp) localStorage.setItem('email', emailResp)

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      const msg = err?.response?.data?.message || err?.message || 'Login failed'
      setErrorMessage(msg)
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
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-group__control"
              required
            />
          </div>

          <div className="input-group">
            <img src={passwordIcon} alt="Password" className="input-group__icon" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-group__control"
              required
            />
          </div>

          {errorMessage && (
            <div className="form-error" role="alert" style={{ color: 'red', marginBottom: 8 }}>{errorMessage}</div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
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

export default LoginPage;