import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommonHeader from './CommonHeader'; // Adjust the path as needed
import '../styles/EditTicketsAgent.css';

const EditTicketsAgent = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get('http://localhost:7000/checkLoggedInUser', { withCredentials: true });
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch tickets once user is available
  useEffect(() => {
    if (user) {
      const fetchTickets = async () => {
        setLoading(true);
        try {
          const ticketsResponse = await axios.get(`http://localhost:7000/api/tickets/agent/${user.username}`, { withCredentials: true });
          setTickets(ticketsResponse.data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTickets();
    }
  }, [user]);

  // Handle ticket selection
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setPriority(ticket.priority || 'Not Assigned');
    setStatus(ticket.status);
  };

  // Handle ticket update
  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    const updatedPriority = priority === 'Not Assigned' ? null : priority;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:7000/api/tickets/${selectedTicket.id}/status/${status}/priority/${updatedPriority}`,
        {}, // No body needed
        { withCredentials: true }
      );
      alert('Ticket updated successfully!');

      const ticketsResponse = await axios.get(`http://localhost:7000/api/tickets/agent/${user.username}`, { withCredentials: true });
      setTickets(ticketsResponse.data);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update the ticket.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/agent/login/agent'); // Redirect to login after logout
  };

  // Handle attachment download
  const handleDownloadAttachment = async (ticketId, filename) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/tickets/${ticketId}/download`, {
        responseType: 'blob',
        withCredentials: true
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download the attachment.');
    }
  };

  return (
    <div>
      <CommonHeader isLoggedIn={!!user} onLogout={handleLogout} />
      <header className="tickets-header">
        <center>
        <h1>Edit Tickets</h1></center>
      </header>
      <div className="tickets-container">
        {loading ? <p>Loading...</p> : (
          <>
            <div className="ticket-list">
              <div className="ticket-header">
                <div>ID</div>
                <div>Title</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Attachment</div>
                <div>Action</div>
              </div>
              {tickets
                .filter(ticket => ticket.status !== 'CLOSED')
                .map(ticket => (
                  <div
                    key={ticket.id}
                    className={`ticket-card priority-${ticket.priority ? ticket.priority.toLowerCase() : ''} status-${ticket.status ? ticket.status.toLowerCase().replace(' ', '-') : ''}`}
                  >
                    <div className="ticket-id">#{ticket.id}</div>
                    <div>{ticket.title}</div>
                    <div className="ticket-status"><h3><span>{ticket.status}</span></h3></div>
                    <div>{ticket.priority || 'Not Assigned'}</div>
                    <div>
                      {ticket.attachment ? (
                        <button
                          className="download-button"
                          onClick={() => handleDownloadAttachment(ticket.id, ticket.attachment)}
                        >
                          Download
                        </button>
                      ) : (
                        'No Attachment'
                      )}
                    </div>
                    <div>
                      <button 
                        className="edit-button" 
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>

            {selectedTicket && (
              <div className="edit-ticket-form">
                <h3>Edit Ticket: {selectedTicket.title}</h3>
                <div className="input-field">
                  <label>Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="select-field"
                  >
                    <option value="OPEN">Open</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div className="input-field">
                  <label>Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="select-field"
                  >
                    <option data-status="not-assigned" value="Not Assigned">Not Assigned</option>
                    <option className='low' value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <button onClick={handleUpdateTicket} className="update-button">Update Ticket</button>
                <button onClick={() => setSelectedTicket(null)} className="cancel-button">Cancel</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditTicketsAgent;
