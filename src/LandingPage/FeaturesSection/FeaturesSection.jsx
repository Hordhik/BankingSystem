// src/components/FeaturesSection/FeaturesSection.jsx

import React from 'react';
import './FeaturesSection.css';

export const FeaturesSection = () => {
  // An array to hold the data for each feature
  const featuresData = [
    {
      title: 'Instant Transfers',
      description: 'Send and receive money in seconds via UPI, NEFT, or IMPS.',
    },
    {
      title: 'Zero Hidden Fees',
      description: 'Transparent pricing — what you see is what you pay.',
    },
    {
      title: 'Bank-Grade Security',
      description: 'End-to-end encryption + fraud protection on every transaction.',
    },
    {
      title: 'Smart Insights',
      description: 'Track spending, budgets, and savings directly in your app.',
    },
    {
      title: 'Global Payments',
      description: 'Use your card anywhere, with the lowest foreign transaction fees.',
    },
    {
      title: '24/7 Support',
      description: 'Always-on chat + phone support when you need it.',
    },
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Features</h2>
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div className="feature-item" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

