import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearCurrentUser } from '../Components/Auth/userStore';
import { Sun, Moon } from 'lucide-react';
import './Dashboard.css';
import profile_img from '/src/assets/profile.svg';
import dashboard from '/src/assets/icons/dashboard.svg';
import wallet from '/src/assets/icons/wallet.svg';
import card from '/src/assets/icons/card.svg';
import loans from '/src/assets/icons/loans.svg';
import offers from '/src/assets/icons/offers.svg';
import ticket from '/src/assets/icons/ticket.svg';
import settings from '/src/assets/icons/settings.svg';
import Payments from './Payments/Payments.jsx';
import { LoansSection } from './LoansSection/LoansSection.jsx';
import { OffersSection } from './OffersSection/OffersSection.jsx';
import Transactions from './Transactions/Transactions.jsx';
import CardsPage from './CardsPage/CardsPage.jsx';
import Settings from './Settings/Settings.jsx';
import SupportTickets from './SupportTicket/SupportTicket.jsx';
// Auth-free mode: no userStore for now

export const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || "Dashboard";
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth-free mode: don't redirect; dashboard is publicly accessible for now

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/login');
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  let essentialsTabs = [
    { name: "Dashboard", icon: dashboard },
    { name: "Cards", icon: card },
    { name: "Transactions", icon: wallet },
    { name: "Loans & Investments", icon: loans },
    { name: "Pre-Approved Offers", icon: offers },
  ];

  let operationalsTabs = [
    { name: "Support Tickets", icon: ticket },
    { name: "Settings", icon: settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Loans & Investments':
        return <LoansSection />;
      case 'Pre-Approved Offers':
        return <OffersSection />;
      case 'Dashboard':
        return <Payments setActiveTab={setActiveTab} />;
      case 'Transactions':
        return <Transactions />;
      case 'Cards':
        return <CardsPage />;
      case 'Settings':
        return <Settings />
      case "Support Tickets":
        return <SupportTickets />
      default:
        return <div style={{ padding: '2rem' }}>{activeTab} content will be shown here.</div>;
    }
  };

  return (
    <div className='dashboard'>
      <div className="side-bar">
        <div className="profile">
          <img src={profile_img} alt="" />
          <div className="user-details">
            <p>{localStorage.getItem('fullname') || 'User'}</p>
            <p>{localStorage.getItem('accountNumber') || 'Account number'}</p>
          </div>
        </div>
        <div className="essentials-tabs">
          <p>Essentials</p>
          {essentialsTabs.map((tab) => (
            <div
              key={tab.name}
              className={`tab ${activeTab === tab.name ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <img src={tab.icon} alt="" />
              <p>{tab.name}</p>
            </div>
          ))}
        </div>
        <div className="operationals-tabs">
          <p>Operationals</p>
          {operationalsTabs.map((tab) => (
            <div
              key={tab.name}
              className={`tab ${activeTab === tab.name ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <img src={tab.icon} alt="" />
              <p>{tab.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <div className="others">
            <div className="theme-toggle">
              <button
                className={`theme-btn light-mode ${theme === 'light' ? 'active' : ''}`}
                onClick={() => toggleTheme('light')}
              >
                <Sun size={18} strokeWidth={2.5} />
                <span>Light</span>
              </button>
              <button
                className={`theme-btn dark-mode ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => toggleTheme('dark')}
              >
                <Moon size={18} strokeWidth={2.5} />
                <span>Dark</span>
              </button>
            </div>
            <div className="log-out">
              <p role="button" tabIndex={0} onClick={handleLogout} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogout(); }}>Log Out</p>
            </div>
          </div>
        </div>
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

