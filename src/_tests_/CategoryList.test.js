import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import CategoryList from '../Admin/CategoryList'; // Adjust the path accordingly
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('CategoryList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    // test('renders loading state initially', () => {
    //     render(<Router><CategoryList /></Router>);
    //     expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    // });

    test('renders categories after fetching', async () => {
        const categoriesData = [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
        ];

        axios.get.mockResolvedValueOnce({ data: categoriesData });

        render(<Router><CategoryList /></Router>);
        
        // Wait for the categories to be rendered
        await waitFor(() => expect(screen.getByText(/Category 1/i)).toBeInTheDocument());
        expect(screen.getByText(/Category 2/i)).toBeInTheDocument();
    });

    test('displays error message when fetching categories fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Failed to fetch categories'));

        render(<Router><CategoryList /></Router>);

        // Wait for the error message to be rendered
        await waitFor(() => expect(screen.getByText(/Failed to fetch categories/i)).toBeInTheDocument());
    });

    // test('creates a new category', async () => {
    //     const categoriesData = [{ id: 1, name: 'Category 1' }];
    //     axios.get.mockResolvedValueOnce({ data: categoriesData });
    //     axios.post.mockResolvedValueOnce({ data: { id: 2, name: 'Category 2' } });

    //     render(<Router><CategoryList /></Router>);

    //     // Wait for the initial categories to be rendered
    //     await waitFor(() => expect(screen.getByText(/Category 1/i)).toBeInTheDocument());

    //     // Open the dialog to create a new category
    //     //fireEvent.click(screen.getByText(/Create New Category/i));

    //     // Input new category name
    //     fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'Category 2' } });

    //     // Submit the new category
    //     fireEvent.click(screen.getByText(/Submit/i));

    //     // Wait for the new category to be rendered
    //     await waitFor(() => expect(screen.getByText(/Category 2/i)).toBeInTheDocument());
    // });

    // test('displays error message when creating a new category fails', async () => {
    //     const categoriesData = [{ id: 1, name: 'Category 1' }];
    //     axios.get.mockResolvedValueOnce({ data: categoriesData });
    //     axios.post.mockRejectedValueOnce(new Error('Failed to create category'));

    //     render(<Router><CategoryList /></Router>);

    //     // Wait for the initial categories to be rendered
    //     await waitFor(() => expect(screen.getByText(/Category 1/i)).toBeInTheDocument());

    //     // Open the dialog to create a new category
    //     //fireEvent.click(screen.getByText(/Create New Category/i));

    //     // Input new category name
    //     fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'Category 2' } });

    //     // Submit the new category
    //     fireEvent.click(screen.getByText(/Submit/i));

    //     // Wait for the error message to be rendered
    //     await waitFor(() => expect(screen.getByText(/Failed to create category/i)).toBeInTheDocument());
    // });

    test('deletes a category', async () => {
        const categoriesData = [{ id: 1, name: 'Category 1' }];
        axios.get.mockResolvedValueOnce({ data: categoriesData });
        axios.delete.mockResolvedValueOnce({}); // Simulate successful deletion

        render(<Router><CategoryList /></Router>);

        // Wait for the initial categories to be rendered
        await waitFor(() => expect(screen.getByText(/Category 1/i)).toBeInTheDocument());

        // Delete the category
        fireEvent.click(screen.getByText(/Delete/i));

        // Wait for the category to be removed
        await waitFor(() => expect(screen.queryByText(/Category 1/i)).not.toBeInTheDocument());
    });

    test('displays error message when deleting a category fails', async () => {
        const categoriesData = [{ id: 1, name: 'Category 1' }];
        axios.get.mockResolvedValueOnce({ data: categoriesData });
        axios.delete.mockRejectedValueOnce(new Error('Failed to delete category'));

        render(<Router><CategoryList /></Router>);

        // Wait for the initial categories to be rendered
        await waitFor(() => expect(screen.getByText(/Category 1/i)).toBeInTheDocument());

        // Delete the category
        fireEvent.click(screen.getByText(/Delete/i));

        // Wait for the error message to be rendered
        await waitFor(() => expect(screen.getByText(/Failed to delete category/i)).toBeInTheDocument());
    });
});
