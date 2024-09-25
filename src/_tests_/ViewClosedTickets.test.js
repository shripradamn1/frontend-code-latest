import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewClosedTickets from '../Agent/ViewClosedTickets'; // Adjust the path as necessary

jest.mock('axios');

describe('ViewClosedTickets Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  it('renders without crashing', () => {
    render(
      <Router>
        <ViewClosedTickets />
      </Router>
    );
    expect(screen.getByText(/View Closed Tickets/i)).toBeInTheDocument();
  });

  it('fetches and displays closed tickets', async () => {
    const username = 'testUser';
    const closedTickets = [
      { id: 1, title: 'Closed Ticket 1', status: 'CLOSED' },
      { id: 2, title: 'Closed Ticket 2', status: 'CLOSED' },
    ];

    // Mock the API response for logged in user check
    axios.get.mockImplementation(url => {
      if (url.endsWith('/checkLoggedInUser')) {
        return Promise.resolve({ status: 200, data: { username } });
      }
      if (url.endsWith(`/api/tickets/agent/${username}`)) {
        return Promise.resolve({ data: closedTickets });
      }
      return Promise.reject(new Error('Not Found'));
    });

    render(
      <Router>
        <ViewClosedTickets />
      </Router>
    );

    // Wait for the closed tickets to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Closed Ticket 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Closed Ticket 2/i)).toBeInTheDocument();
    });
  });

  it('displays an error message when no closed tickets are available', async () => {
    const username = 'testUser';

    // Mock the API response for logged in user check
    axios.get.mockImplementation(url => {
      if (url.endsWith('/checkLoggedInUser')) {
        return Promise.resolve({ status: 200, data: { username } });
      }
      if (url.endsWith(`/api/tickets/agent/${username}`)) {
        return Promise.resolve({ data: [] }); // No closed tickets
      }
      return Promise.reject(new Error('Not Found'));
    });

    render(
      <Router>
        <ViewClosedTickets />
      </Router>
    );

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/No closed tickets available/i)).toBeInTheDocument();
    });
  });

  it('handles errors when fetching tickets', async () => {
    const username = 'testUser';

    // Mock the API response for logged in user check
    axios.get.mockImplementation(url => {
      if (url.endsWith('/checkLoggedInUser')) {
        return Promise.resolve({ status: 200, data: { username } });
      }
      if (url.endsWith(`/api/tickets/agent/${username}`)) {
        return Promise.reject(new Error('Failed to fetch tickets')); // Simulate fetch error
      }
      return Promise.reject(new Error('Not Found'));
    });

    render(
      <Router>
        <ViewClosedTickets />
      </Router>
    );

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/No closed tickets available/i)).toBeInTheDocument();
    });
  });
});
