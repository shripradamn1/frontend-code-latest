import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CategoryList.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]); // Initialize as an array
    const [newCategoryName, setNewCategoryName] = useState(''); // State for the new category name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios.get('http://localhost:7000/api/categories', {
            withCredentials: true, // Include credentials if needed
            headers: {
                'Content-Type': 'application/json' // Ensure JSON response
            }
        })
        .then(response => {
            console.log(response.data); // Log the response to inspect
            const data = response.data;
            if (Array.isArray(data)) {
                setCategories(data); // Set categories if it's an array
            } else {
                setCategories([]); // Handle non-array response
            }
            setLoading(false);
        })
        .catch(error => {
            setError('Failed to fetch categories');
            setLoading(false);
        });
    };

    // Function to handle category creation
    const handleCreateCategory = (e) => {
        e.preventDefault();
        
        axios.post('http://localhost:7000/api/categories', {
            name: newCategoryName
        }, {
            withCredentials: true, // Include credentials if needed
            headers: {
                'Content-Type': 'application/json' // Sending JSON data
            }
        })
        .then(response => {
            console.log('Category created:', response.data);
            setNewCategoryName(''); // Reset the form
            fetchCategories(); // Refresh the category list after creating
        })
        .catch(error => {
            setError('Failed to create category');
        });
    };

    // Function to handle category deletion
    const handleDeleteCategory = (id) => {
        axios.delete(`http://localhost:7000/api/categories/${id}`, {
            withCredentials: true, // Include credentials if needed
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            console.log('Category deleted:', id);
            // Remove the deleted category from the list
            setCategories(categories.filter(category => category.id !== id));
        })
        .catch(error => {
            setError('Failed to delete category');
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Categories List</h2>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        {category.name}
                        <button 
                            className="delete-button"
                            onClick={() => handleDeleteCategory(category.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {/* Form to create a new category */}
            <form onSubmit={handleCreateCategory}>
                <div>
                    <label>New Category Name:</label>
                    <input 
                        type="text" 
                        value={newCategoryName} 
                        onChange={(e) => setNewCategoryName(e.target.value)} 
                        required
                    />
                </div>
                <button type="submit">Create Category</button>
            </form>
        </div>
    );
};

export default CategoryList;
