import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/HomePage.css';
import backgroundImage from './Images/image.png';

const HomePage = () => {
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  const featuresData = [
    { title: 'Create Ticket', description: 'Ticket management with advanced features to help your customers tackle issues without sacrificing the time and effort of your customer service team.', route: '/create-ticket' },
    { title: 'View Tickets', description: 'Customers can communicate with your Bots and Live Chat. Live chat employees can deliver immediate and individualized customer service.', route: '/view-tickets' },
    { title: 'Edit Tickets', description: 'Organize, update, and store a comprehensive self-serve library of reference materials with Support’s knowledge base software.', route: '/edit-tickets' },
    { title: 'Helpdesk Automation', description: 'Acknowledge and respond to your customers’ issues quickly with advanced helpdesk automation software that will impress your customers.' }
  ];

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7000/api/signup', signUpData, { withCredentials: true });

      if (response.status === 200) {
        navigate('/');
      } else {
        console.error('Sign-up failed');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className="homepage-container">
      <div className="header">
        <div className="logo"></div>
        <nav className="nav-links"></nav>
        <div className="auth-buttons">
          <button className="sign-in" onClick={() => navigate('/login')}>Sign In</button>
          <button className="sign-up" onClick={() => navigate('/signup/user')}>Sign Up</button>
        </div>
      </div>

      <div className="hero-section">
        <div className="hero-text">
          <h1>Ticket Management</h1>
          <h3>for streamlining your helpdesk</h3>
          <p>
            Help your customer service staff in prioritizing, categorizing, assigning, and managing agents with real-time tracking of the tickets received.
          </p>
          <button className="get-started-button" onClick={() => navigate('/features')}>Get Started</button>
        </div>
        <div className="hero-image">
          <img src={backgroundImage} alt="Ticketing System Illustration" />
        </div>
      </div>

      <section className="features-section">
        <div className='features-container'>
          <h2 className="features-title">Explore More Features</h2>
          <div className="features-grid">
            {featuresData.map((feature, index) => (
              <div key={index} className="feature-card" onClick={() => feature.route && navigate(feature.route)}>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 Support.cc. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
