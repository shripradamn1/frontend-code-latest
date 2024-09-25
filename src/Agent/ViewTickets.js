import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]); 
  const [ticketCounts, setTicketCounts] = useState({ open: 0, resolved: 0, inProgress: 0, closed: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const loginResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+'/checkLoggedInUser', { withCredentials: true });
        if (loginResponse.status === 200) {
          const username = loginResponse.data.username;
          localStorage.setItem('username', JSON.stringify(username));
          const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/api/tickets/agent/${username}`, { withCredentials: true });
          if (Array.isArray(response.data)) {
            setTickets(response.data);

            const openCount = response.data.filter(ticket => ticket.status === 'OPEN').length;
            const resolvedCount = response.data.filter(ticket => ticket.status === 'RESOLVED').length;
            const inProgressCount = response.data.filter(ticket => ticket.status === 'IN_PROGRESS').length;
            const closedCount = response.data.filter(ticket => ticket.status === 'CLOSED').length;

            setTicketCounts({ open: openCount, resolved: resolvedCount, inProgress: inProgressCount, closed: closedCount });
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

  const chartData = {
    labels: ['Open', 'Resolved', 'In Progress', 'Closed'],
    datasets: [
      {
        label: 'Ticket Status',
        data: [ticketCounts.open, ticketCounts.resolved, ticketCounts.inProgress, ticketCounts.closed],
        backgroundColor: ['#1abc9c', '#2ecc71', '#f39c12', '#e74c3c'],
        borderColor: ['#16a085', '#27ae60', '#e67e22', '#c0392b'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ticket Status Overview',
      },
    },
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
    chartContainer: {
      marginBottom: '30px',
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
    statusHeading: {
      fontSize: '24px',
      color: '#2c3e50',
      margin: '20px 0 10px',
      fontWeight: 'bold',
    },
    errorMessage: {
      color: 'red',
      marginTop: '20px',
    },
  };

  const groupTicketsByStatus = (status) => {
    return tickets
      .filter(ticket => ticket.status === status)
      .map(ticket => (
        <div
          key={ticket.id}
          style={{ ...styles.ticketCard, ...styles.ticketCardHover }}
        >
          <div style={styles.ticketHeader}>
            <h3 style={styles.ticketHeaderTitle}>{ticket.title}</h3>
          </div>
          <p style={styles.ticketDetails}><strong>Status:</strong> {ticket.status}</p>
        </div>
      ));
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

      <div style={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Grouped Ticket Cards */}
      {tickets.length > 0 ? (
        <>
          <h2 style={styles.statusHeading}>Open Tickets</h2>
          <div style={styles.ticketCardsContainer}>
            {groupTicketsByStatus('OPEN')}
          </div>

          <h2 style={styles.statusHeading}>Resolved Tickets</h2>
          <div style={styles.ticketCardsContainer}>
            {groupTicketsByStatus('RESOLVED')}
          </div>

          <h2 style={styles.statusHeading}>In Progress Tickets</h2>
          <div style={styles.ticketCardsContainer}>
            {groupTicketsByStatus('IN_PROGRESS')}
          </div>

          <h2 style={styles.statusHeading}>Closed Tickets</h2>
          <div style={styles.ticketCardsContainer}>
            {groupTicketsByStatus('CLOSED')}
          </div>
        </>
      ) : (
        <p style={styles.errorMessage}>No tickets available</p>
      )}
    </div>
  );
}

export default ViewTickets;
