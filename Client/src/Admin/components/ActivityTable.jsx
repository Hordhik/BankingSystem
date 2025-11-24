import React from 'react';
import PropTypes from 'prop-types';
import './AdminDashboard.css';

const ActivityTable = ({ activities }) => {
  return (
    <div className="activities-table">
      <div className="table-header">
        <div className="col-type">Activity Type</div>
        <div className="col-user">User / Reference</div>
        <div className="col-time">Time</div>
        <div className="col-status">Status</div>
      </div>
      {activities.length > 0 ? (
        activities.map((activity) => (
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
        ))
      ) : (
        <div className="table-row" style={{ justifyContent: 'center', color: '#888' }}>
          No recent activities found.
        </div>
      )}
    </div>
  );
};

ActivityTable.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ActivityTable;
