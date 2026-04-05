// ============================================
// adminFrontend/src/components/UserList.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../services/api';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.users);
      setError('');
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName} and all their children?`)) {
      return;
    }

    try {
      setDeleting(userId);
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      alert('Failed to delete user. Please try again.');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const toggleCardExpansion = (userId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedCards(newExpanded);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.babies && user.babies.some(baby =>
      baby.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const totalChildren = users.reduce((sum, user) => sum + (user.babies?.length || 0), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchUsers}>Retry</button>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="header-section">
        <div className="title-wrapper">
          <h2 className="section-title">Parent & Children Management</h2>
          <p className="section-subtitle">Manage all registered parents and their children</p>
        </div>
        
        <div className="stats-cards">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Total Parents</div>
            </div>
          </div>
          <div className="stat-card stat-secondary">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{totalChildren}</div>
              <div className="stat-label">Total Children</div>
            </div>
          </div>
          <div className="stat-card stat-tertiary">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{users.length > 0 ? (totalChildren / users.length).toFixed(1) : 0}</div>
              <div className="stat-label">Avg per Parent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search parents or children by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="results-count">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'parent' : 'parents'} found
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="empty-title">No users found</p>
          <p className="empty-text">
            {searchTerm ? 'Try adjusting your search terms' : 'No parents are registered yet'}
          </p>
        </div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map((user) => {
            const isExpanded = expandedCards.has(user._id);
            const hasChildren = user.babies && user.babies.length > 0;

            return (
              <div key={user._id} className={`user-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="user-header" onClick={() => hasChildren && toggleCardExpansion(user._id)}>
                  <div className="user-info">
                    <div className="user-avatar">
                      <svg className="avatar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="user-details">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email || 'No email provided'}</span>
                    </div>
                  </div>
                  <div className="user-actions">
                    {hasChildren && (
                      <div className="children-badge">
                        <svg className="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="badge-count">{user.babies.length}</span>
                      </div>
                    )}
                    {hasChildren && (
                      <button className="expand-btn" title={isExpanded ? 'Collapse' : 'Expand'}>
                        <span className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>▼</span>
                      </button>
                    )}
                  </div>
                </div>

                {hasChildren && (
                  <div className={`children-section ${isExpanded ? 'visible' : 'hidden'}`}>
                    <div className="children-header">
                      <span className="children-title">Children ({user.babies.length})</span>
                      <div className="children-divider"></div>
                    </div>
                    <div className="children-list">
                      {user.babies.map((baby, index) => (
                        <div key={baby._id} className="child-item" style={{ animationDelay: `${index * 0.05}s` }}>
                          <div className="child-avatar">
                            <svg className="child-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="child-info">
                            <span className="child-name">{baby.name}</span>
                            <div className="child-meta">
                              <span className="child-gender">{baby.gender}</span>
                              {baby.dateOfBirth && (
                                <>
                                  <span className="meta-separator">•</span>
                                  <span className="child-age">
                                    {calculateAge(baby.dateOfBirth)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!hasChildren && (
                  <div className="no-children">
                    <svg className="no-children-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>No children added yet</span>
                  </div>
                )}

                <div className="card-footer">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id, user.name)}
                    disabled={deleting === user._id}
                  >
                    {deleting === user._id ? (
                      <>
                        <span className="btn-spinner"></span>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete User</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const months = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
  
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
};

export default UserList;
