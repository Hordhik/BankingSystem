import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dashboardStats = [
    { label: 'Total Users', value: '2,543', color: '#667eea' },
    { label: 'Active Transactions', value: '1,284', color: '#764ba2' },
    { label: 'Total Revenue', value: '₹45,60,000', color: '#f093fb' },
    { label: 'System Health', value: '98.5%', color: '#4facfe' },
  ];

  const recentActivities = [
    { id: 1, type: 'User Registration', user: 'John Doe', time: '2 mins ago', status: 'success' },
    { id: 2, type: 'Large Transaction', user: 'Jane Smith', amount: '₹50,000', time: '5 mins ago', status: 'completed' },
    { id: 3, type: 'Failed Login Attempt', user: 'Unknown', time: '10 mins ago', status: 'warning' },
    { id: 4, type: 'Card Creation', user: 'Mike Johnson', time: '15 mins ago', status: 'success' },
    { id: 5, type: 'Password Change', user: 'Sarah Williams', time: '20 mins ago', status: 'success' },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <section className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Recent Activities */}
      <section className="recent-activities-section">
        <h2>Recent Activities</h2>
        <div className="activities-table">
          <div className="table-header">
            <div className="col-type">Activity Type</div>
            <div className="col-user">User / Reference</div>
            <div className="col-time">Time</div>
            <div className="col-status">Status</div>
          </div>
          {recentActivities.map((activity) => (
            <div key={activity.id} className="table-row">
              <div className="col-type">{activity.type}</div>
              <div className="col-user">{activity.user}</div>
              <div className="col-time">{activity.time}</div>
              <div className="col-status">
                <span className={`status-badge ${activity.status}`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="quick-stats">
        <div className="quick-stat-box">
          <h3>Today's Transactions</h3>
          <p className="value">₹2,34,56,000</p>
          <p className="sub-text">+12% from yesterday</p>
        </div>
        <div className="quick-stat-box">
          <h3>New Users Today</h3>
          <p className="value">156</p>
          <p className="sub-text">+8% from yesterday</p>
        </div>
        <div className="quick-stat-box">
          <h3>Server Response Time</h3>
          <p className="value">45ms</p>
          <p className="sub-text">Optimal performance</p>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
