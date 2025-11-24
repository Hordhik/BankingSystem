import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Ban, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getAllTransactions } from '../../services/adminApi';
import './TransactionManagement.css';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || txn.status === filterStatus;
    const matchesType = filterType === 'All' || txn.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleBlockTransaction = (id) => {
    // In a real app, this would call an API
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, status: 'Failed' } : t
    ));
  };

  const totalAmount = filteredTransactions.reduce((sum, txn) => {
    const amount = parseInt(txn.amount.replace(/[₹,]/g, ''));
    return sum + amount;
  }, 0);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={14} />;
      case 'Pending': return <Clock size={14} />;
      case 'Failed': return <XCircle size={14} />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="loading-state">Loading transactions...</div>;
  }

  return (
    <div className="transaction-management">
      <div className="txn-header">
        <div className="header-title">
          <h2>Transaction Management</h2>
          <p>Monitor and manage all system transactions</p>
        </div>
        <div className="txn-stats">
          <div className="stat-box">
            <p className="stat-label">Total Count</p>
            <p className="stat-value">{filteredTransactions.length}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Total Volume</p>
            <p className="stat-value">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="txn-controls">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by sender or receiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-wrapper">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
              <option value="All">All Types</option>
              <option value="Transfer">Transfer</option>
              <option value="Payment">Payment</option>
            </select>
          </div>

          <button className="export-btn">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="transactions-table-container">
        <div className="table-header">
          <div className="col col-from">From</div>
          <div className="col col-to">To</div>
          <div className="col col-amount">Amount</div>
          <div className="col col-type">Type</div>
          <div className="col col-date">Date</div>
          <div className="col col-status">Status</div>
          <div className="col col-actions">Actions</div>
        </div>

        <div className="table-body">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(txn => (
              <div key={txn.id} className="table-row">
                <div className="col col-from">
                  <span className="user-name">{txn.from}</span>
                </div>
                <div className="col col-to">
                  <span className="user-name">{txn.to}</span>
                </div>
                <div className="col col-amount">{txn.amount}</div>
                <div className="col col-type">
                  <span className={`type-badge ${txn.type.toLowerCase()}`}>{txn.type}</span>
                </div>
                <div className="col col-date">{txn.date}</div>
                <div className="col col-status">
                  <span className={`status-badge ${txn.status.toLowerCase()}`}>
                    {getStatusIcon(txn.status)}
                    {txn.status}
                  </span>
                </div>
                <div className="col col-actions">
                  <button className="action-btn view" title="View Details">
                    <Eye size={16} />
                  </button>
                  {txn.status === 'Pending' && (
                    <button
                      className="action-btn block"
                      title="Block Transaction"
                      onClick={() => handleBlockTransaction(txn.id)}
                    >
                      <Ban size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-transactions">
              <p>No transactions found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionManagement;
