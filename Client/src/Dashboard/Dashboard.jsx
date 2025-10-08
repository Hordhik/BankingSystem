import { useState } from 'react';
import './Dashboard.css';
import profile_img from '../assets/profile.svg';
import dashboard from '../assets/icons/dashboard.svg';
import wallet from '../assets/icons/wallet.svg';
import card from '../assets/icons/card.svg';
import loans from '../assets/icons/loans.svg';
import offers from '../assets/icons/offers.svg';
import ticket from '../assets/icons/ticket.svg';
import settings from '../assets/icons/settings.svg';
import Payments from './Payments/Payments';

export const Dashboard = () => {
  // State to manage active tabs for both groups
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
        <div className="content">
          <Payments/>
        </div>
      </div>
    </div>
  );
};