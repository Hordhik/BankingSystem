import React from 'react';
import { Header } from './Header/Header.jsx';
import { CardsSection } from './CardsSection/CardsSection.jsx';
import { FlowchartSection } from './FlowchartSection/FlowchartSection';
import { FeaturesSection } from './FeaturesSection/FeaturesSection';
import { LoansSection } from './LoansSection/LoansSection.jsx';
import { OffersSection } from './OffersSection/offersSection.jsx';
import './Landingpage.css';
import { FileX } from 'lucide-react';

export const Landingpage = () => {
  return (
    <div className="landing-page">
      <Header/>

      <div id="accounts" className="hero-content">
        <h1>Your Money, Your Control — Anytime, Anywhere</h1>
        <h2>Digital-first banking with bank-grade security and 24/7 support</h2>
        <div className="button-container">
          <button>Open Your Account</button>
          <button>Explore Features</button>
        </div>
      </div>

      <div id="credit-card">
        <CardsSection />
      </div>

      <div id="features" style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'100px', padding:'4rem 0'}}>
        <FlowchartSection />
        <FeaturesSection />
      </div>

      <div id="loans">
        <LoansSection />
      </div>

      <div id="offers">
        <OffersSection />
      </div>
    </div>
  );
};

export default Landingpage;
