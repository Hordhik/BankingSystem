import React, { useState, useEffect } from 'react';
import './CardsSection.css';

import horizonCardImg from '../../assets/images/horizon-card.png';
import elevateCardImg from '../../assets/images/elevate-card.png';
import zenithCardImg from '../../assets/images/zenith-card.png';
import swiftCardImg from '../../assets/images/swift-card.png';
import shieldCardImg from '../../assets/images/shield-card.png';
import neoCardImg from '../../assets/images/neo-card.png';

const TravelIcon = () => (
  <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const ShoppingIcon = () => (
  <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);
const ShieldIcon = () => (
  <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const GiftIcon = () => (
  <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
);

const iconMap = {
  travel: TravelIcon,
  shopping: ShoppingIcon,
  shield: ShieldIcon,
  gift: GiftIcon,
};


export const CardsSection = () => {
  const [activeTab, setActiveTab] = useState('credit');

  const debitCardsData= [
    {
      id: 1,
      name: 'Swift Debit',
      image: swiftCardImg,
      tagline: 'Turn everyday spends into everyday rewards.',
      benefits: [
        { text: 'High reward points on travel and dining.', icon: 'travel' },
        { text: 'Complimentary airport lounge access.', icon: 'gift' },
        { text: 'Low foreign transaction fees.', icon: 'shopping' },
      ],
    },
    {
      id: 2,
      name: 'Shield Debit',
      image: shieldCardImg,
      tagline: 'Go further, earn more – every trip, every meal.',
      benefits: [
        { text: 'Generous cashback on online purchases.', icon: 'shopping' },
        { text: 'Easy EMI conversion on big spends.', icon: 'gift' },
        { text: 'Bonus rewards for hitting monthly targets.', icon: 'gift' },
      ],
    },
    {
      id: 3,
      name: 'Neo Debit',
      image: neoCardImg,
      tagline: 'Where luxury meets limitless rewards.',
      benefits: [
        { text: 'Premium insurance and purchase protection.', icon: 'shield' },
        { text: '24/7 concierge services for bookings.', icon: 'travel' },
        { text: 'Accelerated points on luxury categories.', icon: 'shopping' },
      ],
    },
  ];
  const creditCardsData = [
    {
      id: 1,
      name: 'Horizon Credit',
      image: horizonCardImg,
      tagline: 'Turn everyday spends into everyday rewards.',
      benefits: [
        { text: 'High reward points on travel and dining.', icon: 'travel' },
        { text: 'Complimentary airport lounge access.', icon: 'gift' },
        { text: 'Low foreign transaction fees.', icon: 'shopping' },
      ],
    },
    {
      id: 2,
      name: 'Elevate Credit',
      image: elevateCardImg,
      tagline: 'Go further, earn more – every trip, every meal.',
      benefits: [
        { text: 'Generous cashback on online purchases.', icon: 'shopping' },
        { text: 'Easy EMI conversion on big spends.', icon: 'gift' },
        { text: 'Bonus rewards for hitting monthly targets.', icon: 'gift' },
      ],
    },
    {
      id: 3,
      name: 'Zenith Credit',
      image: zenithCardImg,
      tagline: 'Where luxury meets limitless rewards.',
      benefits: [
        { text: 'Premium insurance and purchase protection.', icon: 'shield' },
        { text: '24/7 concierge services for bookings.', icon: 'travel' },
        { text: 'Accelerated points on luxury categories.', icon: 'shopping' },
      ],
    },
  ];
  const cardsData = activeTab === 'credit' ? creditCardsData : debitCardsData;
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(false);
    const t = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(t);
  }, [activeTab]);

  return (
    <section  className="cards-section">
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'credit' ? 'active' : ''}`}
          onClick={() => setActiveTab('credit')}
        >
          Credit
        </button>
        <button
          className={`tab-button ${activeTab === 'debit' ? 'active' : ''}`}
          onClick={() => setActiveTab('debit')}
        >
          Debit
        </button>
      </div>

  <div className={`cards-grid ${isAnimating ? 'animate' : 'no-animate'}`}>
        {cardsData.map((card) => (
          <div className="card" key={`${activeTab}-${card.id}`}>
            <img src={card.image} alt={`${card.name} card`} className="card-image" />
            <h3>{card.name}</h3> 
            <p className="card-tagline">{card.tagline}</p>
            <p className="benefits-title">
              <strong>Benefits:</strong>
            </p>
            <ul className="benefits-list">
              {card.benefits.map((benefit, index) => {
                const IconComponent = iconMap[benefit.icon];
                return (
                  <div key={index} className='benefit-item'>
                    <p>{IconComponent && <IconComponent />}</p>
                    <p>{benefit.text}</p>
                  </div>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

