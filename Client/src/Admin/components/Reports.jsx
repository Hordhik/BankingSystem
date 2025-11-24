import React, { useState, useEffect } from 'react';
import { getDashboardStats, getMonthlyReports } from '../../services/adminApi';
import './Reports.css';

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [stats, setStats] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          getDashboardStats(),
          getMonthlyReports()
        ]);
        setStats(statsData);
        setMonthlyData(reportsData);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to get value safely from stats array
  const getStatValue = (label) => {
    const stat = stats.find(s => s.label === label);
    return stat ? stat.value : '0';
  };

  const getStatChange = (label) => {
    const stat = stats.find(s => s.label === label);
    return stat ? stat.change : '-';
  };

  if (loading) {
    return <div className="loading-state">Loading reports...</div>;
  }

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
          <p className="value">{getStatValue('Active Transactions')}</p>
          <p className="trend">{getStatChange('Active Transactions')} from last period</p>
        </div>
        <div className="summary-card">
          <h3>Total Users</h3>
          <p className="value">{getStatValue('Total Users')}</p>
          <p className="trend">{getStatChange('Total Users')} from last period</p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p className="value">{getStatValue('Total Revenue')}</p>
          <p className="trend">{getStatChange('Total Revenue')} from last period</p>
        </div>
        <div className="summary-card">
          <h3>Avg Transaction Value</h3>
          <p className="value">{getStatValue('Avg Transaction Value')}</p>
          <p className="trend">{getStatChange('Avg Transaction Value')} from last period</p>
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
            {monthlyData.length > 0 ? (
              monthlyData.map((row, idx) => {
                // Calculate Avg Value for the row if not present
                const revenueVal = parseFloat(row.revenue.replace(/[₹,]/g, ''));
                const avgVal = row.transactions > 0 ? Math.round(revenueVal / row.transactions) : 0;

                return (
                  <tr key={idx}>
                    <td>{row.month}</td>
                    <td>{row.transactions}</td>
                    <td>{row.users}</td>
                    <td>{row.revenue}</td>
                    <td>₹{avgVal.toLocaleString('en-IN')}</td>
                    <td>
                      <button className="btn-view-detail">View</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
