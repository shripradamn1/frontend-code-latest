import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ViewTickets.css';

const ViewTicketsUser = () => {
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResolved, setShowResolved] = useState(false); // Track if showing resolved tickets

  // Function to fetch all tickets for the logged-in user
  const fetchTickets = async () => {
    try {
      const loginResponse = await axios.get('http://localhost:7000/checkLoggedInUser', {
        withCredentials: true,
      });
      const userId = loginResponse.data.id;

      const ticketsResponse = await axios.get(`http://localhost:7000/api/tickets/userId/${userId}`, {
        withCredentials: true,
      });

      setTickets(ticketsResponse.data); // Set all tickets (both active and resolved)
      setLoading(false);
    } catch (err) {
      setError('Error fetching tickets');
      setLoading(false);
    }
  };

  // Use useEffect to fetch tickets when the component mounts
  useEffect(() => {
    fetchTickets();
  }, []);

  const handleNewTicketClick = () => {
    navigate('/create-ticket');
  };

  const handleTicketClick = (title) => {
    navigate(`/ticket-details/${encodeURIComponent(title)}`);
  };

  const handleShowResolvedClick = () => {
    setShowResolved(!showResolved); // Toggle between active and resolved tickets
  };

  // Filter the tickets based on the resolved state
  const filteredTickets = showResolved
    ? tickets.filter(ticket => ticket.status.toLowerCase() === 'resolved')
    : tickets.filter(ticket => ticket.status.toLowerCase() !== 'resolved');

  return (
    <div className="view-tickets-container">
      <div className="tickets-header">
        <h2 className="tickets-heading">{showResolved ? 'Resolved Tickets' : 'My Tickets'}</h2>
        <div>
          <button className="new-ticket-button" onClick={handleNewTicketClick}>
            New Ticket
          </button>
          <button className="resolved-tickets-button" onClick={handleShowResolvedClick}>
            {showResolved ? 'Show Active Tickets' : 'Resolved Tickets'}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredTickets.length === 0 ? (
        <p>No {showResolved ? 'resolved' : 'active'} tickets found.</p>
      ) : (
        <div className="ticket-cards-container">
          {filteredTickets.map((ticket) => (
            <div className="ticket-card" key={ticket.id}>
              <div className="ticket-header">
                <h3
                  style={{ cursor: 'pointer', color: '#3498db' }}
                  onClick={() => handleTicketClick(ticket.title)}
                >
                  {ticket.title}
                </h3>
              </div>
              <p><strong>Id:</strong> {ticket.id}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewTicketsUser;
