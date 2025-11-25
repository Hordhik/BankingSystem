import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header/Header.jsx';
import { CardsSection } from './CardsSection/CardsSection.jsx';
import { FlowchartSection } from './FlowchartSection/FlowchartSection';
import { FeaturesSection } from './FeaturesSection/FeaturesSection';
import { LoansSection } from './LoansSection/LoansSection.jsx';
import { OffersSection } from './OffersSection/offersSection.jsx';
import './Landingpage.css';
import { FileX, CreditCard, Coins, ShieldCheck, Wallet, TrendingUp, Banknote, Landmark, ArrowRightLeft, PieChart } from 'lucide-react';

export const Landingpage = () => {
  const navigate = useNavigate();

  const handleOpenAccount = () => {
    navigate('/signup');
  };

  const handleExploreFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <Header />

      <div
        id="accounts"
        className="hero-content"
      >
        <div className="hero-background-animation">
          <div className="floating-item icon-container coin-1">
            <Coins size={48} strokeWidth={1.5} />
          </div>
          <div className="floating-item icon-container wallet-1">
            <Wallet size={48} strokeWidth={1.5} />
          </div>
          <div className="floating-item icon-container card-1">
            <CreditCard size={64} strokeWidth={1.5} />
          </div>
          <div className="floating-item icon-container graph-1">
            <TrendingUp size={48} strokeWidth={1.5} />
          </div>
          <div className="floating-item icon-container shield-1">
            <ShieldCheck size={56} strokeWidth={1.5} />
          </div>
          {/* New Icons */}
          <div className="floating-item icon-container cash-1">
            <Banknote size={52} strokeWidth={1.5} />
          </div>
          <div className="floating-item icon-container bank-1">
            <Landmark size={60} strokeWidth={1.5} />
          </div>
          <div className="floating-item icon-container transfer-1">
            <ArrowRightLeft size={40} strokeWidth={1.5} />
          </div>
          <div className="floating-item icon-container chart-1">
            <PieChart size={44} strokeWidth={1.5} />
          </div>
        </div>
        <h1>Your Money, Your Control Anytime, Anywhere</h1>
        <h2>Digital-first banking with bank-grade security and 24/7 support</h2>
        <div className="button-container">
          <button onClick={handleOpenAccount}>Open Your Account</button>
          <button onClick={handleExploreFeatures}>Explore Features</button>
        </div>
      </div>

      <div id="credit-card">
        <CardsSection />
      </div>

      <div id="features" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '100px', padding: '4rem 0' }}>
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
