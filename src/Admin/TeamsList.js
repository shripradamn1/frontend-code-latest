import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TeamsList.css';

const CategoryComponent = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all categories on component mount
    useEffect(() => {
        axios.get('http://localhost:7000/api/categories', { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to fetch categories');
                setLoading(false);
            });
    }, []);

    // Fetch category by ID and store in localStorage
    const handleCategoryClick = (categoryId) => {
        axios.get(`http://localhost:7000/api/categories/${categoryId}`, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setSelectedCategory(response.data);
                localStorage.setItem('selectedCategory', JSON.stringify(response.data));

                // Now fetch teams for the selected category
                fetchTeamsByCategory(categoryId);
            })
            .catch(error => {
                setError('Failed to fetch category by ID');
            });
    };

    // Fetch teams by category and store in localStorage
    const fetchTeamsByCategory = (categoryId) => {
        axios.get(`http://localhost:7000/api/teams/categories/${categoryId}/teams`, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setTeams(response.data);
                localStorage.setItem('teamsForCategory', JSON.stringify(response.data));
            })
            .catch(error => {
                setError('Failed to fetch teams for category');
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="category-container">
            <h2>Categories</h2>
            <ul className="category-list">
                {categories.map(category => (
                    <li key={category.id} onClick={() => handleCategoryClick(category.id)}>
                        {category.name}
                    </li>
                ))}
            </ul>

            {selectedCategory && (
                <div>
                    <h3>Selected Category: {selectedCategory.name}</h3>
                    <h4>Teams in this category:</h4>
                    <ul className="team-list">
                        {teams.map(team => (
                            <li key={team.id}>{team.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CategoryComponent;
