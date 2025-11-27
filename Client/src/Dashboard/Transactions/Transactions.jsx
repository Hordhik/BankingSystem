import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '/src/Dashboard/Transactions/Transactions.css';
import { jsPDF } from 'jspdf';
import { getHistory } from '../../services/bankApi'; // <-- adjust path if needed

// Card image removed per request

const Icon = ({ type }) => {
  const icons = {
    card: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
    bank: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    self: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>,
    upi: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
  };
  return <div className="option-icon">{icons[type]}</div>;
};

const Transactions = () => {

  const location = useLocation();
  const [filter, setFilter] = useState('all');
  const [exportOpen, setExportOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const exportRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportRef]);

  // ===== replaced static data with live data =====
  const [injectedTx] = useState(location.state?.receipt || null);
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const accountId = localStorage.getItem('primaryAccountId'); // Get logged-in user's account ID

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingTx(true);
      try {
        const data = await getHistory(accountId); // expects TransactionResponse[] from backend
        const mapped = (data || []).map(t => {
          // Determine if transaction is incoming or outgoing based on TYPE
          const isIncoming = t.type === 'TRANSFER_RECEIVED' || t.type === 'DEPOSIT' || t.type === 'CARD_RECEIVE';
          const num = Number(t.amount);
          const absAmount = Math.abs(num).toFixed(2);
          const amountStr = isIncoming ? `+ ₹${absAmount}` : `- ₹${absAmount}`;

          const fee = t.fee ? `₹${t.fee.toFixed(2)}` : null;
          const tax = t.tax ? `₹${t.tax.toFixed(2)}` : null;
          const totalDebited = (t.fee && t.tax) ? `₹${(num + t.fee + t.tax).toFixed(2)}` : null;

          let typeDisplay = t.type;
          if (t.type === 'CARD_AUTOPAY' || t.type === 'LOAN_AUTOPAYMENT_CARD') {
            typeDisplay = 'EMI';
          }

          return {
            id: t.id,
            transactionId: t.transactionId || `TXN${t.id}`, // Fallback if backend doesn't send it yet
            to: t.counterpartyName || (t.counterpartyAccountId ? `Account ${t.counterpartyAccountId}` : 'Self / External'),
            type: typeDisplay,
            dateISO: t.createdAt,
            amount: amountStr,
            status: (t.status === 'SUCCESS' ? 'Completed' : (t.status === 'FAILED' ? 'Failed' : (t.status || 'Completed'))),
            channel: t.type.includes('CARD') ? 'card' : 'bank',
            fee: fee,
            tax: tax,
            totalDebited: totalDebited
          };
        });

        if (injectedTx) {
          // Avoid duplicates if it somehow exists
          const exists = mapped.find(t =>
            t.transactionId === injectedTx.transactionId ||
            (t.amount === injectedTx.amount && t.type === injectedTx.type && Math.abs(new Date(t.dateISO) - new Date(injectedTx.dateISO)) < 5000)
          );

          if (!exists) {
            mapped.unshift(injectedTx);
          }

          // Clear location state to prevent persistence on refresh
          window.history.replaceState({}, document.title);
        }

        if (mounted) setTransactions(mapped);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        if (mounted) {
          // Even if fetch fails, show the injected one
          setTransactions(injectedTx ? [injectedTx] : []);
        }
      } finally {
        if (mounted) setLoadingTx(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [accountId, injectedTx]);
  // ==============================================

  const displayDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { month: 'short', day: '2-digit' });

  const filteredByChip = useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'credited') return transactions.filter(tx => tx.amount.startsWith('+') && tx.status !== 'Failed');
    if (filter === 'debited') return transactions.filter(tx => tx.amount.startsWith('-') && tx.status !== 'Failed');
    if (filter === 'failed') return transactions.filter(tx => tx.status.toLowerCase() === 'failed');
    if (filter === 'bills') return transactions.filter(tx => tx.type.toLowerCase().includes('bill'));
    if (filter === 'emi') return transactions.filter(tx => tx.type === 'LOAN_PAYMENT' || tx.type === 'Monthly EMI' || tx.type === 'EMI');
    return transactions.filter(tx => tx.channel === filter);
  }, [transactions, filter]);

  const filtered = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const query = searchQuery.toLowerCase();

    return filteredByChip.filter(tx => {
      const d = new Date(tx.dateISO);
      if (from && d < from) return false;
      if (to) {
        // include entire 'to' day
        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);
        if (d > toEnd) return false;
      }
      if (query && !(
        (tx.transactionId && tx.transactionId.toLowerCase().includes(query)) ||
        (tx.to && tx.to.toLowerCase().includes(query))
      )) return false;
      return true;
    });
  }, [filteredByChip, fromDate, toDate, searchQuery]);

  const generatePdf = (txList = filtered) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Transaction History', 14, 16);
    doc.setFontSize(10);
    const range = `${fromDate || '—'} to ${toDate || '—'}`;
    doc.text(`Date Range: ${range}`, 14, 22);

    // Table headers
    const startY = 30;
    const colX = [14, 50, 90, 130, 160, 185]; // ID, To, Type, Date, Amount, Status
    doc.setFontSize(8);
    doc.text('TXN ID', colX[0], startY);
    doc.text('TO / FROM', colX[1], startY);
    doc.text('TYPE', colX[2], startY);
    doc.text('DATE', colX[3], startY);
    doc.text('AMOUNT', colX[4], startY);
    doc.text('STATUS', colX[5], startY);

    let y = startY + 6;
    const lineHeight = 6;
    const maxY = 280;
    txList.forEach((tx, idx) => {
      if (y > maxY) {
        doc.addPage();
        y = 20;
      }
      const date = displayDate(tx.dateISO);
      // Simple truncation for long strings
      const idText = (tx.transactionId || '').slice(0, 12);
      const toText = (tx.to || '').slice(0, 18);
      const typeText = (tx.type || '').slice(0, 18);

      doc.text(idText, colX[0], y);
      doc.text(toText, colX[1], y);
      doc.text(typeText, colX[2], y);
      doc.text(date, colX[3], y);
      doc.text(tx.amount, colX[4], y);
      doc.text(tx.status, colX[5], y);
      y += lineHeight;
    });

    doc.save('transactions.pdf');
    setExportOpen(false);
  };

  useEffect(() => {
    if (location.state?.receipt) {
      setSelectedTx(location.state.receipt);
      // Clear state to prevent reopening on refresh (optional, but good practice)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // ... (existing code)

  const downloadReceipt = (tx) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Transaction Receipt', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Transaction ID: ${tx.transactionId}`, 20, 40);
    doc.text(`Date: ${new Date(tx.dateISO).toLocaleString()}`, 20, 50);
    doc.text(`Status: ${tx.status}`, 20, 60);

    doc.line(20, 65, 190, 65);

    const isIncoming = tx.amount.startsWith('+');
    doc.text(`Type: ${tx.type}`, 20, 80);
    doc.text(`${isIncoming ? 'Received From' : 'Paid To'}: ${tx.to}`, 20, 90);

    doc.setFontSize(16);
    if (tx.status === 'Failed') {
      doc.setTextColor(0, 0, 0); // Black
    } else if (isIncoming) {
      doc.setTextColor(16, 185, 129); // Green
    } else {
      doc.setTextColor(239, 68, 68); // Red
    }
    doc.text(`Amount: ${tx.amount}`, 20, 110);
    doc.setTextColor(0, 0, 0); // Reset to black

    if (tx.fee) {
      doc.setFontSize(12);
      doc.text(`Convenience Fee: ${tx.fee}`, 20, 125);
      doc.text(`Taxes: ${tx.tax}`, 20, 135);
      doc.setFontSize(14);
      doc.text(`Total Debited: ${tx.totalDebited}`, 20, 150);
    }

    doc.setFontSize(10);
    doc.text('Thank you for banking with us.', 105, 180, { align: 'center' });

    doc.save(`Receipt_${tx.transactionId}.pdf`);
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-completed';
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return 'status-completed';
    }
  };

  const monthlySpending = useMemo(() => {
    const spending = new Array(12).fill(0);
    transactions.forEach(tx => {
      // Check if it's an outgoing transaction (negative amount or specific types)
      if (tx.amount.startsWith('-') || tx.type === 'TRANSFER_SENT' || tx.type === 'CARD_PAYMENT' || tx.type === 'WITHDRAWAL') {
        const date = new Date(tx.dateISO);
        const month = date.getMonth(); // 0-11
        // Remove currency symbol and commas to parse amount
        const amountVal = parseFloat(tx.amount.replace(/[^0-9.]/g, ''));
        if (!isNaN(amountVal)) {
          spending[month] += amountVal;
        }
      }
    });
    return spending;
  }, [transactions]);

  return (
    <div className="transactions-page">
      <div className="transactions-left">
        <div className="transactions-header">
          <h2 className="tp-title">Transactions</h2>
          <div className="toolbar">
            <div className="filter-chips">
              {[
                { key: 'all', label: 'All' },
                { key: 'credited', label: 'Credited' },
                { key: 'debited', label: 'Debited' },
                { key: 'failed', label: 'Failed' },
                { key: 'bank', label: 'Bank Transfer' },
                { key: 'card', label: 'Card' },
                { key: 'self', label: 'Self Transfer' },
                { key: 'upi', label: 'UPI' },
                { key: 'bills', label: 'Bills' },
                { key: 'emi', label: 'EMI' },
              ].map(({ key, label }) => (
                <button key={key} className={`chip ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search by ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="export-wrap" ref={exportRef}>
              <button className="chip export" onClick={() => setExportOpen(v => !v)}>Export ▾</button>
              {exportOpen && (
                <div className="export-dropdown">
                  <label>From
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                  </label>
                  <label>To
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                  </label>
                  <button className="btn-primary" onClick={() => generatePdf(filtered)}>Export PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="transactions-table-card">
          {loadingTx && <div style={{ padding: 12 }}>Loading transactions…</div>}
          <table>
            <thead>
              <tr>
                <th>TO / FROM</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.transactionId || tx.id} onClick={() => setSelectedTx(tx)} style={{ cursor: 'pointer' }}>
                  <td>{tx.to}</td>
                  <td>{tx.type}</td>
                  <td>{displayDate(tx.dateISO)}</td>
                  <td className={tx.status === 'Failed' ? 'amount-failed' : (tx.amount.startsWith('+') ? 'amount-positive' : 'amount-negative')}>{tx.amount}</td>
                  <td><span className={`status-pill ${getStatusClass(tx.status)}`}>{tx.status}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && !loadingTx && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="transactions-right">
        <div className="analytics-card">
          <h3>Spending Analytics</h3>
          <SpendingChart data={monthlySpending} />
        </div>
        <div className="expenses-card">
          <h3>Expenses by Category</h3>
          <DonutChart />
          <div className="expense-legend">
            <div className="legend-item">
              <span className="dot blue"></span>
              <span>Bills & Utilities</span>
              <span className="pct">35%</span>
            </div>
            <div className="legend-item">
              <span className="dot green"></span>
              <span>Recharge</span>
              <span className="pct">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
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
                  <span className="label">To / From</span>
                  <span className="value">{selectedTx.to}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Type</span>
                  <span className="value">{selectedTx.type}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Amount</span>
                  <span className={`value ${selectedTx.status === 'Failed' ? 'amount-failed' : (selectedTx.amount.startsWith('+') ? 'amount-positive' : 'amount-negative')}`}>
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

export default Transactions;

// Simple inline bar chart without external libs
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function SpendingChart({ data, labels = monthLabels }) {
  const max = Math.max(...data, 1);
  return (
    <div className="spend-chart">
      {data.map((val, i) => (
        <div className="spend-bar" key={labels[i]}>
          <div className="spend-bar__column" style={{ height: `${(val / max) * 140}px` }}>
            <div className="tooltip">₹{val.toLocaleString('en-IN')}</div>
          </div>
          <span className="spend-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart() {
  return (
    <div className="donut-wrapper">
      <svg viewBox="0 0 42 42" className="donut">
        <circle className="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="#eef2f7" strokeWidth="6" />
        <circle className="donut-segment bills" cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="6" strokeDasharray="50 50" strokeDashoffset="25" />
        <circle className="donut-segment recharge" cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="0" />
      </svg>
      <div className="donut-center">50%</div>
    </div>
  );
}
