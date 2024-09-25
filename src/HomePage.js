import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from './Images/image.png';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const navigate = useNavigate();

  const featuresData = [
    { title: 'Create Ticket', route: '/create-ticket' },
    { title: 'View Tickets', route: '/view-tickets' },
    { title: 'Edit Tickets', route: '/edit-tickets' },
  ];

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL+'/checkLoggedInUser', { withCredentials: true });
        setIsLoggedIn(response.data ? true : false);
      } catch (error) {
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
      setTimeout(() => setShowLoginWarning(false), 3000);
    }
  };

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      navigate('/features');
    } else {
      setShowLoginWarning(true);
      setTimeout(() => setShowLoginWarning(false), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL+'/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const styles = {
    homepageContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '90vh',
      width: '100%',
      overflowX: 'hidden',
    },
    signUp: { marginRight: '1rem', borderRadius: '12px' },
    signIn: { marginRight: '1rem', borderRadius: '12px' },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'white',
      width: '100%',
      borderBottom: '1px solid #ddd',
    },
    heroSection: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      width: '100%',
    },
    heroText: {
      flex: 1,
      marginRight: '2rem',
    },
    heroImage: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
    },
    heroImgStyle: {
      maxWidth: '100%',
      height: 'auto',
      objectFit: 'cover',
      maxHeight: '430px',
    },
    loginWarning: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffcc00',
      color: '#333',
      textAlign: 'center',
      padding: '10px',
      fontSize: '16px',
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    },
    getStartedButton: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: '18px',
    },
    featuresSection: {
      backgroundColor: '#f9fafc',
      textAlign: 'center',
      padding: '2rem 1rem',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    featureCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s, border-color 0.3s, background-color 0.3s',
      cursor: 'pointer',
      border: '2px solid transparent',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    footer: {
      backgroundColor: '#f1f1f1',
      padding: '1rem',
      textAlign: 'center',
    },
    logoutButton: {
      backgroundColor: '#f50057',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: '16px',
      marginLeft: '1rem',
      marginRight: '50px',
    },
  };

  return (
    <div style={styles.homepageContainer}>
      {showLoginWarning && (
        <div style={styles.loginWarning}>
          <p>Please log in to access this feature!</p>
        </div>
      )}

      <header style={styles.header}>
        <div className="logo">LOGO</div>
        <div>
          {isLoggedIn ? (
            <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button style={styles.signIn} onClick={() => navigate('/login')}>Sign In</button>
              <button style={styles.signUp} onClick={() => navigate('/signup/user')}>Sign Up</button>
            </>
          )}
        </div>
      </header>

      <section style={styles.heroSection}>
        <div style={styles.heroText}>
          <h1>Ticket Management</h1>
          <h3>Streamline your helpdesk</h3>
          <button style={styles.getStartedButton} onClick={handleGetStartedClick}>Get Started</button>
        </div>
        <div style={styles.heroImage}>
          <img src={backgroundImage} alt="Ticketing System Illustration" style={styles.heroImgStyle} />
        </div>
      </section>

      <section style={styles.featuresSection}>
        <h3>Explore Features</h3>
        <div style={styles.featuresGrid}>
          {featuresData.map((feature, index) => (
            <div
              key={index}
              style={styles.featureCard}
              onClick={() => handleFeatureClick(feature.route)}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <div className="footer-links">
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
