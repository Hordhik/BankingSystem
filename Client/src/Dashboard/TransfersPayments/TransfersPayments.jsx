import React, { useState } from 'react';
import '/src/Dashboard/TransfersPayments/TransfersPayments.css';

// This is the SVG for the Visa logo
const VisaLogoSVG = () => (
  <svg className="card__vendor-logo" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="62" fill="transparent"/>
    <path d="M72.952 23.01H65.816L60.012 39.01C59.66 40.04 59.204 40.544 58.748 40.544C57.732 40.544 57.06 39.772 56.604 38.648L52.124 23.01H45.228L40.924 38.648C40.468 39.772 39.796 40.544 38.78 40.544C38.324 40.544 37.868 40.04 37.516 39.01L31.712 23.01H24.576L21.432 39.01C20.976 40.04 20.472 40.544 19.964 40.544C18.948 40.544 18.276 39.772 17.82 38.648L13.34 23.01H6.444L2.14 38.648C1.684 39.772 1.012 40.544 0 40.544C-0.456 40.544 -0.96 40.04 -1.416 39.01L-7.22 23.01H-14.356L-17.496 39.01C-17.952 40.04 -18.456 40.544 -18.96 40.544C-19.976 40.544 -20.648 39.772 -21.104 38.648L-25.584 23.01H-32.48L-36.784 38.648C-37.24 39.772 -37.912 40.544 -38.928 40.544C-39.384 40.544 -39.888 40.04 -40.344 39.01L-46.148 23.01H-53.284" transform="translate(39 10)" fill="#fff"/>
    <path d="M96.7932 23.0098H89.6572L83.8532 39.0098C83.5012 40.0498 83.0452 40.5438 82.5892 40.5438C81.5732 40.5438 80.9012 39.7718 80.4452 38.6478L75.9652 23.0098H69.0692L64.7652 38.6478C64.3092 39.7718 63.6372 40.5438 62.6212 40.5438C62.1652 40.5438 61.7092 40.0498 61.3572 39.0098L55.5532 23.0098H48.4172L45.2732 39.0098C44.8172 40.0498 44.3132 40.5438 43.8052 40.5438C42.7892 40.5438 42.1172 39.7718 41.6612 38.6478L37.1812 23.0098H30.2852L25.9812 38.6478C25.5252 39.7718 24.8532 40.5438 23.8372 40.5438C23.3812 40.5438 22.8772 40.0498 22.4212 39.0098L16.6172 23.0098H9.48122L6.33722 39.0098C5.88122 40.0498 5.37722 40.5438 4.86922 40.5438C3.85322 40.5438 3.18122 39.7718 2.72522 38.6478L-1.75478 23.0098H-8.65078L-12.9548 38.6478C-13.4108 39.7718 -14.0828 40.5438 -15.0988 40.5438C-15.5548 40.5438 -16.0588 40.0498 -16.5148 39.0098L-22.3188 23.0098H-29.4548" transform="translate(0 10)" fill="#F79500"/>
  </svg>
);

// A small library of professional SVG icons
const Icon = ({ type }) => {
  const icons = {
    card: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
    bank: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    self: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>,
    upi: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
  };
  return <div className="option-icon">{icons[type]}</div>;
};

const TransfersPayments = () => {
  // Data for rendering the UI, making it easy to update
  const transferOptions = [
    { type: 'card', title: 'Transfer via Card Number', description: 'Send money to other cards' },
    { type: 'bank', title: 'Transfer to Other Banks', description: 'NEFT/RTGS/IMPS' },
    { type: 'self', title: 'Self Transfer', description: 'Between your accounts' },
    { type: 'upi', title: 'Transfer via Mobile/UPI ID', description: 'Quick transfers using UPI' },
  ];

  const transactions = [
    { id: 1, to: 'Eswar Reddy', type: 'Online Payment', date: 'October, 03', amount: '- ₹5000.00', status: 'Failed' },
    { id: 2, to: 'Eswar Reddy', type: 'Online Payment', date: 'October, 03', amount: '+ ₹50000.00', status: 'Completed' },
    { id: 3, to: 'Eswar Reddy', type: 'EMI', date: 'October, 03', amount: '- ₹2378.00', status: 'Completed' },
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return '';
    }
  };
  
  return (
    <div className="transfers-payments">
      <h2 className="tp-title">Transfers & Payments</h2>

      <section className="card-display-section">
        <div className="debit-card">
          <div className="debit-card__header">
            <span className="debit-card__logo">FLUIT</span>
            <div className="debit-card__chip"></div>
          </div>
          <div className="debit-card__number">
            <span>4564 8901 2048 6756</span>
          </div>
          <div className="debit-card__footer">
            <div className="debit-card__holder">
              <span className="label">Card Holder</span>
              <span>Hordhik Mnikat</span>
            </div>
            <VisaLogoSVG />
          </div>
        </div>

        <div className="balance-details">
          <div className="balance-info">
            <h4>Card Balance</h4>
            <span className="balance-amount">₹39,800.02</span>
          </div>
          <div className="card-actions">
            <button className="action-btn">History</button>
            <button className="action-btn">Transfer</button>
          </div>
        </div>
      </section>

      <section className="transfer-options-section">
        <h3 className="section-title">Transfer Options</h3>
        <div className="transfer-grid">
          {transferOptions.map((option, index) => (
            <div className="transfer-option" key={index}>
              <Icon type={option.type} />
              <div className="option-details">
                <h4>{option.title}</h4>
                <p>{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="recent-activities-section">
        <h3 className="section-title">Recent Activities</h3>
        <div className="activities-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>TO</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.to}</td>
                  <td>{tx.type}</td>
                  <td>{tx.date}</td>
                  <td className={tx.amount.startsWith('+') ? 'amount-positive' : 'amount-negative'}>{tx.amount}</td>
                  <td>
                    <span className={`status-pill ${getStatusClass(tx.status)}`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TransfersPayments;

