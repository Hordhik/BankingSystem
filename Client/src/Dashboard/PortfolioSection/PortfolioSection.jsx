import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '/src/Dashboard/PortfolioSection/PortfolioSection.css';

export const PortfolioSection = () => {
  const [items, setItems] = useState([]);
  const API = import.meta.env.VITE_API_URL || "http://localhost:6060";

  const fetchLoans = useCallback(async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));
      const res = await axios.get(`${API}/api/loans/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const formatted = res.data.map((l) => ({
        product: l.loanType,
        amount: l.principalAmount,
        status: l.status,
        adminReason: l.adminReason,
        tenureMonths: l.tenure,
        principalAmount: l.principalAmount,
        emi: l.monthlyEmi,
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
      return `You will pay ${item.emi} per month for ${item.tenureMonths} months (Principal: ${item.principalAmount})`;
    }

    return "—";
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
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.amount}</td>

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
    </div>
  );
};
