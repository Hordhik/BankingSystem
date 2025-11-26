import React from 'react';
import './AdminDashboard.css';
import StatCard from './StatCard';
import { Users, CreditCard, DollarSign, Activity, Clock, TrendingUp, Server } from 'lucide-react';

const AdminDashboard = () => {
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
        <StatCard
          title="Total Users"
          value="1"
          change="+12%"
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Active Transactions"
          value="0"
          change="+5%"
          icon={CreditCard}
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value="₹0"
          change="+18%"
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Avg Transaction Value"
          value="₹0"
          change="+3%"
          icon={Activity}
          color="primary"
        />
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="activities-table">
            <thead>
              <tr>
                <th>Activity Type</th>
                <th>User / Reference</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="no-activities">
                  <div className="empty-state">
                    <Clock size={48} strokeWidth={1} />
                    <p>No recent activities found</p>
                    <span>New activities will appear here</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
            <p className="card-value">₹0</p>
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
            <p className="card-value">1</p>
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
            <p className="card-value">27ms</p>
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
