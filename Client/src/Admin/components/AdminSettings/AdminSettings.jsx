import React, { useState } from 'react';
import { Settings, Shield, User, Save, RotateCcw, Check, AlertTriangle, Bell, Lock, Globe } from 'lucide-react';
import './AdminSettings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    appName: 'Banking System',
    adminEmail: 'admin@banking.com',
    maintenanceMode: false,
    enableNotifications: true,
    enableTwoFactor: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    currency: 'INR',
  });

  const [message, setMessage] = useState('');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleResetPassword = () => {
    setMessage('Password reset link sent to email!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-settings">
      <h2>System Settings</h2>

      {message && (
        <div className="success-message">
          <Check size={18} />
          {message}
        </div>
      )}

      <div className="settings-container">
        {/* General Settings */}
        <div className="settings-section">
          <h3><Globe size={20} className="section-icon" /> General Settings</h3>

          <div className="setting-item">
            <label>Application Name</label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => handleSettingChange('appName', e.target.value)}
              placeholder="Enter app name"
            />
          </div>

          <div className="setting-item">
            <label>Admin Email</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
              placeholder="Enter admin email"
            />
          </div>

          <div className="setting-item">
            <label>Currency</label>
            <select value={settings.currency} onChange={(e) => handleSettingChange('currency', e.target.value)}>
              <option>INR</option>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Timezone</label>
            <select>
              <option>Asia/Kolkata (GMT+5:30)</option>
              <option>UTC (GMT+0:00)</option>
              <option>America/New_York (GMT-5:00)</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Language</label>
            <select>
              <option>English (US)</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-section">
          <h3><Shield size={20} className="section-icon" /> Security Settings</h3>

          <div className="setting-item toggle">
            <div className="toggle-info">
              <label>Maintenance Mode</label>
              <p>Enable maintenance mode to temporarily disable user access</p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              className="toggle-input"
            />
          </div>

          <div className="setting-item toggle">
            <div className="toggle-info">
              <label>Enable Notifications</label>
              <p>Send email notifications to users for important events</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
              className="toggle-input"
            />
          </div>

          <div className="setting-item toggle">
            <div className="toggle-info">
              <label>Enable Two-Factor Authentication</label>
              <p>Require 2FA for all user accounts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableTwoFactor}
              onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
              className="toggle-input"
            />
          </div>

          <div className="setting-item">
            <label>Max Login Attempts</label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
              min="1"
              max="20"
            />
          </div>

          <div className="setting-item">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              min="5"
              max="1440"
            />
          </div>
        </div>

        {/* Account Management */}
        <div className="settings-section">
          <h3><User size={20} className="section-icon" /> Account Management</h3>

          <button className="btn-reset-password" onClick={handleResetPassword}>
            <Lock size={16} style={{ marginRight: 8 }} />
            Reset Admin Password
          </button>

          <div className="setting-item">
            <label>Current Session</label>
            <div className="session-info">
              <p>Last login: 2024-11-13 at 10:30 AM</p>
              <p>IP Address: 192.168.1.100</p>
              <p>Device: MacBook Pro</p>
            </div>
          </div>
        </div>


      </div>

      <div className="settings-footer">
        <button className="btn-cancel">Discard Changes</button>
        <button className="btn-save" onClick={handleSaveSettings}>
          <Save size={18} style={{ marginRight: 8 }} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
