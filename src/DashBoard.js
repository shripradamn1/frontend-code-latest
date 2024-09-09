import React from 'react';
import './TicketSystem.css'; // CSS file
import ticketImage from './path/to/your/image.png'; // Replace with your image path

const TicketSystem = () => {
  return (
    <div className="ticket-system-container">
      {/* Left Section */}
      <div className="left-section">
        <h1>What is a ticketing system?</h1>
        <p>
          A ticketing system is software that helps you streamline customer
          support tickets. Ticketing system software provides all the context
          you need to resolve issues and also allows you to prioritize, track,
          and automate routine support tasks.
        </p>
        <img src={ticketImage} alt="Support Illustration" className="ticket-image" />
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h1>Why do you need a ticketing system?</h1>
        <ul>
          <li>Struggling to handle customer conversations across multiple platforms.</li>
          <li>Having trouble keeping up with everyday repetitive tasks.</li>
          <li>Frequently missing high priority issues and failing to meet deadlines.</li>
          <li>Struggling to organize all of the relevant data for a ticket.</li>
          <li>Disappointing customers because of slow response time.</li>
          <li>Receiving poor customer feedback about your customer service.</li>
        </ul>
      </div>
    </div>
  );
};

export default TicketSystem;
