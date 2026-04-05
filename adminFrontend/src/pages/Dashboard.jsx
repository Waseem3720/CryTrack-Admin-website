
// ============================================
// adminFrontend/src/pages/Dashboard.jsx
// ============================================
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TabMenu from '../components/TabMenu';
import UserList from '../components/UserList';
import TutorialList from '../components/TutorialList';
import AddTutorialForm from '../components/AddTutorialForm';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserList />;
      case 'view-tutorials':
        return <TutorialList />;
      case 'update-tutorials':
        return <AddTutorialForm />;
      default:
        return <UserList />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
