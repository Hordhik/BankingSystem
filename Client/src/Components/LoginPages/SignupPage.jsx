import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../../Components/Auth/userStore.js'
import emailIcon from '../assets/email.png'
import passwordIcon from '../assets/password.png'
import personIcon from '../assets/person.png'
import './loginPage.css'


const SignUpPage = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setLoading(true);

  // Validation
  if (password !== confirm) {
    setErrorMessage('Passwords do not match');
    setLoading(false);
    return;
  }

  try {
    const result = await createUser({
      name: fullName,
      email,
      password
    });

    if (result.success) {
      // Redirect to login page on successful signup
      navigate('/login');
    } else {
      setErrorMessage(result.message || 'Failed to create account');
    }
  } catch (error) {
    console.error('Signup error:', error);
    setErrorMessage('An error occurred during signup');
  } finally {
    setLoading(false);
  }
  // All done in try/catch above. function ends here.
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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
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