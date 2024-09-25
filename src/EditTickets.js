import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const EditTickets = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState('');

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Inline styles
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f7f5f2',
      minHeight: '100vh',
      fontFamily: 'Georgia, "Times New Roman", Times, serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      color: '#080707',
      fontSize: '36px',
      fontWeight: 'bold',
    },
    homeButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s, transform 0.2s',
    },
    homeButtonHover: {
      backgroundColor: '#0056b3',
      transform: 'scale(1.05)',
    },
    ticketCards: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
    },
    ticketCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '280px',
      textAlign: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s',
      willChange: 'transform', // Ensure smooth hover animation
    },
    ticketCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    ticketCardTitle: {
      margin: '0 0 10px',
      color: '#0a0909',
      fontSize: '24px',
      fontWeight: 'bold',
      lineHeight: '1.2', // Prevent height shifts
    },
    ticketCardText: {
      margin: '5px 0',
      color: '#555',
      fontSize: '16px',
      lineHeight: '1.5', // Ensure consistency in text size
    },
    editButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.2s',
      marginTop: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    editButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    editButtonHover: {
      backgroundColor: '#0056b3',
      transform: 'scale(1.05)',
    },
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      padding: '30px',
      zIndex: '1000',
      width: '300px',
      maxWidth: '90%',
      animation: 'fadeIn 0.3s',
    },
    modalHeader: {
      margin: '0 0 15px',
      color: '#333',
      fontSize: '20px',
      fontWeight: 'bold',
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
      transition: 'border-color 0.3s',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.2s',
      marginRight: '10px',
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
      transform: 'scale(1.05)',
    },
    cancelButtonHover: {
      backgroundColor: '#5a6268',
    },
  };

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+'/checkLoggedInUser', { withCredentials: true });
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
          const ticketsResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+`/api/tickets/userId/${user.id}`, { withCredentials: true });
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
      //console.log( process.env.REACT_APP_BACKEND_URL+`api/tickets/${editingTicket.id}`+" "+ process.env.REACT_APP_BACKEND_URL+`/api/tickets/userId/${user.id}`)
      await axios.put(
        process.env.REACT_APP_BACKEND_URL+`/api/tickets/${editingTicket.id}`,
         updatedDescription ,{headers:{'Content-Type':'text/plain'}},
        { withCredentials: true }
      );
      console.log(updatedDescription)
      console.log("uId "+user.id)
      // After successful update, refresh tickets list
      const ticketsResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+`/api/tickets/userId/${user.id}`, { withCredentials: true });
      
      setTickets(ticketsResponse.data);
      setEditingTicket(null); 
      alert('ticket is updated')// Close the editing state
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
      {/* Header with Home Button */}
      <div style={styles.header}>
        <h2>Edit Tickets</h2>
        <button
          style={styles.homeButton}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.homeButtonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.homeButton)}
        >
          Home
        </button>
      </div>

      <div style={styles.ticketCards}>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            style={styles.ticketCard}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.ticketCardHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.ticketCard)}
          >
            <h3 style={styles.ticketCardTitle}>{ticket.title}</h3>
           
            {/* <p style={styles.ticketCardText}>Description: {ticket.description}</p> */}
            <button
              onClick={() => handleEditClick(ticket)}
              disabled={ticket.status.toLowerCase() !== 'open'}
              style={{
                ...styles.editButton,
                ...(ticket.status.toLowerCase() !== 'open' ? styles.editButtonDisabled : {}),
              }}
              onMouseEnter={(e) =>
                ticket.status.toLowerCase() === 'open' &&
                Object.assign(e.currentTarget.style, styles.editButtonHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, ticket.status.toLowerCase() === 'open' ? styles.editButton : styles.editButtonDisabled)
              }
            >
              {ticket.status.toLowerCase() === 'open' ? 'Edit Ticket' : 'Cannot Edit'}
            </button>
          </div>
        ))}
      </div>

      {/* Modal for editing ticket */}
      {editingTicket && (
        <div style={styles.modal}>
          <h3 style={styles.modalHeader}>Edit Ticket</h3>
          <div style={styles.inputField}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
          </div>
          <button
            onClick={handleUpdateTicket}
            style={styles.button}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditingTicket(null)}
            style={{ ...styles.button, ...styles.cancelButton }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cancelButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default EditTickets;
