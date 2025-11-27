import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, X, AlertCircle, DollarSign, Users, Activity, Clock } from "lucide-react";
import "./Loans.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:6060";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [message, setMessage] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    fetchLoans();
    const interval = setInterval(fetchLoans, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await axios.get(`${API}/api/loans`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLoans(res.data);
      setLoading(false);
    } catch (err) {
      console.error("ADMIN LOAN FETCH ERROR", err);
      setLoading(false);
      setMessage("Failed to load loans");
    }
  };

  const approve = async (id) => {
    setIsApproving(true);
    try {
      await axios.post(
        `${API}/api/loans/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage("✅ Loan approved successfully!");
      setTimeout(() => setMessage(""), 3000);
      await fetchLoans();
    } catch (err) {
      console.error("APPROVE ERROR", err);
      setMessage("❌ Failed to approve loan: " + (err.response?.data?.message || err.message));
    } finally {
      setIsApproving(false);
    }
  };

  const reject = async () => {
    if (!rejectReason.trim()) {
      setMessage("❌ Please enter a rejection reason");
      return;
    }

    setIsRejecting(true);
    try {
      await axios.post(
        `${API}/api/loans/${selected.id}/reject`,
        rejectReason,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "text/plain",
          },
        }
      );
      setMessage("✅ Loan rejected successfully!");
      setTimeout(() => setMessage(""), 3000);
      setSelected(null);
      setRejectReason("");
      await fetchLoans();
    } catch (err) {
      console.error("REJECT ERROR", err);
      setMessage("❌ Failed to reject loan: " + (err.response?.data?.message || err.message));
    } finally {
      setIsRejecting(false);
    }
  };

  // Calculate stats
  const totalLoans = loans.length;
  const activeLoans = loans.filter(l => l.status === 'ACTIVE' || l.status === 'APPROVED').length;
  const pendingLoans = loans.filter(l => l.status === 'PENDING').length;
  const rejectedLoans = loans.filter(l => l.status === 'REJECTED').length;

  if (loading) return <div className="loading-box">Loading loan applications...</div>;

  return (
    <div className="admin-loans-container">
      <h1 className="admin-loans-title">Loan Management</h1>

      {/* Stats Grid */}
      <div className="loans-stats-grid">
        <div className="loan-stat-card">
          <div className="stat-icon-wrapper blue">
            <Activity size={20} />
          </div>
          <h3>Total Applications</h3>
          <p className="value">{totalLoans}</p>
        </div>
        <div className="loan-stat-card">
          <div className="stat-icon-wrapper green">
            <DollarSign size={20} />
          </div>
          <h3>Active Loans</h3>
          <p className="value">{activeLoans}</p>
        </div>
        <div className="loan-stat-card">
          <div className="stat-icon-wrapper orange">
            <Clock size={20} />
          </div>
          <h3>Pending Approval</h3>
          <p className="value">{pendingLoans}</p>
        </div>
        <div className="loan-stat-card">
          <div className="stat-icon-wrapper red">
            <AlertCircle size={20} />
          </div>
          <h3>Rejected</h3>
          <p className="value">{rejectedLoans}</p>
        </div>
      </div>

      {message && (
        <div className={`success-message ${message.includes("❌") ? "error" : ""}`} style={{ marginBottom: '20px' }}>
          {message}
        </div>
      )}

      <div className="admin-loans-table-wrapper">
        {loans.length === 0 ? (
          <div className="no-data">No loan applications found.</div>
        ) : (
          <table className="admin-loans-table">
            <thead>
              <tr>
                <th>Account No</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Tenure</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.accountNumber}</td>
                  <td>{loan.loanType}</td>
                  <td style={{ fontWeight: 600 }}>{loan.principalAmount}</td>
                  <td>{loan.tenure}</td>
                  <td>
                    <div className={`loan-status-badge status-${loan.status.toLowerCase()}`}>
                      {loan.status === 'ACTIVE' && <Check size={12} />}
                      {loan.status === 'PENDING' && <Clock size={12} />}
                      {loan.status === 'REJECTED' && <X size={12} />}
                      {loan.status}
                      {loan.status === 'REJECTED' && loan.adminReason && (
                        <div className="status-tooltip">
                          <strong>Rejection Reason:</strong>
                          <p>{loan.adminReason}</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="action-cell">
                    {loan.status === "PENDING" ? (
                      <div className="admin-actions">
                        <button
                          className="approve-btn"
                          onClick={() => approve(loan.id)}
                          disabled={isApproving}
                          title="Approve Loan"
                        >
                          {isApproving ? <Activity size={16} className="spin" /> : <Check size={16} />}
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => setSelected(loan)}
                          disabled={isRejecting}
                          title="Reject Loan"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className={`details-${loan.status.toLowerCase()}`}>
                        {loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? 'Approved' : 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reject Modal */}
      {selected && (
        <div className="reject-modal-overlay" onClick={() => setSelected(null)}>
          <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 12px 0", color: "var(--text-primary)", fontSize: '18px' }}>Reject Loan Application</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "8px 0 16px 0" }}>
              <strong>Type:</strong> {selected.loanType} | <strong>Amount:</strong>{" "}
              {selected.principalAmount}
            </p>

            <textarea
              className="reject-textarea"
              placeholder="Enter detailed reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={500}
            />
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: 'right' }}>
              {rejectReason.length}/500
            </div>

            <div className="reject-actions">
              <button
                className="cancel-modal-btn"
                onClick={() => setSelected(null)}
                disabled={isRejecting}
              >
                Cancel
              </button>
              <button
                className="submit-reject-btn"
                onClick={reject}
                disabled={isRejecting || !rejectReason.trim()}
              >
                {isRejecting ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
