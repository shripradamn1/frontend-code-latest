import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EditTicketsAgent.css';

const EditTicketsAgent = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  // Fetch user on initial load
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

  // Fetch tickets once user is available
  useEffect(() => {
    if (user) {
      const fetchTickets = async () => {
        try {
          const ticketsResponse = await axios.get(`http://localhost:7000/api/tickets/agent/${user.username}`, { withCredentials: true });
          setTickets(ticketsResponse.data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };
      fetchTickets();
    }
  }, [user]);

  // Handle ticket selection (set priority and status for editing)
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setPriority(ticket.priority || 'Not Assigned'); // Default if priority is not assigned
    setStatus(ticket.status); // Set status of the selected ticket
  };

  // Handle ticket update (send update to backend)
  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    // Ensure that "Not Assigned" priority is not passed to the backend
    const updatedPriority = priority === 'Not Assigned' ? null : priority;
    console.log(updatedPriority);
    
    try {
      // Update the ticket using the new endpoint format
      await axios.put(
        `http://localhost:7000/api/tickets/${selectedTicket.id}/status/${status}/priority/${updatedPriority}`,
        {}, // Empty body since the status and priority are in the URL
        { withCredentials: true }
      );
      alert('Ticket updated successfully!');

      // After updating the ticket, fetch the updated tickets list
      const ticketsResponse = await axios.get(`http://localhost:7000/api/tickets/agent/${user.username}`, { withCredentials: true });
      setTickets(ticketsResponse.data); // Update the tickets state with new data
      setSelectedTicket(null); // Reset the selected ticket after update
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update the ticket.');
    }
  };

  return (
    <div className="tickets-container">
      <h2>Your Tickets</h2>
      <div className="ticket-list">
        <div className="ticket-header">
          <div>ID</div>
          <div>Title</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Action</div> {/* New column for the Edit button */}
        </div>
        {tickets
          .filter(ticket => ticket.status !== 'CLOSED') // Only display non-closed tickets
          .map(ticket => (
            <div
            key={ticket.id}
            className={`ticket-card priority-${ticket.priority ? ticket.priority.toLowerCase() : ''} status-${ticket.status ? ticket.status.toLowerCase().replace(' ', '-') : ''}`}
          >
            <div className="ticket-id">#{ticket.id}</div>
            <div>{ticket.title}</div>
            <div className="ticket-status"><h3><span>{ticket.status}</span></h3></div>
            <div>{ticket.priority || 'Not Assigned'}</div> {/* Show 'Not Assigned' if priority is null */}
            <div>
              <button 
                className="edit-button" 
                onClick={() => handleSelectTicket(ticket)} // Select ticket for editing
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
              className="select-field">
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
              className="select-field">
              <option data-status="not-assigned" value="Not Assigned">Not Assigned</option>

              <option className='low' value="LOW">Low</option>
              <option  value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <button onClick={handleUpdateTicket} className="update-button">Update Ticket</button>
          <button onClick={() => setSelectedTicket(null)} className="cancel-button">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EditTicketsAgent;
