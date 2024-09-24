// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import axios from 'axios';
// import HomePage from '../HomePage';  

// jest.mock('axios');

// describe('HomePage Component', () => {
//   beforeEach(() => {
//     axios.get.mockClear();
//     axios.post.mockClear();
//   });

//   test('renders HomePage correctly', () => {
//     render(
//       <Router>
//         <HomePage />
//       </Router>
//     );
//     expect(screen.getByText('Ticket Management')).toBeInTheDocument();
//     expect(screen.getByText('Streamline your helpdesk')).toBeInTheDocument();
//     expect(screen.getByText('Get Started')).toBeInTheDocument();
//     expect(screen.getByText('Explore Features')).toBeInTheDocument();
//   });

//   test('shows login warning when accessing features without logging in', async () => {
//     axios.get.mockResolvedValue({ data: null });  // Simulate user not logged in

//     render(
//       <Router>
//         <HomePage />
//       </Router>
//     );

//     fireEvent.click(screen.getByText('Create Ticket'));

//     await waitFor(() => {
//       expect(screen.getByText('Please log in to access this feature!')).toBeInTheDocument();
//     });
//   });

//   test('navigates to login and signup pages when buttons clicked', () => {
//     const { getByText } = render(
//       <Router>
//         <HomePage />
//       </Router>
//     );

//     // Mock navigation events
//     fireEvent.click(getByText('Sign In'));
//     expect(window.location.pathname).toBe('/login');

//     fireEvent.click(getByText('Sign Up'));
//     expect(window.location.pathname).toBe('/signup/user');
//   });

//   test('displays logout button if user is logged in', async () => {
//     axios.get.mockResolvedValue({ data: { username: 'testuser' } });

//     render(
//       <Router>
//         <HomePage />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Logout')).toBeInTheDocument();
//     });
//   });

//   test('logs out user when clicking logout button', async () => {
//     axios.get.mockResolvedValue({ data: { username: 'testuser' } });
//     axios.post.mockResolvedValue({});  // Mock the logout API

//     render(
//       <Router>
//         <HomePage />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Logout')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText('Logout'));

//     await waitFor(() => {
//       expect(screen.getByText('Sign In')).toBeInTheDocument();
//       expect(screen.getByText('Sign Up')).toBeInTheDocument();
//     });
//   });

//   test('navigates to feature page when logged in and feature is clicked', async () => {
//     axios.get.mockResolvedValue({ data: { username: 'testuser' } });

//     render(
//       <Router>
//         <HomePage />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Create Ticket')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText('Create Ticket'));

//     expect(window.location.pathname).toBe('/create-ticket');
//   });

//   test('shows feature cards on homepage', () => {
//     render(
//       <Router>
//         <HomePage />
//       </Router>
//     );

//     expect(screen.getByText('Create Ticket')).toBeInTheDocument();
//     expect(screen.getByText('View Tickets')).toBeInTheDocument();
//     expect(screen.getByText('Edit Tickets')).toBeInTheDocument();
//   });
// });
