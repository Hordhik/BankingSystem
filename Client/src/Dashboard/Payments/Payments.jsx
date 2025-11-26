import React, { useEffect, useState } from 'react';
import './Payments.css';
import { PaymentMethods } from './components/PaymentMethods.jsx';
import { RechargeAndBills } from './components/RechargeAndBills.jsx';
import { Activity, CreditCard, Zap, Bell } from 'lucide-react';
import transferIcon from '/src/assets/icons/transfer.svg';
import cardIcon from '/src/assets/icons/card.svg';
import loansIcon from '/src/assets/icons/loans.svg';
import offersIcon from '/src/assets/icons/offers.svg';
import { useNavigate } from 'react-router-dom';
import { DebitCardDisplay } from './components/DebitCardDisplay.jsx';
import { getHistory, getAccounts } from '../../services/bankApi';

function Payments({ setActiveTab }) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(parseFloat(localStorage.getItem('primaryAccountBalance') || '0'));
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickTiles = [
    { label: 'Transfer / Pay', icon: transferIcon, action: () => navigate('/payment') },
    { label: 'Cards', icon: cardIcon, action: () => setActiveTab('Cards') },
    { label: 'Loans & Investments', icon: loansIcon, action: () => setActiveTab('Loans & Investments') },
    { label: 'Pre-Approved Offers', icon: offersIcon, action: () => setActiveTab('Pre-Approved Offers') },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountId = localStorage.getItem('primaryAccountId');
        if (accountId) {
          // Fetch Transactions
          const history = await getHistory(accountId);

          // Map backend transaction format to UI format
          const mappedTransactions = history.map(txn => {
            const isIncoming = txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_RECEIVED';
            const absAmount = Math.abs(parseFloat(txn.amount)).toFixed(2);
            return {
              id: txn.id,
              to: txn.counterpartyName || (txn.type === 'TRANSFER' ? `Account ${txn.counterpartyAccountId || 'Unknown'}` : txn.type),
              type: txn.type, // DEPOSIT, WITHDRAWAL, TRANSFER
              date: new Date(txn.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
              amount: (isIncoming ? '+ ' : '- ') + '₹' + absAmount,
              status: 'Completed' // Assuming all returned are completed for now
            };
          });
          setTransactions(mappedTransactions);

          // Fetch latest balance
          const accounts = await getAccounts();
          // AccountController returns all accounts, so we find ours
          const myAccount = accounts.find(a => a.id.toString() === accountId.toString());
          if (myAccount) {
            setBalance(myAccount.balance);
            // Update localStorage to keep it fresh
            localStorage.setItem('primaryAccountBalance', myAccount.balance);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='payments-container'>
      <h1 className="dash-greeting">Welcome back, {localStorage.getItem('fullname')?.split(' ')[0] || 'User'} <span className="wave">👋</span></h1>

      {/* Top overview: balance + hero card */}
      <section className="dash-top-grid">
        <div className="balance-panel">
          <h3>Total Balance</h3>
          <div className="big-amount">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="mini-cards">
            <div className="mini">
              <div className="mini-title">Savings Account</div>
              <div className="mini-value">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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

      {/* Middle Grid: Payment Methods & Bills side-by-side */}
      <section className="dash-mid-grid">
        <div className="mid-panel methods-wrapper">
          <PaymentMethods />
        </div>
        <div className="mid-panel bills-wrapper">
          <RechargeAndBills />
        </div>
      </section>

      {/* Premium Insights Section */}
      <section className="dash-stats-section">
        <div className="stats-grid">
          {/* Monthly Spend Limit -> Transactions */}
          <div className="stat-card" onClick={() => setActiveTab('Transactions')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon">
              <Activity size={24} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <p className="stat-label">Monthly Limit</p>
                <span className="stat-badge">75% Used</span>
              </div>
              <p className="stat-value">₹45,000 <span className="stat-sub">/ ₹60k</span></p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Credit Score -> Loans & Investments */}
          <div className="stat-card" onClick={() => setActiveTab('Loans & Investments')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon">
              <CreditCard size={24} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Credit Score</p>
              <p className="stat-value">785 <span className="stat-sub text-green">Excellent</span></p>
              <p className="stat-desc">Updated today</p>
            </div>
          </div>

          {/* Rewards -> Pre-Approved Offers */}
          <div className="stat-card" onClick={() => setActiveTab('Pre-Approved Offers')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon">
              <Zap size={24} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Reward Points</p>
              <p className="stat-value">1,250 <span className="stat-sub">Pts</span></p>
              <p className="stat-desc">Redeem for cashback</p>
            </div>
          </div>

          {/* Security Status -> Settings */}
          <div className="stat-card" onClick={() => setActiveTab('Settings')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon">
              <Bell size={24} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Security Status</p>
              <p className="stat-value">Safe <span className="stat-sub text-green">✓</span></p>
              <p className="stat-desc">2-Factor Active</p>
            </div>
          </div>
        </div>
      </section>
    </div >
  );
}

export default Payments;