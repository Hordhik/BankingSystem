import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) return <div style={{ padding: "24px" }}>Loading loan applications…</div>;

  if (loans.length === 0)
    return (
      <div style={{ padding: "24px" }}>
        <h1>Loan Applications</h1>
        <div style={{ marginTop: "16px", color: "#999", fontSize: "14px" }}>
          No loan applications yet.
        </div>
      </div>
    );

  return (
    <div style={{ padding: "24px" }}>
      <h1>Loan Applications</h1>

      {message && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "6px",
            background: message.includes("✅") ? "#d4edda" : "#f8d7da",
            color: message.includes("✅") ? "#155724" : "#721c24",
            border: message.includes("✅") ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
          }}
        >
          {message}
        </div>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              textAlign: "left",
              color: "#fff",
              background: "#333",
              fontWeight: 600,
            }}
          >
            <th style={{ padding: 12 }}>Account No</th>
            <th style={{ padding: 12 }}>Type</th>
            <th style={{ padding: 12 }}>Amount</th>
            <th style={{ padding: 12 }}>Tenure</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Action / Details</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((loan, idx) => (
            <tr
              key={loan.id}
              style={{
                borderTop: "1px solid #eee",
                background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
              }}
            >
              <td style={{ padding: 12 }}>{loan.accountNumber}</td>
              <td style={{ padding: 12 }}>{loan.loanType}</td>
              <td style={{ padding: 12, fontWeight: 600 }}>{loan.principalAmount}</td>
              <td style={{ padding: 12 }}>{loan.tenure}</td>

              <td style={{ padding: 12 }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "white",
                    background:
                      loan.status === "ACTIVE"
                        ? "#2ecc71"
                        : loan.status === "REJECTED"
                        ? "#e74c3c"
                        : loan.status === "PENDING"
                        ? "#f39c12"
                        : loan.status === "APPROVED"
                        ? "#3498db"
                        : "#95a5a6",
                  }}
                >
                  {loan.status}
                </span>
                {loan.status === "REJECTED" && (
                  <div style={{ fontSize: 11, color: "#e74c3c", marginTop: 6 }}>
                  </div>
                )}
                {loan.status === "ACTIVE" && loan.monthlyEmi && (
                  <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
                  </div>
                )}
              </td>

              <td style={{ padding: 12 }}>
                {loan.status === "PENDING" ? (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      style={{
                        padding: "6px 14px",
                        background: "#2ecc71",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: isApproving ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        fontSize: "12px",
                        transition: "all 0.3s",
                        opacity: isApproving ? 0.7 : 1,
                      }}
                      onClick={() => approve(loan.id)}
                      disabled={isApproving}
                      onMouseOver={(e) => !isApproving && (e.target.style.background = "#27ae60")}
                      onMouseOut={(e) => (e.target.style.background = "#2ecc71")}
                    >
                      {isApproving ? "Approving..." : "✓ Accept"}
                    </button>

                    <button
                      style={{
                        padding: "6px 14px",
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: isRejecting ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        fontSize: "12px",
                        transition: "all 0.3s",
                        opacity: isRejecting ? 0.7 : 1,
                      }}
                      onClick={() => setSelected(loan)}
                      disabled={isRejecting}
                      onMouseOver={(e) => !isRejecting && (e.target.style.background = "#c0392b")}
                      onMouseOut={(e) => (e.target.style.background = "#e74c3c")}
                    >
                      ✕ Reject
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {loan.details || "—"}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reject Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "white",
              padding: "28px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "450px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 12px 0", color: "#333" }}>Reject Loan Application</h3>
            <p style={{ color: "#666", fontSize: "14px", margin: "8px 0 16px 0" }}>
              <strong>Type:</strong> {selected.loanType} | <strong>Amount:</strong>{" "}
              {selected.principalAmount}
            </p>

            <textarea
              style={{
                width: "100%",
                minHeight: 120,
                marginTop: 12,
                marginBottom: 16,
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
                fontFamily: "sans-serif",
                resize: "vertical",
              }}
              placeholder="Enter detailed reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={500}
            />
            <div style={{ fontSize: "12px", color: "#999", marginBottom: 16 }}>
              {rejectReason.length}/500 characters
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                style={{
                  padding: "8px 16px",
                  background: "#e0e0e0",
                  color: "#333",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
                onClick={() => setSelected(null)}
                disabled={isRejecting}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  opacity: isRejecting ? 0.7 : 1,
                }}
                onClick={reject}
                disabled={isRejecting || !rejectReason.trim()}
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
