import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestLoginOTP, verifyLoginOTP } from '../../Components/Auth/userStore.js'
import emailIcon from '../assets/email.png'
import passwordIcon from '../assets/password.png'
import personIcon from '../assets/person.png'
import './loginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) 
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestOtp = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      await requestLoginOTP(email)
      setStep(2) // Move to the next step
    } catch (err) {
      setErrorMessage(err.message)
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setLoading(true)
    
    try {
      await verifyLoginOTP(email, otp)
      navigate('/dashboard') // Success! Go to dashboard
    } catch (err) {
      setErrorMessage(err.message)
    }
    setLoading(false)
  }

return (
  <div className="login-page">
    <div className="login-card">
      <div className="login-card__header">
        <img src={personIcon} alt="User" className="login-card__avatar" />
        <h1 className="login-card__title">
          {step === 1 ? 'Login' : 'Enter OTP'}
        </h1>
        <p className="login-card__subtitle">
          {step === 1 
            ? 'We\'ll send a code to your email' 
            : `Enter the code sent to ${email}`}
        </p>
      </div>

      {/* --- STEP 1: EMAIL FORM --- */}
      {step === 1 && (
        <form className="login-form" onSubmit={handleRequestOtp}>
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

          {errorMessage && (
            <div className="form-error" role="alert">{errorMessage}</div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {/* --- STEP 2: OTP FORM --- */}
      {step === 2 && (
        <form className="login-form" onSubmit={handleVerifyOtp}>
          <div className="input-group">
            <img src={passwordIcon} alt="OTP" className="input-group__icon" />
            <input
              type="text"
              placeholder="6-Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-group__control"
              required
            />
          </div>

          {errorMessage && (
            <div className="form-error" role="alert">{errorMessage}</div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      )}

      <div className="login-footer" style={{ justifyContent: 'center' }}>
        <Link className="login-link" to="/signup">Create account</Link>
      </div>
    </div>
  </div>
)
}

export default LoginPage;