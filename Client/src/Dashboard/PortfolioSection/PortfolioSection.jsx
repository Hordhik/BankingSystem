import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/src/Dashboard/PortfolioSection/PortfolioSection.css';

export const PortfolioSection = ({ portfolioItems = [] }) => {
  const [items, setItems] = useState([]);
  const API ='http://localhost:6060';

  useEffect(() => {
    fetchLoans();
  }, [portfolioItems]);

  const fetchLoans = async () => {
    try {
      const userId = Number(localStorage.getItem('userId'));
      const res = await axios.get(`${API}/api/loans/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const formatted = res.data.map((l) => ({
        product: l.loanType,
        amount: `₹${Number(l.amount).toLocaleString()}`,
        status: l.status,
        next_action: l.nextPayment || '----',
        admin_reason: l.adminReason || null,
      }));

      setItems(formatted);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    }
  };

  return (
    <div className="portfolio-section-dashboard">
      <h3 className="portfolio-title-dashboard">My Portfolio</h3>

      <div className="portfolio-table-container">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Amount / Value</th>
              <th>Status</th>
              <th>Next Payment / Maturity</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  No loans or investments yet.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.amount}</td>

                  <td>
                    <span className={`status-pill status-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>

                    {item.status === 'REJECTED' && item.admin_reason && (
                      <div className="rejection-note">
                        Reason: {item.admin_reason}
                      </div>
                    )}
                  </td>

                  <td>{item.next_action}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
