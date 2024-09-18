import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import '../styles/CategoryList.css';
 
const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
 
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
                handleClose();
            })
            .catch(() => {
                setError('Failed to create category');
            });
    };
 
    const handleDeleteCategory = (id) => {
        const categoryToDelete = categories.find(category => category.id === id);
   
        axios.delete(`http://localhost:7000/api/categories/${id}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                setCategories(categories.filter(category => category.id !== id));
                alert(`Category ${categoryToDelete.name} deleted successfully`);
            })
            .catch(() => {
                setError('Failed to delete category');
            });
    };
   
 
    const handleClickOpen = () => {
        setOpen(true);
    };
 
    const handleClose = () => {
        setOpen(false);
    };
 
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCreateCategory(e);
        }
    };
 
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
 
    return (
        <div className="container">
            <header>
                <h1>Manage Categories</h1>
                <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginLeft: 'auto' }}>
                    Create Category
                </Button>
            </header>
 
            <main className="main-content">
                <div className="categories-container">
                    <h2>Categories List</h2>
                    <ul>
                        {categories.map(category => (
                            <li key={category.id}>
                                {category.name || 'Unnamed Category'}
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
 
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="categoryName"
                        label="Category Name"
                        type="text"
                        fullWidth
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateCategory} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
 
            <footer>
                <p>© 2024 Category Management</p>
            </footer>
        </div>
    );
};
 
export default CategoryList;