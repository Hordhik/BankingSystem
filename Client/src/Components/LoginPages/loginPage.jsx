import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import passwordIcon from '../assets/password.png'
import personIcon from '../assets/person.png'
import './loginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    // No validation or auth calls for now; just navigate
    navigate('/dashboard')
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
            <img src={passwordIcon} alt="Password" className="input-group__icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-group__control"
            />
          </div>

          {errorMessage && (
            <div className="form-error" role="alert">{errorMessage}</div>
          )}

          <button type="submit" className="login-button">Login</button>
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



