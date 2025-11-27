import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import '/src/Dashboard/PortfolioSection/PortfolioSection.css';

export const PortfolioSection = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentStep, setPaymentStep] = useState('DETAILS'); // DETAILS, SELECT_METHOD, PROCESSING, SUCCESS

  const [transactions, setTransactions] = useState([]);
  const API = import.meta.env.VITE_API_URL || "http://localhost:6060";

  const fetchLoans = useCallback(async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));
      const res = await axios.get(`${API}/api/loans/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const parseCurrency = (value) => {
        if (typeof value === 'number') return value;
        if (!value) return 0;
        return parseFloat(value.toString().replace(/[^0-9.-]+/g, "")) || 0;
      };

      const formatted = res.data.map((l) => ({
        product: l.loanType,
        amount: parseCurrency(l.principalAmount),
        status: l.status,
        adminReason: l.adminReason,
        tenureMonths: parseInt(l.tenure) || 0,
        principalAmount: parseCurrency(l.principalAmount),
        emi: parseCurrency(l.monthlyEmi),
        emisPaid: l.emisPaid || 0,
        createdAt: l.createdAt || new Date().toISOString() // Fallback if missing
      }));

      setItems(formatted);
    } catch (err) {
      console.error("Portfolio fetch failed:", err);
    }
  }, [API]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const generateDetails = (item) => {
    if (item.status === "REJECTED") {
      return `Reason: ${item.adminReason || "Not provided"}`;
    }

    if (item.status === "PENDING" || item.status === "IN_VERIFICATION") {
      return "Awaiting admin approval";
    }

    if (item.status === "ACTIVE" || item.status === "APPROVED") {
      return `You will pay ₹${item.emi.toLocaleString()} per month for ${item.tenureMonths} months (Principal: ₹${item.principalAmount.toLocaleString()})`;
    }

    return "—";
  };

  const handleRowClick = (item) => {
    if (item.status === "ACTIVE" || item.status === "APPROVED") {
      setSelectedLoan(item);
    }
  };

  // Reset state when modal closes
  const closeModal = () => {
    setSelectedLoan(null);
    setPaymentStep('DETAILS');
  };

  // Helper to calculate progress
  const calculateProgress = (loan) => {
    // Use emisPaid from backend if available
    let monthsPaid = loan.emisPaid !== undefined ? loan.emisPaid : 0;

    // Fallback to date calculation if emisPaid is 0 (optional, but backend should be source of truth)
    // For now, we trust backend emisPaid.

    // Clamp values
    monthsPaid = Math.max(0, Math.min(monthsPaid, loan.tenureMonths));
    const monthsRemaining = loan.tenureMonths - monthsPaid;
    const totalPaid = monthsPaid * loan.emi;
    const balance = (loan.tenureMonths * loan.emi) - totalPaid;

    return { monthsPaid, monthsRemaining, totalPaid, balance };
  };

  // Helper to generate Amortization Schedule
  const generateAmortization = (loan) => {
    const P = loan.principalAmount;
    const N = loan.tenureMonths;
    const annualRate = 0.10; // Assuming 10% as per LoansSection
    const R = annualRate / 12;
    const emi = loan.emi;

    const breakdown = [];
    let balance = P;

    for (let i = 1; i <= N; i++) {
      const interest = balance * R;
      const principal = emi - interest;
      balance -= principal;

      breakdown.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance))
      });
    }
    return breakdown;
  };

  const handlePaymentClick = (type) => {
    const amount = type === 'EMI' ? selectedLoan.emi : calculateProgress(selectedLoan).balance;

    navigate('/payment/card', {
      state: {
        amount: amount,
        isLoanPayment: true,
        loanDetails: selectedLoan,
        paymentType: type, // 'EMI' or 'FULL'
        preselectedMethod: 'card' // Default to card as per URL request
      }
    });
  };

  return (
    <div className="portfolio-section-dashboard">
      <h3 className="portfolio-title-dashboard">My Portfolio</h3>

      <div className="portfolio-table-container">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No loans or investments yet.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(item)}
                  className={item.status === "ACTIVE" || item.status === "APPROVED" ? "clickable-row" : ""}
                >
                  <td>{item.product}</td>
                  <td>₹{item.amount.toLocaleString()}</td>

                  <td>
                    <span
                      className={`status-pill status-${item.status.toLowerCase().replaceAll("_", "-")}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>{generateDetails(item)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedLoan && (
        <div className="portfolio-modal-overlay" onClick={closeModal}>
          <div className="portfolio-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedLoan.product} Details</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>

            {paymentStep === 'DETAILS' && (() => {
              const { monthsPaid, monthsRemaining, totalPaid, balance } = calculateProgress(selectedLoan);
              const amortization = generateAmortization(selectedLoan);

              return (
                <div className="repayment-details">
                  <div className="progress-grid">
                    <div className="progress-card">
                      <span className="label">Months Paid</span>
                      <span className="value highlight">{monthsPaid}</span>
                    </div>
                    <div className="progress-card">
                      <span className="label">Remaining</span>
                      <span className="value">{monthsRemaining}</span>
                    </div>
                    <div className="progress-card">
                      <span className="label">Total Paid</span>
                      <span className="value">₹{totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="progress-card">
                      <span className="label">Balance</span>
                      <span className="value">₹{balance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${(monthsPaid / selectedLoan.tenureMonths) * 100}%` }}
                      ></div>
                    </div>
                    <div className="progress-labels">
                      <span>0 Months</span>
                      <span>{selectedLoan.tenureMonths} Months</span>
                    </div>
                  </div>

                  <div className="payment-actions">
                    {balance <= 0 || monthsRemaining <= 0 || selectedLoan.status === 'COMPLETED' ? (
                      <div className="completed-tag">Completed</div>
                    ) : (
                      <>
                        <button className="pay-btn" onClick={() => handlePaymentClick('EMI')}>
                          Pay EMI (₹{selectedLoan.emi.toLocaleString()})
                        </button>
                        <button className="pay-btn secondary" onClick={() => handlePaymentClick('FULL')}>
                          Pay Full Balance
                        </button>
                      </>
                    )}
                  </div>

                  {transactions.length > 0 && (
                    <div className="transactions-section">
                      <h4>Transaction History</h4>
                      <div className="portfolio-table-container">
                        <table className="portfolio-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>ID</th>
                              <th>Type</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((txn) => (
                              <tr key={txn.id}>
                                <td>{txn.date}</td>
                                <td>{txn.id}</td>
                                <td>{txn.type}</td>
                                <td>₹{txn.amount.toLocaleString()}</td>
                                <td style={{ color: 'green', fontWeight: 'bold' }}>{txn.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="amortization-section">
                    <h4>Amortization Schedule</h4>
                    <div className="portfolio-table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <table className="portfolio-table">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>EMI</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amortization.map((row) => (
                            <tr key={row.month} style={row.month <= monthsPaid ? { background: '#f0fdf4' } : {}}>
                              <td>{row.month}</td>
                              <td>₹{row.emi.toLocaleString()}</td>
                              <td>₹{row.principal.toLocaleString()}</td>
                              <td>₹{row.interest.toLocaleString()}</td>
                              <td>₹{row.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="loan-info-grid" style={{ marginTop: '2rem' }}>
                    <div className="info-item">
                      <span className="label">Principal Amount</span>
                      <span className="value">₹{selectedLoan.principalAmount.toLocaleString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Monthly EMI</span>
                      <span className="value">₹{selectedLoan.emi.toLocaleString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Start Date</span>
                      <span className="value">{new Date(selectedLoan.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Status</span>
                      <span className={`status-text ${selectedLoan.status.toLowerCase()}`}>{selectedLoan.status}</span>
                    </div>
                  </div>
                </div>
              );
            })()}



            {paymentStep === 'PROCESSING' && (
              <div className="processing-state">
                <div className="spinner"></div>
                <p>Processing Payment...</p>
              </div>
            )}

            {paymentStep === 'SUCCESS' && (
              <div className="success-state">
                <div className="success-icon">✓</div>
                <h4>Payment Successful!</h4>
                <p>Your receipt has been downloaded.</p>
                <button className="pay-btn" onClick={() => setPaymentStep('DETAILS')}>Back to Details</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
