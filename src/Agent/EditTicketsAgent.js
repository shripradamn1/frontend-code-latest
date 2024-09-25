import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa'; // Using react-icons for download icon
import CommonHeader from './CommonHeader'; // Adjust the path as needed

const EditTicketsAgent = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage logged-in state

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+'/checkLoggedInUser', { withCredentials: true });
        setUser(userResponse.data);
        setIsLoggedIn(true); // Update logged-in state
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchTickets = async () => {
        setLoading(true);
        try {
          const ticketsResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+`/api/tickets/agent/${user.username}`, { withCredentials: true });
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

  useEffect(() => {
    const fetchAttachments = async (ticketId) => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/api/tickets/${ticketId}/attachments`, { withCredentials: true });
        setAttachments(response.data);
      } catch (error) {
        console.error('Error fetching attachments:', error);
      }
    };

    if (selectedTicket) {
      fetchAttachments(selectedTicket.id);
    }
  }, [selectedTicket]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setPriority(ticket.priority || 'Not Assigned');
    setStatus(ticket.status);
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    const updatedPriority = priority === 'Not Assigned' ? null : priority;

    setLoading(true);
    try {
      await axios.put(
        process.env.REACT_APP_BACKEND_URL+`/api/tickets/${selectedTicket.id}/status/${status}/priority/${updatedPriority}`,
        {},
        { withCredentials: true }
      );
      alert('Ticket updated successfully!');

      const ticketsResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+`/api/tickets/agent/${user.username}`, { withCredentials: true });
      setTickets(ticketsResponse.data);
      setSelectedTicket(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update the ticket.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttachment = async (ticketId, fileName) => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/api/tickets/${ticketId}/attachments/download`, {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  };

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    zIndex: 1001,
    borderRadius: '8px',
    width: '80%',
    maxWidth: '600px',
    minWidth: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 0.3s ease',
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    marginRight: '10px',
    borderRadius: '4px',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
  };

  const attachmentButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2ecc71',
  };

  const handleLogout = () => {
    // Add your logout logic here
    setIsLoggedIn(false);
    alert('Logged out successfully!'); // Sample logout alert
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <CommonHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>Assigned Ticket</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 3fr 1fr 1fr 1fr',
              fontWeight: 'bold',
              padding: '10px',
              borderBottom: '2px solid #ecf0f1',
              backgroundColor: '#f2f2f2'
            }}>
              <div>ID</div>
              <div>Title</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Action</div>
            </div>
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 3fr 1fr 1fr 1fr',
                  padding: '10px',
                  borderBottom: '1px solid #ecf0f1',
                  alignItems: 'center'
                }}
              >
                <div style={{ color: '#2980b9', cursor: 'pointer' }}>#{ticket.id}</div>
                <div>{ticket.title}</div>
                <div style={{ fontWeight: 'bold', color: ticket.status === 'OPEN' ? 'green' : 'gray' }}>{ticket.status}</div>
                <div>{ticket.priority || 'Not Assigned'}</div>
                <div>
                  <button
                    onClick={() => handleSelectTicket(ticket)}
                    style={buttonStyle}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && selectedTicket && (
            <>
              <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}></div>
              <div style={modalStyle}>
                <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Edit Ticket: {selectedTicket.title}</h3>

                <div style={{ marginBottom: '10px' }}>
                  <label>Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', width: '100%', marginTop: '5px' }}
                  >
                    <option value="OPEN">Open</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label>Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', width: '100%', marginTop: '5px' }}
                  >
                    <option value="Not Assigned">Not Assigned</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <button onClick={handleUpdateTicket} style={buttonStyle}>Update Ticket</button>
                  <button onClick={() => setIsModalOpen(false)} style={cancelButtonStyle}>Cancel</button>
                </div>
                <h4 style={{ marginTop: '20px' }}>Attachments:</h4>
                {attachments.length > 0 ? (
                  attachments.map((attachment, index) => (
                    <div key={index}>
                      <a
                        href="#"
                        onClick={() => handleDownloadAttachment(selectedTicket.id, attachment.fileName)}
                        style={attachmentButtonStyle}
                      >
                        <FaDownload /> {attachment.fileName}
                      </a>
                    </div>
                  ))
                ) : (
                  <p>No attachments available.</p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EditTicketsAgent;
