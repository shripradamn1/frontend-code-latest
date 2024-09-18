import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f4f9;
  font-family: Georgia, 'Times New Roman', Times, serif;
  color: #333;
`;

const AppHeader = styled.header`
  background-color: #212529;
  color: #ffffff;
  text-align: center;
  padding: 20px 0;
  font-size: 1.5rem;
  letter-spacing: 1px;
`;

const CategoryContainer = styled.main`
  padding: 40px;
  flex-grow: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const CategoryBox = styled.li`
  position: relative;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  background-color: #fff;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  flex-grow: 1;

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

const HoverContent = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: -300px;
  width: 250px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 10;

  ${CategoryBox}:hover & {
    display: flex;
  }
`;

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:7000/api/categories', { withCredentials: true })
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch categories');
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryId) => {
    axios.get(`http://localhost:7000/api/categories/${categoryId}`, { withCredentials: true })
      .then(response => {
        setSelectedCategory(response.data);
        localStorage.setItem('selectedCategory', JSON.stringify(response.data));
        fetchTeamsByCategory(categoryId);
      })
      .catch(error => {
        setError('Failed to fetch category by ID');
      });
  };

  const fetchTeamsByCategory = (categoryId) => {
    axios.get(`http://localhost:7000/api/teams/categories/${categoryId}/teams`, { withCredentials: true })
      .then(response => {
        setTeams(response.data);
        localStorage.setItem('teamsForCategory', JSON.stringify(response.data));
      })
      .catch(error => {
        setError('Failed to fetch teams for category');
      });
  };

  const handleCreateTeam = () => {
    if (newTeamName.trim() === '' || !selectedCategory) return;
    axios.post(`http://localhost:7000/api/teams?categoryId=${selectedCategory.id}`, {
      name: newTeamName
    }, { withCredentials: true })
      .then(response => {
        alert(`Team ${newTeamName} has been created successfully`);
        setNewTeamName('');
        setShowForm(false);
        fetchTeamsByCategory(selectedCategory.id);
      })
      .catch(error => {
        setError('Failed to create team');
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <AppContainer>
      <AppHeader>
        <h1>Team Management</h1>
      </AppHeader>
      <CategoryContainer>
        <h2>Categories</h2>
        <CategoryList>
          {categories.map(category => (
            <CategoryBox key={category.id} onClick={() => handleCategoryClick(category.id)}>
              <span>{category.name}</span>
              <HoverContent>
                <button onClick={() => { setSelectedCategory(category); setShowForm(true); }}>Create Team</button>
              </HoverContent>
            </CategoryBox>
          ))}
        </CategoryList>
        {selectedCategory && (
          <div>
            <h3>Teams in {selectedCategory.name}:</h3>
            <ul>
              {teams.map(team => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          </div>
        )}
        {showForm && selectedCategory && (
          <div>
            <h3>Create a new team in {selectedCategory.name}</h3>
            <label>
              Team Name:
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </label>
            <button onClick={handleCreateTeam}>Create Team</button>
          </div>
        )}
      </CategoryContainer>
    </AppContainer>
  );
};

export default CategoryComponent;
