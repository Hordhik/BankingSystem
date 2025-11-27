import React from 'react';
import './AdminDashboard.css';
import StatCard from './StatCard';
import { Users, CreditCard, DollarSign, Activity, Clock, TrendingUp, Server } from 'lucide-react';

import { getDashboardStats, getRecentActivities, getQuickStats } from '../../../services/adminApi';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [quickStats, setQuickStats] = useState({
    todaysTransactions: '₹0',
    newUsersToday: 0,
    serverResponseTime: '0ms'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activitiesData, quickStatsData] = await Promise.all([
          getDashboardStats(),
          getRecentActivities(),
          getQuickStats()
        ]);
        setStats(statsData);
        setActivities(activitiesData);
        setQuickStats(quickStatsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="admin-dashboard">Loading dashboard...</div>;
  }
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard Overview</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat, index) => {
          let Icon = Users;
          if (stat.label === 'Active Transactions') Icon = CreditCard;
          if (stat.label === 'Total Revenue') Icon = DollarSign;
          if (stat.label === 'Avg Transaction Value') Icon = Activity;

          return (
            <StatCard
              key={index}
              title={stat.label}
              value={stat.value}
              change={stat.change}
              icon={Icon}
              color={stat.color}
            />
          );
        })}
      </div>

      <div className="system-health-section">
        <h3>System Health</h3>
        <div className="health-grid">
          <div className="health-card">
            <div className="health-icon success">
              <Server size={20} />
            </div>
            <div className="health-info">
              <span className="health-label">Database Status</span>
              <span className="health-value">Operational</span>
            </div>
            <div className="health-status-indicator online"></div>
          </div>

          <div className="health-card">
            <div className="health-icon warning">
              <Activity size={20} />
            </div>
            <div className="health-info">
              <span className="health-label">API Latency</span>
              <span className="health-value">45ms</span>
            </div>
            <div className="health-metric">Avg</div>
          </div>

          <div className="health-card">
            <div className="health-icon info">
              <Clock size={20} />
            </div>
            <div className="health-info">
              <span className="health-label">System Uptime</span>
              <span className="health-value">99.9%</span>
            </div>
            <div className="health-metric">30d</div>
          </div>

          <div className="health-card">
            <div className="health-icon primary">
              <TrendingUp size={20} />
            </div>
            <div className="health-info">
              <span className="health-label">Last Backup</span>
              <span className="health-value">2h ago</span>
            </div>
            <div className="health-metric">Auto</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header-icon">
            <div className="icon-bg">
              <TrendingUp size={24} />
            </div>
          </div>
          <div>
            <h3>Today's Transactions</h3>
            <p className="card-value">{quickStats.todaysTransactions}</p>
          </div>
          <div className="card-footer">
            <span>Real-time data</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header-icon">
            <div className="icon-bg">
              <Users size={24} />
            </div>
          </div>
          <div>
            <h3>New Users Today</h3>
            <p className="card-value">{quickStats.newUsersToday}</p>
          </div>
          <div className="card-footer">
            <span>Real-time data</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header-icon">
            <div className="icon-bg">
              <Server size={24} />
            </div>
          </div>
          <div>
            <h3>Server Response Time</h3>
            <p className="card-value">{quickStats.serverResponseTime}</p>
          </div>
          <div className="card-footer">
            <span style={{ color: '#10b981' }}>Optimal performance</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header-icon">
            <div className="icon-bg">
              <Clock size={24} />
            </div>
          </div>
          <div>
            <h3>Pending Loans</h3>
            <p className="card-value">0</p>
          </div>
          <div className="card-footer">
            <span>Requires attention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
