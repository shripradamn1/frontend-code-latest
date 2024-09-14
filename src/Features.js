import React, { useState } from 'react';
import './styles/Features.css'; // Link to your CSS file

const Features = () => {
  const [showFeatures, setShowFeatures] = useState(false);

  const featuresData = [
    { title: 'Create Ticket ', description: 'Ticket management with advanced features to help your customers tackle issues without sacrificing the time and effort of your customer service team.' },
    { title: 'View Tickets', description: 'Customers can communicate with your Bots and Live Chat. Live chat employees can deliver immediate and individualized customer service.' },
    { title: 'Edit Tickets', description: 'Organize, update, and store a comprehensive self-serve library of reference materials with Support’s knowledge base software.' },
    { title: 'Helpdesk Automation', description: 'Acknowledge and respond to your customers’ issues quickly with advanced helpdesk automation software that will impress your customers.' }
    
  ];

  return (
    <section className="features-section">
      {/* Button to toggle the features */}
      <button className="features-toggle-btn" onClick={() => setShowFeatures(!showFeatures)}>
        {showFeatures ? 'Hide Features' : 'Show Features'}
      </button>

      {/* Conditionally render the features section */}
      {showFeatures && (
        <div className='features-container'>
          <h2 className="features-title">Explore More Features</h2>
         
          <div className="features-grid">
            {featuresData.map((feature, index) => (
              <div key={index} className="feature-card">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Features;
