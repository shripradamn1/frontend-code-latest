import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams from React Router
import axios from 'axios'; // Import axios for making API requests
import './ViewTickets.css'; // Custom CSS for the ticket details

const ViewTicketDetails = () => {
  const { title } = useParams(); // Get the title from the URL parameters
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch ticket details by title
  const fetchTicketByTitle = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/api/tickets/title/${encodeURIComponent(title)}`, {
        withCredentials: true,
      });
      setTicket(response.data);
      setLoading(false); 
    } catch (err) {
      setError('Error fetching ticket details'); 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchTicketByTitle();
  }, [title]);

  return (
    <div className="view-ticket-details-container">
      {loading ? (
        <p>Loading ticket details...</p>
      ) : error ? (
        <p>{error}</p>
      ) : ticket ? (
        <div className="ticket-details-card">
          <h2>Ticket Details</h2>
          <p><strong>ID:</strong> {ticket.id}</p>
          <p><strong>Title:</strong> {ticket.title}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
        </div>
      ) : (
        <p>No ticket details available.</p>
      )}
    </div>
  );
};

export default ViewTicketDetails;
