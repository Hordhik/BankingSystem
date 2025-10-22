import React from 'react';
import './RecentActivities.css';

export const RecentActivities = ({ transactions }) => {
  
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

  return (
    <div className="activities-container">
      <h2 className="activities__title">Recent Activities</h2>
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
            {transactions.map((transaction) => (
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
