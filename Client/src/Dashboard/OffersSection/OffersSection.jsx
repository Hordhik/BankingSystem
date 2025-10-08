import React from 'react';
import '/src/Dashboard/OffersSection/OffersSection.css';

// Icon library for different offer types
const IconLibrary = {
  loan: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
  ),
  card: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
  ),
  investment: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
  ),
};

export const OffersSection = () => {
  // An array to hold the data for each offer card
  const offersData = [
    {
      icon: 'loan',
      title: 'Pre-Approved Personal Loan',
      description: 'Get up to ₹5,00,000 instantly with zero paperwork and flexible tenure options. Ready for you, anytime.',
    },
    {
      icon: 'card',
      title: 'Upgrade to Zenith Credit Card',
      description: 'You are eligible for a complimentary upgrade to our premium Zenith card with enhanced rewards.',
    },
    {
      icon: 'investment',
      title: 'Special Rate Fixed Deposit',
      description: 'Enjoy a special interest rate of 7.5% p.a. on fixed deposits for a limited time. Lock in your savings today.',
    },
  ];

  return (
    <section className="offers-section-dashboard">
      <h2 className="offers-title-dashboard">Just for You</h2>
      <p className="offers-subtitle-dashboard">
        We’ve curated these exclusive pre-approved offers based on your profile.
      </p>
      <div className="offers-grid-dashboard">
        {offersData.map((offer, index) => {
          const Icon = IconLibrary[offer.icon];
          return (
            <div className="offer-card-dashboard" key={index}>
              <div className="offer-icon-wrapper-dashboard">
                <Icon />
              </div>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <div className="offer-actions-dashboard">
                <button className="offer-details-button">View Details</button>
                <button className="offer-avail-button">Avail Now</button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

