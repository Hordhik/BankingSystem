import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, Zap } from 'lucide-react';
import BackgroundAnimation from '../Components/BackgroundAnimation/BackgroundAnimation';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'pass123') {
      localStorage.setItem('adminToken', 'mock-admin-token');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-container">
      <BackgroundAnimation />

      <div className="admin-header-logo">
        <div className="logo-icon">
          <Zap size={24} color="white" fill="white" />
        </div>
        <span className="logo-text">FLUIT ADMIN</span>
      </div>

      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="icon-circle">
            <ShieldCheck size={32} color="#0066FF" />
          </div>
          <h1>Admin Portal</h1>
          <p>Secure access for administrators</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="input-group">
            <div className="input-group__control">
              <User size={18} className="input-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin Username"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-group__control">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Access Dashboard
          </button>
        </form>

        <div className="admin-login-footer">
          <button onClick={() => navigate('/')} className="back-link">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
