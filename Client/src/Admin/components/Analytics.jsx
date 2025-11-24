import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../../services/adminApi';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    topMetrics: [],
    transactionTrends: [],
    userGrowth: [],
    topTransactionTypes: [],
    detailedStats: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsData = await getAnalytics();
        setData(analyticsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading analytics...</div>;
  }

  const { topMetrics, transactionTrends, userGrowth, topTransactionTypes, detailedStats } = data;

  // Find max values for scaling charts
  const maxTxnAmount = Math.max(...transactionTrends.map(d => d.amount), 1);
  const maxUsers = Math.max(...userGrowth.map(d => d.users), 1);

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
          <h3>Transaction Trends (Last 7 Days)</h3>
          <div className="chart-placeholder">
            <div className="mini-chart">
              {transactionTrends.map((data, idx) => (
                <div key={idx} className="bar-container">
                  <div className="bar" style={{ height: `${(data.amount / maxTxnAmount) * 100}%` }}></div>
                  <span className="bar-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="chart-note">Transaction volume by day</p>
        </div>

        {/* User Growth */}
        <div className="chart-card">
          <h3>User Growth (Last 7 Days)</h3>
          <div className="chart-placeholder">
            <div className="mini-chart line-chart">
              {userGrowth.map((data, idx) => (
                <div key={idx} className="point-container">
                  <div className="point" style={{ height: `${(data.users / maxUsers) * 100}%` }}></div>
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
          {topTransactionTypes.map((item, idx) => (
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
          <p className="stat-big">{detailedStats.hourlyAvg}</p>
          <p className="stat-small">Per hour transaction value</p>
        </div>
        <div className="stat-box">
          <h4>Daily Average</h4>
          <p className="stat-big">{detailedStats.dailyAvg}</p>
          <p className="stat-small">Daily transaction volume</p>
        </div>
        <div className="stat-box">
          <h4>Weekly Average</h4>
          <p className="stat-big">{detailedStats.weeklyAvg}</p>
          <p className="stat-small">Weekly transaction volume</p>
        </div>
        <div className="stat-box">
          <h4>Failed Transactions</h4>
          <p className="stat-big">{detailedStats.failureRate}</p>
          <p className="stat-small">Failure rate this week</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
