import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import TransfersPayments from './TransfersPayments/TransfersPayments.jsx';
import CardsPage from './CardsPage/CardsPage.jsx';
import Settings from './Settings/Settings.jsx';
import SupportTickets from './SupportTicket/SupportTicket.jsx';
import { clearCurrentUser, getCurrentUser } from '../Components/Auth/userStore';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  // if there is no current user, redirect to login
  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    try {
      clearCurrentUser();
    } catch (_) {
      // ignore storage errors
    }
    navigate('/login');
  };

  let essentialsTabs = [
    { name: "Dashboard", icon: dashboard },
    { name: "Transfers & Payments", icon: wallet },
    { name: "Cards", icon: card },
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
        return <Payments/>;
      case 'Transfers & Payments':
        return <TransfersPayments/>;
      case 'Cards':
        return <CardsPage />;
      case 'Settings':
        return <Settings/>
      case "Support Tickets":
        return <SupportTickets/>
      default:
        return <div style={{ padding: '2rem' }}>{activeTab} content will be shown here.</div>;
    }
  };

  return (
    <div className='dashboard'>
      <div className="side-bar">
        <div className="profile">
          <img src={profile_img} alt="" />
          <p>hordhik.manikant@fluit</p>
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
          <div className="kyc">
            <p>Complete KYC in 12 days</p>
          </div>
          <div className="others">
            <div className="theme">
              <p>Change Themes</p>
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

