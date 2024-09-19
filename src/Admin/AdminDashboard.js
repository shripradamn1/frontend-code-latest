import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const navigate = useNavigate();

  const featuresData = [
    { title: 'Categories', route: '/categories/admin' },
    { title: 'Teams', route: '/teams/admin' },
    { title: 'Agents', route: '/viewAgents/admin' },
    { title: 'Create Agent', route: '/CreateAgents/admin' }
  ];

  const [hovered, setHovered] = useState(null);

  const featureCardStyle = (isHovered) => ({
    backgroundColor: isHovered ? '#007bff' : '#f8f9fa', // Change on hover
    color: isHovered ? '#efcaca' : '#343a40', // Change text color on hover
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    height: '200px', // Adjust the card height
    overflow: 'hidden',
    textAlign: 'center',
    marginTop: '30px',
    fontFamily: 'Georgia, "Times New Roman", Times, serif'
  });

  const cardBodyStyle = {
    padding: '30px',
    textAlign: 'center'
  };

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
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container my-4">
      {showLoginWarning && (
        <div className="alert alert-warning text-center" role="alert">
          Please log in to access this feature!
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Ticket Management</a>
          <div className="collapse navbar-collapse justify-content-end">
            {isLoggedIn ? (
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <button className="btn btn-outline-primary me-2" onClick={() => navigate('/login/admin')}>Sign In</button>
                {/* <button className="btn btn-outline-secondary" onClick={() => navigate('/signup/user')}>Sign Up</button> */}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Feature Cards */}
      <div className="custom-features-container mt-4">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className="col"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div 
                className="card h-100 d-flex align-items-center justify-content-center text-center"
                style={featureCardStyle(hovered === index)} // Apply hover styles conditionally
                onClick={() => handleFeatureClick(feature.route)}
              >
                <div className="card-body" style={cardBodyStyle}>
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-text">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
