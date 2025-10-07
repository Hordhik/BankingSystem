import React from 'react';
// Corrected import paths with file extensions for clarity
import { Header } from './Header/Header.jsx';
import { CardsSection } from './CardsSection/CardsSection.jsx';
import { FlowchartSection } from './FlowchartSection/FlowchartSection';
import './Landingpage.css';

export const Landingpage = () => {
  return (
    <div className="landing-page">
      <Header isLoggedIn={false} />
        
      <div className="hero-content">
        <h1>Your Money, Your Control — Anytime, Anywhere</h1>
        <h2>Digital-first banking with bank-grade security and 24/7 support</h2>
        <div className="button-container">
          <button>Open Your Account</button>
          <button>Explore Features</button>
        </div>
      </div>
      
      <CardsSection />

      <FlowchartSection />

    </div>
  );
};
