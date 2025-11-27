import React from 'react';

const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h3 className="stat-title">{title}</h3>
        {Icon && (
          <div className="stat-icon-wrapper" style={{
            background: color === 'primary' ? 'rgba(0,0,0,0.05)' :
              color === 'success' ? 'rgba(0,0,0,0.05)' :
                color === 'warning' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.05)',
            color: '#111'
          }}>
            <Icon size={22} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="stat-content">
        <h2 className="stat-value">{value}</h2>
        {change && (
          <div className="stat-footer">
            <span className={`stat-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
              {change}
            </span>
            <span className="stat-period">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
