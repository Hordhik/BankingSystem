import React from 'react';
import '/src/Dashboard/PortfolioSection/PortfolioSection.css';

export const PortfolioSection = () => {
  // Sample data for the user's portfolio
  const portfolioData = [
    {
      product: 'Personal Loan',
      amount: '₹5,00,000',
      status: 'Active',
      next_action: 'EMI due on 15th Nov',
      type: 'loan',
    },
    {
      product: 'Equity Mutual Fund',
      amount: '₹1,25,000',
      status: 'Growing',
      next_action: 'Next SIP on 20th Nov',
      type: 'investment',
    },
    {
      product: 'Fixed Deposit',
      amount: '₹2,00,000',
      status: 'Maturing',
      next_action: 'Matures on 1st Jan 2026',
      type: 'investment',
    },
  ];

  return (
    <div className="portfolio-section-dashboard">
      <h3 className="portfolio-title-dashboard">My Portfolio</h3>
      <div className="portfolio-table-container">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Amount / Value</th>
              <th>Status</th>
              <th>Next Payment / Maturity</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.map((item, index) => (
              <tr key={index}>
                <td>{item.product}</td>
                <td>{item.amount}</td>
                <td>
                  <span className={`status-pill status-${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.next_action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

