import React, { useState } from 'react';
import './Admin.css';
import profile_img from '/src/assets/profile.svg';
import { LayoutDashboard, Users, CreditCard, FileText, BarChart2, Settings, LogOut, Palette } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import UserManagement from './components/UserManagement/UserManagement.jsx';
import TransactionManagement from './components/TransactionManagement/TransactionManagement.jsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';
import Loans from './components/Loans/Loans.jsx';
import AdminSettings from './components/AdminSettings/AdminSettings.jsx';
import Reports from './components/Reports/Reports.jsx';
import Analytics from './components/Analytics/Analytics.jsx';
import CardRequests from './components/CardRequests/CardRequests.jsx';
import loan from '../assets/icons/loan.png';

export const Admin = () => {
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState(tab || "Dashboard");
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
    { name: "Dashboard", icon: LayoutDashboard, isImage: false },
    { name: "Users", icon: Users, isImage: false },
    { name: "Transactions", icon: CreditCard, isImage: false },
    { name: "Card Requests", icon: CreditCard, isImage: false }, // Reusing CreditCard icon
    { name: "Loans", icon: loan, isImage: true },
    { name: "Reports", icon: FileText, isImage: false },
    { name: "Analytics", icon: BarChart2, isImage: false },
    { name: "Settings", icon: Settings, isImage: false },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Users':
        return <UserManagement />;
      case 'Transactions':
        return <TransactionManagement />;
      case 'Card Requests':
        return <CardRequests />;
      case 'Reports':
        return <Reports />;
      case 'Analytics':
        return <Analytics />;
      case 'Settings':
        return <AdminSettings />;
      case 'Loans':
        return <Loans />;
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
              onClick={() => {
                setActiveTab(tab.name);
                navigate(`/admin/${tab.name.toLowerCase()}`);
              }}
            >
              {tab.isImage ? (
                <img src={tab.icon} alt={tab.name} />
              ) : (
                <tab.icon size={20} strokeWidth={1.5} />
              )}
              <p>{tab.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-main-content">
        <div className="admin-top-bar">
          <div className="admin-bar-content">
            <div className="admin-actions">
              <div className="admin-theme">
                {/* Placeholder for theme toggle if needed, or just keep logout for now as per design */}
              </div>
              <div className="admin-logout" onClick={handleLogout}>
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
