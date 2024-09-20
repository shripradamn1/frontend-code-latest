import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const isLoggedIn = true; // Replace this with actual login state logic

  const featuresData = [
    { title: 'Create Ticket', route: '/create-ticket' },
    { title: 'View Tickets', route: '/view-tickets' },
    { title: 'Edit Tickets', route: '/edit-tickets' },
  ];

  const handleFeatureClick = (route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      setShowLoginWarning(true);
      setTimeout(() => setShowLoginWarning(false), 3000);
    }
  };

  const sectionStyle = {
    padding: '50px 20px',
    backgroundColor: '#f9fafc',
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '60px',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  };

  const cardStyle = {
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
    cursor: 'pointer',
    textAlign: 'center',
    width: '100%',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const cardHoverStyle = {
    transform: 'translateY(-10px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  };

  const cardTitleStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#007bff',
    marginBottom: '10px',
    transition: 'color 0.3s ease',
  };

  const cardTitleHoverStyle = {
    color: '#0056b3',
  };

  const cardDescriptionStyle = {
    fontSize: '16px',
    color: '#555',
    marginTop: '10px',
  };

  const warningStyle = {
    color: 'red',
    marginTop: '15px',
    fontSize: '16px',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Explore Features</h2>
        <div style={gridStyle}>
          {featuresData.map((feature, index) => (
            <div
              key={index}
              style={cardStyle}
              onClick={() => handleFeatureClick(feature.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = cardHoverStyle.transform;
                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                e.currentTarget.querySelector('h3').style.color = cardTitleHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                e.currentTarget.querySelector('h3').style.color = cardTitleStyle.color;
              }}
            >
              <h3 style={cardTitleStyle}>{feature.title}</h3>
              <p style={cardDescriptionStyle}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      {showLoginWarning && <div style={warningStyle}>Please log in to access this feature.</div>}
    </section>
  );
};

export default Features;
