import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/HomePageAgent.css';
import backgroundImage from '../Images/image.png';

const HomePage = () => {
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  const featuresData = [
    { title: 'ViewTickets', description: 'Ticket management with advanced features to help your customers tackle issues without sacrificing the time and effort of your customer service team.', route: '/view-tickets/agent' },
    
    { title: 'Edit Tickets', description: 'Organize, update, and store a comprehensive self-serve library of reference materials with Support’s knowledge base software.', route: '/edit-tickets/agent' }
   
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
    <div className={styles}>
    <div className="homepage-container-agent">
    <div className="header-agent">
        <div className="logo-agent"></div>
        <nav className="nav-links-agent"></nav>
        <div className="auth-buttons-agent">
            <button className="sign-in-agent" onClick={() => navigate('login/agent')}>Sign In</button>
            <button className="sign-up-agent" onClick={() => navigate('/signup/agent')}>Sign Up</button>
        </div>
    </div>

    <div className="hero-section-agent">
        <div className="hero-text-agent">
            <h1>Ticket Management</h1>
            <h3>for streamlining your helpdesk</h3>
            <p>
                Help your customer service staff in prioritizing, categorizing, assigning, and managing agents with real-time tracking of the tickets received.
            </p>
            <button className="get-started-button-agent" onClick={() => navigate('/features')}>Get Started</button>
        </div>
        <div className="hero-image-agent">
            <img src={backgroundImage} alt="Ticketing System Illustration" />
        </div>
    </div>

    <section className="features-section-agent">
        <div className="features-container-agent">
            <h2 className="features-title-agent">Explore More Features</h2>
            <div className="features-grid-agent">
                {featuresData.map((feature, index) => (
                    <div key={index} className="feature-card-agent" onClick={() => feature.route && navigate(feature.route)}>
                        <h3 className="feature-title-agent">{feature.title}</h3>
                        <p className="feature-description-agent">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>

   
</div>
</div>

  );
};

export default HomePage;
