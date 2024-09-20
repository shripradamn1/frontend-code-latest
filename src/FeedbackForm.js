import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/FeedbackForm.css'; // Import the CSS

const FeedbackForm = () => {
  const { ticketId } = useParams(); // Get the ticket ID from the URL
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable the button while submitting
  const navigate = useNavigate(); // To redirect after successful feedback submission

  const submitFeedback = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Disable the button during form submission

    const feedbackData = { comment, rating };

    try {
      await axios.post(`http://localhost:7000/api/feedback/${ticketId}`, feedbackData); // Send feedback to backend
    //   alert('Feedback submitted successfully!');
      navigate('/ThankYou'); // Redirect to thank you page
    } catch (error) {
      console.error("There was an error submitting the feedback", error);
      alert("An error occurred while submitting the feedback. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <div className="feedback-page"> {/* Add this wrapper */}
      <div className="feedback-card">
        <h2>Submit Feedback for Ticket #{ticketId}</h2>
        <form onSubmit={submitFeedback}>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <label>Rating:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>

          <button type="submit" disabled={isSubmitting}>Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
