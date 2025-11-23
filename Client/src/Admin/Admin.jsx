import React, { useState } from 'react';
import './Admin.css';
import profile_img from '/src/assets/profile.svg';
import dashboard from '/src/assets/icons/dashboard.svg';
import users from '/src/assets/icons/wallet.svg';
import transactions from '/src/assets/icons/card.svg';
import settings from '/src/assets/icons/settings.svg';
import reports from '/src/assets/icons/loans.svg';
import analytics from '/src/assets/icons/offers.svg';
import { useNavigate } from 'react-router-dom';
import { clearCurrentUser } from '../Components/Auth/userStore';
import UserManagement from './components/UserManagement.jsx';
import TransactionManagement from './components/TransactionManagement.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminSettings from './components/AdminSettings.jsx';
import Reports from './components/Reports.jsx';
import Analytics from './components/Analytics.jsx';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/login');
  };

  const adminTabs = [
    { name: "Dashboard", icon: dashboard },
    { name: "Users", icon: users },
    { name: "Transactions", icon: transactions },
    { name: "Reports", icon: reports },
    { name: "Analytics", icon: analytics },
    { name: "Settings", icon: settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Users':
        return <UserManagement />;
      case 'Transactions':
        return <TransactionManagement />;
      case 'Reports':
        return <Reports />;
      case 'Analytics':
        return <Analytics />;
      case 'Settings':
        return <AdminSettings />;
      case 'Dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className='admin-container'>
      <div className="admin-sidebar">
        <div className="admin-profile">
          <img src={profile_img} alt="Admin Profile" />
          <div className="admin-user-details">
            <p>Admin User</p>
            <p>Administrator</p>
          </div>
        </div>
        <div className="admin-tabs">
          <p className="admin-section-title">Management</p>
          {adminTabs.map((tab) => (
            <div 
              key={tab.name}
              className={`admin-tab ${activeTab === tab.name ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <img src={tab.icon} alt={tab.name} />
              <p>{tab.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-main-content">
        <div className="admin-top-bar">
          <div className="admin-bar-content">
            <h2>{activeTab}</h2>
            <div className="admin-actions">
              <div className="admin-theme">
                <p>Change Themes</p>
              </div>
              <div className="admin-logout">
                <p 
                  role="button" 
                  tabIndex={0} 
                  onClick={handleLogout} 
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogout(); }}
                >
                  Log Out
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
