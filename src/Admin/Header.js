import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBell, FaTags, FaUsers, FaUserPlus, FaHome } from 'react-icons/fa';

const Header = ({ isLoggedIn, onLogout }) => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const featuresData = [
    { title: 'Home', route: '/admin', icon: <FaHome /> },
    { title: 'Categories', route: '/categories/admin', icon: <FaTags /> },
    { title: 'Teams', route: '/teams/admin', icon: <FaUsers /> },
    { title: 'Agents', route: '/viewAgents/admin', icon: <FaUserCircle /> },
    { title: 'Create Agent', route: '/CreateAgents/admin', icon: <FaUserPlus /> },
  ];

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <header style={{
      backgroundColor: '#fff',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
      width: '100%',
      position: 'fixed',
      top: '0',
      zIndex: '1000',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {featuresData.map((feature, index) => {
          const isActive = location.pathname === feature.route;
          return (
            <div
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleFeatureClick(feature.route)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                color: isActive || hovered === index ? '#007bff' : '#343a40'
              }}
            >
              {feature.icon}
              <span>{feature.title}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isLoggedIn ? (
          <button style={{
            backgroundColor: '#f4d7d1',
            border: '1px solid #dc3545',
            color: '#dc3545',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px'
          }} onClick={onLogout}>Logout</button>
        ) : (
          <button style={{
            backgroundColor: 'transparent',
            border: '1px solid #007bff',
            color: '#007bff',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px'
          }} onClick={() => navigate('/login/admin')}>Sign In</button>
        )}
      </div>
    </header>
  );
};

export default Header;
