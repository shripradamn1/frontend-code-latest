import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ViewTickets.css';

const columns = () => [
  {
    name: 'Ticket ID',
    selector: row => row.id,
    cell: row => (
      <div className="data-table-cell">
        <span className={`status-dot ${row.status?.toLowerCase()}`}></span>
        {row.id}
      </div>
    ),
  },{
    name: 'Title',
    selector: row => row.name, 
    cell: row => (
      <div className="data-table-cell">
        {row.name ? row.name : 'No Title'} 
      </div>
    ),
  },
  {
    name: 'Status',
    selector: row => row.status,
    cell: row => (
      <div className="data-table-cell">
        {row.status}
      </div>
    ),
  },
];

const customStyles = {
  headCells: {
    style: {
      backgroundColor: '#f4f4f4',
      fontWeight: 'bold',
      color: '#333',
    },
  },
  rows: {
    style: {
      backgroundColor: '#fff',
      '&:nth-of-type(even)': {
        backgroundColor: '#f9f9f9',
      },
    },
  },
  cells: {
    style: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
  },
};

function ViewTickets() {
  const [tickets, setTickets] = useState([]); // Initialize with empty array
  const [ticketCounts, setTicketCounts] = useState({ new: 0, open: 0, pending: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // First check the logged-in user
        const loginResponse = await axios.get('http://localhost:7000/checkLoggedInUser', {
          withCredentials: true,
        });
        if (loginResponse.status === 200) {
          const username = loginResponse.data.username;
          localStorage.setItem('username', JSON.stringify(username));
          const response = await axios.get(`http://localhost:7000/api/tickets/agent/${username}`, { withCredentials: true });
          console.log('Fetched Tickets:', response.data);
          if (Array.isArray(response.data)) {
            setTickets(response.data);
            const newCount = response.data.filter(ticket => ticket.status === 'NEW').length;
            const openCount = response.data.filter(ticket => ticket.status === 'OPEN').length;
            const pendingCount = response.data.filter(ticket => ticket.status === 'PENDING').length;

            setTicketCounts({ new: newCount, open: openCount, pending: pendingCount });
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

  return (
    <div className="view-tickets-container">
      <div className="tickets-header">
        <h1 className="tickets-heading">View Tickets</h1>
        <button className="new-ticket-button" onClick={handleEditTicket}>Edit Ticket</button>
      </div>
      <div className="status-counts">
        <div className="status-box new">New: {ticketCounts.new}</div>
        <div className="status-box OPEN">Open: {ticketCounts.open}</div>
        <div className="status-box pending">Pending: {ticketCounts.pending}</div>
      </div>
      <div className="ticket-cards-container">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.name}</h3>
                {/* <span className={`priority-tag ${ticket.priority?.toLowerCase()}`}>{ticket.priority}</span> */}
              </div>
              <p><strong>Status:</strong> {ticket.status}</p>
            </div>
          ))
        ) : (
          <p className="error-message">No tickets available</p>
        )}
      </div>
    </div>
  );
}

export default ViewTickets;
