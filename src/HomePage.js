import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import axios from 'axios';
import './styles/HomePage.css';
import backgroundImage from './Images/image.png';
import Features from './Features';

const HomePage = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Create a ref for the Features section
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const closeModal = () => {
    setShowSignInModal(false);
  };

  // Handle input changes for the sign-up form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle sign-up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Make the POST request for signup
      const response = await axios.post('http://localhost:7000/api/signup', signUpData, { withCredentials: true });

      if (response.status === 200) {
        // If sign up is successful, navigate to the 'signin/user' page
        navigate('/signin/user');
      } else {
        console.error('Sign-up failed');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className="homepage-container">
      {/* Header Section */}
      <div className="header">
        <div className="logo">
          {/* Replace with actual logo */}
        </div>
        <nav className="nav-links">
          {/* Add navigation links here */}
        </nav>
        <div className="auth-buttons">
          <button className="sign-in" onClick={() => setShowSignInModal(true)}>Sign In</button>
          <button className="sign-up" onClick={() => navigate('/signup/user')}>Sign Up</button> 
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Ticket Management</h1>
          <h3>for streamlining your helpdesk</h3>
          <p>
            Help your customer service staff in prioritizing, categorizing, assigning, and managing agents with real-time tracking of the tickets received.
          </p>
          <button className="get-started-button" onClick={() => navigate('/signup/user')}>Get Started</button> {/* Navigate to sign-up page */}
        </div>
        <div className="hero-image">
          <img src={backgroundImage} alt="Ticketing System Illustration" />
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef}>
        <Features />
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Support.cc. All rights reserved.</p>
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
    </div>
  );
};

export default HomePage;
