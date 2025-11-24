import React, { useState } from 'react';
import './Admin.css';
import profile_img from '/src/assets/profile.svg';
import { LayoutDashboard, Users, CreditCard, FileText, BarChart2, Settings, LogOut, Palette } from 'lucide-react';
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

  // Check for admin token on mount
  React.useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const adminTabs = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Transactions", icon: CreditCard },
    { name: "Reports", icon: FileText },
    { name: "Analytics", icon: BarChart2 },
    { name: "Settings", icon: Settings },
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
              <tab.icon size={20} />
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
                <Palette size={18} style={{ marginRight: '8px' }} />
                <p>Change Themes</p>
              </div>
              <div className="admin-logout" onClick={handleLogout}>
                <LogOut size={18} style={{ marginRight: '8px' }} />
                <p>Log Out</p>
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
