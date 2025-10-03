import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailIcon from '../assets/email.png';
import passwordIcon from '../assets/password.png';
import { findUserByEmail, updatePassword } from '../Auth/userStore';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    // Use findUserByEmail from userStore to check if email exists
    const user = findUserByEmail(email);
    
    if (user) {
      setShowPasswordFields(true);
      setMessage('Please enter your new password');
      setIsSuccess(true);
    } else {
      setMessage('Email not found in our system');
      setIsSuccess(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setIsSuccess(false);
      return;
    }

    try {
      // Use updatePassword from userStore to update the password
      updatePassword(email, newPassword);
      
      setMessage('Password updated successfully! Redirecting to login...');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage('Failed to update password. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">Reset Password</h1>
          <p className="login-card__subtitle">
            {showPasswordFields ? 'Enter your new password' : 'Enter your email to reset password'}
          </p>
        </div>

        {!showPasswordFields ? (
          <form className="login-form" onSubmit={handleEmailSubmit}>
            <div className="input-group">
              <img src={emailIcon} alt="Email" className="input-group__icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-group__control"
                required
              />
            </div>

            {message && (
              <div className={`form-message ${isSuccess ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="login-button">
              Continue
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handlePasswordReset}>
            <div className="input-group">
              <img src={passwordIcon} alt="Password" className="input-group__icon" />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-group__control"
                required
              />
            </div>

            <div className="input-group">
              <img src={passwordIcon} alt="Password" className="input-group__icon" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-group__control"
                required
              />
            </div>

            {message && (
              <div className={`form-message ${isSuccess ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="login-button">
              Reset Password
            </button>
          </form>
        )}

        <div className="login-footer">
          <a className="login-link" href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;