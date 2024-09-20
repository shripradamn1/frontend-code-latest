import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]); 
  const [ticketCounts, setTicketCounts] = useState({ open: 0, pending: 0, inProgress: 0, closed: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const loginResponse = await axios.get('http://localhost:7000/checkLoggedInUser', { withCredentials: true });
        if (loginResponse.status === 200) {
          const username = loginResponse.data.username;
          localStorage.setItem('username', JSON.stringify(username));
          const response = await axios.get(`http://localhost:7000/api/tickets/agent/${username}`, { withCredentials: true });
          if (Array.isArray(response.data)) {
            setTickets(response.data);

          //  const newCount = response.data.filter(ticket => ticket.status === 'NEW').length;
            const openCount = response.data.filter(ticket => ticket.status === 'OPEN').length;
            const pendingCount = response.data.filter(ticket => ticket.status === 'PENDING').length;
            const inProgressCount = response.data.filter(ticket => ticket.status === 'IN_PROGRESS').length;
            const closedCount = response.data.filter(ticket => ticket.status === 'CLOSED').length;

            setTicketCounts({  open: openCount, pending: pendingCount, inProgress: inProgressCount, closed: closedCount });
          } else {
            console.error("Unexpected response data:", response.data);
            setTickets([]);
          }
        } else {
          console.error("Failed to check logged-in user");
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, []);

  const handleEditTicket = () => {
    navigate('/edit-tickets/agent');
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '40px',
      backgroundColor: '#f7f7f9',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Georgia, Times New Roman, Times, serif',
      position: 'relative',
    },
    button: {
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
    buttonHover: {
      backgroundColor: '#16a085',
      transform: 'translateY(-2px)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    heading: {
      fontSize: '32px',
      color: '#2c3e50',
      margin: '0',
      letterSpacing: '1px',
    },
    statusCounts: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
    },
    statusBox: {
      flex: '1',
      textAlign: 'center',
      padding: '15px', // Reduced padding
      backgroundColor: '#f7f7f9',
      borderRadius: '8px',
      margin: '20px 10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    statusTitle: {
      margin: '0',
      fontSize: '16px', // Adjusted font size
      color: '#2c3e50',
      fontWeight: '600',
    },
    statusCount: {
      margin: '5px 0 0',
      fontSize: '20px', // Reduced font size
      color: '#1abc9c',
      fontWeight: '700',
      lineHeight: '1.2', // Adjusted line height for better spacing
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
    },
    ticketDetails: {
      fontSize: '14px',
      color: '#7f8c8d',
      margin: '8px 0',
    },
    errorMessage: {
      color: 'red',
      marginTop: '20px',
    },
  };

  
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>View Tickets</h1>
        <button
          style={styles.button}
          onClick={handleEditTicket}
        >
          Edit Ticket
        </button>
      </div>
      <div style={styles.statusCounts}>
        {/* <div style={styles.statusBox}>
          {/* <h4 style={styles.statusTitle}>New</h4>
          <p style={styles.statusCount}>{ticketCounts.new}</p> */}
        {/* </div> */}
        <div style={styles.statusBox}>
          <h4 style={styles.statusTitle}>Open</h4>
          <p style={styles.statusCount}>{ticketCounts.open}</p>
        </div>
        {/* <div style={styles.statusBox}>
          <h4 style={styles.statusTitle}>Pending</h4>
          <p style={styles.statusCount}>{ticketCounts.pending}</p>
        </div> */}
        <div style={styles.statusBox}>
          <h4 style={styles.statusTitle}>In Progress</h4>
          <p style={styles.statusCount}>{ticketCounts.inProgress}</p>
        </div>
        <div style={styles.statusBox}>
          <h4 style={styles.statusTitle}>Closed</h4>
          <p style={styles.statusCount}>{ticketCounts.closed}</p>
        </div>
      </div>
      <div style={styles.ticketCardsContainer}>
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div
              key={ticket.id}
              style={{ ...styles.ticketCard, ...styles.ticketCardHover }}
            >
              <div style={styles.ticketHeader}>
                <h3 style={styles.ticketHeaderTitle}>{ticket.title}</h3>
              </div>
              <p style={styles.ticketDetails}><strong>Status:</strong> {ticket.status}</p>
            </div>
          ))
        ) : (
          <p style={styles.errorMessage}>No tickets available</p>
        )}
      </div>
    </div>
  );
}

export default ViewTickets;
