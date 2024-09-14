import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/CreateTicket.css';

const CreateTicket = () => {
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/categories', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
          },
        });

        // Ensure that the response data is an array
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setErrorMessage('Failed to fetch categories: Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Failed to fetch categories');
      }
    };

    const checkLoggedInUser = async () => {
      try {
        const response = await axios.get('http://localhost:7000/checkLoggedInUser', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
          },
        });
        setLoggedInUserId(response.data.id);
      } catch (error) {
        console.error('Error checking logged-in user:', error);
        setErrorMessage('Failed to verify logged-in user');
      }
    };

    fetchCategories();
    checkLoggedInUser();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    axios.get(`http://localhost:7000/api/teams/categories/${categoryId}/teams`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      if (Array.isArray(response.data)) {
        setTeams(response.data);
      } else {
        setErrorMessage('Invalid data format for teams');
      }
    })
    .catch((error) => {
      console.error('Error fetching teams:', error);
      setErrorMessage('Failed to fetch teams');
    });
  };

  const handleTeamChange = (e) => {
    const selectedTeamName = e.target.value;
    setSelectedTeam(selectedTeamName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ticketData = {
      title,
      description,
      categoryId: selectedCategory,
      userId: loggedInUserId,
    };

    axios.post(`http://localhost:7000/api/tickets/${loggedInUserId}/${selectedCategory}/${selectedTeam}`, ticketData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      setSuccessMessage('Ticket created successfully!');
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSelectedTeam('');
      setTeams([]);
      navigate('/view-tickets');
    })
    .catch((error) => {
      setErrorMessage('Failed to create ticket. Please try again.');
    });
  };

  return (
    <div className="create-ticket-page">
      <div className="header">
        <div className="welcome-section">
          <div className="profile-pic"></div>
          <span className="welcome-message">Welcome, User!</span>
        </div>
        <div className="notification-section">
          <span className="notification-icon">🔔</span>
        </div>
      </div>

      <div className="sidebar">
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/create-ticket">Create Ticket</a></li>
          <li><a onClick={() => navigate('/view-tickets')}>View Tickets</a></li>
        </ul>
      </div>

      <div className="ticket-form-container">
        <h2 className="ticket-heading">Create New Ticket</h2>

        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label htmlFor="category">Category:</label>
          <select id="category" value={selectedCategory} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {selectedCategory && teams.length > 0 && (
            <div>
              <label htmlFor="team">Team:</label>
              <select id="team" value={selectedTeam} onChange={handleTeamChange} required>
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit">Create Ticket</button>
            <button type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
