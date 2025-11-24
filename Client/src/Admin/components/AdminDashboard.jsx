import React, { useEffect, useState } from 'react';
import { Users, CreditCard, DollarSign, Activity } from 'lucide-react';
import { getDashboardStats, getRecentActivities, getQuickStats } from '../../services/adminApi';
import StatCard from './StatCard';
import ActivityTable from './ActivityTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [quickStats, setQuickStats] = useState({
    todaysTransactions: '₹0',
    newUsersToday: 0,
    serverResponseTime: '-'
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
          <p className="value">{quickStats.todaysTransactions}</p>
          <p className="sub-text">Real-time data</p>
        </div>
        <div className="quick-stat-box">
          <h3>New Users Today</h3>
          <p className="value">{quickStats.newUsersToday}</p>
          <p className="sub-text">Real-time data</p>
        </div>
        <div className="quick-stat-box">
          <h3>Server Response Time</h3>
          <p className="value">{quickStats.serverResponseTime}</p>
          <p className="sub-text">Optimal performance</p>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
