import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  viewTicketsContainer: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '40px',
    backgroundColor: '#f7f7f9',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    position: 'relative',
  },
  newTicketButton: {
    backgroundColor: '#1abc9c',
    color: '#fff',
    padding: '14px 28px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
  },
  newTicketButtonHover: {
    backgroundColor: '#16a085',
    transform: 'translateY(-2px)',
  },
  ticketsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  ticketsHeading: {
    fontSize: '32px',
    color: '#2c3e50',
    margin: '0',
    letterSpacing: '1px',
  },
  ticketCardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    justifyContent: 'center',
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    width: '320px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
  },
  ticketCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  ticketHeaderTitle: {
    fontSize: '20px',
    margin: '0',
    color: '#34495e',
    fontWeight: '700',
    cursor: 'pointer',
    color: '#3498db',
  },
  priorityTag: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  priorityHigh: {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
  priorityMedium: {
    backgroundColor: '#f39c12',
    color: '#fff',
  },
  priorityLow: {
    backgroundColor: '#27ae60',
    color: '#fff',
  },
  ticketCardText: {
    fontSize: '14px',
    color: '#7f8c8d',
    margin: '8px 0',
  },
  ticketCardTextStrong: {
    color: '#2c3e50',
  },
  selectedTicketDetails: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f2f2f2',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  errorMessage: {
    color: 'red',
    marginTop: '20px',
  },
  viewTicketDetailsContainer: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '30px',
    backgroundColor: '#e9ecef',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
  },
  ticketDetailsCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #dcdcdc',
    borderRadius: '10px',
    padding: '30px',
    margin: '20px 0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  ticketDetailsCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  },
  statusItem: {
    flex: '1',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f7f7f9',
    borderRadius: '8px',
    margin: '0 10px',
  },
  statusItemTitle: {
    margin: '0',
    fontSize: '18px',
    color: '#2c3e50',
  },
  statusItemText: {
    margin: '5px 0 0',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px', // Adds space between buttons
  },
};

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
    ? tickets.filter(ticket => ticket.status && ticket.status.toLowerCase() === 'resolved')
    : tickets.filter(ticket => ticket.status && ticket.status.toLowerCase() !== 'resolved');

  return (
    <div style={styles.viewTicketsContainer}>
      <div style={styles.ticketsHeader}>
        <h2 style={styles.ticketsHeading}>{showResolved ? 'Resolved Tickets' : 'My Tickets'}</h2>
        <div style={styles.buttonContainer}>
          <button
            style={styles.newTicketButton}
            onClick={handleNewTicketClick}
          >
            
            New Ticket
          </button>
          <button
            style={styles.newTicketButton}
            onClick={handleShowResolvedClick}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#16a085'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1abc9c'}
          >
            {showResolved ? 'Show Active Tickets' : 'Resolved Tickets'}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p style={styles.errorMessage}>{error}</p>
      ) : filteredTickets.length === 0 ? (
        <p>No {showResolved ? 'resolved' : 'active'} tickets found.</p>
      ) : (
        <div style={styles.ticketCardsContainer}>
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                ...styles.ticketCard,
                ...(showResolved
                  ? styles.ticketDetailsCardHover
                  : styles.ticketCardHover),
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={styles.ticketHeader}>
                <h3
                  style={styles.ticketHeaderTitle}
                  onClick={() => handleTicketClick(ticket.title)}
                >
                  {ticket.title}
                </h3>
                <span
                  style={{
                    ...styles.priorityTag,
                    ...(ticket.priority && ticket.priority.toLowerCase() === 'high'
                      ? styles.priorityHigh
                      : ticket.priority && ticket.priority.toLowerCase() === 'medium'
                      ? styles.priorityMedium
                      : ticket.priority && ticket.priority.toLowerCase() === 'low'
                      ? styles.priorityLow
                      : {}), // Default style if priority is undefined or not recognized
                  }}
                >
                  {ticket.priority || ''} {/* Display 'N/A' if priority is undefined */}
                </span>
              </div>
              <p style={styles.ticketCardText}>
                <strong style={styles.ticketCardTextStrong}>Status:</strong> {ticket.status}
              </p>
              <p style={styles.ticketCardText}>
                {/* <strong style={styles.ticketCardTextStrong}>Created On:</strong> {ticket.createdOn} */}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewTicketsUser;
