import { useState } from 'react';
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
import TransfersPayments from './TransfersPayments/TransfersPayments.jsx';

export const Dashboard = () => {
  // State to manage active tabs
  const [activeTab, setActiveTab] = useState("Dashboard");

  let essentialsTabs = [
    { name: "Dashboard", icon: dashboard },
    { name: "Transfers & Payments", icon: wallet },
    { name: "Cards", icon: card },
    { name: "Loans", icon: loans },
    { name: "Pre-Approved Offers", icon: offers },
  ];

  let operationalsTabs = [
    { name: "Support Tickets", icon: ticket },
    { name: "Settings", icon: settings },
  ];

  // Helper function to render the correct content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Payments/>;
      case 'Transfers & Payments':
        return <TransfersPayments/>;
      // You can add cases for other tabs here as you build them
      // For example: case 'Cards': return <CardsComponent />;
      default:
        // A placeholder for tabs that don't have a component yet
        return <div style={{ padding: '2rem' }}>{activeTab} content will be shown here.</div>;
    }
  };

  return (
    <div className='dashboard'>
      <div className="side-bar">
        <div className="profile">
          <img src={profile_img} alt="" />
          <p>preethi.real@fluit</p>
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
              <p>Log Out</p>
            </div>
          </div>
        </div>
        {/* The content will now change based on the selected tab */}
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};