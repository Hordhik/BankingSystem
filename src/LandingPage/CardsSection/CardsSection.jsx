// src/components/CardsSection/CardsSection.jsx

import React, { useState } from 'react';
import './CardsSection.css'; // We will create this file next

// Import the images (adjust the path to go up two levels)
import horizonCardImg from '../../assets/images/horizon-card.png';
import elevateCardImg from '../../assets/images/elevate-card.png';
import zenithCardImg from '../../assets/images/zenith-card.png';

export const CardsSection = () => {

  const [activeTab, setActiveTab] = useState('credit');

  const cardsData = [
    {
      id: 1,
      name: 'Horizon Credit',
      image: horizonCardImg,
      tagline: 'Turn everyday spends into everyday rewards.',
      benefits: [
        'High reward points on travel and dining.',
        'Airport lounge access.',
        'Low foreign transaction fees.',
      ],
    },
    {
      id: 2,
      name: 'Elevate Credit',
      image: elevateCardImg,
      tagline: 'Go further, earn more – very trip, every meal.',
      benefits: [
        'Cashback on online purchases.',
        'EMI conversion on big spends.',
        'Bonus rewards for hitting monthly spend targets.',
      ],
    },
    {
      id: 3,
      name: 'Zenith Credit',
      image: zenithCardImg,
      tagline: 'Where luxury meets limitless rewards.',
      benefits: [
        'Premium insurance cover (travel, purchase protection).',
        'Concierge services for bookings.',
        'Accelerated points on luxury categories.',
      ],
    },
  ];

  return (
    <section className="cards-section">
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

      <div className="cards-grid">
        {cardsData.map((card) => (
          <div className="card" key={card.id}>
            <img src={card.image} alt={`${card.name} card`} className="card-image" />
            <h3 className="card-name">{card.name}</h3>
            <p className="card-tagline">{card.tagline}</p>
            <p className="benefits-title">
              <strong>Benefits:</strong>
            </p>
            <ul className="benefits-list">
              {card.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};