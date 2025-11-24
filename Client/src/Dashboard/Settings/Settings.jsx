import React, { useState } from 'react';
import './Settings.css';
import { FiUser, FiLock, FiBell, FiEdit2 } from 'react-icons/fi';
import { updateUser } from '../../services/bankApi';

const PersonalInfoTab = () => {
    const [formData, setFormData] = useState({
        firstName: localStorage.getItem('fullname')?.split(' ')[0] || '',
        lastName: localStorage.getItem('fullname')?.split(' ')[1] || '',
        email: localStorage.getItem('email') || '',
        username: localStorage.getItem('username') || '',
        accountNumber: localStorage.getItem('accountNumber') || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('User ID not found. Please login again.');
                return;
            }
            const fullname = `${formData.firstName} ${formData.lastName}`;
            const response = await updateUser(userId, {
                fullname,
                email: formData.email,
                username: formData.username
            });
            
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('fullname', response.fullname);
                localStorage.setItem('email', response.email);
                localStorage.setItem('username', response.username);
            } else {
                localStorage.setItem('fullname', fullname);
                localStorage.setItem('email', formData.email);
                localStorage.setItem('username', formData.username);
            }
            
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="settings-form-container">
        <div className="profile-picture-section">
            <div className="profile-picture-wrapper">
                <img 
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" 
                    alt="User profile" 
                    className="profile-picture"
                />
                <button className="edit-picture-button">
                    <FiEdit2 size={16} />
                </button>
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={formData.username} onChange={handleChange} />
        </div>

        <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input type="text" id="accountNumber" value={formData.accountNumber} readOnly disabled style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} />
        </div>
        
        <div className="form-actions">
            <button className="save-button" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
            </button>
        </div>
    </div>
    );
};


// --- PASSWORD & SECURITY TAB ---
const PasswordSecurityTab = () => (
    <div className="settings-form-container">
        <div className="form-section">
            <h3 className="section-title">Change password</h3>
            <div className="form-group">
                <label htmlFor="currentPassword">Current password</label>
                <input type="password" id="currentPassword" placeholder="••••••••" />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="newPassword">New password</label>
                    <input type="password" id="newPassword" placeholder="••••••••" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm new password</label>
                    <input type="password" id="confirmPassword" placeholder="••••••••" />
                </div>
            </div>
        </div>

        <div className="form-section">
            <h3 className="section-title">Two-factor authentication</h3>
            <p className="section-description">
                Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <button className="save-button secondary">Enable Two-Factor Authentication</button>
        </div>
        <div className="form-actions">
            <button className="save-button">Update Password</button>
        </div>
    </div>
);

const NotificationsTab = () => (
    <div className="settings-form-container">
        <div className="form-section">
            <h3 className="section-title">Email Notifications</h3>
            <div className="notification-row">
                <div>
                    <h4>Weekly Summaries</h4>
                    <p>Receive a summary of your account activity every week.</p>
                </div>
                <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                </label>
            </div>
            <div className="notification-row">
                <div>
                    <h4>Promotional Offers</h4>
                    <p>Get notified about new products, features, and special offers.</p>
                </div>
                <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                </label>
            </div>
             <div className="notification-row">
                <div>
                    <h4>Security Alerts</h4>
                    <p>Be notified about important security events on your account.</p>
                </div>
                <label className="toggle-switch">
                    <input type="checkbox" defaultChecked disabled />
                    <span className="slider"></span>
                </label>
            </div>
        </div>
        <div className="form-actions">
            <button className="save-button">Save Preferences</button>
        </div>
    </div>
);

const Settings = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const renderContent = () => {
        switch(activeTab) {
            case 'personal': return <PersonalInfoTab />;
            case 'password': return <PasswordSecurityTab />;
            case 'notifications': return <NotificationsTab />;
            default: return <PersonalInfoTab />;
        }
    };

    return (
        <div className="account-settings-container">
            <h1 className="main-title">Account Settings</h1>

            <div className="settings-navigation">
                <button 
                    className={`nav-button ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    <FiUser /> Personal info
                </button>
                <button 
                    className={`nav-button ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    <FiLock /> Password and security
                </button>
                <button 
                    className={`nav-button ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    <FiBell /> Notifications
                </button>
            </div>
            
            <div className="settings-content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default Settings;