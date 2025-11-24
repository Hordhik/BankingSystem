import React from 'react';
import PropTypes from 'prop-types';
import './AdminDashboard.css'; // Reusing existing CSS for now

const StatCard = ({ label, value, color, icon: Icon, change }) => {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="stat-label" style={{ marginBottom: 0 }}>{label}</p>
        {Icon && <Icon size={20} color={color} />}
      </div>
      <p className="stat-value" style={{ color: color, marginTop: '10px' }}>{value}</p>
      {change && <p className="stat-change" style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>{change}</p>}
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
  icon: PropTypes.elementType,
  change: PropTypes.string
};

export default StatCard;
