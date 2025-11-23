import React, { useEffect, useMemo, useState } from 'react';
import '/src/Dashboard/Transactions/Transactions.css';
import { jsPDF } from 'jspdf';
import { getHistory } from '../../services/bankApi'; // <-- adjust path if needed

// Card image removed per request

const Icon = ({ type }) => {
  const icons = {
    card: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
    bank: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    self: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>,
    upi: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
  };
  return <div className="option-icon">{icons[type]}</div>;
};

const Transactions = () => {

  const [filter, setFilter] = useState('all');
  const [exportOpen, setExportOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // ===== replaced static data with live data =====
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const accountId = 1; // <-- TEMP: hardcoded account id for testing. Replace with logged-in user's account id later.

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingTx(true);
      try {
        const data = await getHistory(accountId); // expects TransactionResponse[] from backend
        const mapped = (data || []).map(t => {
          // normalize amount to UI string like "+ ₹123.00" or "- ₹123.00"
          const num = Number(t.amount);
          const amountStr = Number.isFinite(num)
            ? (num >= 0 ? `+ ₹${num.toFixed(2)}` : `- ₹${Math.abs(num).toFixed(2)}`)
            : (String(t.amount).startsWith('-') ? `- ₹${String(t.amount).replace(/[^0-9.]/g,'')}` : `+ ₹${String(t.amount)}`);

          return {
            id: t.id,
            to: t.counterpartyAccountId ? `Account ${t.counterpartyAccountId}` : 'Self / External',
            type: t.type,
            dateISO: t.createdAt,
            amount: amountStr,
            status: 'Completed', // backend doesn't currently provide status in DTO — change if available
            channel: 'bank'
          };
        });
        if (mounted) setTransactions(mapped);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        if (mounted) setTransactions([]);
      } finally {
        if (mounted) setLoadingTx(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [accountId]);
  // ==============================================

  const displayDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { month: 'short', day: '2-digit' });

  const filteredByChip = useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'bills') return transactions.filter(tx => tx.type.toLowerCase().includes('bill'));
    return transactions.filter(tx => tx.channel === filter);
  }, [transactions, filter]);

  const filtered = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return filteredByChip.filter(tx => {
      const d = new Date(tx.dateISO);
      if (from && d < from) return false;
      if (to) {
        // include entire 'to' day
        const toEnd = new Date(to);
        toEnd.setHours(23,59,59,999);
        if (d > toEnd) return false;
      }
      return true;
    });
  }, [filteredByChip, fromDate, toDate]);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Transaction History', 14, 16);
    doc.setFontSize(10);
    const range = `${fromDate || '—'} to ${toDate || '—'}`;
    doc.text(`Date Range: ${range}`, 14, 22);

    // Table headers
    const startY = 30;
    const colX = [14, 74, 124, 156, 180]; // To, Type, Date, Amount, Status
    doc.setFontSize(9);
    doc.text('TO', colX[0], startY);
    doc.text('TYPE', colX[1], startY);
    doc.text('DATE', colX[2], startY);
    doc.text('AMOUNT', colX[3], startY);
    doc.text('STATUS', colX[4], startY);

    let y = startY + 6;
    const lineHeight = 6;
    const maxY = 280;
    filtered.forEach((tx, idx) => {
      if (y > maxY) {
        doc.addPage();
        y = 20;
      }
      const date = displayDate(tx.dateISO);
      // Simple truncation for long strings
      const toText = (tx.to || '').slice(0, 24);
      const typeText = (tx.type || '').slice(0, 24);
      doc.text(toText, colX[0], y);
      doc.text(typeText, colX[1], y);
      doc.text(date, colX[2], y);
      doc.text(tx.amount, colX[3], y);
      doc.text(tx.status, colX[4], y);
      y += lineHeight;
    });

    doc.save('transactions.pdf');
    setExportOpen(false);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return '';
    }
  };
  
  return (
    <div className="transactions-page">
      <div className="transactions-left">
        <div className="transactions-header">
          <h2 className="tp-title">Transactions</h2>
          <div className="toolbar">
            <div className="filter-chips">
              {[
                { key:'all', label:'All' },
                { key:'bank', label:'Bank Transfer' },
                { key:'card', label:'Card' },
                { key:'self', label:'Self Transfer' },
                { key:'upi',  label:'UPI' },
                { key:'bills',label:'Bills' },
              ].map(({key,label}) => (
                <button key={key} className={`chip ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="export-wrap">
              <button className="chip export" onClick={() => setExportOpen(v=>!v)}>Export ▾</button>
              {exportOpen && (
                <div className="export-dropdown">
                  <label>From
                    <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} />
                  </label>
                  <label>To
                    <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} />
                  </label>
                  <button className="btn-primary" onClick={generatePdf}>Export PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="transactions-table-card">
          {loadingTx && <div style={{padding:12}}>Loading transactions…</div>}
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
              {filtered.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.to}</td>
                  <td>{tx.type}</td>
                  <td>{displayDate(tx.dateISO)}</td>
                  <td className={tx.amount.startsWith('+') ? 'amount-positive' : 'amount-negative'}>{tx.amount}</td>
                  <td><span className={`status-pill ${getStatusClass(tx.status)}`}>{tx.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="transactions-right">
        <div className="analytics-card">
          <h3 className="section-title">Spending Analytics</h3>
          <SpendingChart />
        </div>
        <div className="expenses-card">
          <h3 className="section-title">Expenses by Category</h3>
          <DonutChart />
          <ul className="legend">
            <li><span className="dot bills"/> Bills</li>
            <li><span className="dot recharge"/> Recharge</li>
            <li><span className="dot other"/> Other</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

// Simple inline bar chart without external libs
const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const sampleSpends = [12000, 18500, 15400, 20100, 9800, 17600, 22000, 24500, 19900, 26800, 23100, 18800];

function SpendingChart({ data = sampleSpends, labels = monthLabels }){
  const max = Math.max(...data, 1);
  return (
    <div className="spend-chart">
      {data.map((val, i) => (
        <div className="spend-bar" key={labels[i]}>
          <div className="spend-bar__column" style={{ height: `${(val / max) * 140}px` }} />
          <span className="spend-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart(){
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
