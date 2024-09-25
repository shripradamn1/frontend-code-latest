import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommonHeader from './CommonHeader'; // Adjust the path as necessary

const ViewClosedTickets = () => {
  const [closedTickets, setClosedTickets] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClosedTickets = async () => {
      try {
        const loginResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+'/checkLoggedInUser', { withCredentials: true });
        if (loginResponse.status === 200) {
          const username = loginResponse.data.username;
          localStorage.setItem('username', JSON.stringify(username));
          setIsLoggedIn(true); // Update login state

          const response = await axios.get(`http://localhost:7000/api/tickets/agent/${username}`, { withCredentials: true });
          if (Array.isArray(response.data)) {
            const filteredClosedTickets = response.data.filter(ticket => ticket.status === 'CLOSED');
            setClosedTickets(filteredClosedTickets);
          } else {
            console.error("Unexpected response data:", response.data);
            setClosedTickets([]);
          }
        } else {
          console.error("Failed to check logged-in user");
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error);
        setClosedTickets([]);
      }
    };

    fetchClosedTickets();
  }, []);

  const handleLogout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false);
    localStorage.removeItem('username');
    navigate('/agent/login/agent'); // Redirect to login after logout
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
    <>
      <CommonHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.heading}>View Closed Tickets</h1>
        </div>
        <div style={styles.ticketCardsContainer}>
          {closedTickets.length > 0 ? (
            closedTickets.map(ticket => (
              <div key={ticket.id} style={styles.ticketCard}>
                <div style={styles.ticketHeader}>
                  <h3 style={styles.ticketHeaderTitle}>{ticket.title}</h3>
                </div>
                <p style={styles.ticketDetails}><strong>Status:</strong> {ticket.status}</p>
              </div>
            ))
          ) : (
            <p style={styles.errorMessage}>No closed tickets available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewClosedTickets;
