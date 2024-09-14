import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/EditTickets.css'; 

const EditTickets = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null); // To track which ticket is being edited
  const [updatedDescription, setUpdatedDescription] = useState('');

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
    if (ticket.status.toLowerCase() !== 'closed') {
      setEditingTicket(ticket);
      setUpdatedDescription(ticket.description); // Set the initial description for editing
    } else {
      alert('You cannot edit a ticket with status "Closed".');
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
    <div className="tickets-container">
      <h2>Your Tickets</h2>
      <div className="ticket-cards">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-card">
            <h3>{ticket.title}</h3>
            <p>Status: {ticket.status}</p>
            <p>Description: {ticket.description}</p>
            {/* <p>Created At: {new Date(ticket.createdAt).toLocaleString()}</p> */}
            <button
              onClick={() => handleEditClick(ticket)}
              disabled={ticket.status.toLowerCase() === 'closed'}
              className="edit-button"
            >
              Edit Description
            </button>
          </div>
        ))}
      </div>

      {editingTicket && (
        <div className="edit-ticket-modal">
          <h3>Edit Ticket: {editingTicket.title}</h3>
          <div className="input-field">
            <label>Description:</label>
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
          </div>
          <button onClick={handleUpdateTicket} className="update-button">
            Update Description
          </button>
          <button onClick={() => setEditingTicket(null)} className="cancel-button">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default EditTickets;
