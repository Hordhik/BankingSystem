import React, { useState } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  const analyticsData = {
    transactions: [
      { day: 'Mon', amount: 45000, count: 120 },
      { day: 'Tue', amount: 52000, count: 145 },
      { day: 'Wed', amount: 48000, count: 132 },
      { day: 'Thu', amount: 61000, count: 168 },
      { day: 'Fri', amount: 73000, count: 195 },
      { day: 'Sat', amount: 68000, count: 178 },
      { day: 'Sun', amount: 55000, count: 151 },
    ],
    userGrowth: [
      { day: 'Mon', users: 45 },
      { day: 'Tue', users: 52 },
      { day: 'Wed', users: 38 },
      { day: 'Thu', users: 65 },
      { day: 'Fri', users: 72 },
      { day: 'Sat', users: 58 },
      { day: 'Sun', users: 48 },
    ],
    topTransactionTypes: [
      { type: 'Online Payment', percentage: 45, amount: '₹50,40,000' },
      { type: 'Transfers', percentage: 30, amount: '₹33,60,000' },
      { type: 'Recharges', percentage: 15, amount: '₹16,80,000' },
      { type: 'Bill Payments', percentage: 10, amount: '₹11,20,000' },
    ],
  };

  const topMetrics = [
    { label: 'Peak Hour', value: '3:00 PM', subtext: 'Highest activity' },
    { label: 'Busiest Day', value: 'Friday', subtext: 'Most transactions' },
    { label: 'Avg Txn Size', value: '₹33,120', subtext: 'Average amount' },
    { label: 'Success Rate', value: '99.2%', subtext: 'Transaction success' },
  ];

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="time-range-selector">
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Top Metrics */}
      <div className="top-metrics">
        {topMetrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
            <p className="metric-subtext">{metric.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Transaction Trends */}
        <div className="chart-card">
          <h3>Transaction Trends</h3>
          <div className="chart-placeholder">
            <div className="mini-chart">
              {analyticsData.transactions.map((data, idx) => (
                <div key={idx} className="bar-container">
                  <div className="bar" style={{ height: `${(data.amount / 73000) * 100}%` }}></div>
                  <span className="bar-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="chart-note">Transaction volume by day</p>
        </div>

        {/* User Growth */}
        <div className="chart-card">
          <h3>User Growth</h3>
          <div className="chart-placeholder">
            <div className="mini-chart line-chart">
              {analyticsData.userGrowth.map((data, idx) => (
                <div key={idx} className="point-container">
                  <div className="point" style={{ height: `${(data.users / 72) * 100}%` }}></div>
                  <span className="point-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="chart-note">New users added by day</p>
        </div>
      </div>

      {/* Transaction Distribution */}
      <div className="distribution-card">
        <h3>Transaction Types Distribution</h3>
        <div className="distribution-list">
          {analyticsData.topTransactionTypes.map((item, idx) => (
            <div key={idx} className="distribution-item">
              <div className="distribution-info">
                <p className="distribution-type">{item.type}</p>
                <p className="distribution-amount">{item.amount}</p>
              </div>
              <div className="distribution-bar">
                <div className="progress-bar" style={{ width: `${item.percentage}%` }}></div>
              </div>
              <p className="distribution-percentage">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="detailed-stats">
        <div className="stat-box">
          <h4>Hourly Average</h4>
          <p className="stat-big">₹18,540</p>
          <p className="stat-small">Per hour transaction value</p>
        </div>
        <div className="stat-box">
          <h4>Daily Average</h4>
          <p className="stat-big">₹4,45,000</p>
          <p className="stat-small">Daily transaction volume</p>
        </div>
        <div className="stat-box">
          <h4>Weekly Average</h4>
          <p className="stat-big">₹31,15,000</p>
          <p className="stat-small">Weekly transaction volume</p>
        </div>
        <div className="stat-box">
          <h4>Failed Transactions</h4>
          <p className="stat-big">0.8%</p>
          <p className="stat-small">Failure rate this week</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
