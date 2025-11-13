import React, { useState } from 'react';
import '/src/Dashboard/LoansSection/LoansSection.css';
import { PortfolioSection } from '../PortfolioSection/PortfolioSection.jsx';

const IconLibrary = {
  personal: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
  ),
  home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  car: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.5 19.5 12 14 7.5"/><path d="M4 12h15.5"/><circle cx="5" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="m3 19-1.5-3.6a1 1 0 0 1 .8-1.4h15.4a1 1 0 0 1 .8 1.4L19 19"/></svg>
  ),
  mutualFunds: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  stocks: () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
  ),
  deposits: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
  ),
};

export const LoansSection = () => {
  const [activeView, setActiveView] = useState('loans');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '', tenure: '' });
  const [submitted, setSubmitted] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]); // 👈 added

  const loansData = [
    { icon: 'personal', title: 'Personal Loan', description: 'Instant funds for any personal need, from weddings to emergencies.' },
    { icon: 'home', title: 'Home Loan', description: 'Competitive interest rates and an easy application process for your dream home.' },
    { icon: 'car', title: 'Car Loan', description: 'Fast and affordable financing solutions for new and used vehicles.' },
  ];

  const investmentsData = [
    { icon: 'mutualFunds', title: 'Mutual Funds', description: 'Diversify your portfolio with our curated list of top-performing funds.' },
    { icon: 'stocks', title: 'Stock Market', description: 'Invest directly in the stock market with our easy-to-use trading platform.' },
    { icon: 'deposits', title: 'Fixed Deposits', description: 'Secure your savings and enjoy guaranteed returns with our high-interest FDs.' },
  ];

  const handleApply = (loan) => {
    setSelectedLoan(loan);
    setShowForm(true);
    setSubmitted(false);
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Add this loan to portfolio
    const newItem = {
      productName: selectedLoan.title,
      amount: formData.amount,
      status: 'In Verification',
      nextPayment: '----',
    };
    setPortfolioItems(prev => [...prev, newItem]);

    // Reset form after success
    setTimeout(() => {
      setShowForm(false);
      setFormData({ name: '', amount: '', tenure: '' });
    }, 2500);
  };

  return (
    <section className="loans-section-dashboard">
      <h2 className="loans-title-dashboard">Loans & Investments</h2>
      <p className="loans-subtitle-dashboard">
        Explore products to help you borrow smarter and grow your wealth.
      </p>

      {/* Tabs */}
      <div className="product-tabs-container">
        <button
          className={`product-tab ${activeView === 'loans' ? 'active' : ''}`}
          onClick={() => setActiveView('loans')}
        >
          Loans
        </button>
        <button
          className={`product-tab ${activeView === 'investments' ? 'active' : ''}`}
          onClick={() => setActiveView('investments')}
        >
          Investments
        </button>
      </div>

      {/* Loans or Investments Grid */}
      {activeView === 'loans' ? (
        <div className="loans-grid-dashboard">
          {loansData.map((loan, index) => {
            const Icon = IconLibrary[loan.icon];
            return (
              <div className="loan-card-dashboard" key={index}>
                <div className="loan-icon-wrapper-dashboard"><Icon /></div>
                <h3>{loan.title}</h3>
                <p>{loan.description}</p>
                <button 
                  className="loan-apply-button-dashboard" 
                  onClick={() => handleApply(loan)}
                >
                  Apply Loan
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="loans-grid-dashboard">
          {investmentsData.map((investment, index) => {
            const Icon = IconLibrary[investment.icon];
            return (
              <div className="loan-card-dashboard" key={index}>
                <div className="loan-icon-wrapper-dashboard"><Icon /></div>
                <h3>{investment.title}</h3>
                <p>{investment.description}</p>
                <button className="loan-apply-button-dashboard">Start Investing</button>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Pass portfolio items */}
      <PortfolioSection portfolioItems={portfolioItems} />

      {/* Modal */}
      {showForm && (
        <div className="loan-modal-overlay">
          <div className="loan-modal">
            {!submitted ? (
              <>
                <h3>Apply for {selectedLoan?.title}</h3>
                <form onSubmit={handleSubmit} className="loan-form">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Loan Amount (₹)"
                    value={formData.amount}
                    onChange={handleFormChange}
                    required
                  />
                  <input
                    type="number"
                    name="tenure"
                    placeholder="Tenure (in months)"
                    value={formData.tenure}
                    onChange={handleFormChange}
                    required
                  />
                  <button type="submit" className="loan-submit-btn">Submit</button>
                  <button type="button" className="loan-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
              </>
            ) : (
              <div className="loan-success-message">
                <h4>Application Submitted!</h4>
                <p>Your {selectedLoan?.title} is under verification.<br/>
                   You’ll be notified via email and SMS once it’s reviewed.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
