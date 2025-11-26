import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Ban, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { getAllTransactions, updateTransactionStatus } from '../../../services/adminApi';
import './TransactionManagement.css';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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

  const handleViewTransaction = (txn) => {
    setSelectedTransaction(txn);
    setShowModal(true);
  };

  const handleBlockTransaction = async (id) => {
    if (window.confirm('Are you sure you want to block this transaction?')) {
      try {
        await updateTransactionStatus(id, 'FAILED');
        setTransactions(transactions.map(t =>
          t.id === id ? { ...t, status: 'Failed' } : t
        ));
      } catch (error) {
        console.error("Error blocking transaction:", error);
        alert("Failed to block transaction");
      }
    }
  };

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    // Define CSV headers
    const headers = ["ID", "From", "To", "Amount", "Type", "Date", "Status"];

    // Map transactions to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...filteredTransactions.map(txn => {
        return [
          txn.id,
          `"${txn.from}"`, // Quote strings to handle commas
          `"${txn.to}"`,
          `"${txn.amount.replace(/[₹,]/g, '')}"`, // Clean amount
          txn.type,
          txn.date,
          txn.status
        ].join(',');
      })
    ];

    // Create CSV content
    const csvContent = csvRows.join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          <button className="export-btn" onClick={handleExport}>
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
                  <button
                    className="action-btn view"
                    title="View Details"
                    onClick={() => handleViewTransaction(txn)}
                  >
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

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Transaction Details</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="txn-details-grid">
                <div className="detail-item">
                  <label>Transaction ID</label>
                  <p>#{selectedTransaction.id}</p>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <p>{selectedTransaction.date}</p>
                </div>
                <div className="detail-item">
                  <label>From</label>
                  <p>{selectedTransaction.from}</p>
                </div>
                <div className="detail-item">
                  <label>To</label>
                  <p>{selectedTransaction.to}</p>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <p className="amount">{selectedTransaction.amount}</p>
                </div>
                <div className="detail-item">
                  <label>Type</label>
                  <span className={`type-badge ${selectedTransaction.type.toLowerCase()}`}>
                    {selectedTransaction.type}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className={`status-badge ${selectedTransaction.status.toLowerCase()}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
