import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/CreateTicket.css'
 
 
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
  const [loggedInUserId, setLoggedInUserId] = useState(null); // State for user ID
 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/categories', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
 
    const checkLoggedInUser = async () => {
      try {
        const response = await axios.get('http://localhost:7000/checkLoggedInUser', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        setLoggedInUserId(response.data.id);
      } catch (error) {
        console.error('Error checking logged-in user:', error);
       
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
 
  const handleTeamChange = (e) => {
    const selectedTeamName = e.target.value;
    setSelectedTeam(selectedTeamName);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    const teamId = getTeamIdFromName(selectedCategory, selectedTeam);
 
    if (teamId === null) {
      setErrorMessage('Invalid team selected');
      return;
    }
 
    const ticketData = {
      title,
      description,
      categoryId: selectedCategory,
      userId: loggedInUserId
    };
 
    axios.post(`http://localhost:7000/api/tickets/${loggedInUserId}/${selectedCategory}/${teamId}`, ticketData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log('Ticket created successfully:', response.data);
 
      setSuccessMessage('Ticket created successfully!');
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSelectedTeam('');
      setTeams([]);
 
     
      navigate('/success');
    })
    .catch((error) => {
      console.error('Error creating ticket:', error);
      setErrorMessage('Failed to create ticket. Please try again.');
    });
  };
 
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Ticket</h2>
 
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
 
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
 
      <button type="submit">Create Ticket</button>
    </form>
  );
};
 
export default CreateTicket;