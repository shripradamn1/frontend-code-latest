import React, { useState } from 'react';
import './styles/HomePage.css';
import backgroundImage from './Images/ticketing-system-illustra.png';

const HomePage = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Function to handle modal close
  const closeModal = () => {
    setShowSignInModal(false);
    setShowSignUpModal(false);
  };

  return (
    <div className="homepage-container">
      {/* Header Section with Sign Up and Sign In */}
      <div className="header">
        <div className="auth-buttons">
          <button className="sign-in" onClick={() => setShowSignInModal(true)}>Sign In</button>
          <button className="sign-up" onClick={() => setShowSignUpModal(true)}>Sign Up</button>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="hero-section">
        <h1>Omnichannel Support Ticketing System</h1>
        <p>
          Easy and user-friendly features set Zoho Desk apart as one of the best online
          ticketing systems available. Take a 15-day free trial of the industry's leading
          ticketing system software!
        </p>
        <button className="get-started-button" onClick={() => setShowSignInModal(true)}>Get Started</button>
      </div>

      {/* New section with image on the left and boxes on the right */}
      <div className="container">
        <div className="left">
          <div className="illustration">
            <img src={backgroundImage} alt="Ticketing System Illustration" />
          </div>
        </div>
        <div className="right">
          {/* Ticketing System Heading */}
          <div className="ticket-management-section"></div>

          {/* Information Section */}
          <h1>What is a Ticketing System?</h1>
          <ul>
            <li>A ticketing system is a software that helps organizations manage customer service and support requests.</li>
            <li>It streamlines the communication between customers and support teams.</li>
            <li>Enables tracking and resolving issues efficiently.</li>
          </ul>

          <h1>Why do you need a Ticketing System?</h1>
          <ul>
            <li>It ensures that no customer request goes unanswered.</li>
            <li>Improves team efficiency by organizing requests and assigning them to the right people.</li>
            <li>Enhances customer satisfaction by providing timely responses.</li>
          </ul>
        </div>
      </div>

      {/* Existing content */}
      <ul className="features-list">
        <li className="feature-item">
          <a href="/desk/multi-channel-ticketing-system.html">
            <h3>Omnichannel</h3>
            <p>Be available for your customers, whatever channel of communication they choose.</p>
          </a>
        </li>
        <li className="feature-item">
          <a href="/desk/multibrand-help-center.html">
            <h3>Multi-brand Help Center</h3>
            <p>Create a distinct self-service portal for each brand's customers.</p>
          </a>
        </li>
        <li className="feature-item">
          <a href="/desk/customer-support-email-management.html">
            <h3>Email</h3>
            <p>Enable simple email communication, fueled by context.</p>
          </a>
        </li>
        <li className="feature-item">
          <a href="/desk/call-center-software.html">
            <h3>Telephony</h3>
            <p>Here are good old phone conversations with a helping of context.</p>
          </a>
        </li>
        <li className="feature-item">
          <a href="/desk/live-chat-ticketing-software.html">
            <h3>Live Chat</h3>
            <p>Offer real-time chat support with our Business Messaging platform.</p>
          </a>
        </li>
      </ul>

      <div className="help-navigation-section">
        <h2>Need help navigating your way?</h2>
        <div className="help-options">
          <div className="help-option">
            <p>Complete self-service HR tasks and view employment summary information</p>
            <button className="help-button">Workday</button>
          </div>
          <div className="help-option">
            <p>Get help from our friendly People Solutions team</p>
            <button className="help-button">Submit a request</button>
          </div>
          <div className="help-option">
            <p>View your existing requests</p>
            <button className="help-button">My requests</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Ticketing System. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Sign In</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="submit-button">Sign In</button>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Sign Up</h2>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="submit-button">Sign Up</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
