import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/'); // Adjust path based on your routes
  };

  const successPageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: '20px',
  };

  const messageStyle = {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
    lineHeight: '1.6',
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#45a049',
  };

  return (
    <div style={successPageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Success!</h1>
        <h3 style={messageStyle}>
          Your ticket has been created successfully. You can go back to the
          dashboard to manage your tickets.
        </h3>
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
