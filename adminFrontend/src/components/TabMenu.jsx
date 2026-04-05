
// ============================================
// adminFrontend/src/components/TabMenu.jsx
// ============================================
import React from 'react';
import './TabMenu.css';

const TabMenu = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'view-tutorials', label: 'View Tutorials', icon: '📚' },
    { id: 'update-tutorials', label: 'Update Tutorials', icon: '✏️' }
  ];

  return (
    <div className="tab-menu">
      <div className="tab-menu-content">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabMenu;

