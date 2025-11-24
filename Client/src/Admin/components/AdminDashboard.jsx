import React, { useEffect, useState } from 'react';
import { Users, CreditCard, DollarSign, Activity } from 'lucide-react';
import { getDashboardStats, getRecentActivities } from '../../services/adminApi';
import StatCard from './StatCard';
import ActivityTable from './ActivityTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          getDashboardStats(),
          getRecentActivities()
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIconForLabel = (label) => {
    switch (label) {
      case 'Total Users': return Users;
      case 'Active Transactions': return CreditCard;
      case 'Total Revenue': return DollarSign;
      case 'System Health': return Activity;
      default: return Activity;
    }
  };

  if (loading) {
    return <div className="admin-dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <section className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            change={stat.change}
            icon={getIconForLabel(stat.label)}
          />
        ))}
      </section>

      {/* Recent Activities */}
      <section className="recent-activities-section">
        <h2>Recent Activities</h2>
        <ActivityTable activities={activities} />
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
