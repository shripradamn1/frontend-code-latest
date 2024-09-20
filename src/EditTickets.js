import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTickets = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState('');

  // Inline styles
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f7f5f2',
      minHeight: '100vh',
      fontFamily: 'Georgia, "Times New Roman", Times, serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#080707',
      fontSize: '30px',
    },
    ticketCards: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '40px',
      justifyContent: 'center',
      marginBottom: '30px',
    },
    ticketCard: {
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '15px',
      width: '250px',
      textAlign: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s', // Added transition for background-color
      marginBottom: '90px',
    },
    ticketCardHover: {
      backgroundColor: '#8b4513', // Brown color
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    ticketCardTitle: {
      margin: '0 0 10px',
      color: '#0a0909',
    },
    ticketCardText: {
      margin: '5px 0',
      color: '#070707',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 15px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '10px',
    },
    editButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    editButtonHover: {
      backgroundColor: '#0056b3',
    },
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#77c5c5',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      padding: '20px',
      zIndex: '1000',
      width: '300px',
      maxWidth: '90%',
    },
    modalHeader: {
      margin: '0 0 15px',
      color: '#333',
    },
    inputField: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#333',
    },
    textarea: {
      width: '100%',
      height: '100px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '10px',
      boxSizing: 'border-box',
      fontSize: '16px',
      color: '#333',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 15px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginRight: '10px',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    cancelButtonHover: {
      backgroundColor: '#5a6268',
    },
  };
  

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get('http://localhost:7000/checkLoggedInUser', { withCredentials: true });
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch tickets for the logged-in user once the user is available
  useEffect(() => {
    if (user) {
      const fetchTickets = async () => {
        try {
          const ticketsResponse = await axios.get(`http://localhost:7000/api/tickets/userId/${user.id}`, { withCredentials: true });
          setTickets(ticketsResponse.data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };

      fetchTickets();
    }
  }, [user]);

  // Handle edit ticket click
  const handleEditClick = (ticket) => {
    if (ticket.status.toLowerCase() === 'open') {
      setEditingTicket(ticket);
      setUpdatedDescription(ticket.description); // Set the initial description for editing
    } else {
      alert('You can only edit tickets with status "OPEN".');
    }
  };

  // Handle description update and API call to update the ticket
  const handleUpdateTicket = async () => {
    if (!editingTicket || updatedDescription === '') return;

    try {
      await axios.put(
        `http://localhost:7000/tickets/${editingTicket.id}`,
        { description: updatedDescription }, // Send the updated description only
        { withCredentials: true }
      );
      // After successful update, refresh tickets list
      const ticketsResponse = await axios.get(`http://localhost:7000/api/tickets/userId/${user.id}`, { withCredentials: true });
      setTickets(ticketsResponse.data);
      setEditingTicket(null); // Close the editing state
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update the ticket.');
    }
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Your Tickets</h2>
      <div style={styles.ticketCards}>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            style={styles.ticketCard}
            onMouseEnter={(e) => e.currentTarget.style = { ...styles.ticketCard, ...styles.ticketCardHover }}
            onMouseLeave={(e) => e.currentTarget.style = styles.ticketCard}
          >
            <h3 style={styles.ticketCardTitle}>{ticket.title}</h3>
            <p style={styles.ticketCardText}>Status: {ticket.status}</p>
            <p style={styles.ticketCardText}>Description: {ticket.description}</p>
            <button
              onClick={() => handleEditClick(ticket)}
              disabled={ticket.status.toLowerCase() !== 'open'}
              style={{
                ...styles.editButton,
                ...(ticket.status.toLowerCase() !== 'open' ? styles.editButtonDisabled : {}),
              }}
              onMouseEnter={(e) => e.currentTarget.style = { ...styles.editButton, ...styles.editButtonHover }}
              onMouseLeave={(e) => e.currentTarget.style = styles.editButton}
            >
              Edit Information
            </button>
          </div>
        ))}
      </div>

      {editingTicket && (
        <div style={styles.modal}>
          <h3 style={styles.modalHeader}>Edit Ticket: {editingTicket.title}</h3>
          <div style={styles.inputField}>
            <label style={styles.label}>Description:</label>
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>
          <button
            onClick={handleUpdateTicket}
            style={styles.button}
            onMouseEnter={(e) => e.currentTarget.style = { ...styles.button, ...styles.buttonHover }}
            onMouseLeave={(e) => e.currentTarget.style = styles.button}
          >
            Update Description
          </button>
          <button
            onClick={() => setEditingTicket(null)}
            style={{ ...styles.button, ...styles.cancelButton }}
            onMouseEnter={(e) => e.currentTarget.style = { ...styles.cancelButton, ...styles.cancelButtonHover }}
            onMouseLeave={(e) => e.currentTarget.style = styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default EditTickets;
