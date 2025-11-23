import React, { useState } from 'react';
import './TransactionManagement.css';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, from: 'John Doe', to: 'Jane Smith', amount: '₹5,000', type: 'Transfer', date: '2024-11-13', status: 'Completed' },
    { id: 2, from: 'Mike Johnson', to: 'Sarah Williams', amount: '₹12,500', type: 'Payment', date: '2024-11-13', status: 'Completed' },
    { id: 3, from: 'Robert Brown', to: 'John Doe', amount: '₹3,200', type: 'Transfer', date: '2024-11-12', status: 'Failed' },
    { id: 4, from: 'Jane Smith', to: 'Mike Johnson', amount: '₹8,750', type: 'Payment', date: '2024-11-12', status: 'Pending' },
    { id: 5, from: 'Sarah Williams', to: 'Robert Brown', amount: '₹15,000', type: 'Transfer', date: '2024-11-11', status: 'Completed' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          txn.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || txn.status === filterStatus;
    const matchesType = filterType === 'All' || txn.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleBlockTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalAmount = filteredTransactions.reduce((sum, txn) => {
    const amount = parseInt(txn.amount.replace(/[₹,]/g, ''));
    return sum + amount;
  }, 0);

  return (
    <div className="transaction-management">
      <div className="txn-header">
        <h2>Transaction Management</h2>
        <div className="txn-stats">
          <div className="stat">
            <p>Total Transactions</p>
            <span>{filteredTransactions.length}</span>
          </div>
          <div className="stat">
            <p>Total Amount</p>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="txn-filters">
        <input
          type="text"
          placeholder="Search by sender or receiver..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter">
          <option>All Status</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter">
          <option>All Types</option>
          <option>Transfer</option>
          <option>Payment</option>
        </select>
      </div>

      <div className="transactions-table">
        <div className="table-header">
          <div className="col-from">From</div>
          <div className="col-to">To</div>
          <div className="col-amount">Amount</div>
          <div className="col-type">Type</div>
          <div className="col-date">Date</div>
          <div className="col-status">Status</div>
          <div className="col-actions">Actions</div>
        </div>

        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(txn => (
            <div key={txn.id} className="table-row">
              <div className="col-from">{txn.from}</div>
              <div className="col-to">{txn.to}</div>
              <div className="col-amount">{txn.amount}</div>
              <div className="col-type">
                <span className={`type-badge ${txn.type.toLowerCase()}`}>{txn.type}</span>
              </div>
              <div className="col-date">{txn.date}</div>
              <div className="col-status">
                <span className={`status-badge ${txn.status.toLowerCase()}`}>{txn.status}</span>
              </div>
              <div className="col-actions">
                <button className="btn-action view">View</button>
                {txn.status === 'Pending' && (
                  <button className="btn-action delete" onClick={() => handleBlockTransaction(txn.id)}>
                    Block
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-transactions">No transactions found</div>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;
