import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getAllUsers } from '../../../services/adminApi';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        const formattedUsers = data.map(u => ({
          id: u.userId,
          name: u.fullname,
          email: u.email,
          accountNumber: u.accountNumber,
          status: 'Active',
          joinDate: new Date(u.createdAt).toLocaleDateString()
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        <div>
          <h2>User Management</h2>
          <p className="user-subtitle">Manage and monitor user accounts</p>
        </div>
        <div className="header-stats">
          <span className="total-users-badge">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      <div className="user-controls">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-wrapper">
          <Filter size={16} className="filter-icon" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="status-filter">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
        </div>
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
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={selectedUser.status} onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}>
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
