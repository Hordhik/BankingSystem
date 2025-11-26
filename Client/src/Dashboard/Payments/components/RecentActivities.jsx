import React from 'react';
import './RecentActivities.css';

export const RecentActivities = ({ transactions, setActiveTab }) => {

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'status--completed';
      case 'failed':
        return 'status--failed';
      case 'pending':
        return 'status--pending';
      default:
        return '';
    }
  };

  // Limit to 5 transactions
  const displayedTransactions = transactions.slice(0, 5);

  return (
    <div className="activities-container">
      <div className="activities__header">
        <h2 className="activities__title">Recent Activities</h2>
        <button className="view-all-btn" onClick={() => setActiveTab('Transactions')}>
          View All →
        </button>
      </div>
      <div className="activities__table-wrapper">
        <table className="activities-table">
          <thead>
            <tr>
              <th>To / From</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.to}</td>
                <td>{transaction.type}</td>
                <td>{transaction.date}</td>
                <td className={transaction.amount.startsWith('+') ? 'amount--positive' : transaction.amount.startsWith('-') ? 'amount--negative' : ''}>
                  {transaction.amount}
                </td>
                <td>
                  <span className={`status-pill ${getStatusClass(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
