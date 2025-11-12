import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import emailIcon from '../assets/email.png'
import passwordIcon from '../assets/password.png'
import personIcon from '../assets/person.png'
import { createUser } from '../Auth/userStore'
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
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!fullName || !username || !email || !accountNumber || !ifsc || !password || !confirm){
      setErrorMessage('Please fill in all fields.')
      return
    }
    const emailRegex = /.+@.+\..+/
    if (!emailRegex.test(email)){
      setErrorMessage('Please enter a valid email address.')
      return
    }
    const usernameRegex = /^[a-zA-Z0-9_\.\-]{3,20}$/
    if (!usernameRegex.test(username)){
      setErrorMessage('Username must be 3-20 characters; letters, numbers, dot, dash or underscore only.')
      return
    }
    const acctRegex = /^\d{10,18}$/
    if (!acctRegex.test(accountNumber)){
      setErrorMessage('Account Number should be 10-18 digits.')
      return
    }
    const ifscRegex = /^[A-Z]{4}0[0-9A-Z]{6}$/
    if (!ifscRegex.test(String(ifsc).toUpperCase())){
      setErrorMessage('IFSC should match pattern: 4 letters + 0 + 6 alphanumerics (e.g., HDFC0123456).')
      return
    }
    if (password.length < 6){
      setErrorMessage('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm){
      setErrorMessage('Passwords do not match.')
      return
    }

    try{
      createUser({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        accountNumber: accountNumber.trim(),
        ifscCode: String(ifsc).toUpperCase(),
        password
      })
      navigate('/login')
    }catch(err){
      setErrorMessage(err?.message || 'Sign up failed')
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
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-group__control"
              required
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
              required
              inputMode="numeric"
              pattern="\\d{10,18}"
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
              required
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

          {errorMessage && (
            <div className="form-error" role="alert">{errorMessage}</div>
          )}

          <button type="submit" className="login-button">Create Account</button>
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



