
// ============================================
// adminFrontend/src/pages/Welcome.jsx
// ============================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Welcome.css';

import logo from '../assets/logo.png';

const Welcome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="logo-circle">
          <img src={logo} alt="CryTrack Logo" className="welcome-logo" />
        </div>
        <div className="logo-text">CryTrack</div>

        <h1 className="welcome-title">Welcome to CryTrack</h1>
        <p className="welcome-subtitle">Admin Management Portal</p>

        <button
          className="get-started-btn"
          onClick={() => navigate('/login')}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default Welcome;

