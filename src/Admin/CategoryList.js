import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
 
const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        fetchCategories();
    }, []);
 
    const fetchCategories = () => {
        axios.get('http://localhost:7000/api/categories', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    setCategories([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch categories');
                setLoading(false);
            });
    };
 
    const handleCreateCategory = (e) => {
        e.preventDefault();
        if (newCategoryName.trim() === '') {
            setError('Category name cannot be empty');
            return;
        }
 
        axios.post('http://localhost:7000/api/categories', { name: newCategoryName }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                const createdCategory = response.data;
                setCategories([...categories, createdCategory]);
                setNewCategoryName('');
                setError(null);
            })
            .catch(() => {
                setError('Failed to create category');
            });
    };
 
    const handleDeleteCategory = (id) => {
        axios.delete(`http://localhost:7000/api/categories/${id}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                setCategories(categories.filter(category => category.id !== id));
            })
            .catch(() => {
                setError('Failed to delete category');
            });
    };
 
    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
 
    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="bg-primary text-white text-center py-3">
                <h1>Manage Categories</h1>
            </header>
 
            <main className="container flex-grow-1 mt-4">
                <h2>Categories List</h2>
                <ul className="list-group mb-4">
                    {categories.map(category => (
                        <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {category.name}
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteCategory(category.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
 
                <form onSubmit={handleCreateCategory} className="mb-4">
                    <div className="mb-3">
                        <label htmlFor="categoryName" className="form-label">New Category Name:</label>
                        <input
                            type="text"
                            id="categoryName"
                            className="form-control"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Category</button>
                </form>
            </main>
 
            <footer className="bg-light text-center py-3 mt-auto">
                <p className="text-muted">© 2024 Category Management</p>
            </footer>
        </div>
    );
};
 
export default CategoryList;