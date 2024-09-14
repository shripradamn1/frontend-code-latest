import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import axios from 'axios'; // Import axios for making API requests
import './styles/ViewTickets.css'; // Custom CSS for the ticket boxes

const ViewTicketsUser = () => {
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch the tickets for the logged-in user
  const fetchTickets = async () => {
    try {
      // First, check the logged-in user and retrieve their userId
      const loginResponse = await axios.get('http://localhost:7000/checkLoggedInUser', {
        withCredentials: true,
      });

      const userId = loginResponse.data.id; // Assuming the response contains the user's ID in the `id` field

      // Fetch the tickets for the user using the retrieved userId
      const ticketsResponse = await axios.get(`http://localhost:7000/api/tickets/userId/${userId}`, {
        withCredentials: true,
      });
      console.log(ticketsResponse)

      setTickets(ticketsResponse.data); // Update the tickets state with the fetched tickets
      setLoading(false); // Set loading to false after tickets are fetched
    } catch (err) {
      setError('Error fetching tickets'); // Set error state in case of failure
      setLoading(false); // Ensure loading is set to false in case of error
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

  return (
    <div className="view-tickets-container">
      <div className="tickets-header">
        <h2 className="tickets-heading">My Tickets</h2>
        <button className="new-ticket-button" onClick={handleNewTicketClick}>
          New Ticket
        </button>
      </div>

      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="ticket-cards-container">
          {tickets.map((ticket) => (
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
