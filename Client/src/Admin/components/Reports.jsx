import React, { useState } from 'react';
import './Reports.css';

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  
  const reportData = {
    monthly: [
      { month: 'January', transactions: 1240, users: 150, revenue: '₹45,60,000' },
      { month: 'February', transactions: 1560, users: 180, revenue: '₹52,40,000' },
      { month: 'March', transactions: 1890, users: 220, revenue: '₹61,20,000' },
      { month: 'April', transactions: 2100, users: 280, revenue: '₹68,50,000' },
      { month: 'May', transactions: 1950, users: 260, revenue: '₹63,40,000' },
      { month: 'June', transactions: 2340, users: 310, revenue: '₹76,30,000' },
    ]
  };

  return (
    <div className="reports">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        <div className="report-controls">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="report-selector">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
          <button className="btn-export">📥 Export Report</button>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <p className="value">11,080</p>
          <p className="trend">↑ 12% from last period</p>
        </div>
        <div className="summary-card">
          <h3>Total Users</h3>
          <p className="value">1,400</p>
          <p className="trend">↑ 8% from last period</p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p className="value">₹3,67,40,000</p>
          <p className="trend">↑ 15% from last period</p>
        </div>
        <div className="summary-card">
          <h3>Avg Transaction Value</h3>
          <p className="value">₹33,120</p>
          <p className="trend">↑ 3% from last period</p>
        </div>
      </div>

      <div className="report-table">
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Transactions</th>
              <th>New Users</th>
              <th>Revenue</th>
              <th>Avg Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportData.monthly.map((row, idx) => (
              <tr key={idx}>
                <td>{row.month}</td>
                <td>{row.transactions}</td>
                <td>{row.users}</td>
                <td>{row.revenue}</td>
                <td>₹{Math.round(parseInt(row.revenue.replace(/[₹,]/g, '')) / row.transactions).toLocaleString('en-IN')}</td>
                <td>
                  <button className="btn-view-detail">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
