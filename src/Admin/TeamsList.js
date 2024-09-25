import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Header from './Header';

// CSS styles for the layout
const styles = {
  body: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    width: '100%',
    backgroundColor: '#f8f9fa',
    color: 'black',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  headerTitle: {
    margin: '0',
    fontSize: '1.5rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingTop: '100px',
  },
  categoriesContainer: {
    width: '50%',
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginTop: '20px',
  },
  categoryList: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  categoryBox: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    margin: '10px',
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#333',
  },
  teamList: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'flex-start',
  },
  teamItem: {
    backgroundColor: '#ffffff',
    padding: '20px 30px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  teamTitle: {
    marginTop: '40px',
    fontSize: '1.6rem',
    fontWeight: '600',
    color: '#212529',
    textAlign: 'left',
  },
};

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL+'/api/categories', { withCredentials: true })
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch categories');
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryId) => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL+`/api/categories/${categoryId}`, {
        withCredentials: true,
      })
      .then((response) => {
        setSelectedCategory(response.data);
        fetchTeamsByCategory(categoryId);
      })
      .catch((error) => {
        setError('Failed to fetch category by ID');
      });
  };

  const fetchTeamsByCategory = (categoryId) => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL+`/api/teams/categories/${categoryId}/teams`, {
        withCredentials: true,
      })
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        setError('Failed to fetch teams for category');
      });
  };

  const handleLogout = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL+'/logout', {}, { withCredentials: true });
      localStorage.removeItem('username'); // Clear the username from localStorage
      navigate('/login/admin'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.body}>
      <Header isLoggedIn={true} onLogout={handleLogout} /> {/* Pass handleLogout to Header */}

      <div style={styles.container}>
        <div style={styles.categoriesContainer}>
          <h2>Categories</h2>
          <div style={styles.categoryList}>
            {categories.map((category) => (
              <div
                key={category.id}
                style={styles.categoryBox}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span style={styles.categoryText}>{category.name}</span>
              </div>
            ))}
          </div>

          {selectedCategory && (
            <>
              <h3 style={styles.teamTitle}>
                Teams in {selectedCategory.name}:
              </h3>
              <ul style={styles.teamList}>
                {teams.map((team) => (
                  <li key={team.id} style={styles.teamItem}>
                    {team.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;