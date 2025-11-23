import React, { useState } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', accountNumber: '1234567890', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', accountNumber: '0987654321', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', accountNumber: '5555666677', status: 'Inactive', joinDate: '2024-03-10' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', accountNumber: '1111222233', status: 'Active', joinDate: '2024-04-05' },
    { id: 5, name: 'Robert Brown', email: 'robert@example.com', accountNumber: '9999888877', status: 'Suspended', joinDate: '2024-05-12' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>User Management</h2>
        <button className="btn-add-user">+ Add New User</button>
      </div>

      <div className="user-filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="status-filter">
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Suspended</option>
        </select>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="col-name">Name</div>
          <div className="col-email">Email</div>
          <div className="col-account">Account Number</div>
          <div className="col-status">Status</div>
          <div className="col-joindate">Join Date</div>
          <div className="col-actions">Actions</div>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user.id} className="table-row">
              <div className="col-name">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                {user.name}
              </div>
              <div className="col-email">{user.email}</div>
              <div className="col-account">{user.accountNumber}</div>
              <div className="col-status">
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
              <div className="col-joindate">{user.joinDate}</div>
              <div className="col-actions">
                <button className="btn-action edit" onClick={() => handleEditUser(user)}>Edit</button>
                <button className="btn-action delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-users">No users found</div>
        )}
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={(e) => {
              e.preventDefault();
              handleSaveUser(selectedUser);
            }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={selectedUser.status} onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
