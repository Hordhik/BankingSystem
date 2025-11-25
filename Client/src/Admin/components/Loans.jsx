import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Loans.css';   // ⬅️ make sure this is imported

const API = import.meta.env.VITE_API_URL || 'http://localhost:6060';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/loans`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLoans(res.data);
    } catch (err) {
      console.error("Error fetching loans:", err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    if (!window.confirm('Approve this loan?')) return;

    try {
      await axios.post(
        `${API}/api/loans/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      await fetchLoans();
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const openReject = (loan) => {
    setSelected(loan);
    setRejectReason('');
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) return alert('Provide a reason for rejection');

    try {
      await axios.post(
        `${API}/api/loans/${selected.id}/reject`,
        { reason: rejectReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setSelected(null);
      setRejectReason('');
      await fetchLoans();
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  if (loading) return <div className="admin-loans-page">Loading loans...</div>;

  return (
    <div className="admin-loans-page">
      <h1>Loan Applications</h1>

      <table className="admin-loans-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Tenure</th>
            <th>Status</th>
            <th>Applied At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.userId}</td>
              <td>{l.loanType}</td>
              <td>₹{Number(l.amount).toLocaleString()}</td>
              <td>{l.tenureMonths} mo</td>

              <td>
                {l.status}
                {l.adminReason && (
                  <div style={{ fontSize: 12, color: '#999' }}>
                    Reason: {l.adminReason}
                  </div>
                )}
              </td>

              <td>{new Date(l.createdAt).toLocaleString()}</td>

              <td>
                <button
                  className="admin-btn admin-btn-approve"
                  onClick={() => approve(l.id)}
                >
                  Approve
                </button>

                <button
                  className="admin-btn admin-btn-reject"
                  onClick={() => openReject(l)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="reject-modal-overlay">
          <div className="reject-modal-box">
            <h3>Reject Loan #{selected.id}</h3>
            <p>
              Borrower: {selected.userId} — {selected.loanType} — ₹
              {Number(selected.amount).toLocaleString()}
            </p>

            <textarea
              className="reject-textarea"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection"
            />

            <div className="reject-modal-actions">
              <button
                className="reject-cancel"
                onClick={() => {
                  setSelected(null);
                  setRejectReason('');
                }}
              >
                Cancel
              </button>

              <button className="reject-submit" onClick={submitReject}>
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
