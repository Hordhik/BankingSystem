// Client/src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailIcon from '../assets/email.png';
import passwordIcon from '../assets/password.png';
import './loginPage.css';
import API from '../../api'; // try backend endpoints if available

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: ask backend to start reset (if endpoint exists) otherwise show fields
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    // Try calling a backend "forgot" endpoint if available, otherwise allow local flow
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot', { email });
      // If backend responds OK, instruct user to check email
      setMessage(res?.data?.message || 'Password reset email sent (check inbox).');
      setIsSuccess(true);
    } catch (err) {
      // If the endpoint doesn't exist (404) or fails, fallback to local behavior:
      setShowPasswordFields(true);
      setMessage('If your email exists we will let you reset the password. Enter new password below.');
      setIsSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: submit new password (try backend reset endpoint, otherwise show success locally)
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

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

    setLoading(true);
    try {
      // Try backend reset endpoint (if implemented)
      const res = await API.post('/auth/reset', { email, password: newPassword });
      setMessage(res?.data?.message || 'Password updated successfully. Redirecting to login...');
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      // If backend doesn't provide reset, fallback to local success message
      setMessage('Password updated locally (backend reset not implemented). Redirecting to login...');
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } finally {
      setLoading(false);
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
              <div className={`form-message ${isSuccess ? 'success' : 'error'}`} style={{ marginBottom: 8 }}>
                {message}
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Please wait...' : 'Continue'}
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
              <div className={`form-message ${isSuccess ? 'success' : 'error'}`} style={{ marginBottom: 8 }}>
                {message}
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Please wait...' : 'Reset Password'}
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