import React from 'react';
import './Payments.css';
import { PaymentMethods } from './components/PaymentMethods.jsx';
import { RecentActivities } from './components/RecentActivities.jsx';
import { RechargeAndBills } from './components/RechargeAndBills.jsx';
import transferIcon from '/src/assets/icons/transfer.svg';
import cardIcon from '/src/assets/icons/card.svg';
import loansIcon from '/src/assets/icons/loans.svg';
import offersIcon from '/src/assets/icons/offers.svg';
import { useNavigate } from 'react-router-dom';
import { DebitCardDisplay } from './components/DebitCardDisplay.jsx';

const transactionsData = [
  { id: 1, to: 'Eswar Reddy', type: 'Online Payment', date: 'October, 03', amount: '- ₹5000.00', status: 'Failed' },
  { id: 2, to: 'Eswar Reddy', type: 'Online Payment', date: 'October, 03', amount: '+ ₹50000.00', status: 'Completed' },
  { id: 3, to: 'Eswar Reddy', type: 'EMI', date: 'October, 03', amount: '+ ₹2378.00', status: 'Completed' },
  { id: 4, to: 'Eswar Reddy', type: 'Merchant', date: 'September, 29', amount: '- ₹3000.00', status: 'Success' },
  { id: 5, to: 'Eswar Reddy', type: 'Electric Bill', date: 'September, 25', amount: '+ ₹2584.43', status: 'Pending' },
  { id: 6, to: 'Eswar Reddy', type: 'Insurance', date: 'September, 25', amount: '- ₹10000.00', status: 'Completed' },
];

function Payments() {
  const navigate = useNavigate();

  const quickTiles = [
    { label: 'Transfer / Pay', icon: transferIcon, action: () => navigate('/payment') },
    { label: 'Cards', icon: cardIcon, action: () => navigate('/dashboard') },
    { label: 'Loans & Investments', icon: loansIcon, action: () => navigate('/dashboard') },
    { label: 'Pre-Approved Offers', icon: offersIcon, action: () => navigate('/dashboard') },
  ];

  return (
    <div className='payments-container'>
      <h1 className="dash-greeting">Welcome back, {localStorage.getItem('fullname')?.split(' ')[0] || 'User'} <span className="wave">👋</span></h1>

      {/* Top overview: balance + hero card */}
      <section className="dash-top-grid">
        <div className="balance-panel">
          <h3>Total Balance</h3>
          <div className="big-amount">₹{parseFloat(localStorage.getItem('primaryAccountBalance') || '0').toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="mini-cards">
            <div className="mini">
              <div className="mini-title">Savings Account</div>
              <div className="mini-value">₹{parseFloat(localStorage.getItem('primaryAccountBalance') || '0').toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="mini">
              <div className="mini-title">Credit Card</div>
              <div className="mini-value">1,200 Due</div>
            </div>
            <div className="mini">
              <div className="mini-title">Loans</div>
              <div className="mini-value">₹2,50,000,00</div>
            </div>
            {/* Caption under the Savings tile (first column only) */}
            <div className="mini-caption">{localStorage.getItem('fullname') || 'User'}</div>
          </div>
        </div>

        <div className="top-card-wrapper">
          <DebitCardDisplay />
        </div>
      </section>

      {/* Quick actions row */}
      <section className="quick-grid">
        {quickTiles.map(t => (
          <button key={t.label} className="quick-tile" onClick={t.action}>
            <img src={t.icon} alt="" />
            <span>{t.label}</span>
          </button>
        ))}
      </section>

      {/* Payment Methods above, then Recharge & Bills */}
      <section className="dash-section">
        <PaymentMethods />
      </section>
      <section className="dash-section">
        <RechargeAndBills />
      </section>

      {/* Recent Activities table */}
      <div className="payments-activities">
        <RecentActivities transactions={transactionsData} />
      </div>
    </div>
  );
}

export default Payments;