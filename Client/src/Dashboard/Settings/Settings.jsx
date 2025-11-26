import React, { useState, useEffect } from 'react';
import './Settings.css';
import {
    FiUser, FiLock, FiBell, FiEdit2, FiCheck, FiShield,
    FiSmartphone, FiMail, FiMoon, FiSun, FiEye, FiEyeOff,
    FiHelpCircle, FiMessageCircle, FiChevronRight, FiLogOut, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUser, changePassword } from '../../services/bankApi';

// --- Toast Component ---
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 20 }}
        className={`toast ${type}`}
    >
        <div className="toast-content">
            {type === 'success' ? <FiCheck size={18} /> : <FiShield size={18} />}
            <span>{message}</span>
        </div>
        <button onClick={onClose} className="toast-close"><FiX /></button>
    </motion.div>
);

// --- Personal Info Tab ---
const PersonalInfoTab = ({ showToast }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', username: '', accountNumber: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fullname = localStorage.getItem('fullname') || '';
        const [first, ...last] = fullname.split(' ');
        setFormData({
            firstName: first || '',
            lastName: last.join(' ') || '',
            email: localStorage.getItem('email') || '',
            username: localStorage.getItem('username') || '',
            accountNumber: localStorage.getItem('accountNumber') || ''
        });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const fullname = `${formData.firstName} ${formData.lastName}`.trim();
            const response = await updateUser(userId, {
                fullname, email: formData.email, username: formData.username
            });

            if (response?.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('fullname', response.fullname);
                localStorage.setItem('email', response.email);
                localStorage.setItem('username', response.username);
            } else {
                localStorage.setItem('fullname', fullname);
                localStorage.setItem('email', formData.email);
                localStorage.setItem('username', formData.username);
            }
            showToast('Profile updated successfully', 'success');
        } catch (error) {
            showToast('Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="settings-tab-content"
        >
            <div className="profile-header-card">
                <div className="profile-avatar-container">
                    <img
                        src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=0f172a&color=fff&size=128`}
                        alt="Profile"
                        className="profile-avatar"
                    />
                    <button className="avatar-edit-btn"><FiEdit2 size={14} /></button>
                </div>
                <div className="profile-info">
                    <h3>{formData.firstName} {formData.lastName}</h3>
                    <span className="badge premium">Premium Member</span>
                </div>
            </div>

            <div className="form-grid">
                <div className="input-group">
                    <label>First Name</label>
                    <div className="input-wrapper">
                        <FiUser className="input-icon" />
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label>Last Name</label>
                    <div className="input-wrapper">
                        <FiUser className="input-icon" />
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                        <FiMail className="input-icon" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label>Username</label>
                    <div className="input-wrapper">
                        <FiUser className="input-icon" />
                        <input
                            type="text"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                </div>
                <div className="input-group full-width">
                    <label>Account Number</label>
                    <div className="input-wrapper disabled">
                        <FiShield className="input-icon" />
                        <input type="text" value={formData.accountNumber} readOnly disabled />
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button className="btn-primary" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </motion.div>
    );
};

// --- Security Tab ---
const SecurityTab = ({ showToast }) => {
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);

    const toggleShow = (field) => setShowPass(prev => ({ ...prev, [field]: !prev[field] }));

    const handleUpdate = async () => {
        if (passData.new !== passData.confirm) return showToast('Passwords do not match', 'error');
        setLoading(true);
        try {
            await changePassword(localStorage.getItem('userId'), {
                currentPassword: passData.current,
                newPassword: passData.new,
                confirmPassword: passData.confirm
            });
            showToast('Password updated successfully', 'success');
            setPassData({ current: '', new: '', confirm: '' });
        } catch (err) {
            showToast(err.message || 'Failed to update password', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="settings-tab-content"
        >
            <div className="section-header">
                <h3>Change Password</h3>
                <p>Ensure your account is using a long, random password to stay secure.</p>
            </div>

            <div className="form-grid">
                <div className="input-group">
                    <label>Current Password</label>
                    <div className="input-wrapper">
                        <FiLock className="input-icon" />
                        <input
                            type={showPass.current ? "text" : "password"}
                            value={passData.current}
                            onChange={e => setPassData({ ...passData, current: e.target.value })}
                            placeholder="••••••••"
                        />
                        <button className="pass-toggle" onClick={() => toggleShow('current')}>
                            {showPass.current ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>
                <div className="input-group">
                    <label>Last Active</label>
                    <div className="input-wrapper disabled">
                        <FiSmartphone className="input-icon" />
                        <input type="text" value="MacBook Pro • Just now" readOnly disabled />
                    </div>
                </div>
                <div className="input-group">
                    <label>New Password</label>
                    <div className="input-wrapper">
                        <FiLock className="input-icon" />
                        <input
                            type={showPass.new ? "text" : "password"}
                            value={passData.new}
                            onChange={e => setPassData({ ...passData, new: e.target.value })}
                            placeholder="••••••••"
                        />
                        <button className="pass-toggle" onClick={() => toggleShow('new')}>
                            {showPass.new ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>
                <div className="input-group">
                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                        <FiLock className="input-icon" />
                        <input
                            type={showPass.confirm ? "text" : "password"}
                            value={passData.confirm}
                            onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                            placeholder="••••••••"
                        />
                        <button className="pass-toggle" onClick={() => toggleShow('confirm')}>
                            {showPass.confirm ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </div>

            <div className="divider" />

            <div className="section-header">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account.</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon"><FiSmartphone /></div>
                <div className="feature-info">
                    <h4>Authenticator App</h4>
                    <p>Use an authenticator app to generate one time security codes.</p>
                </div>
                <button className="btn-outline">Setup</button>
            </div>
        </motion.div>
    );
};

// --- Notifications Tab ---
const NotificationsTab = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="settings-tab-content"
    >
        <div className="section-header">
            <h3>Notification Preferences</h3>
            <p>Choose how you want to be notified about activity.</p>
        </div>

        <div className="toggles-list">
            <div className="toggle-row">
                <div className="toggle-info">
                    <h4>Push Notifications</h4>
                    <p>Receive push notifications on your devices.</p>
                </div>
                <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="toggle-row">
                <div className="toggle-info">
                    <h4>Email Alerts</h4>
                    <p>Receive email updates about your account activity.</p>
                </div>
                <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="toggle-row">
                <div className="toggle-info">
                    <h4>Promotional Offers</h4>
                    <p>Receive emails about new products and features.</p>
                </div>
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    </motion.div>
);

// --- Help Tab ---
const HelpTab = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="settings-tab-content"
    >
        <div className="section-header">
            <h3>Help & Support</h3>
            <p>Get assistance with your account or transactions.</p>
        </div>

        <div className="toggles-list">
            <button className="toggle-row" style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                <div className="feature-icon" style={{ width: '40px', height: '40px', fontSize: '20px' }}><FiHelpCircle /></div>
                <div className="toggle-info" style={{ flex: 1, marginLeft: '16px' }}>
                    <h4>FAQs</h4>
                    <p>Answers to commonly asked questions.</p>
                </div>
                <FiChevronRight />
            </button>

            <button className="toggle-row" style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                <div className="feature-icon" style={{ width: '40px', height: '40px', fontSize: '20px' }}><FiMessageCircle /></div>
                <div className="toggle-info" style={{ flex: 1, marginLeft: '16px' }}>
                    <h4>Contact Support</h4>
                    <p>Chat with our support team.</p>
                </div>
                <FiChevronRight />
            </button>
        </div>
    </motion.div>
);

// --- Main Settings Component ---
const Settings = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: FiUser },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'help', label: 'Help', icon: FiHelpCircle },
    ];

    return (
        <div className="account-settings-container">
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            <div className="settings-header">
                <h1>Account Settings</h1>
                <p>Manage your profile details and security settings.</p>
            </div>

            <div className="settings-layout">
                {/* Top Navigation Bar */}
                <div className="settings-top-nav">
                    <nav className="settings-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon className="nav-icon" />
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="active-indicator"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="settings-content">
                    <AnimatePresence mode="wait">
                        {activeTab === 'personal' && <PersonalInfoTab key="personal" showToast={showToast} />}
                        {activeTab === 'security' && <SecurityTab key="security" showToast={showToast} />}
                        {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
                        {activeTab === 'help' && <HelpTab key="help" />}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Settings;
