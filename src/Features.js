import React, { useState } from 'react';
import './styles/Features.css'; // Link to your CSS file

const Features = () => {
  const [showFeatures, setShowFeatures] = useState(false);

  const featuresData = [
    { title: 'Ticket Management', description: 'Ticket management with advanced features to help your customers tackle issues without sacrificing the time and effort of your customer service team.' },
    { title: 'Bots and Live Chat', description: 'Customers can communicate with your Bots and Live Chat. Live chat employees can deliver immediate and individualized customer service.' },
    { title: 'Knowledge Base', description: 'Organize, update, and store a comprehensive self-serve library of reference materials with Support’s knowledge base software.' },
    { title: 'Helpdesk Automation', description: 'Acknowledge and respond to your customers’ issues quickly with advanced helpdesk automation software that will impress your customers.' },
    { title: 'Advanced Reports', description: 'Generate advanced reports with enhanced customer service insights that accurately depict all of your customer service data in real-time.' },
    { title: 'Contact Management', description: 'Contact management software with features that help you manage your customers’ information all in one place and grow your business.' },
    { title: 'Task Management', description: 'Task Management is designed to help you stay on top of deadlines and ensure that everyone is on the same page.' },
    { title: 'Email Integration', description: 'Get total customer support with Support.cc. We offer email integration and an easy-to-use solution that allows you to create a complete support experience.' },
  ];

  return (
    <section className="features-section">
      {/* Button to toggle the features */}
      <button className="features-toggle-btn" onClick={() => setShowFeatures(!showFeatures)}>
        {showFeatures ? 'Hide Features' : 'Show Features'}
      </button>

      {/* Conditionally render the features section */}
      {showFeatures && (
        <>
          <h2 className="features-title">Explore More Features</h2>
         
          <div className="features-grid">
            {featuresData.map((feature, index) => (
              <div key={index} className="feature-card">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Features;
