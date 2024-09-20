import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAgent = () => {
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTeamName, setSelectedTeamName] = useState(''); // Will store the team name
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Added state for username
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Fetch categories on component mount
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

  // Handle category change and fetch corresponding teams
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
      setTeams(response.data); // Response should contain teams with their names
    })
    .catch((error) => {
      console.error('Error fetching teams:', error);
    });
  };

  // Handle team change by using team names to map to IDs
  const handleTeamChange = (e) => {
    const selectedTeamName = e.target.value;
    setSelectedTeamName(selectedTeamName); // Store the selected team name
  };

  // Map team names to their corresponding IDs
  const getTeamId = (teamName) => {
    switch (teamName) {
      case 'Application Support Team':
        return 1;
      case 'Technical Support Team':
        return 2;
      case 'Security Team':
        return 3;
        case 'Device Support Team':
          return 4;
        case 'Networking and Connectivity Team':
          return 5;
        case 'Telecommunication Equipment Team':
          return 6;
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedTeamId = getTeamId(selectedTeamName); // Map team name to team ID

    if (!selectedTeamId) {
      setErrorMessage('Invalid team selected');
      return;
    }

    const agentData = {
      name,
      email,
      username, // Include username in agentData
      categoryId: selectedCategory,  // Send categoryId
    };
    // console.log("team"+selectedTeamId)
    // console.log("cat"+selectedC)
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
      setSelectedTeamName(''); // Clear team name state
      setTeams([]);
      navigate('/admin'); // Redirect to success page
    })
    .catch((error) => {
      console.error('Error registering agent:', error);
      setErrorMessage('Error registering agent. Please try again.');
    });
  };

  // Styles for the form
  const formStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    marginTop:'50px',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '8px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#0000FF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const labelStyle = {
    fontWeight: 'bold',
    display: 'block',
    marginTop: '10px'
  };

  const messageStyle = {
    color: successMessage ? 'green' : 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center' }}>Register New Agent</h2>

      {successMessage && <p style={messageStyle}>{successMessage}</p>}
      {errorMessage && <p style={messageStyle}>{errorMessage}</p>}

      <label htmlFor="username" style={labelStyle}>Username:</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={inputStyle}
      />

      <label htmlFor="name" style={labelStyle}>Name:</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={inputStyle}
      />

      <label htmlFor="email" style={labelStyle}>Email:</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
      />

      <label htmlFor="category" style={labelStyle}>Category:</label>
      <select id="category" value={selectedCategory} onChange={handleCategoryChange} required style={inputStyle}>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {selectedCategory && teams.length > 0 && (
        <div>
          <label htmlFor="team" style={labelStyle}>Team:</label>
          <select id="team" value={selectedTeamName} onChange={handleTeamChange} required style={inputStyle}>
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.name} value={team.name}> {/* Using team.name and mapping manually */}
                {team.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" style={buttonStyle}>Submit</button>
    </form>
  );
};

export default CreateAgent;
