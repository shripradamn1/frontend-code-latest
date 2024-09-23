import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

// Styles for the header and form
const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
  },
  containerStyle: {
    maxWidth: '400px',
    margin: '0 auto',
    marginTop: '80px',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  inputStyle: {
    width: '100%',
    padding: '8px',
    margin: '8px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  buttonStyle: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#0000FF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  labelStyle: {
    fontWeight: 'bold',
    display: 'block',
    marginTop: '10px',
  },
  messageStyle: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
  },
};

const CreateAgent = () => {
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTeamName, setSelectedTeamName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:7000/api/categories', {
      withCredentials: true,
      headers: { 'Accept': 'application/json' },
    })
    .then((response) => {
      setCategories(response.data);
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
    });
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    axios.get(`http://localhost:7000/api/teams/categories/${categoryId}/teams`, {
      withCredentials: true,
      headers: { 'Accept': 'application/json' },
    })
    .then((response) => {
      setTeams(response.data);
    })
    .catch((error) => {
      console.error('Error fetching teams:', error);
    });
  };

  const handleTeamChange = (e) => {
    setSelectedTeamName(e.target.value);
  };

  const getTeamId = (teamName) => {
    switch (teamName) {
      case 'Application Support Team': return 1;
      case 'Technical Support Team': return 2;
      case 'Security Team': return 3;
      case 'Device Support Team': return 4;
      case 'Networking and Connectivity Team': return 5;
      case 'Telecommunication Equipment Team': return 6;
      default: return null;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedTeamId = getTeamId(selectedTeamName);
    if (!selectedTeamId) {
      setErrorMessage('Invalid team selected');
      return;
    }

    const agentData = {
      name,
      email,
      username,
      categoryId: selectedCategory,
    };

    axios.post(`http://localhost:7000/api/agents/category/${selectedCategory}/team/${selectedTeamId}`, agentData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => {
      console.log('Agent created successfully:', response.data);
      setSuccessMessage('Agent registered successfully!');
      setName('');
      setEmail('');
      setUsername('');
      setSelectedCategory('');
      setSelectedTeamName('');
      setTeams([]);
      navigate('/viewAgents/admin'); // Redirect to the view agents page
    })
    .catch((error) => {
      console.error('Error registering agent:', error);
      setErrorMessage('Error registering agent. Please try again.');
    });
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:7000/logout', {}, { withCredentials: true });
      localStorage.removeItem('username'); // Clear the username from localStorage
      navigate('/login/admin'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Header isLoggedIn={true} onLogout={handleLogout} />
      <form onSubmit={handleSubmit} style={styles.containerStyle}>
        <h2>Register New Agent</h2>
        {successMessage && <p style={styles.messageStyle}>{successMessage}</p>}
        {errorMessage && <p style={styles.messageStyle}>{errorMessage}</p>}
        <label htmlFor="username" style={styles.labelStyle}>Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.inputStyle}
        />
        <label htmlFor="name" style={styles.labelStyle}>Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.inputStyle}
        />
        <label htmlFor="email" style={styles.labelStyle}>Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.inputStyle}
        />
        <label htmlFor="category" style={styles.labelStyle}>Category:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange} required style={styles.inputStyle}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategory && teams.length > 0 && (
          <div>
            <label htmlFor="team" style={styles.labelStyle}>Team:</label>
            <select id="team" value={selectedTeamName} onChange={handleTeamChange} required style={styles.inputStyle}>
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.name} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" style={styles.buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

export default CreateAgent;
