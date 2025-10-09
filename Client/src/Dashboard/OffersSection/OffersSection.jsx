import React from 'react';
import './OffersSection.css';

// A comprehensive icon library for all offer types
const IconLibrary = {
  // Pre-approved offer icons
  loan: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  card: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
  investment: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>,
  
  // Exclusive partner offer icons
  travel: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  dining: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M17 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/></svg>,
  shopping: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  cart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  fuel: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  wellness: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 015 5c0 5-5 7.5-5 7.5S7 12 7 7a5 5 0 015-5z"/><path d="M12 22s5-4 5-9H7c0 5 5 9 5 9z"/></svg>,
  entertainment: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>,
  utility: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v5M10 7h4"/><path d="M12 11a5 5 0 01-5 5H6a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-1-1h-1a5 5 0 01-5-5z"/></svg>,
};

export const OffersSection = () => {
  // Data for the detailed, pre-approved offers
  const preApprovedOffers = [
    { icon: 'loan', title: 'Pre-Approved Personal Loan', description: 'Get up to ₹5,00,000 instantly with zero paperwork and flexible tenure options.' },
    { icon: 'card', title: 'Upgrade to Zenith Credit Card', description: 'You are eligible for a complimentary upgrade to our premium Zenith card with enhanced rewards.' },
    { icon: 'investment', title: 'Special Rate Fixed Deposit', description: 'Enjoy a special interest rate of 7.5% p.a. on fixed deposits for a limited time.' },
  ];

  // Data for the grid of exclusive partner offers
  const exclusiveOffers = [
    { icon: 'travel', title: 'Travel Boost', description: 'Earn 5x points on all flight bookings.' },
    { icon: 'dining', title: 'Dining Delights', description: '20% off at partner restaurants.' },
    { icon: 'shopping', title: 'Shopping Perks', description: '20% off at partner restatronics.' },
    { icon: 'cart', title: 'Shopping Spree', description: 'Flat ₹500 cashback on electronics.' },
    { icon: 'fuel', title: 'Fuel Savings', description: 'Track ₹300 back on monthly groceries.' },
    { icon: 'wellness', title: 'Wellness Perks', description: 'Discounts on gym memberships.' },
  ];

  return (
    <div className="offers-page-container">
      {/* --- Pre-Approved Offers Section --- */}
      <section className="pre-approved-section">
        <h2 className="section-title">Pre-Approved For You</h2>
        <p className="section-subtitle">
          We’ve curated these exclusive offers based on your profile.
        </p>
        <div className="pre-approved-grid">
          {preApprovedOffers.map((offer, index) => {
            const Icon = IconLibrary[offer.icon];
            return (
              <div className="pre-approved-card" key={index}>
                <div className="pre-approved-icon-wrapper"><Icon /></div>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <div className="pre-approved-actions">
                  <button className="details-button">View Details</button>
                  <button className="avail-button">Avail Now</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- Exclusive Partner Offers Section --- */}
      <section className="exclusive-offers-section">
        <h2 className="section-title">Exclusive Partner Offers</h2>
        <div className="exclusive-offers-grid">
          {exclusiveOffers.map((offer, index) => {
            const Icon = IconLibrary[offer.icon];
            return (
              <div className="exclusive-offer-card" key={index}>
                <div className="exclusive-icon-wrapper"><Icon /></div>
                <div className="exclusive-offer-details">
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="view-all-offers-btn">View All Offers</button>
      </section>
    </div>
  );
};

