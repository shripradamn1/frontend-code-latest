import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaBell, FaTags, FaUsers, FaUserPlus } from 'react-icons/fa';
 
const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const navigate = useNavigate();
 
  const featuresData = [
    { title: 'Categories', route: '/categories/admin', icon: <FaTags /> },
    { title: 'Teams', route: '/teams/admin', icon: <FaUsers /> },
    { title: 'Agents', route: '/viewAgents/admin', icon: <FaUserCircle /> },
    { title: 'Create Agent', route: '/CreateAgents/admin', icon: <FaUserPlus /> }
  ];
 
  const [hovered, setHovered] = useState(null);
 
  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const response = await axios.get('http://localhost:7000/checkLoggedInUser', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        setIsLoggedIn(response.data ? true : false);
      } catch (error) {
        console.error('Error checking logged-in status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoggedInStatus();
  }, []);
 
  const handleFeatureClick = (route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      setShowLoginWarning(true);
      setTimeout(() => {
        setShowLoginWarning(false);
      }, 3000);
    }
  };
 
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:7000/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/login/admin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

 
  const featureCardStyle = (isHovered) => ({
    backgroundColor:'#f4d7d1',
    background: isHovered ? '#5d99f6' : '#f8f9fa',
    color: isHovered ? '#fff' : '#343a40',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    height: '180px',
    width:'600px',
    textAlign: 'center',
    marginTop: '30px',
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  });
 
  const cardBodyStyle = {
    padding: '20px',
    textAlign: 'center'
  };
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showLoginWarning && (
        <div style={{
          backgroundColor: '#ffc107',
          color: '#856404',
          padding: '10px',
          textAlign: 'center',
          width: '100%',
          position: 'fixed',
          top: '0',
          zIndex: '1001'
        }}>
          Please log in to access this feature!
        </div>
      )}
 
      {/* Header */}
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
          {featuresData.map((feature, index) => (
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
                color: hovered === index ? '#007bff' : '#343a40'
              }}
            >
              {feature.icon}
              <span>{feature.title}</span>
            </div>
          ))}
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
            }} onClick={handleLogout}>Logout</button>
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
 
      {/* Main Content */}
      <div style={{ flex: '1', padding: '20px', marginTop: '100px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {featuresData.map((feature, index) => (
            <div
              key={index}
              style={{
                flex: '1 1 45%', // Two cards per row
                maxWidth: '45%',
                boxSizing: 'border-box'
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                style={featureCardStyle(hovered === index)} // Apply hover styles conditionally
                onClick={() => handleFeatureClick(feature.route)}
              >
                <div style={cardBodyStyle}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{feature.icon}</div>
                  <h3 style={{ margin: '0', fontSize: '18px' }}>{feature.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Footer */}
      <footer style={{
        backgroundColor: '#f8f9fa',
        padding: '5px 0', // Reduced padding for smaller height
        textAlign: 'center',
        borderTop: '1px solid #ddd',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <p>© 2024 Ticket Support. All rights reserved.</p>
        <p>
          <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>Privacy Policy</a> |
          <a href="#" style={{ color: '#007bff', textDecoration: 'none', marginLeft: '1px' }}>Terms of Service</a>
        </p>
      </footer>
    </div>
  );
};
 
export default AdminDashboard;
