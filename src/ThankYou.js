import React from 'react';
import './styles/ThankYou.css'; // Import the CSS file for styling

const ThankYou = () => {
  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <h1>Thank you for your feedback !</h1>
        <h2>Your feedback helps us improve our service quality. We're grateful for your time and effort.</h2>
        <h3>If you need further assistance or have more to share, feel free to reach out to us:</h3>
        <h3 className="email"> <a href="mailto:telecarehelp@gmail.com">telecarehelp@gmail.com</a></h3>
        <button className="home-btn" onClick={() => window.location.href = '/'}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
