import React, { useState } from 'react';
import './Settings.css';
import { FiUser, FiLock, FiBell, FiEdit2 } from 'react-icons/fi';

const PersonalInfoTab = () => (
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
                <input type="text" id="firstName" placeholder="firstName" />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input type="text" id="lastName" placeholder="lastName" />
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="email@gmail.com" />
        </div>

        <div className="form-group">
            <label htmlFor="phoneNumber">Phone number</label>
            <input type="tel" id="phoneNumber" placeholder="+91 " />
        </div>

        <div className="form-group">
            <label htmlFor="streetAddress">Street Address</label>
            <input type="text" id="streetAddress" placeholder="Address" />
        </div>
        
        <div className="form-row">
            <div className="form-group">
                <label htmlFor="zipCode">Pincode</label>
                <input type="text" id="Pincode" placeholder="Pincode"  />
            </div>
            <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" placeholder="City" />
            </div>
        </div>
        
        <div className="form-row">
             <div className="form-group">
                <label htmlFor="state">State</label>
                <input type="text" id="state" placeholder="State" />
            </div>
            <div className="form-group">
                <label htmlFor="country">Country</label>
                <input type="text" id="country" placeholder="Country" />
            </div>
        </div>

        <div className="form-actions">
            <button className="save-button">Save changes</button>
        </div>
    </div>
);


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