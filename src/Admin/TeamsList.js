import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TeamsList.css';
 
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
        if (newTeamName.trim() === '') return;
 
        axios.post('http://localhost:7000/api/teams', {
            name: newTeamName,
            categoryId: selectedCategory.id
        }, { withCredentials: true })
            .then(response => {
                alert(`Team ${newTeamName} has been created successfully`);
                setNewTeamName('');
                setShowForm(false);
                // Optionally, you can refresh the teams list here if needed
                // fetchTeamsByCategory(selectedCategory.id);
            })
            .catch(error => {
                setError('Failed to create team');
            });
    };
 
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
 
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Team Management</h1>
            </header>
            <main className="category-container">
                <h2>Categories</h2>
                <ul className="category-list">
                    {categories.map(category => (
                        <li key={category.id} onClick={() => handleCategoryClick(category.id)}>
                            <div className="category-box">
                                <span className="category-name">{category.name}</span>
                                <div className="hover-content">
                                    <button onClick={() => { setSelectedCategory(category); setShowForm(true); }}>Create Team</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
 
                {showForm && selectedCategory && (
                    <div className="create-team-form">
                        <h3>Create a new team in {selectedCategory.name}</h3>
                        <label>
                            Team Name:
                            <input
                                type="text"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                            />
                        </label>
                        <button onClick={handleCreateTeam}>Create</button>
                    </div>
                )}
            </main>
            <footer className="app-footer">
                <p>© 2024 Team Management. All rights reserved.</p>
            </footer>
        </div>
    );
};
 
export default CategoryComponent;