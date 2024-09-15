import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAgent = () => {
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(''); // Added state for team ID
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Added state for username
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:7000/api/categories', {
      withCredentials: true,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      setCategories(response.data);
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
    });
  }, []);

  const getTeamIdFromName = (categoryName, teamName) => {
    if (categoryName === '1') {
      switch (teamName) {
        case 'Support Team A':
          return 1;
        case 'Support Team B':
          return 2;
        case 'Support Team C':
          return 3;
        default:
          return null;
      }
    } else if (categoryName === '2') {
      switch (teamName) {
        case 'HardWare team A':
          return 1;
        case 'HardWare team B':
          return 2;
        default:
          return null;
      }
    }
    return null;
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    axios.get(`http://localhost:7000/api/teams/categories/${categoryId}/teams`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      setTeams(response.data);
    })
    .catch((error) => {
      console.error('Error fetching teams:', error);
    });
  };

  const handleTeamChange = (e) => {
    const selectedTeamName = e.target.value;
    setSelectedTeam(selectedTeamName);

    const teamId = getTeamIdFromName(selectedCategory, selectedTeamName);
    setSelectedTeamId(teamId); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedTeamId === null) {
      setErrorMessage('Invalid team selected');
      return;
    }

    const agentData = {
      name,
      email,
      username, // Include username in agentData
      categoryId: selectedCategory,  // Send categoryId
    };

    axios.post(`http://localhost:7000/api/agents/category/${selectedCategory}/team/${selectedTeamId}`, agentData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log('Agent created successfully:', response.data);
      setSuccessMessage('Agent registered successfully!');
      setName('');
      setEmail('');
      setUsername(''); // Clear username field
      setSelectedCategory('');
      setSelectedTeam('');
      setSelectedTeamId(''); // Clear team ID state
      setTeams([]);
      navigate('/agent/manage-tickets'); // Redirect to success page
    })
    .catch((error) => {
      console.error('Error registering agent:', error);
      setErrorMessage('Error registering agent. Please try again.');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register New Agent</h2>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateAgent;
