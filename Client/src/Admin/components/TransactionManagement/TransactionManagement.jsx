import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Ban, TrendingUp, Activity } from 'lucide-react';
import { getAllTransactions } from '../../../services/adminApi';
import './TransactionManagement.css';
import { jsPDF } from 'jspdf';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        // Map backend data to frontend model
        const formatted = data.map(t => {
          // Use the raw ISO timestamp from backend if available, otherwise fallback
          const dateISO = t.createdAt || t.date || new Date().toISOString();
          const dateObj = new Date(dateISO);
          const isValidDate = !isNaN(dateObj.getTime());

          return {
            id: t.id,
            transactionId: t.transactionId || `TXN${t.id}`,
            // Backend sends 'from' which is the user name
            user: t.from || 'Unknown User',
            type: t.type,
            amount: t.amount,
            date: isValidDate ? dateObj.toLocaleDateString() : 'N/A',
            dateISO: dateISO,
            status: t.status || 'Completed',
            to: t.to || 'Self / External',
            fee: t.fee ? `₹${t.fee.toFixed(2)}` : null,
            tax: t.tax ? `₹${t.tax.toFixed(2)}` : null,
            totalDebited: (t.fee && t.tax && t.amount) ? `₹${(Math.abs(Number(t.amount)) + t.fee + t.tax).toFixed(2)}` : null
          };
        });
        setTransactions(formatted);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || tx.type === filterType;
    const matchesStatus = filterStatus === 'All' || tx.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return 'status-completed';
    }
  };

  const downloadReceipt = (tx) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Transaction Receipt', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Transaction ID: ${tx.transactionId}`, 20, 40);
    doc.text(`Date: ${new Date(tx.dateISO).toLocaleString()}`, 20, 50);
    doc.text(`Status: ${tx.status}`, 20, 60);

    doc.line(20, 65, 190, 65);

    const isIncoming = tx.amount.toString().startsWith('+');
    doc.text(`Type: ${tx.type}`, 20, 80);
    doc.text(`User: ${tx.user}`, 20, 90);
    doc.text(`${isIncoming ? 'Received From' : 'Paid To'}: ${tx.to}`, 20, 100);

    doc.setFontSize(16);
    if (tx.status === 'Failed') {
      doc.setTextColor(0, 0, 0); // Black
    } else if (isIncoming) {
      doc.setTextColor(16, 185, 129); // Green
    } else {
      doc.setTextColor(239, 68, 68); // Red
    }
    doc.text(`Amount: ${tx.amount}`, 20, 120);
    doc.setTextColor(0, 0, 0); // Reset to black

    if (tx.fee) {
      doc.setFontSize(12);
      doc.text(`Convenience Fee: ${tx.fee}`, 20, 135);
      doc.text(`Taxes: ${tx.tax}`, 20, 145);
      doc.setFontSize(14);
      doc.text(`Total Debited: ${tx.totalDebited}`, 20, 160);
    }

    doc.setFontSize(10);
    doc.text('Thank you for banking with us.', 105, 190, { align: 'center' });

    doc.save(`Receipt_${tx.transactionId}.pdf`);
  };

  return (
    <div className="transaction-management">
      <div className="txn-header">
        <div className="header-title">
          <h2>Transaction Management</h2>
          <p>Monitor and manage all system transactions</p>
        </div>
        <div className="txn-stats">
          <div className="stat-box total-volume">
            <div className="stat-content">
              <p className="stat-label">Total Volume</p>
              <p className="stat-value">₹{transactions.reduce((acc, curr) => acc + Math.abs(parseFloat(curr.amount) || 0), 0).toLocaleString()}</p>
            </div>
            <div className="stat-icon-wrapper">
              <TrendingUp size={24} color="#fff" />
            </div>
          </div>
          <div className="stat-box todays-txns">
            <div className="stat-content">
              <p className="stat-label">Today's Txns</p>
              <p className="stat-value">{transactions.filter(t => new Date(t.dateISO).toDateString() === new Date().toDateString()).length}</p>
            </div>
            <div className="stat-icon-wrapper">
              <Activity size={24} color="#111" />
            </div>
          </div>
        </div>
      </div>

      <div className="txn-controls">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID or User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filters-wrapper">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
              <option value="All">All Types</option>
              <option value="TRANSFER_SENT">Transfers</option>
              <option value="CARD_PAYMENT">Card Payments</option>
              <option value="DEPOSIT">Deposits</option>
            </select>
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select" style={{ paddingLeft: '14px' }}>
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
        <button className="export-btn">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="transactions-table-container">
        <div className="table-header">
          <div className="col">Transaction ID</div>
          <div className="col" style={{ flex: 1.5 }}>Flow (User → Recipient)</div>
          <div className="col">Date</div>
          <div className="col">Amount</div>
          <div className="col">Status</div>
          <div className="col">Actions</div>
        </div>

        <div className="table-body">
          {loading ? (
            <div className="loading-state">Loading transactions...</div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="table-row">
                <div className="col" style={{ fontFamily: 'SF Mono, monospace', fontSize: '12px', color: '#555' }}>{tx.transactionId}</div>
                <div className="col" style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 600, color: '#111' }}>{tx.user}</span>
                    <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#ccc' }}>↳</span> {tx.to}
                    </span>
                  </div>
                </div>
                <div className="col" style={{ color: '#666' }}>{tx.date}</div>
                <div className={`col col-amount ${tx.status === 'Failed' ? 'amount-failed' : 'amount-success'}`}>
                  {tx.amount}
                </div>
                <div className="col">
                  <span className={`status-badge ${getStatusClass(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
                <div className="col col-actions">
                  <button className="action-btn view" title="View Details" onClick={() => setSelectedTx(tx)}>
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-transactions">No transactions found matching your criteria</div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal - Receipt Style */}
      {
        selectedTx && (
          <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Transaction Details</h3>
                <button className="close-btn" onClick={() => setSelectedTx(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <span className="label">Transaction ID</span>
                  <span className="value">{selectedTx.transactionId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date & Time</span>
                  <span className="value">{new Date(selectedTx.dateISO).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">User</span>
                  <span className="value">{selectedTx.user}</span>
                </div>
                <div className="detail-row">
                  <span className="label">To / From</span>
                  <span className="value">{selectedTx.to}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Type</span>
                  <span className="value">{selectedTx.type}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Amount</span>
                  <span className={`value ${selectedTx.status === 'Failed' ? 'amount-failed' : (selectedTx.amount.toString().startsWith('+') ? 'amount-positive' : 'amount-negative')}`}>
                    {selectedTx.amount}
                  </span>
                </div>
                {selectedTx.fee && (
                  <>
                    <div className="detail-row">
                      <span className="label">Convenience Fee</span>
                      <span className="value">{selectedTx.fee}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Taxes</span>
                      <span className="value">{selectedTx.tax}</span>
                    </div>
                    <div className="detail-row" style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                      <span className="label" style={{ fontWeight: 'bold' }}>Total Debited</span>
                      <span className="value" style={{ fontWeight: 'bold' }}>{selectedTx.totalDebited}</span>
                    </div>
                  </>
                )}
                <div className="detail-row">
                  <span className="label">Status</span>
                  <span className={`status-pill ${getStatusClass(selectedTx.status)}`}>{selectedTx.status}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => downloadReceipt(selectedTx)}>Download Receipt</button>
                <button className="btn-primary" onClick={() => setSelectedTx(null)}>Close</button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default TransactionManagement;
