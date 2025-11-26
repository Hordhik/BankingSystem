import React from 'react';

const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h3 className="stat-title">{title}</h3>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={20} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="stat-content">
        <h2 className="stat-value">{value}</h2>
        {change && (
          <span className={`stat-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
